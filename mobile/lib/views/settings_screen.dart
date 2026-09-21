import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:share_plus/share_plus.dart";
import "../providers/app_providers.dart";
import "../providers/library_providers.dart";
import "../services/cache_service.dart";
import "../widgets/donation_modal.dart";
import "../widgets/inquiry_modal.dart";
import "../widgets/privacy_modal.dart";

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _isSyncing = false;
  bool _transliteration = true;
  double _ttsSpeed = 1.0;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    final trans = await CacheService.isTransliterationEnabled();
    final speed = await CacheService.getTtsSpeed();
    if (mounted) {
      setState(() {
        _transliteration = trans;
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
            content: Text("Catalog successfully updated!"),
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

  void _showAboutDialog() {
    showAboutDialog(
      context: context,
      applicationName: "SLLK Reader",
      applicationVersion: "v1.0.0",
      applicationIcon: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Image.asset(
          "assets/images/app_logo.png",
          width: 48,
          height: 48,
          fit: BoxFit.cover,
        ),
      ),
      children: const [
        SizedBox(height: 12),
        Text(
          "SLLK is a digital platform dedicated to the preservation, transliteration, and study of ancient Manipuri Puya manuscripts and contemporary indigenous literature.",
          style: TextStyle(fontSize: 13, height: 1.4),
        ),
      ],
    );
  }

  void _shareApp() {
    final media = MediaQuery.of(context);
    final screenW = media.size.width > 0 ? media.size.width : 375.0;
    final screenH = media.size.height > 0 ? media.size.height : 667.0;
    final box = context.findRenderObject() as RenderBox?;
    final origin = (box != null && box.hasSize && box.size.width > 10 && box.size.height > 10)
        ? (box.localToGlobal(Offset.zero) & box.size)
        : Rect.fromLTWH(0, 0, screenW, screenH / 2);

    Share.share(
      "Read indigenous Manipuri Puya manuscripts and articles with SLLK!\nhttps://blog-cms-gilt.vercel.app/",
      subject: "SLLK - Meetei Mayek & English Reader",
      sharePositionOrigin: origin,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final currentThemeMode = ref.watch(themeModeProvider);
    final currentFontSize = ref.watch(fontSizeProvider);
    final currentPaperTone = ref.watch(paperToneProvider);
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
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.asset(
                    "assets/images/app_logo.png",
                    width: 48,
                    height: 48,
                    fit: BoxFit.cover,
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
                        "Sanamahi Laining Leechat Kangleipak • v1.0",
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
                  trailing: Switch.adaptive(
                    value: currentThemeMode == ThemeMode.dark,
                    activeColor: const Color(0xFF6366F1),
                    onChanged: (val) {
                      ref.read(themeModeProvider.notifier).toggle();
                    },
                  ),
                ),
                const Divider(height: 1),
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
                        icon: const Icon(Icons.remove_circle_outline_rounded, size: 20),
                        onPressed: currentFontSize > 0.8
                            ? () => ref.read(fontSizeProvider.notifier).decrease()
                            : null,
                      ),
                      Text(
                        "${currentFontSize.toStringAsFixed(1)}x",
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add_circle_outline_rounded, size: 20),
                        onPressed: currentFontSize < 1.4
                            ? () => ref.read(fontSizeProvider.notifier).increase()
                            : null,
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.auto_stories_rounded, color: Color(0xFF6366F1)),
                  title: const Text("Reader Paper Tone", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    switch (currentPaperTone) {
                      "sepia" => "Warm Sepia (Parchment)",
                      "cream" => "Soft Cream (Book Paper)",
                      "sage" => "Calm Sage (Eye Comfort)",
                      "navy" => "Midnight Navy (Night)",
                      "oled" => "OLED Pure Black (Zero-Nit)",
                      _ => "Default Paper",
                    },
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: DropdownButton<String>(
                    value: currentPaperTone,
                    underline: const SizedBox.shrink(),
                    items: [
                      DropdownMenuItem(
                        value: "default",
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                                border: Border.all(color: Colors.grey.shade400, width: 1),
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text("Default", style: TextStyle(fontSize: 13)),
                          ],
                        ),
                      ),
                      DropdownMenuItem(
                        value: "cream",
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: const Color(0xFFFAF7F0),
                                border: Border.all(color: const Color(0xFFDCD6C8), width: 1),
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text("Soft Cream", style: TextStyle(fontSize: 13)),
                          ],
                        ),
                      ),
                      DropdownMenuItem(
                        value: "sepia",
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: const Color(0xFFFBF0D9),
                                border: Border.all(color: const Color(0xFFD9C6A5), width: 1),
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text("Warm Sepia", style: TextStyle(fontSize: 13)),
                          ],
                        ),
                      ),
                      DropdownMenuItem(
                        value: "sage",
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: const Color(0xFFEBF2EB),
                                border: Border.all(color: const Color(0xFFB8CEB8), width: 1),
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text("Calm Sage", style: TextStyle(fontSize: 13)),
                          ],
                        ),
                      ),
                      DropdownMenuItem(
                        value: "navy",
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text("Midnight Navy", style: TextStyle(fontSize: 13)),
                          ],
                        ),
                      ),
                      DropdownMenuItem(
                        value: "oled",
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.black,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text("OLED Black", style: TextStyle(fontSize: 13)),
                          ],
                        ),
                      ),
                    ],
                    onChanged: (val) {
                      if (val != null) {
                        ref.read(paperToneProvider.notifier).setTone(val);
                      }
                    },
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Section 2: Language & Script
          _buildSectionHeader("Language & Script", Icons.translate_rounded),
          _buildCard(
            isDark: isDark,
            child: SwitchListTile.adaptive(
              contentPadding: EdgeInsets.zero,
              secondary: const Icon(Icons.spellcheck_rounded, color: Color(0xFF6366F1)),
              title: const Text("Script Transliteration", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              subtitle: Text(
                "Instant toggle between Bengali/Roman script and Meetei Mayek",
                style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
              ),
              value: _transliteration,
              activeColor: const Color(0xFF6366F1),
              onChanged: (val) {
                setState(() => _transliteration = val);
                CacheService.setTransliteration(val);
              },
            ),
          ),

          const SizedBox(height: 20),

          // Section 3: Storage & Offline Cache
          _buildSectionHeader("Storage & Offline Cache", Icons.sd_storage_rounded),
          _buildCard(
            isDark: isDark,
            child: Column(
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFFEF4444)),
                  title: const Text("Downloaded PDF Documents", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "${downloadedPdfs.length} offline files (${_formatBytes(totalStorageBytes)})",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: downloadedPdfs.isNotEmpty
                      ? TextButton(
                          onPressed: _clearPdfDownloads,
                          style: TextButton.styleFrom(
                            foregroundColor: Colors.redAccent,
                            visualDensity: VisualDensity.compact,
                          ),
                          child: const Text("Clear All"),
                        )
                      : Text(
                          "Empty",
                          style: TextStyle(fontSize: 12, color: isDark ? Colors.white38 : Colors.black38),
                        ),
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
                    style: TextButton.styleFrom(
                      foregroundColor: const Color(0xFF6366F1),
                      visualDensity: VisualDensity.compact,
                    ),
                    child: const Text("Free Up"),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Section 4: Audio Narration (TTS)
          _buildSectionHeader("Audio Narration (TTS)", Icons.record_voice_over_rounded),
          _buildCard(
            isDark: isDark,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
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

          // Section 5: Content & Sync
          _buildSectionHeader("Content & Sync", Icons.sync_rounded),
          _buildCard(
            isDark: isDark,
            child: ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Icon(
                Icons.cloud_sync_rounded,
                color: _isSyncing ? const Color(0xFFD97706) : const Color(0xFF10B981),
              ),
              title: const Text("Sync Latest Content", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              subtitle: Text(
                "Checks for newly published articles and documents",
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

          // Section 6: Community & Project
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
                  leading: const Icon(Icons.mail_outline_rounded, color: Color(0xFF0284C7)),
                  title: const Text("App Inquiries & Contact", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "sanamaheelainingleechatkanglei@gmail.com",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: () => InquiryModal.show(context),
                ),
                const Divider(height: 1),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.info_outline_rounded, color: Color(0xFF6366F1)),
                  title: const Text("About SLLK", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "Mission to preserve indigenous manuscripts",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: _showAboutDialog,
                ),
                const Divider(height: 1),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.shield_outlined, color: Color(0xFF10B981)),
                  title: const Text("Privacy & Data Safety", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(
                    "Zero tracking, strictly local device storage",
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white54 : Colors.black54),
                  ),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: () => PrivacyPolicyModal.show(context),
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
