import "package:flutter/material.dart";
import "package:url_launcher/url_launcher.dart";
import "package:youtube_player_iframe/youtube_player_iframe.dart";

/// A responsive YouTube video embed widget for Flutter articles.
/// Features a high-definition thumbnail preview with a play button,
/// initializing the interactive YouTube player inline on tap.
class YoutubeEmbedPlayer extends StatefulWidget {
  final String videoId;
  final String? videoTitle;

  const YoutubeEmbedPlayer({
    super.key,
    required this.videoId,
    this.videoTitle,
  });

  /// Extracts an 11-character YouTube video ID from various YouTube URL formats.
  static String? extractVideoId(String url) {
    final trimmed = url.trim();
    if (trimmed.isEmpty) return null;

    // Direct 11-char ID check
    final directIdRegex = RegExp(r"^[a-zA-Z0-9_-]{11}$");
    if (directIdRegex.hasMatch(trimmed)) return trimmed;

    // Matches youtu.be, youtube.com/watch?v=, youtube.com/embed/, youtube.com/shorts/
    final youtubeRegex = RegExp(
      r"(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})",
      caseSensitive: false,
    );

    final match = youtubeRegex.firstMatch(trimmed);
    return match?.group(1);
  }

  @override
  State<YoutubeEmbedPlayer> createState() => _YoutubeEmbedPlayerState();
}

class _YoutubeEmbedPlayerState extends State<YoutubeEmbedPlayer> {
  YoutubePlayerController? _controller;
  bool _isPlaying = false;
  bool _hasError = false;

  void _startInlinePlayer() {
    setState(() {
      _controller = YoutubePlayerController.fromVideoId(
        videoId: widget.videoId,
        autoPlay: true,
        params: const YoutubePlayerParams(
          showFullscreenButton: true,
          showControls: true,
          mute: false,
        ),
      );
      _isPlaying = true;
    });
  }

  Future<void> _openExternal() async {
    final url = Uri.parse("https://www.youtube.com/watch?v=${widget.videoId}");
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  void dispose() {
    _controller?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final maxResUrl = "https://img.youtube.com/vi/${widget.videoId}/maxresdefault.jpg";
    final fallbackUrl = "https://img.youtube.com/vi/${widget.videoId}/hqdefault.jpg";

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          color: isDark ? const Color(0xFF16161E) : const Color(0xFFE8E8EE),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.35 : 0.08),
              blurRadius: 14,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AspectRatio(
              aspectRatio: 16 / 9,
              child: _isPlaying && _controller != null
                  ? YoutubePlayer(
                      controller: _controller!,
                      aspectRatio: 16 / 9,
                    )
                  : Stack(
                      fit: StackFit.expand,
                      children: [
                        // Video thumbnail
                        Image.network(
                          _hasError ? fallbackUrl : maxResUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            if (!_hasError) {
                              WidgetsBinding.instance.addPostFrameCallback((_) {
                                if (mounted) setState(() => _hasError = true);
                              });
                            }
                            return Container(
                              color: isDark ? const Color(0xFF22222E) : const Color(0xFFDDDDE5),
                              child: const Center(
                                child: Icon(Icons.videocam_rounded, size: 48, color: Colors.grey),
                              ),
                            );
                          },
                        ),

                        // Dark gradient overlay for contrast
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.black.withValues(alpha: 0.25),
                                Colors.transparent,
                                Colors.black.withValues(alpha: 0.6),
                              ],
                            ),
                          ),
                        ),

                        // Center Play Button
                        Center(
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: _startInlinePlayer,
                              borderRadius: BorderRadius.circular(32),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFF0000), // YouTube Red
                                  borderRadius: BorderRadius.circular(28),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFFFF0000).withValues(alpha: 0.4),
                                      blurRadius: 16,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.play_arrow_rounded, color: Colors.white, size: 26),
                                    SizedBox(width: 6),
                                    Text(
                                      "Play Video",
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                        letterSpacing: 0.3,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),

                        // External App Launcher Button in top right
                        Positioned(
                          top: 8,
                          right: 8,
                          child: Material(
                            color: Colors.black.withValues(alpha: 0.55),
                            borderRadius: BorderRadius.circular(20),
                            child: InkWell(
                              onTap: _openExternal,
                              borderRadius: BorderRadius.circular(20),
                              child: const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.open_in_new_rounded, size: 14, color: Colors.white),
                                    SizedBox(width: 4),
                                    Text(
                                      "YouTube",
                                      style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
