import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../providers/app_providers.dart";
import "../theme/app_theme.dart";
import "bookmarks_screen.dart";
import "home_screen.dart";
import "mayek_explorer_screen.dart";
import "pdf_library_screen.dart";
import "settings_screen.dart";

class MainNavigationScreen extends ConsumerStatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  ConsumerState<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends ConsumerState<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    PdfLibraryScreen(),
    MayekExplorerScreen(),
    BookmarksScreen(),
    SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final bookmarks = ref.watch(bookmarksProvider);

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF141418) : Colors.white,
          border: Border(
            top: BorderSide(
              color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
            ),
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(
                  index: 0,
                  icon: Icons.article_outlined,
                  activeIcon: Icons.article_rounded,
                  label: "Feed",
                  isDark: isDark,
                ),
                _buildNavItem(
                  index: 1,
                  icon: Icons.menu_book_outlined,
                  activeIcon: Icons.menu_book_rounded,
                  label: "Library",
                  isDark: isDark,
                ),
                _buildNavItem(
                  index: 2,
                  icon: Icons.translate_rounded,
                  activeIcon: Icons.translate_rounded,
                  label: "Explorer",
                  meeteiLabel: "ꯃꯌꯦꯛ",
                  isDark: isDark,
                ),
                _buildNavItem(
                  index: 3,
                  icon: Icons.bookmark_outline_rounded,
                  activeIcon: Icons.bookmark_rounded,
                  label: "Saved",
                  badgeCount: bookmarks.length,
                  isDark: isDark,
                ),
                _buildNavItem(
                  index: 4,
                  icon: Icons.settings_outlined,
                  activeIcon: Icons.settings_rounded,
                  label: "Settings",
                  isDark: isDark,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required IconData icon,
    required IconData activeIcon,
    required String label,
    String? meeteiLabel,
    int badgeCount = 0,
    required bool isDark,
  }) {
    final isSelected = _currentIndex == index;
    final primaryColor = isDark ? const Color(0xFF6366F1) : const Color(0xFF4F46E5);

    return GestureDetector(
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
      },
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? primaryColor.withValues(alpha: 0.12) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  isSelected ? activeIcon : icon,
                  size: 22,
                  color: isSelected ? primaryColor : (isDark ? Colors.white60 : Colors.black54),
                ),
                if (badgeCount > 0)
                  Positioned(
                    right: -8,
                    top: -4,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Color(0xFF6366F1),
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 14,
                        minHeight: 14,
                      ),
                      child: Text(
                        badgeCount > 9 ? "9+" : "$badgeCount",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 3),
            Text(
              isSelected && meeteiLabel != null ? meeteiLabel : label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? primaryColor : (isDark ? Colors.white60 : Colors.black54),
                fontFamilyFallback: AppTheme.fontFallbacks,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
