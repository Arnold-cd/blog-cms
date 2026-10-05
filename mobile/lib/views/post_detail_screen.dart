import "package:flutter/material.dart";
import "package:flutter_markdown/flutter_markdown.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:flutter_tts/flutter_tts.dart";
import "package:intl/intl.dart";
import "package:share_plus/share_plus.dart";
import "package:url_launcher/url_launcher.dart";
import "../models/post.dart";
import "../providers/app_providers.dart";
import "../providers/monetization_provider.dart";
import "../services/ad_service.dart";
import "../services/api_service.dart";
import "../services/cache_service.dart";
import "../services/meetei_mayek_service.dart";
import "../theme/app_theme.dart";
import "../widgets/adaptive_image.dart";
import "../widgets/donation_modal.dart";
import "../widgets/monetization_modal.dart";

class PostDetailScreen extends ConsumerStatefulWidget {
  final Post post;

  const PostDetailScreen({super.key, required this.post});

  @override
  ConsumerState<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends ConsumerState<PostDetailScreen> {
  late Future<String> _contentFuture;
  late FlutterTts _flutterTts;
  bool _isPlayingTts = false;
  bool _isTranslated = false;
  String _rawMarkdown = "";

  @override
  void initState() {
    super.initState();
    _initTts();
    _contentFuture = _loadContent();
  }

  void _initTts() {
    _flutterTts = FlutterTts();
    _flutterTts.setStartHandler(() {
      if (mounted) setState(() => _isPlayingTts = true);
    });
    _flutterTts.setCompletionHandler(() {
      if (mounted) setState(() => _isPlayingTts = false);
    });
    _flutterTts.setCancelHandler(() {
      if (mounted) setState(() => _isPlayingTts = false);
    });
    _flutterTts.setErrorHandler((msg) {
      if (mounted) setState(() => _isPlayingTts = false);
    });
  }

  @override
  void dispose() {
    _flutterTts.stop();
    try {
      final isAdFree = ref.read(monetizationProvider).isAdFreeActive;
      if (!isAdFree) {
        AdService.instance.showInterstitialIfEligible();
      }
    } catch (_) {}
    super.dispose();
  }

  Future<String> _loadContent() async {
    // 1. Try local offline cache first
    final cached = await CacheService.getCachedContent(widget.post.id);
    if (cached != null && cached.isNotEmpty) {
      _rawMarkdown = cached;
      _revalidateContentInBackground();
      return cached;
    }

    // 2. Fetch from GitHub raw
    try {
      final api = ref.read(apiServiceProvider);
      final text = await api.fetchPostContent(widget.post.contentUrl);
      _rawMarkdown = text;
      await CacheService.saveContent(widget.post.id, text);
      return text;
    } catch (e) {
      if (widget.post.content != null && widget.post.content!.isNotEmpty) {
        _rawMarkdown = widget.post.content!;
        return widget.post.content!;
      }
      rethrow;
    }
  }

  Future<void> _revalidateContentInBackground() async {
    try {
      final api = ref.read(apiServiceProvider);
      final text = await api.fetchPostContent(widget.post.contentUrl);
      if (text != _rawMarkdown && mounted) {
        setState(() {
          _rawMarkdown = text;
        });
        await CacheService.saveContent(widget.post.id, text);
      }
    } catch (_) {}
  }

  void _toggleTts() async {
    if (_isPlayingTts) {
      await _flutterTts.stop();
      if (mounted) setState(() => _isPlayingTts = false);
    } else {
      if (_rawMarkdown.isEmpty) return;
      final speed = await CacheService.getTtsSpeed();
      await _flutterTts.setSpeechRate(speed * 0.5);
      final cleanText = _stripMarkdown(_rawMarkdown);
      final title = _isTranslated
          ? MeeteiMayekService.translateToMeeteiMayekWithVocab(widget.post.title)
          : widget.post.title;
      final author = _isTranslated
          ? MeeteiMayekService.translateToMeeteiMayekWithVocab(widget.post.author)
          : widget.post.author;
      final body = _isTranslated
          ? MeeteiMayekService.translateToMeeteiMayekWithVocab(cleanText)
          : cleanText;
      final spokenText = "$title. By $author. $body";
      await _flutterTts.speak(spokenText);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Playing audio narration..."),
            duration: Duration(seconds: 2),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  /// Strip all YAML frontmatters, metadata blocks, and ID fields so they never pollute article text
  String _cleanContent(String markdown) {
    var content = markdown.trim();

    // 1. Repeatedly strip all standard frontmatter blocks delimited by --- or +++
    // (handles multiple/chained frontmatters from multi-saved files)
    final frontmatterRegex = RegExp(
      r'^(?:---|\+\+\+)\s*[\r\n]+[\s\S]*?[\r\n]+(?:---|\+\+\+)\s*',
      multiLine: false,
    );
    while (frontmatterRegex.hasMatch(content)) {
      content = content.replaceFirst(frontmatterRegex, '').trim();
    }

    // 2. Strip any naked/un-delimited YAML metadata blocks at the start of the article
    final metadataKeyRegex = RegExp(
      r'^\s*(?:id|title|summary|date|author|category|thumbnail|language|featured|tags|slug)\s*:\s*.*$',
      caseSensitive: false,
    );
    final lines = content.split(RegExp(r'\r?\n'));
    int dropUntil = 0;
    for (int i = 0; i < lines.length; i++) {
      final line = lines[i].trim();
      if (line.isEmpty || line == '---' || line == '***' || line == '___' || metadataKeyRegex.hasMatch(line)) {
        dropUntil = i + 1;
      } else {
        break;
      }
    }
    if (dropUntil > 0) {
      content = lines.sublist(dropUntil).join('\n').trim();
    }

    // 3. Remove any metadata blocks collapsed onto one or more lines (e.g. id: "..." title: "..." summary: "...")
    final inlineMetadataBlockRegex = RegExp(
      r'(?:^|\n)\s*id:\s*["\x27]?[^"\x27\n\r]+["\x27]?(?:\s+(?:title|summary|date|author|category|thumbnail|language|featured|tags):\s*["\x27]?[^"\x27\n\r]+["\x27]?)+[^\n\r]*(?:\r?\n|$)',
      caseSensitive: false,
    );
    content = content.replaceAll(inlineMetadataBlockRegex, '\n');

    // 4. Remove any isolated `id: "..."` or `id: ...` lines throughout the article
    content = content.replaceAll(
      RegExp(r'^\s*id\s*:\s*["\x27]?[^"\x27\r\n]*["\x27]?\s*$', multiLine: true, caseSensitive: false),
      '',
    );

    // 5. Clean up any leading horizontal dividers (---, ***, ___) left orphaned at the start
    content = content.replaceFirst(RegExp(r'^(?:(?:\-{3,}|\*{3,}|_{3,})\s*[\r\n]+)+'), '').trim();

    return content;
  }

  String _stripMarkdown(String markdown) {
    final clean = _cleanContent(markdown);
    return clean
        .replaceAll(RegExp(r'!\[.*?\]\(.*?\)', dotAll: true), '')
        .replaceAll(RegExp(r'#+\s*'), '')
        .replaceAll(RegExp(r'(\*\*|__)(.*?)\1'), r'$2')
        .replaceAll(RegExp(r'(\*|_)(.*?)\1'), r'$2')
        .replaceAll(RegExp(r'\[(.*?)\]\(.*?\)'), r'$1')
        .replaceAll(RegExp(r'`{1,3}.*?`{1,3}', dotAll: true), '')
        .replaceAll(RegExp(r'>\s*'), '');
  }

  String _formatDate(String rawDate) {
    if (rawDate.isEmpty) return "";
    try {
      final parsed = DateTime.parse(rawDate);
      return DateFormat("MMMM d, yyyy").format(parsed);
    } catch (_) {
      return rawDate;
    }
  }

  void _openFullScreenImage(BuildContext context, String imageUrl) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            backgroundColor: Colors.black.withValues(alpha: 0.6),
            elevation: 0,
            iconTheme: const IconThemeData(color: Colors.white),
          ),
          body: Center(
            child: InteractiveViewer(
              minScale: 0.8,
              maxScale: 4.0,
              child: AdaptiveImage(
                imageUrl: imageUrl,
                fit: BoxFit.contain,
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final isAdFree = ref.watch(monetizationProvider).isAdFreeActive;
    final bookmarks = ref.watch(bookmarksProvider);
    final isBookmarked = bookmarks.contains(widget.post.id);
    final fontScale = ref.watch(fontSizeProvider);
    final paperTone = ref.watch(paperToneProvider);

    // Dynamic paper tone styling
    final Color? customBgColor = switch (paperTone) {
      "sepia" => const Color(0xFFFBF0D9),
      "cream" => const Color(0xFFFAF7F0),
      "sage" => const Color(0xFFEBF2EB),
      "navy" => const Color(0xFF0F172A),
      "oled" => Colors.black,
      _ => null,
    };

    final Color? customTextColor = switch (paperTone) {
      "sepia" => const Color(0xFF2C241E),
      "cream" => const Color(0xFF1F2421),
      "sage" => const Color(0xFF1C2B1E),
      "navy" => const Color(0xFFE2E8F0),
      "oled" => const Color(0xFFEDEDED),
      _ => null,
    };

    final Color? customSubtitleColor = switch (paperTone) {
      "sepia" => const Color(0xFF6B5847),
      "cream" => const Color(0xFF5C635E),
      "sage" => const Color(0xFF4B5E4D),
      "navy" => const Color(0xFF94A3B8),
      "oled" => Colors.white60,
      _ => null,
    };

    final Color? customContainerColor = switch (paperTone) {
      "sepia" => const Color(0xFFF2E4C4),
      "cream" => const Color(0xFFF0EBE0),
      "sage" => const Color(0xFFDEE9DE),
      "navy" => const Color(0xFF1E293B),
      "oled" => const Color(0xFF141418),
      _ => null,
    };

    // Derived translated or original text
    final unicodeTitle = _isTranslated
        ? MeeteiMayekService.translateToMeeteiMayekWithVocab(widget.post.title)
        : widget.post.title;
    final unicodeCategory = _isTranslated
        ? MeeteiMayekService.translateToMeeteiMayekWithVocab(widget.post.category)
        : widget.post.category;
    final unicodeAuthor = _isTranslated
        ? MeeteiMayekService.translateToMeeteiMayekWithVocab(widget.post.author)
        : widget.post.author;

    final effectiveTitle = _isTranslated
        ? MeeteiMayekService.convertUnicodeToPukokFont(unicodeTitle)
        : unicodeTitle;
    final effectiveCategory = _isTranslated
        ? MeeteiMayekService.convertUnicodeToPukokFont(unicodeCategory)
        : unicodeCategory;
    final effectiveAuthor = _isTranslated
        ? MeeteiMayekService.convertUnicodeToPukokFont(unicodeAuthor)
        : unicodeAuthor;

    return Scaffold(
      backgroundColor: customBgColor,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Collapsible Hero Header
          SliverAppBar(
            expandedHeight: widget.post.thumbnailUrl.isNotEmpty ? 260 : 100,
            pinned: true,
            leading: IconButton(
              icon: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: isDark ? Colors.black.withValues(alpha: 0.5) : Colors.white.withValues(alpha: 0.85),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.arrow_back_rounded,
                  color: isDark ? Colors.white : Colors.black,
                  size: 20,
                ),
              ),
              onPressed: () => Navigator.of(context).pop(),
            ),
            actions: [
              // Free Ad-Free Pass / Rewarded Ad
              IconButton(
                tooltip: "Free Ad-Free Pass (Watch Ad)",
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.black.withValues(alpha: 0.5) : Colors.white.withValues(alpha: 0.85),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.stars_rounded,
                    color: Color(0xFFF59E0B),
                    size: 20,
                  ),
                ),
                onPressed: () => MonetizationModal.show(context),
              ),
              // Quick Translation Toggle Button in AppBar
              IconButton(
                tooltip: _isTranslated ? "Switch to English" : "Translate to Meetei Mayek",
                icon: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _isTranslated
                        ? const Color(0xFF6366F1)
                        : (isDark ? Colors.black.withValues(alpha: 0.5) : Colors.white.withValues(alpha: 0.85)),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    _isTranslated ? "ꯃꯤ" : "EN",
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: _isTranslated ? Colors.white : (isDark ? Colors.white : Colors.black),
                      fontFamilyFallback: AppTheme.fontFallbacks,
                    ),
                  ),
                ),
                onPressed: () {
                  setState(() => _isTranslated = !_isTranslated);
                },
              ),
              // TTS Audio Button
              IconButton(
                tooltip: _isPlayingTts ? "Pause Narration" : "Listen to Article",
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: _isPlayingTts
                        ? const Color(0xFF6366F1)
                        : (isDark ? Colors.black.withValues(alpha: 0.5) : Colors.white.withValues(alpha: 0.85)),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _isPlayingTts ? Icons.volume_up_rounded : Icons.volume_mute_rounded,
                    color: _isPlayingTts ? Colors.white : (isDark ? Colors.white : Colors.black),
                    size: 20,
                  ),
                ),
                onPressed: _toggleTts,
              ),
              // Font Size Adjustment
              IconButton(
                tooltip: "Adjust Font Size",
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.black.withValues(alpha: 0.5) : Colors.white.withValues(alpha: 0.85),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.format_size_rounded,
                    color: isDark ? Colors.white : Colors.black,
                    size: 20,
                  ),
                ),
                onPressed: () => _showFontSizeModal(context),
              ),
              // Bookmark Button
              IconButton(
                tooltip: isBookmarked ? "Remove Bookmark" : "Save Bookmark",
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.black.withValues(alpha: 0.5) : Colors.white.withValues(alpha: 0.85),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_outline_rounded,
                    color: isBookmarked ? const Color(0xFF6366F1) : (isDark ? Colors.white : Colors.black),
                    size: 20,
                  ),
                ),
                onPressed: () {
                  ref.read(bookmarksProvider.notifier).toggle(widget.post.id);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      duration: const Duration(seconds: 1),
                      content: Text(
                        isBookmarked ? "Removed from bookmarks" : "Article saved for offline reading",
                      ),
                    ),
                  );
                },
              ),
              // Donate / Support Button
              IconButton(
                tooltip: "Support & Donate",
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.black.withValues(alpha: 0.5) : Colors.white.withValues(alpha: 0.85),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.volunteer_activism_rounded,
                    color: Color(0xFFF43F5E),
                    size: 20,
                  ),
                ),
                onPressed: () => DonationModal.show(context),
              ),
              // Share Button
              IconButton(
                tooltip: "Share Article",
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.black.withValues(alpha: 0.5) : Colors.white.withValues(alpha: 0.85),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.share_outlined,
                    color: isDark ? Colors.white : Colors.black,
                    size: 20,
                  ),
                ),
                onPressed: () {
                  final media = MediaQuery.of(context);
                  final screenW = media.size.width > 0 ? media.size.width : 375.0;
                  final screenH = media.size.height > 0 ? media.size.height : 667.0;
                  final box = context.findRenderObject() as RenderBox?;
                  final origin = (box != null && box.hasSize && box.size.width > 10 && box.size.height > 10)
                      ? (box.localToGlobal(Offset.zero) & box.size)
                      : Rect.fromLTWH(0, 0, screenW, screenH / 2);

                  Share.share(
                    "${widget.post.title}\n\nRead on SLLK app\nhttps://blog-cms-gilt.vercel.app/",
                    sharePositionOrigin: origin,
                  );
                },
              ),
              const SizedBox(width: 8),
            ],
            flexibleSpace: widget.post.thumbnailUrl.isNotEmpty
                ? FlexibleSpaceBar(
                    background: Hero(
                      tag: "post-thumbnail-${widget.post.id}",
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          AdaptiveImage(
                            imageUrl: widget.post.thumbnailUrl,
                            fit: BoxFit.cover,
                          ),
                          Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.black.withValues(alpha: 0.3),
                                  Colors.transparent,
                                  customBgColor ?? (isDark ? const Color(0xFF09090B) : Colors.white),
                                ],
                                stops: const [0.0, 0.5, 1.0],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                : null,
          ),

          // Article Header & Metadata
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Dedicated Language View Toggle Bar (Matches Web App)
                  Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: customContainerColor ?? (isDark ? const Color(0xFF141418) : const Color(0xFFF1F5F9)),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isDark ? Colors.white.withValues(alpha: 0.07) : Colors.black.withValues(alpha: 0.06),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.translate_rounded, size: 16, color: Color(0xFF6366F1)),
                            const SizedBox(width: 8),
                            Text(
                              "Language View:",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: customTextColor ?? (isDark ? Colors.white : const Color(0xFF0F172A)),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                "(Authentic Wakoklon Pukok Eeyek)",
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 10.5,
                                  color: customSubtitleColor ?? theme.textTheme.bodySmall?.color?.withValues(alpha: 0.6),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Container(
                          padding: const EdgeInsets.all(3),
                          decoration: BoxDecoration(
                            color: customBgColor ?? (isDark ? const Color(0xFF09090B) : Colors.white),
                            borderRadius: BorderRadius.circular(9),
                            border: Border.all(
                              color: isDark ? Colors.white.withValues(alpha: 0.06) : Colors.black.withValues(alpha: 0.05),
                            ),
                          ),
                          child: Row(
                            children: [
                              // English button
                              Expanded(
                                child: GestureDetector(
                                  onTap: () {
                                    if (_isTranslated) setState(() => _isTranslated = false);
                                  },
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 180),
                                    padding: const EdgeInsets.symmetric(vertical: 8),
                                    decoration: BoxDecoration(
                                      color: !_isTranslated
                                          ? (isDark ? const Color(0xFF6366F1) : const Color(0xFF4F46E5))
                                          : Colors.transparent,
                                      borderRadius: BorderRadius.circular(7),
                                      boxShadow: !_isTranslated
                                          ? [
                                              BoxShadow(
                                                color: const Color(0xFF6366F1).withValues(alpha: 0.3),
                                                blurRadius: 4,
                                                offset: const Offset(0, 2),
                                              ),
                                            ]
                                          : null,
                                    ),
                                    alignment: Alignment.center,
                                    child: Text(
                                      "English",
                                      style: TextStyle(
                                        fontSize: 12.5,
                                        fontWeight: !_isTranslated ? FontWeight.w700 : FontWeight.w500,
                                        color: !_isTranslated ? Colors.white : (customTextColor ?? (isDark ? Colors.white70 : Colors.black87)),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 4),
                              // Meetei Mayek button
                              Expanded(
                                child: GestureDetector(
                                  onTap: () {
                                    if (!_isTranslated) setState(() => _isTranslated = true);
                                  },
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 180),
                                    padding: const EdgeInsets.symmetric(vertical: 8),
                                    decoration: BoxDecoration(
                                      color: _isTranslated
                                          ? (isDark ? const Color(0xFF6366F1) : const Color(0xFF4F46E5))
                                          : Colors.transparent,
                                      borderRadius: BorderRadius.circular(7),
                                      boxShadow: _isTranslated
                                          ? [
                                              BoxShadow(
                                                color: const Color(0xFF6366F1).withValues(alpha: 0.3),
                                                blurRadius: 4,
                                                offset: const Offset(0, 2),
                                              ),
                                            ]
                                          : null,
                                    ),
                                    alignment: Alignment.center,
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          "ꯃꯤꯇꯩ ꯃꯌꯦꯛ",
                                          style: TextStyle(
                                            fontSize: 12.5,
                                            fontWeight: _isTranslated ? FontWeight.w700 : FontWeight.w500,
                                            fontFamilyFallback: AppTheme.fontFallbacks,
                                            color: _isTranslated ? Colors.white : (customTextColor ?? (isDark ? Colors.white70 : Colors.black87)),
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          "(Meetei)",
                                          style: TextStyle(
                                            fontSize: 10.5,
                                            color: _isTranslated ? Colors.white.withValues(alpha: 0.85) : (customSubtitleColor ?? (isDark ? Colors.white54 : Colors.black54)),
                                          ),
                                        ),
                                      ],
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

                  // Category & Language Tags
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF6366F1).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          _isTranslated ? effectiveCategory : effectiveCategory.toUpperCase(),
                          style: TextStyle(
                            color: const Color(0xFF6366F1),
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.8,
                            fontFamily: _isTranslated ? "PukokEeyek" : null,
                            fontFamilyFallback: AppTheme.fontFallbacks,
                          ),
                        ),
                      ),
                      if (widget.post.language.isNotEmpty) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.teal.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            _isTranslated
                                ? MeeteiMayekService.convertUnicodeToPukokFont("ꯃꯤꯇꯩ ꯃꯌꯦꯛ")
                                : (widget.post.language == "mni" ? MeeteiMayekService.convertUnicodeToPukokFont("ꯃꯤꯇꯩ ꯃꯌꯦꯛ") : widget.post.language.toUpperCase()),
                            style: TextStyle(
                              color: Colors.teal.shade300,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              fontFamily: _isTranslated || widget.post.language == "mni" ? "PukokEeyek" : null,
                              fontFamilyFallback: AppTheme.fontFallbacks,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Post Title
                  Text(
                    effectiveTitle,
                    style: theme.textTheme.headlineMedium?.copyWith(
                      color: customTextColor,
                      fontWeight: _isTranslated ? FontWeight.normal : FontWeight.w800,
                      letterSpacing: _isTranslated ? 0.8 : -0.5,
                      height: 1.3,
                      fontFamily: _isTranslated ? "PukokEeyek" : null,
                      fontFamilyFallback: AppTheme.fontFallbacks,
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Author & Date Row
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: const Color(0xFF6366F1).withValues(alpha: 0.2),
                        child: Text(
                          effectiveAuthor.isNotEmpty
                              ? (_isTranslated ? effectiveAuthor[0] : effectiveAuthor[0].toUpperCase())
                              : "A",
                          style: TextStyle(
                            color: const Color(0xFF6366F1),
                            fontWeight: _isTranslated ? FontWeight.normal : FontWeight.bold,
                            fontSize: 13,
                            fontFamily: _isTranslated ? "PukokEeyek" : null,
                            fontFamilyFallback: AppTheme.fontFallbacks,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            effectiveAuthor,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: customTextColor,
                              fontWeight: _isTranslated ? FontWeight.normal : FontWeight.w600,
                              fontFamily: _isTranslated ? "PukokEeyek" : null,
                              fontFamilyFallback: AppTheme.fontFallbacks,
                            ),
                          ),
                          Text(
                            _isTranslated
                                ? "${MeeteiMayekService.convertUnicodeToPukokFont(MeeteiMayekService.translateToMeeteiMayekWithVocab(_formatDate(widget.post.date)))} • ${MeeteiMayekService.convertUnicodeToPukokFont(MeeteiMayekService.translateToMeeteiMayekWithVocab(widget.post.readingTimeMin.toString()))} ${MeeteiMayekService.convertUnicodeToPukokFont("ꯃꯤꯅꯤꯠ ꯄꯥꯕ")}"
                                : "${_formatDate(widget.post.date)} • ${widget.post.readingTimeMin} min read",
                            style: TextStyle(
                              color: customSubtitleColor ?? theme.textTheme.bodySmall?.color?.withValues(alpha: 0.6),
                              fontSize: 12,
                              fontFamily: _isTranslated ? "PukokEeyek" : null,
                              fontFamilyFallback: AppTheme.fontFallbacks,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Divider(
                    height: 1,
                    color: switch (paperTone) {
                      "sepia" => const Color(0xFFD6C6A8),
                      "cream" => const Color(0xFFE2DDD3),
                      "sage" => const Color(0xFFCFDDCF),
                      "navy" => const Color(0xFF334155),
                      _ => null,
                    },
                  ),
                ],
              ),
            ),
          ),

          // Markdown Content Body
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: FutureBuilder<String>(
                future: _contentFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting && _rawMarkdown.isEmpty) {
                    return const Padding(
                      padding: EdgeInsets.all(40),
                      child: Center(
                        child: CircularProgressIndicator(color: Color(0xFF6366F1)),
                      ),
                    );
                  }

                  if (snapshot.hasError && _rawMarkdown.isEmpty) {
                    return Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        children: [
                          Icon(Icons.broken_image_outlined, size: 48, color: theme.colorScheme.error),
                          const SizedBox(height: 12),
                          Text(
                            "Unable to load markdown content",
                            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            snapshot.error.toString(),
                            textAlign: TextAlign.center,
                            style: theme.textTheme.bodySmall,
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton.icon(
                            onPressed: () {
                              setState(() {
                                _contentFuture = _loadContent();
                              });
                            },
                            icon: const Icon(Icons.refresh_rounded),
                            label: const Text("Retry"),
                          ),
                        ],
                      ),
                    );
                  }

                  final raw = _rawMarkdown.isNotEmpty ? _rawMarkdown : (snapshot.data ?? "");
                  final cleaned = _cleanContent(raw);
                  final markdownData = _isTranslated
                      ? MeeteiMayekService.translateMarkdownToPukok(cleaned)
                      : cleaned;

                  return MarkdownBody(
                    data: markdownData,
                    selectable: true,
                    onTapLink: (text, href, title) {
                      if (href != null) {
                        final uri = Uri.tryParse(href);
                        if (uri != null && (uri.scheme == 'http' || uri.scheme == 'https')) {
                          launchUrl(uri, mode: LaunchMode.externalApplication);
                        }
                      }
                    },
                    imageBuilder: (uri, title, alt) {
                      final resolved = ApiService.resolveUrl(uri.toString());
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        child: GestureDetector(
                          onTap: () => _openFullScreenImage(context, resolved),
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.08),
                                  blurRadius: 12,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(14),
                              child: AdaptiveImage(
                                imageUrl: resolved,
                                width: double.infinity,
                                fit: BoxFit.fitWidth,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                    styleSheet: MarkdownStyleSheet(
                      p: theme.textTheme.bodyLarge?.copyWith(
                        fontSize: 16 * fontScale,
                        height: 1.7,
                        color: customTextColor,
                        fontFamily: _isTranslated ? "PukokEeyek" : null,
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                      h1: theme.textTheme.headlineMedium?.copyWith(
                        fontSize: 24 * fontScale,
                        fontWeight: _isTranslated ? FontWeight.normal : FontWeight.bold,
                        color: customTextColor,
                        fontFamily: _isTranslated ? "PukokEeyek" : null,
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                      h2: theme.textTheme.titleLarge?.copyWith(
                        fontSize: 20 * fontScale,
                        fontWeight: _isTranslated ? FontWeight.normal : FontWeight.w700,
                        color: customTextColor,
                        fontFamily: _isTranslated ? "PukokEeyek" : null,
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                      h3: theme.textTheme.titleMedium?.copyWith(
                        fontSize: 18 * fontScale,
                        fontWeight: _isTranslated ? FontWeight.normal : FontWeight.w600,
                        color: customTextColor,
                        fontFamily: _isTranslated ? "PukokEeyek" : null,
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                      blockquote: theme.textTheme.bodyMedium?.copyWith(
                        fontSize: 15 * fontScale,
                        fontStyle: FontStyle.italic,
                        height: 1.6,
                        color: customSubtitleColor ?? theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.8),
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                      blockquoteDecoration: BoxDecoration(
                        border: const Border(
                          left: BorderSide(color: Color(0xFF6366F1), width: 4),
                        ),
                        color: customContainerColor ?? (isDark ? const Color(0xFF1B1B21) : const Color(0xFFF4F4F8)),
                        borderRadius: const BorderRadius.only(
                          topRight: Radius.circular(8),
                          bottomRight: Radius.circular(8),
                        ),
                      ),
                      code: TextStyle(
                        fontFamily: "monospace",
                        fontSize: 14 * fontScale,
                        backgroundColor: isDark ? const Color(0xFF24242D) : const Color(0xFFE9E9F0),
                        color: isDark ? const Color(0xFF818CF8) : const Color(0xFF4F46E5),
                      ),
                      codeblockDecoration: BoxDecoration(
                        color: customContainerColor ?? (isDark ? const Color(0xFF141418) : const Color(0xFFF3F3F7)),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
                        ),
                      ),
                      em: TextStyle(
                        fontStyle: FontStyle.italic,
                        fontFamily: _isTranslated ? "PukokEeyek" : null,
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                      strong: TextStyle(
                        fontWeight: _isTranslated ? FontWeight.normal : FontWeight.bold,
                        fontFamily: _isTranslated ? "PukokEeyek" : null,
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                      tableBody: TextStyle(
                        fontFamily: _isTranslated ? "PukokEeyek" : null,
                        color: customTextColor,
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                      listBullet: TextStyle(
                        fontSize: 16 * fontScale,
                        color: customTextColor,
                        fontFamily: _isTranslated ? "PukokEeyek" : null,
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          // Article Footer Donation Card
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF141418) : const Color(0xFFFFF1F2),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFFF43F5E).withValues(alpha: 0.2),
                  ),
                ),
                child: Column(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF43F5E).withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      alignment: Alignment.center,
                      child: const Icon(
                        Icons.volunteer_activism_rounded,
                        color: Color(0xFFF43F5E),
                        size: 24,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      "Support Independent Indigenous Writing",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      "ꯃꯤꯇꯩ ꯃꯌꯦꯛ ꯑꯃꯁꯨꯡ ꯋꯥꯔꯦꯡ ꯁꯧꯒꯠꯄ",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFFF43F5E),
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      "If you found this article valuable, support our preservation and publication initiatives with a small contribution.",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 12,
                        color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.7),
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF43F5E),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      onPressed: () => DonationModal.show(context),
                      icon: const Icon(Icons.qr_code_rounded, size: 18),
                      label: const Text(
                        "Donate via QR Code",
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SliverToBoxAdapter(
            child: SizedBox(height: 60),
          ),
        ],
      ),
      bottomNavigationBar: !isAdFree ? const SafeArea(top: false, child: BannerAdWidget()) : null,
    );
  }

  void _showFontSizeModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Consumer(
          builder: (context, ref, _) {
            final scale = ref.watch(fontSizeProvider);
            final percent = (scale * 100).round();

            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.4),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      "Text Size",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.text_decrease_rounded),
                          onPressed: () {
                            ref.read(fontSizeProvider.notifier).decrease();
                          },
                        ),
                        const SizedBox(width: 16),
                        Text(
                          "$percent%",
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(width: 16),
                        IconButton(
                          icon: const Icon(Icons.text_increase_rounded),
                          onPressed: () {
                            ref.read(fontSizeProvider.notifier).increase();
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: () {
                        ref.read(fontSizeProvider.notifier).reset();
                      },
                      child: const Text("Reset to Default"),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
