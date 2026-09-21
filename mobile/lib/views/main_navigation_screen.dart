import "dart:ui";
import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../providers/app_providers.dart";
import "../theme/app_theme.dart";
import "../widgets/app_drawer.dart";
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
    final currentIndex = ref.watch(selectedNavIndexProvider);
    final scaffoldKey = ref.watch(mainScaffoldKeyProvider);
    final bottomInset = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      key: scaffoldKey,
      drawer: AppDrawer(
        currentIndex: currentIndex,
        onSelectIndex: (index) {
          ref.read(selectedNavIndexProvider.notifier).state = index;
          scaffoldKey.currentState?.closeDrawer();
        },
      ),
      body: Stack(
        children: [
          // Screen contents with bottom clearance for frosted nav bar
          Padding(
            padding: EdgeInsets.only(bottom: 58 + bottomInset),
            child: IndexedStack(
              index: currentIndex,
              children: _screens,
            ),
          ),

          // Floating Frosted Glass Bottom Navigation Bar
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: ClipRect(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 25, sigmaY: 25),
                child: Container(
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xE6121216) : const Color(0xF5FFFFFF),
                    border: Border(
                      top: BorderSide(
                        color: isDark ? Colors.white.withOpacity(0.08) : Colors.black.withOpacity(0.06),
                        width: 0.5,
                      ),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(isDark ? 0.3 : 0.04),
                        blurRadius: 16,
                        offset: const Offset(0, -4),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    top: false,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
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
              ),
            ),
          ),
        ],
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
    final isSelected = ref.watch(selectedNavIndexProvider) == index;
    final activeColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final inactiveColor = isDark ? const Color(0xFF71717A) : const Color(0xFF94A3B8);
    const accentIndicator = Color(0xFF0284C7);

    return Expanded(
      child: GestureDetector(
        onTap: () {
          HapticFeedback.selectionClick();
          ref.read(selectedNavIndexProvider.notifier).state = index;
        },
        behavior: HitTestBehavior.opaque,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Sleek Micro Indicator on Top of Active Tab
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeOutCubic,
                width: isSelected ? 16 : 0,
                height: 2.5,
                margin: const EdgeInsets.only(bottom: 4),
                decoration: BoxDecoration(
                  color: isSelected ? accentIndicator : Colors.transparent,
                  borderRadius: BorderRadius.circular(2),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: accentIndicator.withOpacity(0.5),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ]
                      : null,
                ),
              ),

              // Icon with micro scale and crisp badge
              Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.center,
                children: [
                  AnimatedScale(
                    scale: isSelected ? 1.08 : 1.0,
                    duration: const Duration(milliseconds: 180),
                    curve: Curves.easeOutBack,
                    child: Icon(
                      isSelected ? activeIcon : icon,
                      size: 23,
                      color: isSelected ? activeColor : inactiveColor,
                    ),
                  ),
                  if (badgeCount > 0)
                    Positioned(
                      right: -10,
                      top: -4,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 4.5, vertical: 1.5),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF43F5E),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isDark ? const Color(0xFF141418) : Colors.white,
                            width: 1.5,
                          ),
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 16,
                          minHeight: 14,
                        ),
                        child: Text(
                          badgeCount > 9 ? "9+" : "$badgeCount",
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 8.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.2,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 3.5),

              // Refined Minimalist Typography
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 180),
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  letterSpacing: -0.2,
                  color: isSelected ? activeColor : inactiveColor,
                  fontFamilyFallback: AppTheme.fontFallbacks,
                ),
                child: Text(
                  isSelected && meeteiLabel != null ? meeteiLabel : label,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
