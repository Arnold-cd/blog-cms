import "dart:io";
import "package:flutter/material.dart";
import "package:flutter_pdfview/flutter_pdfview.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:http/http.dart" as http;
import "package:path_provider/path_provider.dart";
import "package:share_plus/share_plus.dart";
import "../models/pdf_document.dart";
import "../providers/library_providers.dart";
import "../services/api_service.dart";

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
  http.Client? _downloadClient;

  @override
  void initState() {
    super.initState();
    _preparePdf();
  }

  @override
  void dispose() {
    _downloadClient?.close();
    super.dispose();
  }

  /// Verifies file existence, minimum size, and valid %PDF header magic bytes
  Future<bool> _isValidPdf(File file) async {
    try {
      if (!await file.exists()) return false;
      final length = await file.length();
      if (length < 100) return false;
      final header = await file.openRead(0, 5).first;
      final magic = String.fromCharCodes(header);
      return magic.startsWith("%PDF");
    } catch (_) {
      return false;
    }
  }

  Future<void> _preparePdf() async {
    setState(() {
      _isLoading = true;
      _errorMessage = "";
      _loadingMessage =
          "Downloading PDF (${widget.document.fileSizeFormatted})...";
    });

    final downloadedMap = ref.read(downloadedPdfsProvider);
    final existingLocalPath = downloadedMap[widget.document.fileName];

    if (existingLocalPath != null) {
      final existingFile = File(existingLocalPath);
      if (await _isValidPdf(existingFile)) {
        if (mounted) {
          setState(() {
            _localPath = existingLocalPath;
            _isLoading = false;
          });
        }
        return;
      }
    }

    try {
      final dir = await getTemporaryDirectory();
      final safeName = PdfDocument.sanitizeFileName(widget.document.fileName,
          fallbackId: widget.document.id);
      final tempFile = File("${dir.path}/$safeName");

      if (await tempFile.exists()) {
        if (await _isValidPdf(tempFile)) {
          if (mounted) {
            setState(() {
              _localPath = tempFile.path;
              _isLoading = false;
            });
          }
          return;
        } else {
          // Stale / partial / corrupted cache file -> purge it
          try {
            await tempFile.delete();
          } catch (_) {}
        }
      }

      _downloadClient?.close();
      final client = http.Client();
      _downloadClient = client;

      await ApiService.downloadFileStreamed(
        widget.document.pdfUrl,
        tempFile,
        client: client,
        maxBytes: ApiService.maxPdfBytes, // 150 MB safe limit
        verifyPdfHeader: true, // Verifies %PDF- magic bytes
        onProgress: (progress) {
          if (mounted) {
            setState(() {
              final pct = (progress * 100).toInt();
              _loadingMessage =
                  "Downloading PDF (${widget.document.fileSizeFormatted}) • $pct%...";
            });
          }
        },
      );

      if (mounted) {
        setState(() {
          _localPath = tempFile.path;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage =
              "Security/Download Error: ${e.toString().replaceAll('Exception: ', '')}";
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
    final media = MediaQuery.of(context);
    final screenW = media.size.width > 0 ? media.size.width : 375.0;
    final screenH = media.size.height > 0 ? media.size.height : 667.0;
    final box = context.findRenderObject() as RenderBox?;
    final origin = (box != null &&
            box.hasSize &&
            box.size.width > 10 &&
            box.size.height > 10)
        ? (box.localToGlobal(Offset.zero) & box.size)
        : Rect.fromLTWH(0, 0, screenW, screenH / 2);

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
    final isDownloaded =
        ref.watch(downloadedPdfsProvider).containsKey(widget.document.fileName);

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
              isDownloaded
                  ? Icons.download_done_rounded
                  : Icons.download_rounded,
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
                        const Icon(Icons.error_outline_rounded,
                            color: Colors.redAccent, size: 48),
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
                      key: ValueKey("pdf_view_$_localPath"),
                      filePath: _localPath,
                      enableSwipe: true,
                      swipeHorizontal: false,
                      autoSpacing: true,
                      pageFling: true,
                      pageSnap: true,
                      nightMode: false,
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
                      onError: (error) async {
                        final badPath = _localPath;
                        if (badPath != null) {
                          try {
                            final badFile = File(badPath);
                            if (await badFile.exists()) {
                              await badFile.delete();
                            }
                          } catch (_) {}
                        }
                        if (mounted) {
                          setState(() {
                            _errorMessage = error.toString();
                            _localPath = null;
                            _isLoading = false;
                          });
                        }
                      },
                      onPageError: (page, error) {
                        if (mounted) {
                          setState(() {
                            _errorMessage = "Page $page error: $error";
                          });
                        }
                      },
                    )
                  : const SizedBox.shrink(),
    );
  }
}
