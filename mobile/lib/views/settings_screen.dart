import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:url_launcher/url_launcher.dart";
import "package:share_plus/share_plus.dart";
import "../providers/app_providers.dart";
import "../providers/library_providers.dart";
import "../services/cache_service.dart";
import "../widgets/donation_modal.dart";

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _isSyncing = false;
  bool _transliteration = true;
  String _paperTone = "default";
  double _ttsSpeed = 1.0;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    final trans = await CacheService.isTransliterationEnabled();
    final tone = await CacheService.getPaperTone();
    final speed = await CacheService.getTtsSpeed();
    if (mounted) {
      setState(() {
        _transliteration = trans;
        _paperTone = tone;
        _ttsSpeed = speed;
      });
    }
  }

  String _formatBytes(int bytes) {
    if (bytes < 1024) return "$bytes B";
    if (bytes < 1024 * 1024) return "${(bytes / 1024).toStringAsFixed(1)} KB";
    return "${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB";
  }

  Future<void> _syncCatalog() async {
    setState(() => _isSyncing = true);
    try {
      await Future.wait([
        ref.read(postsProvider.notifier).refresh(showLoadingIfEmpty: false),
        ref.read(libraryProvider.notifier).refresh(showLoadingIfEmpty: false),
      ]);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Catalog successfully synced with GitHub!"),
            backgroundColor: Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Sync failed: $e"),
            backgroundColor: Colors.redAccent,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSyncing = false);
    }
  }

  Future<void> _clearPdfDownloads() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Clear Downloaded PDFs?"),
        content: const Text(
          "This will remove all offline PDF documents from your device. You can download them again anytime.",
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(foregroundColor: Colors.redAccent),
            child: const Text("Clear"),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await ref.read(downloadedPdfsProvider.notifier).clearAllDownloads();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("All offline PDFs cleared."),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  Future<void> _clearImageCache() async {
    PaintingBinding.instance.imageCache.clear();
    PaintingBinding.instance.imageCache.clearLiveImages();
    await CacheService.clearCache();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Article and image cache cleared."),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _openGitHub() async {
    final uri = Uri.parse("https://github.com/Arnold-cd/blog-cms");
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _shareApp() {
    Share.share(
      "Read indigenous Manipuri Puya manuscripts and articles with SLLK!\nhttps://arnold-cd.github.io/blog-cms/",
      subject: "SLLK - Meetei Mayek & English Reader",
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final currentThemeMode = ref.watch(themeModeProvider);
    final currentFontSize = ref.watch(fontSizeProvider);
    final downloadedPdfs = ref.watch(downloadedPdfsProvider);
    final totalStorageBytes = ref.read(downloadedPdfsProvider.notifier).getTotalStorageBytes();

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Settings & Preferences",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        children: [
          // App Header Profile Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isDark
                    ? [const Color(0xFF242430), const Color(0xFF181820)]
                    : [const Color(0xFFEEF2FF), const Color(0xFFE0E7FF)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isDark ? Colors.white.withValues(alpha: 0.08) : const Color(0xFFC7D2FE),
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF6366F1), Color(0xFF4F46E5)],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignment: Alignment.center,
                  child: const Text(
                    "S",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "SLLK Reader & E-Library",
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "v1.0.0 • Git-Driven Headless CMS",
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? Colors.white60 : Colors.black54,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Section 1: Appearance & Theme
          _buildSectionHeader("Appearance", Icons.palette_outlined),
          _buildCard(
            isDark: isDark,
            child: Column(
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Icon(
                    isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
                    color: const Color(0xFF6366F1),
                  ),
                  title: const Text("Theme Mode", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    currentThemeMode == ThemeMode.dark
                        ? "Dark Mode"
                        : currentThemeMode == ThemeMode.light
                            ? "Light Mode"
                            : "System Default",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: SegmentedButton<ThemeMode>(
                    segments: const [
                      ButtonSegment(value: ThemeMode.light, icon: Icon(Icons.light_mode, size: 16)),
                      ButtonSegment(value: ThemeMode.dark, icon: Icon(Icons.dark_mode, size: 16)),
                    ],
                    selected: {currentThemeMode == ThemeMode.light ? ThemeMode.light : ThemeMode.dark},
                    onSelectionChanged: (val) {
                      ref.read(themeModeProvider.notifier).toggle();
                    },
                    style: const ButtonStyle(visualDensity: VisualDensity.compact),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Section 2: Reading & Typography
          _buildSectionHeader("Reading & Typography", Icons.menu_book_outlined),
          _buildCard(
            isDark: isDark,
            child: Column(
              children: [
                // Font Size Scale
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.format_size_rounded, color: Color(0xFF6366F1)),
                  title: const Text("Article Font Size", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "${(currentFontSize * 100).toInt()}% scale",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.remove_circle_outline, size: 20),
                        onPressed: currentFontSize > 0.8
                            ? () => ref.read(fontSizeProvider.notifier).decrease()
                            : null,
                      ),
                      Text(
                        "${currentFontSize.toStringAsFixed(1)}x",
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add_circle_outline, size: 20),
                        onPressed: currentFontSize < 1.4
                            ? () => ref.read(fontSizeProvider.notifier).increase()
                            : null,
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1),
                // Paper Tone Preference
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.auto_stories_rounded, color: Color(0xFF6366F1)),
                  title: const Text("Reader Paper Tone", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    _paperTone == "sepia"
                        ? "Warm Sepia"
                        : _paperTone == "oled"
                            ? "OLED Pure Black"
                            : "Default Paper",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: DropdownButton<String>(
                    value: _paperTone,
                    underline: const SizedBox.shrink(),
                    items: const [
                      DropdownMenuItem(value: "default", child: Text("Default", style: TextStyle(fontSize: 13))),
                      DropdownMenuItem(value: "sepia", child: Text("Warm Sepia", style: TextStyle(fontSize: 13))),
                      DropdownMenuItem(value: "oled", child: Text("OLED Black", style: TextStyle(fontSize: 13))),
                    ],
                    onChanged: (val) {
                      if (val != null) {
                        setState(() => _paperTone = val);
                        CacheService.setPaperTone(val);
                      }
                    },
                  ),
                ),
                const Divider(height: 1),
                // Transliteration Hints Toggle
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  secondary: const Icon(Icons.translate_rounded, color: Color(0xFF6366F1)),
                  title: const Text("Meetei Mayek Hints", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "Display phonetic transliteration on ancient titles",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  value: _transliteration,
                  activeColor: const Color(0xFF6366F1),
                  onChanged: (val) {
                    setState(() => _transliteration = val);
                    CacheService.setTransliteration(val);
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Section 3: Storage & Offline Downloads
          _buildSectionHeader("Storage & Offline Library", Icons.storage_rounded),
          _buildCard(
            isDark: isDark,
            child: Column(
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFFD97706)),
                  title: const Text("Downloaded PDF Documents", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "${downloadedPdfs.length} offline files (${_formatBytes(totalStorageBytes)})",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: downloadedPdfs.isNotEmpty
                      ? TextButton(
                          onPressed: _clearPdfDownloads,
                          style: TextButton.styleFrom(foregroundColor: Colors.redAccent),
                          child: const Text("Clear", style: TextStyle(fontSize: 12)),
                        )
                      : const Text("Empty", style: TextStyle(fontSize: 12, color: Colors.grey)),
                ),
                const Divider(height: 1),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.cleaning_services_rounded, color: Color(0xFF6366F1)),
                  title: const Text("Clear Image & Data Cache", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "Re-downloads fresh thumbnail images and post covers",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: TextButton(
                    onPressed: _clearImageCache,
                    child: const Text("Free Up", style: TextStyle(fontSize: 12)),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Section 4: Narration & Audio
          _buildSectionHeader("Audio Narration (TTS)", Icons.record_voice_over_rounded),
          _buildCard(
            isDark: isDark,
            child: Column(
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.speed_rounded, color: Color(0xFF6366F1)),
                  title: const Text("Narration Speed", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "${_ttsSpeed.toStringAsFixed(2)}x reading speed",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                ),
                Slider(
                  value: _ttsSpeed,
                  min: 0.5,
                  max: 1.75,
                  divisions: 5,
                  activeColor: const Color(0xFF6366F1),
                  label: "${_ttsSpeed.toStringAsFixed(2)}x",
                  onChanged: (val) {
                    setState(() => _ttsSpeed = val);
                    CacheService.setTtsSpeed(val);
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Section 5: Sync & CMS Manifests
          _buildSectionHeader("Sync & Manifests", Icons.sync_rounded),
          _buildCard(
            isDark: isDark,
            child: ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Icon(
                Icons.cloud_sync_rounded,
                color: _isSyncing ? const Color(0xFFD97706) : const Color(0xFF10B981),
              ),
              title: const Text("Sync Catalog with GitHub", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              subtitle: Text(
                "Fetches latest posts.json and library.json",
                style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
              ),
              trailing: _isSyncing
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFFD97706)),
                    )
                  : ElevatedButton(
                      onPressed: _syncCatalog,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF6366F1),
                        foregroundColor: Colors.white,
                        visualDensity: VisualDensity.compact,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                      ),
                      child: const Text("Sync Now", style: TextStyle(fontSize: 12)),
                    ),
            ),
          ),

          const SizedBox(height: 20),

          // Section 6: Community & About
          _buildSectionHeader("Community & Project", Icons.info_outline_rounded),
          _buildCard(
            isDark: isDark,
            child: Column(
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.volunteer_activism_rounded, color: Color(0xFFF43F5E)),
                  title: const Text("Support & Contribute", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "Donate towards preserving ancient Manipuri scripts",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: () => DonationModal.show(context),
                ),
                const Divider(height: 1),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.code_rounded, color: Color(0xFF6366F1)),
                  title: const Text("GitHub Repository", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "Open source code, contributions & issues",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: const Icon(Icons.open_in_new_rounded, size: 18),
                  onTap: _openGitHub,
                ),
                const Divider(height: 1),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.share_rounded, color: Color(0xFF6366F1)),
                  title: const Text("Share SLLK", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: _shareApp,
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 16, color: const Color(0xFF6366F1)),
          const SizedBox(width: 6),
          Text(
            title.toUpperCase(),
            style: const TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCard({required bool isDark, required Widget child}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Material(
        color: isDark ? const Color(0xFF1C1C22) : Colors.white,
        clipBehavior: Clip.antiAlias,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: child,
        ),
      ),
    );
  }
}
