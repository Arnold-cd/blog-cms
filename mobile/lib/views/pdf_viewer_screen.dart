import "dart:io";
import "package:flutter/material.dart";
import "package:flutter_pdfview/flutter_pdfview.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:http/http.dart" as http;
import "package:path_provider/path_provider.dart";
import "package:share_plus/share_plus.dart";
import "../models/pdf_document.dart";
import "../providers/library_providers.dart";

class PdfViewerScreen extends ConsumerStatefulWidget {
  final PdfDocument document;

  const PdfViewerScreen({super.key, required this.document});

  @override
  ConsumerState<PdfViewerScreen> createState() => _PdfViewerScreenState();
}

class _PdfViewerScreenState extends ConsumerState<PdfViewerScreen> {
  String? _localPath;
  bool _isLoading = true;
  String _loadingMessage = "Preparing document...";
  int _totalPages = 0;
  int _currentPage = 0;
  bool _isReady = false;
  String _errorMessage = "";

  @override
  void initState() {
    super.initState();
    _preparePdf();
  }

  Future<void> _preparePdf() async {
    final downloadedMap = ref.read(downloadedPdfsProvider);
    final existingLocalPath = downloadedMap[widget.document.fileName];

    if (existingLocalPath != null && await File(existingLocalPath).exists()) {
      if (mounted) {
        setState(() {
          _localPath = existingLocalPath;
          _isLoading = false;
        });
      }
      return;
    }

    // Download to temporary cache directory for instant reading
    setState(() {
      _isLoading = true;
      _loadingMessage = "Downloading PDF (${widget.document.fileSizeFormatted})...";
    });

    try {
      final dir = await getTemporaryDirectory();
      final safeName = PdfDocument.sanitizeFileName(widget.document.fileName, fallbackId: widget.document.id);
      final tempFile = File("${dir.path}/$safeName");

      if (await tempFile.exists()) {
        if (mounted) {
          setState(() {
            _localPath = tempFile.path;
            _isLoading = false;
          });
        }
        return;
      }

      final response = await http.get(Uri.parse(widget.document.pdfUrl));
      if (response.statusCode == 200) {
        await tempFile.writeAsBytes(response.bodyBytes);
        if (mounted) {
          setState(() {
            _localPath = tempFile.path;
            _isLoading = false;
          });
        }
      } else {
        if (mounted) {
          setState(() {
            _errorMessage = "Unable to fetch document (HTTP ${response.statusCode})";
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = "Network error: ${e.toString()}";
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _saveForOffline() async {
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    final notifier = ref.read(downloadedPdfsProvider.notifier);
    final path = await notifier.downloadPdf(widget.document);

    if (path != null) {
      scaffoldMessenger.showSnackBar(
        const SnackBar(
          content: Text("Document saved for offline reading!"),
          backgroundColor: Color(0xFF10B981),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _shareDocument() {
    final box = context.findRenderObject() as RenderBox?;
    final origin = (box != null && box.hasSize)
        ? (box.localToGlobal(Offset.zero) & box.size)
        : Rect.fromLTWH(0, 0, MediaQuery.of(context).size.width, MediaQuery.of(context).size.height / 2);

    Share.share(
      "Read \"${widget.document.title}\" by ${widget.document.author}\n${widget.document.pdfUrl}",
      subject: widget.document.title,
      sharePositionOrigin: origin,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final isDownloaded = ref.watch(downloadedPdfsProvider).containsKey(widget.document.fileName);

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              widget.document.title,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            if (_isReady && _totalPages > 0)
              Text(
                "Page ${_currentPage + 1} of $_totalPages",
                style: TextStyle(
                  fontSize: 11,
                  color: isDark ? Colors.white70 : Colors.black54,
                ),
              ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              isDownloaded ? Icons.download_done_rounded : Icons.download_rounded,
              color: isDownloaded ? const Color(0xFF10B981) : null,
            ),
            tooltip: isDownloaded ? "Saved offline" : "Save for offline",
            onPressed: isDownloaded ? null : _saveForOffline,
          ),
          IconButton(
            icon: const Icon(Icons.share_outlined),
            tooltip: "Share document",
            onPressed: _shareDocument,
          ),
        ],
      ),
      body: _isLoading
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircularProgressIndicator(color: Color(0xFFD97706)),
                  const SizedBox(height: 16),
                  Text(
                    _loadingMessage,
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark ? Colors.white70 : Colors.black54,
                    ),
                  ),
                ],
              ),
            )
          : _errorMessage.isNotEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.error_outline_rounded, color: Colors.redAccent, size: 48),
                        const SizedBox(height: 12),
                        Text(
                          _errorMessage,
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 14),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: _preparePdf,
                          icon: const Icon(Icons.refresh),
                          label: const Text("Retry"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFD97706),
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                )
              : _localPath != null
                  ? PDFView(
                      filePath: _localPath,
                      enableSwipe: true,
                      swipeHorizontal: false,
                      autoSpacing: true,
                      pageFling: true,
                      pageSnap: true,
                      nightMode: isDark,
                      onRender: (pages) {
                        setState(() {
                          _totalPages = pages ?? 0;
                          _isReady = true;
                        });
                      },
                      onPageChanged: (int? page, int? total) {
                        setState(() {
                          _currentPage = page ?? 0;
                          _totalPages = total ?? _totalPages;
                        });
                      },
                      onError: (error) {
                        setState(() {
                          _errorMessage = error.toString();
                        });
                      },
                    )
                  : const SizedBox.shrink(),
    );
  }
}
