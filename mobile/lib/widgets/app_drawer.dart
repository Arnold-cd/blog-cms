import "dart:math" as math;
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../providers/app_providers.dart";
import "../providers/library_providers.dart";
import "donation_modal.dart";
import "privacy_modal.dart";

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
    final drawerWidth = math.min(screenWidth * 0.82, 330.0);

    final posts = ref.watch(postsProvider).valueOrNull ?? [];
    final libraryDocs = ref.watch(libraryProvider).valueOrNull ?? [];
    final bookmarks = ref.watch(bookmarksProvider);
    final currentPaperTone = ref.watch(paperToneProvider);

    return Drawer(
      width: drawerWidth,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.horizontal(right: Radius.circular(24)),
      ),
      backgroundColor: isDark ? const Color(0xFF141418) : Colors.white,
      child: Column(
        children: [
          // Elegant Brand Header
          _buildHeader(context, isDark),

          // Scrollable Navigation Items
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              children: [
                _buildSectionHeader("ARCHIVE & READING", isDark),
                _buildDrawerItem(
                  icon: Icons.article_outlined,
                  activeIcon: Icons.article_rounded,
                  title: "Articles Feed",
                  subtitle: "Puya, philosophy & culture",
                  badge: "${posts.length}",
                  isSelected: currentIndex == 0,
                  isDark: isDark,
                  onTap: () => onSelectIndex(0),
                ),
                _buildDrawerItem(
                  icon: Icons.menu_book_outlined,
                  activeIcon: Icons.menu_book_rounded,
                  title: "PDF Library",
                  subtitle: "E-books & original scripts",
                  badge: "${libraryDocs.length}",
                  isSelected: currentIndex == 1,
                  isDark: isDark,
                  onTap: () => onSelectIndex(1),
                ),
                _buildDrawerItem(
                  icon: Icons.translate_rounded,
                  activeIcon: Icons.translate_rounded,
                  title: "Mayek Explorer",
                  subtitle: "English ↔ Meetei Mayek",
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

                const SizedBox(height: 12),
                _buildSectionHeader("PREFERENCES & DISPLAY", isDark),

                // Quick Dark Mode Toggle Tile
                Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Material(
                    color: isDark ? Colors.white.withOpacity(0.03) : const Color(0xFFF8FAFC),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                      side: BorderSide(
                        color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.05),
                      ),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                      dense: true,
                    leading: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF27272A) : const Color(0xFFE2E8F0),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
                        size: 18,
                        color: isDark ? const Color(0xFFF59E0B) : const Color(0xFF0F172A),
                      ),
                    ),
                    title: Text(
                      "Appearance",
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                      ),
                    ),
                    subtitle: Text(
                      isDark ? "Dark Theme" : "Light Theme",
                      style: TextStyle(
                        fontSize: 11,
                        color: isDark ? Colors.white54 : Colors.black54,
                      ),
                    ),
                    trailing: Transform.scale(
                      scale: 0.8,
                      child: Switch(
                        value: isDark,
                        activeColor: const Color(0xFF0284C7),
                        onChanged: (val) {
                          ref.read(themeModeProvider.notifier).setThemeMode(val);
                        },
                      ),
                    ),
                  ),
                ),
              ),

                // Reading Paper Tone Quick Indicator / Settings
                _buildDrawerItem(
                  icon: Icons.palette_outlined,
                  activeIcon: Icons.palette_rounded,
                  title: "Paper Tone",
                  subtitle: "Active: ${_paperToneName(currentPaperTone)}",
                  isSelected: false,
                  isDark: isDark,
                  onTap: () => onSelectIndex(4), // Navigate to Settings
                ),

                // Settings
                _buildDrawerItem(
                  icon: Icons.settings_outlined,
                  activeIcon: Icons.settings_rounded,
                  title: "App Settings",
                  subtitle: "Font scale, TTS, offline cache",
                  isSelected: currentIndex == 4,
                  isDark: isDark,
                  onTap: () => onSelectIndex(4),
                ),

                const SizedBox(height: 12),
                _buildSectionHeader("PROJECT & TRUST", isDark),

                // Support & Contribution
                _buildDrawerItem(
                  icon: Icons.volunteer_activism_outlined,
                  activeIcon: Icons.volunteer_activism_rounded,
                  title: "Support SLLK",
                  subtitle: "Cultural preservation contribution",
                  iconColor: const Color(0xFFF43F5E),
                  isSelected: false,
                  isDark: isDark,
                  onTap: () {
                    Navigator.of(context).pop();
                    DonationModal.show(context);
                  },
                ),

                // Privacy Policy
                _buildDrawerItem(
                  icon: Icons.shield_outlined,
                  activeIcon: Icons.shield_rounded,
                  title: "Privacy Policy",
                  subtitle: "100% private, zero data tracking",
                  iconColor: const Color(0xFF10B981),
                  isSelected: false,
                  isDark: isDark,
                  onTap: () {
                    Navigator.of(context).pop();
                    PrivacyPolicyModal.show(context);
                  },
                ),

                // About SLLK Dialog
                _buildDrawerItem(
                  icon: Icons.info_outline_rounded,
                  activeIcon: Icons.info_rounded,
                  title: "About SLLK",
                  subtitle: "Version 1.0.0 • Verified Archive",
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

          // Refined Footer
          _buildFooter(context, isDark),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, bool isDark) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 16, 20, 18),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF18181D) : const Color(0xFFF8FAFC),
        border: Border(
          bottom: BorderSide(
            color: isDark ? Colors.white.withOpacity(0.08) : Colors.black.withOpacity(0.06),
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(isDark ? 0.4 : 0.1),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(14),
                  child: Image.asset(
                    "assets/images/app_logo.png",
                    width: 48,
                    height: 48,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF27272A) : const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(8),
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
                      "v1.0.0",
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
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
              fontSize: 22,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.5,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 3),
          Text(
            "ꯁꯅꯥꯃꯍꯤ ꯂꯥꯏꯅꯤꯡ • Puya Archive",
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF0284C7),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            "Meetei Mayek & English Cultural Reader",
            style: TextStyle(
              fontSize: 11,
              color: isDark ? Colors.white54 : const Color(0xFF64748B),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, bool isDark) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(8, 12, 8, 6),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.8,
          color: isDark ? Colors.white38 : const Color(0xFF94A3B8),
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
    Color? iconColor,
  }) {
    final effectiveIconColor = iconColor ??
        (isSelected
            ? const Color(0xFF0284C7)
            : isDark
                ? Colors.white70
                : const Color(0xFF475569));

    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Material(
        color: isSelected
            ? (isDark ? const Color(0xFF0284C7).withOpacity(0.15) : const Color(0xFF0284C7).withOpacity(0.08))
            : Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: isSelected
              ? BorderSide(
                  color: const Color(0xFF0284C7).withOpacity(0.3),
                  width: 1,
                )
              : BorderSide.none,
        ),
        clipBehavior: Clip.antiAlias,
        child: ListTile(
          onTap: onTap,
          dense: true,
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 1),
        leading: Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            color: isSelected
                ? const Color(0xFF0284C7).withOpacity(0.18)
                : (isDark ? Colors.white.withOpacity(0.05) : const Color(0xFFF1F5F9)),
            borderRadius: BorderRadius.circular(9),
          ),
          child: Icon(
            isSelected ? activeIcon : icon,
            size: 18,
            color: effectiveIconColor,
          ),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 13.5,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
            color: isSelected
                ? (isDark ? Colors.white : const Color(0xFF0284C7))
                : (isDark ? Colors.white : const Color(0xFF1E293B)),
          ),
        ),
        subtitle: Text(
          subtitle,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: 10.5,
            color: isDark ? Colors.white54 : const Color(0xFF64748B),
          ),
        ),
        trailing: badge != null
            ? Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                decoration: BoxDecoration(
                  color: isSelected
                      ? const Color(0xFF0284C7)
                      : (isDark ? const Color(0xFF27272A) : const Color(0xFFE2E8F0)),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  badge,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: isSelected
                        ? Colors.white
                        : (isDark ? Colors.white70 : const Color(0xFF475569)),
                  ),
                ),
              )
            : null,
        ),
      ),
    );
  }

  Widget _buildFooter(BuildContext context, bool isDark) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF101014) : const Color(0xFFF8FAFC),
        border: Border(
          top: BorderSide(
            color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.05),
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
                  color: isDark ? Colors.white60 : const Color(0xFF64748B),
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            "© 2026 SLLK • Git Headless Architecture",
            style: TextStyle(
              fontSize: 9.5,
              color: isDark ? Colors.white38 : const Color(0xFF94A3B8),
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
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        backgroundColor: isDark ? const Color(0xFF1E1E24) : Colors.white,
        title: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.asset("assets/images/app_logo.png", width: 32, height: 32),
            ),
            const SizedBox(width: 10),
            const Text(
              "About SLLK",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "SLLK is a dedicated digital publication and e-library designed to read, preserve, and celebrate indigenous Manipuri literature, ancient Puya manuscripts, and cultural essays in both Meetei Mayek and English scripts.",
              style: TextStyle(fontSize: 13, height: 1.5),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF27272A) : const Color(0xFFF1F5F9),
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
