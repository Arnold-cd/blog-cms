import "dart:math" as math;
import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../providers/app_providers.dart";
import "../providers/library_providers.dart";
import "../theme/app_theme.dart";
import "donation_modal.dart";
import "inquiry_modal.dart";
import "privacy_modal.dart";
import "rating_modal.dart";

class AppDrawer extends ConsumerWidget {
  final int currentIndex;
  final ValueChanged<int> onSelectIndex;

  const AppDrawer({
    super.key,
    required this.currentIndex,
    required this.onSelectIndex,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final screenWidth = MediaQuery.of(context).size.width;
    final drawerWidth = math.min(screenWidth * 0.82, 335.0);

    final posts = ref.watch(postsProvider).valueOrNull ?? [];
    final libraryDocs = ref.watch(libraryProvider).valueOrNull ?? [];
    final bookmarks = ref.watch(bookmarksProvider);
    final currentPaperTone = ref.watch(paperToneProvider);

    return Drawer(
      width: drawerWidth,
      elevation: 0,
      backgroundColor: isDark ? const Color(0xFF0F0F13) : const Color(0xFFFAFAFC),
      shape: Border(
        right: BorderSide(
          color: isDark ? Colors.white.withOpacity(0.07) : Colors.black.withOpacity(0.06),
          width: 0.5,
        ),
      ),
      child: Column(
        children: [
          // Elegant Masthead
          _buildHeader(context, isDark),

          // Scrollable Editorial Navigation
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              children: [
                _buildSectionHeader("ARCHIVE & COLLECTION", isDark),
                _buildDrawerItem(
                  icon: Icons.article_outlined,
                  activeIcon: Icons.article_rounded,
                  title: "Articles Feed",
                  subtitle: "Puya, philosophy & cultural essays",
                  badge: "${posts.length}",
                  isSelected: currentIndex == 0,
                  isDark: isDark,
                  onTap: () => onSelectIndex(0),
                ),
                _buildDrawerItem(
                  icon: Icons.menu_book_outlined,
                  activeIcon: Icons.menu_book_rounded,
                  title: "PDF Library",
                  subtitle: "E-books & original archived manuscripts",
                  badge: "${libraryDocs.length}",
                  isSelected: currentIndex == 1,
                  isDark: isDark,
                  onTap: () => onSelectIndex(1),
                ),
                _buildDrawerItem(
                  icon: Icons.translate_rounded,
                  activeIcon: Icons.translate_rounded,
                  title: "Mayek Explorer",
                  subtitle: "English ↔ Meetei Mayek converter",
                  badge: "ꯃꯌꯦꯛ",
                  isSelected: currentIndex == 2,
                  isDark: isDark,
                  onTap: () => onSelectIndex(2),
                ),
                _buildDrawerItem(
                  icon: Icons.bookmark_outline_rounded,
                  activeIcon: Icons.bookmark_rounded,
                  title: "Saved Articles",
                  subtitle: "Offline reading bookmarks",
                  badge: "${bookmarks.length}",
                  isSelected: currentIndex == 3,
                  isDark: isDark,
                  onTap: () => onSelectIndex(3),
                ),

                const SizedBox(height: 14),
                _buildSectionHeader("READING COMFORT", isDark),

                // Appearance & Theme Mode Tile
                _buildThemeTile(ref, isDark),
                const SizedBox(height: 10),

                // Paper Tone Quick Swatch Selector
                _buildPaperToneBar(ref, currentPaperTone, isDark),

                const SizedBox(height: 10),
                _buildDrawerItem(
                  icon: Icons.tune_rounded,
                  activeIcon: Icons.tune_rounded,
                  title: "Reading Settings",
                  subtitle: "Font scaling, TTS, offline cache",
                  isSelected: currentIndex == 4,
                  isDark: isDark,
                  onTap: () => onSelectIndex(4),
                ),

                const SizedBox(height: 14),
                _buildSectionHeader("PROJECT & TRUST", isDark),

                _buildDrawerItem(
                  icon: Icons.volunteer_activism_outlined,
                  activeIcon: Icons.volunteer_activism_rounded,
                  title: "Support SLLK",
                  subtitle: "Cultural preservation contribution",
                  accentColor: const Color(0xFFF43F5E),
                  isSelected: false,
                  isDark: isDark,
                  onTap: () {
                    Navigator.of(context).pop();
                    DonationModal.show(context);
                  },
                ),
                _buildDrawerItem(
                  icon: Icons.mail_outline_rounded,
                  activeIcon: Icons.mail_rounded,
                  title: "App Inquiries",
                  subtitle: "sanamaheelainingleechatkanglei@gmail.com",
                  accentColor: const Color(0xFF0284C7),
                  isSelected: false,
                  isDark: isDark,
                  onTap: () {
                    Navigator.of(context).pop();
                    InquiryModal.show(context);
                  },
                ),
                _buildDrawerItem(
                  icon: Icons.star_outline_rounded,
                  activeIcon: Icons.star_rounded,
                  title: "Rate & Review",
                  subtitle: "Support our cultural archive",
                  badge: "★ 5.0",
                  accentColor: const Color(0xFFF59E0B),
                  isSelected: false,
                  isDark: isDark,
                  onTap: () {
                    Navigator.of(context).pop();
                    RatingModal.show(context);
                  },
                ),
                _buildDrawerItem(
                  icon: Icons.shield_outlined,
                  activeIcon: Icons.shield_rounded,
                  title: "Privacy Policy",
                  subtitle: "100% Private, zero data tracking",
                  accentColor: const Color(0xFF10B981),
                  isSelected: false,
                  isDark: isDark,
                  onTap: () {
                    Navigator.of(context).pop();
                    PrivacyPolicyModal.show(context);
                  },
                ),
                _buildDrawerItem(
                  icon: Icons.info_outline_rounded,
                  activeIcon: Icons.info_rounded,
                  title: "About SLLK",
                  subtitle: "Version 1.0.0 • Public Cultural Archive",
                  isSelected: false,
                  isDark: isDark,
                  onTap: () {
                    Navigator.of(context).pop();
                    _showAboutDialog(context, isDark);
                  },
                ),
              ],
            ),
          ),

          // Refined Masthead Footer
          _buildFooter(context, isDark),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, bool isDark) {
    final topPadding = MediaQuery.of(context).padding.top;
    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(20, topPadding + 16, 20, 18),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF141419) : Colors.white,
        border: Border(
          bottom: BorderSide(
            color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.05),
            width: 0.5,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // High-end Framed Logo
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isDark ? Colors.white.withOpacity(0.1) : Colors.black.withOpacity(0.08),
                    width: 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(isDark ? 0.35 : 0.06),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(11),
                  child: Image.asset(
                    "assets/images/app_logo.png",
                    width: 44,
                    height: 44,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const Spacer(),
              // Verified Status Pill
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4.5),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1F1F26) : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.04),
                    width: 0.5,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: Color(0xFF10B981),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 5),
                    Text(
                      "ARCHIVE • v1.0",
                      style: TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.3,
                        color: isDark ? Colors.white70 : const Color(0xFF475569),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            "SLLK",
            style: TextStyle(
              fontSize: 23,
              fontWeight: FontWeight.w900,
              letterSpacing: -0.6,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 3),
          Text(
            "ꯁꯥꯅꯥꯃꯍꯤ  ꯂꯥꯏꫫꯅꯡ  ꯂꯤꯆꯠ ꫰  ꯀꯪꯂꯩꯄꯥꯛ",
            style: TextStyle(
              fontSize: 12.5,
              fontWeight: FontWeight.w600,
              color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF0284C7),
              fontFamilyFallback: AppTheme.fontFallbacks,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            "Sanamahi Laining Leechat Kangleipak",
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              letterSpacing: -0.1,
              color: isDark ? const Color(0xFFA1A1AA) : const Color(0xFF64748B),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, bool isDark) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(6, 10, 6, 6),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 9.5,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.1,
          color: isDark ? const Color(0xFF71717A) : const Color(0xFF94A3B8),
        ),
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required IconData activeIcon,
    required String title,
    required String subtitle,
    required bool isSelected,
    required bool isDark,
    required VoidCallback onTap,
    String? badge,
    Color? accentColor,
  }) {
    final effectiveColor = accentColor ??
        (isSelected
            ? const Color(0xFF0284C7)
            : isDark
                ? const Color(0xFFA1A1AA)
                : const Color(0xFF64748B));

    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Material(
        color: isSelected
            ? (isDark ? const Color(0xFF0284C7).withOpacity(0.12) : const Color(0xFF0284C7).withOpacity(0.08))
            : Colors.transparent,
        borderRadius: BorderRadius.circular(10),
        child: InkWell(
          onTap: () {
            HapticFeedback.selectionClick();
            onTap();
          },
          borderRadius: BorderRadius.circular(10),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
            child: Row(
              children: [
                // Active Left Indicator Pill
                Container(
                  width: 3.5,
                  height: 20,
                  margin: const EdgeInsets.only(right: 10),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFF0284C7) : Colors.transparent,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),

                // Icon without bulky background
                Icon(
                  isSelected ? activeIcon : icon,
                  size: 20,
                  color: effectiveColor,
                ),
                const SizedBox(width: 12),

                // Title & Subtitle
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 13.5,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          letterSpacing: -0.2,
                          color: isSelected
                              ? (isDark ? Colors.white : const Color(0xFF0284C7))
                              : (isDark ? const Color(0xFFF4F4F5) : const Color(0xFF0F172A)),
                        ),
                      ),
                      const SizedBox(height: 1),
                      Text(
                        subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 10.5,
                          color: isDark ? const Color(0xFF71717A) : const Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),

                // Minimalist Pill Badge
                if (badge != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? const Color(0xFF0284C7)
                          : (isDark ? const Color(0xFF22222A) : const Color(0xFFE2E8F0)),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      badge,
                      style: TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w700,
                        color: isSelected
                            ? Colors.white
                            : (isDark ? Colors.white70 : const Color(0xFF475569)),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildThemeTile(WidgetRef ref, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF15151B) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.05),
          width: 0.5,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 30,
            height: 30,
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF22222B) : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
              size: 16,
              color: isDark ? const Color(0xFFF59E0B) : const Color(0xFF0284C7),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "Appearance",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    letterSpacing: -0.2,
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                  ),
                ),
                Text(
                  isDark ? "Dark Palette" : "Light Palette",
                  style: TextStyle(
                    fontSize: 10.5,
                    color: isDark ? const Color(0xFF71717A) : const Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          Transform.scale(
            scale: 0.78,
            child: Switch.adaptive(
              value: isDark,
              activeColor: const Color(0xFF0284C7),
              onChanged: (val) {
                HapticFeedback.selectionClick();
                ref.read(themeModeProvider.notifier).setThemeMode(val);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaperToneBar(WidgetRef ref, String currentTone, bool isDark) {
    final tones = [
      {"id": "default", "label": "Pure", "color": isDark ? const Color(0xFF18181B) : Colors.white, "border": isDark ? Colors.white24 : Colors.black12},
      {"id": "cream", "label": "Cream", "color": const Color(0xFFFAF6EE), "border": const Color(0xFFE2D9C5)},
      {"id": "sepia", "label": "Sepia", "color": const Color(0xFFF4ECD8), "border": const Color(0xFFDCCDB2)},
      {"id": "sage", "label": "Sage", "color": const Color(0xFFEAEFE9), "border": const Color(0xFFCBD6CA)},
      {"id": "oled", "label": "OLED", "color": Colors.black, "border": Colors.white30},
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF15151B) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.05),
          width: 0.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Paper Tone Palette",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  letterSpacing: -0.2,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
              Text(
                _paperToneName(currentTone),
                style: const TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF0284C7),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: tones.map((tone) {
              final isToneSelected = currentTone == tone["id"];
              return GestureDetector(
                onTap: () {
                  HapticFeedback.selectionClick();
                  ref.read(paperToneProvider.notifier).setTone(tone["id"] as String);
                },
                behavior: HitTestBehavior.opaque,
                child: Column(
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: tone["color"] as Color,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isToneSelected
                              ? const Color(0xFF0284C7)
                              : (tone["border"] as Color),
                          width: isToneSelected ? 2.2 : 1.0,
                        ),
                        boxShadow: isToneSelected
                            ? [
                                BoxShadow(
                                  color: const Color(0xFF0284C7).withOpacity(0.4),
                                  blurRadius: 6,
                                  offset: const Offset(0, 1),
                                ),
                              ]
                            : null,
                      ),
                      child: isToneSelected
                          ? Center(
                              child: Icon(
                                Icons.check_rounded,
                                size: 14,
                                color: (tone["id"] == "oled" || isDark && tone["id"] == "default")
                                    ? Colors.white
                                    : const Color(0xFF0284C7),
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      tone["label"] as String,
                      style: TextStyle(
                        fontSize: 9.5,
                        fontWeight: isToneSelected ? FontWeight.w700 : FontWeight.w400,
                        color: isToneSelected
                            ? const Color(0xFF0284C7)
                            : (isDark ? const Color(0xFF71717A) : const Color(0xFF64748B)),
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildFooter(BuildContext context, bool isDark) {
    final bottomPadding = MediaQuery.of(context).padding.bottom;
    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(16, 12, 16, bottomPadding > 0 ? bottomPadding + 8 : 16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF141419) : Colors.white,
        border: Border(
          top: BorderSide(
            color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.05),
            width: 0.5,
          ),
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.favorite_rounded, size: 12, color: Color(0xFFF43F5E)),
              const SizedBox(width: 6),
              Text(
                "Dedicated to Manipuri Cultural Preservation",
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w500,
                  color: isDark ? const Color(0xFFA1A1AA) : const Color(0xFF64748B),
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            "© 2026 SLLK • Git Headless Architecture",
            style: TextStyle(
              fontSize: 9.5,
              color: isDark ? const Color(0xFF52525B) : const Color(0xFF94A3B8),
            ),
          ),
        ],
      ),
    );
  }

  String _paperToneName(String tone) {
    switch (tone) {
      case "cream":
        return "Soft Cream";
      case "sepia":
        return "Warm Sepia";
      case "sage":
        return "Calm Sage";
      case "navy":
        return "Midnight Navy";
      case "oled":
        return "OLED Black";
      default:
        return "Standard";
    }
  }

  void _showAboutDialog(BuildContext context, bool isDark) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        backgroundColor: isDark ? const Color(0xFF18181E) : Colors.white,
        title: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.asset("assets/images/app_logo.png", width: 32, height: 32),
            ),
            const SizedBox(width: 10),
            const Text(
              "About SLLK",
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "SLLK (Sanamahi Laining Leechat Kangleipak • ꯁꯥꯅꯥꯃꯍꯤ  ꯂꯥꯏꫫꯅꯡ  ꯂꯤꯆꯠ ꫰  ꯀꯪꯂꯩꯄꯥꯛ) is a digital publication and e-library designed to read, preserve, and celebrate indigenous Manipuri literature, ancient Puya manuscripts, and cultural essays in both Meetei Mayek and English scripts.",
              style: TextStyle(fontSize: 13, height: 1.5),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF22222A) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("• Version: 1.0.0 (Build 1)", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                  SizedBox(height: 3),
                  Text("• Platform: Flutter & Git Headless CMS", style: TextStyle(fontSize: 11)),
                  SizedBox(height: 3),
                  Text("• Zero Tracking • 100% Privacy by Design", style: TextStyle(fontSize: 11)),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text("Close"),
          ),
        ],
      ),
    );
  }
}
