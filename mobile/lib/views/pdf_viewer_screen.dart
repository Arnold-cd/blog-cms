import "dart:io";
import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:flutter_pdfview/flutter_pdfview.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:http/http.dart" as http;
import "package:path_provider/path_provider.dart";
import "package:share_plus/share_plus.dart";
import "../models/pdf_document.dart";
import "../providers/library_providers.dart";
import "../services/api_service.dart";

enum ReadingTheme { normal, sepia, night }

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

  // Book Reading UX States
  PDFViewController? _pdfViewController;
  ReadingTheme _theme = ReadingTheme.normal;
  bool _showControls = true;

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

  void _jumpToPage(int targetPage) {
    if (targetPage < 0 || targetPage >= _totalPages) return;
    HapticFeedback.selectionClick();
    _pdfViewController?.setPage(targetPage);
    setState(() {
      _currentPage = targetPage;
    });
  }

  void _showJumpToPageDialog() {
    final controller =
        TextEditingController(text: (_currentPage + 1).toString());
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Jump to Page",
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          autofocus: true,
          decoration: InputDecoration(
            labelText: "Page (1 - $_totalPages)",
            border: const OutlineInputBorder(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFD97706),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              final pageNum = int.tryParse(controller.text.trim());
              if (pageNum != null && pageNum >= 1 && pageNum <= _totalPages) {
                Navigator.pop(ctx);
                _jumpToPage(pageNum - 1);
              }
            },
            child: const Text("Go"),
          ),
        ],
      ),
    );
  }

  void _cycleReadingTheme() {
    setState(() {
      switch (_theme) {
        case ReadingTheme.normal:
          _theme = ReadingTheme.sepia;
          break;
        case ReadingTheme.sepia:
          _theme = ReadingTheme.night;
          break;
        case ReadingTheme.night:
          _theme = ReadingTheme.normal;
          break;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final isDownloaded =
        ref.watch(downloadedPdfsProvider).containsKey(widget.document.fileName);

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: AnimatedSlide(
          duration: const Duration(milliseconds: 250),
          offset: _showControls ? Offset.zero : const Offset(0, -1.2),
          child: AnimatedOpacity(
            duration: const Duration(milliseconds: 200),
            opacity: _showControls ? 1.0 : 0.0,
            child: AppBar(
              backgroundColor: isDark
                  ? const Color(0xEE121214)
                  : const Color(0xEEFFFFFF),
              elevation: 1,
              title: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    widget.document.title,
                    style: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.bold),
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
          ),
        ),
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
                  ? Stack(
                      children: [
                        // Main PDF Rendering Canvas (Book Flip Mode)
                        Positioned.fill(
                          child: PDFView(
                            key: ValueKey(
                                "pdf_view_${_localPath}_${_theme == ReadingTheme.night}"),
                            filePath: _localPath,
                            defaultPage: _currentPage,
                            enableSwipe: true,
                            swipeHorizontal: true,
                            autoSpacing: false,
                            pageFling: true,
                            pageSnap: true,
                            fitEachPage: true,
                            nightMode: _theme == ReadingTheme.night,
                            onViewCreated: (PDFViewController controller) {
                              _pdfViewController = controller;
                            },
                            onRender: (pages) {
                              setState(() {
                                _totalPages = pages ?? 0;
                                _isReady = true;
                              });
                            },
                            onPageChanged: (int? page, int? total) {
                              if (page != null && page != _currentPage) {
                                HapticFeedback.selectionClick();
                              }
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
                          ),
                        ),

                        // Realistic Book Spine Inner Shadow (Left Gutter)
                        if (_theme != ReadingTheme.night) ...[
                          Positioned(
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 18,
                            child: IgnorePointer(
                              child: DecoratedBox(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.centerLeft,
                                    end: Alignment.centerRight,
                                    colors: [
                                      Colors.black.withOpacity(0.18),
                                      Colors.black.withOpacity(0.04),
                                      Colors.transparent,
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                          // Subtle Right Edge Stack Shadow
                          Positioned(
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: 8,
                            child: IgnorePointer(
                              child: DecoratedBox(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.centerRight,
                                    end: Alignment.centerLeft,
                                    colors: [
                                      Colors.black.withOpacity(0.08),
                                      Colors.transparent,
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],

                        // Sepia Warm Paper Filter Overlay
                        if (_theme == ReadingTheme.sepia)
                          Positioned.fill(
                            child: IgnorePointer(
                              child: Container(
                                color: const Color(0xFFD97706).withOpacity(0.08),
                              ),
                            ),
                          ),

                        // Floating Toggle Immersion Button (Top Right Under AppBar)
                        Positioned(
                          right: 16,
                          top: _showControls ? 80 : 44,
                          child: Material(
                            color: isDark
                                ? Colors.black.withOpacity(0.65)
                                : Colors.white.withOpacity(0.85),
                            shape: const CircleBorder(),
                            elevation: 3,
                            child: InkWell(
                              customBorder: const CircleBorder(),
                              onTap: () {
                                setState(() {
                                  _showControls = !_showControls;
                                });
                              },
                              child: Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Icon(
                                  _showControls
                                      ? Icons.fullscreen_rounded
                                      : Icons.fullscreen_exit_rounded,
                                  size: 20,
                                  color: const Color(0xFFD97706),
                                ),
                              ),
                            ),
                          ),
                        ),

                        // Bottom Floating Reader HUD
                        Positioned(
                          left: 16,
                          right: 16,
                          bottom: 24,
                          child: AnimatedSlide(
                            duration: const Duration(milliseconds: 250),
                            offset: _showControls
                                ? Offset.zero
                                : const Offset(0, 1.4),
                            child: AnimatedOpacity(
                              duration: const Duration(milliseconds: 200),
                              opacity: _showControls ? 1.0 : 0.0,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 12),
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? const Color(0xEE1A1A1F)
                                      : const Color(0xEEFFFFFF),
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.2),
                                      blurRadius: 18,
                                      offset: const Offset(0, 6),
                                    ),
                                  ],
                                  border: Border.all(
                                    color: isDark
                                        ? Colors.white12
                                        : Colors.black12,
                                  ),
                                ),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    // Scrubber Slider
                                    if (_totalPages > 1)
                                      Row(
                                        children: [
                                          Text(
                                            "1",
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: isDark
                                                  ? Colors.white54
                                                  : Colors.black45,
                                            ),
                                          ),
                                          Expanded(
                                            child: SliderTheme(
                                              data: SliderTheme.of(context)
                                                  .copyWith(
                                                activeTrackColor:
                                                    const Color(0xFFD97706),
                                                thumbColor:
                                                    const Color(0xFFD97706),
                                                inactiveTrackColor: isDark
                                                    ? Colors.white12
                                                    : Colors.black12,
                                                trackHeight: 3.5,
                                                thumbShape:
                                                    const RoundSliderThumbShape(
                                                        enabledThumbRadius: 6),
                                                overlayShape:
                                                    const RoundSliderOverlayShape(
                                                        overlayRadius: 14),
                                              ),
                                              child: Slider(
                                                value: _currentPage
                                                    .toDouble()
                                                    .clamp(
                                                        0.0,
                                                        (_totalPages - 1)
                                                            .toDouble()),
                                                min: 0.0,
                                                max: (_totalPages - 1)
                                                    .toDouble(),
                                                onChanged: (val) {
                                                  _jumpToPage(val.round());
                                                },
                                              ),
                                            ),
                                          ),
                                          Text(
                                            "$_totalPages",
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: isDark
                                                  ? Colors.white54
                                                  : Colors.black45,
                                            ),
                                          ),
                                        ],
                                      ),

                                    // Reader Navigation & Style Toolbar
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        // Prev Page
                                        IconButton(
                                          icon: const Icon(
                                              Icons.chevron_left_rounded),
                                          iconSize: 28,
                                          tooltip: "Previous page",
                                          onPressed: _currentPage > 0
                                              ? () => _jumpToPage(
                                                  _currentPage - 1)
                                              : null,
                                        ),

                                        // Jump to Page Button
                                        InkWell(
                                          borderRadius:
                                              BorderRadius.circular(8),
                                          onTap: _showJumpToPageDialog,
                                          child: Padding(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 10, vertical: 4),
                                            child: Text(
                                              _totalPages > 0
                                                  ? "Page ${_currentPage + 1} of $_totalPages"
                                                  : "--",
                                              style: const TextStyle(
                                                fontSize: 13,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          ),
                                        ),

                                        // Next Page
                                        IconButton(
                                          icon: const Icon(
                                              Icons.chevron_right_rounded),
                                          iconSize: 28,
                                          tooltip: "Next page",
                                          onPressed:
                                              _currentPage < _totalPages - 1
                                                  ? () => _jumpToPage(
                                                      _currentPage + 1)
                                                  : null,
                                        ),

                                        // Theme Cycler Button (Normal -> Sepia -> Night)
                                        IconButton(
                                          icon: Icon(
                                            _theme == ReadingTheme.sepia
                                                ? Icons.auto_awesome
                                                : _theme == ReadingTheme.night
                                                    ? Icons.dark_mode_rounded
                                                    : Icons.light_mode_rounded,
                                            size: 20,
                                            color: const Color(0xFFD97706),
                                          ),
                                          tooltip: "Cycle Reading Theme",
                                          onPressed: _cycleReadingTheme,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    )
                  : const SizedBox.shrink(),
    );
  }
}

