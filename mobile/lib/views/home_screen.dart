import "../widgets/donation_modal.dart";
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:shimmer/shimmer.dart";
import "../providers/app_providers.dart";
import "../widgets/post_card.dart";
import "post_detail_screen.dart";
import "settings_screen.dart";

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  bool _isSearching = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _clearSearch() {
    _searchController.clear();
    ref.read(searchQueryProvider.notifier).state = "";
    setState(() {
      _isSearching = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final postsAsync = ref.watch(postsProvider);
    final filteredPosts = ref.watch(filteredPostsProvider);
    final categories = ref.watch(categoriesProvider);
    final selectedCategory = ref.watch(selectedCategoryProvider);

    return Scaffold(
      body: SafeArea(
        child: NestedScrollView(
          headerSliverBuilder: (context, innerBoxIsScrolled) => [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top App Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () => ref.read(mainScaffoldKeyProvider).currentState?.openDrawer(),
                            borderRadius: BorderRadius.circular(10),
                            child: Row(
                              children: [
                                IconButton(
                                  tooltip: "Open Navigation Menu",
                                  visualDensity: VisualDensity.compact,
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                  icon: const Icon(Icons.notes_rounded, size: 24),
                                  onPressed: () => ref.read(mainScaffoldKeyProvider).currentState?.openDrawer(),
                                ),
                                const SizedBox(width: 10),
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(10),
                                  child: Image.asset(
                                    "assets/images/app_logo.png",
                                    width: 36,
                                    height: 36,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        "SLLK",
                                        style: TextStyle(
                                          fontSize: 21,
                                          fontWeight: FontWeight.w800,
                                          letterSpacing: -0.5,
                                        ),
                                      ),
                                       Text(
                                         "Sanamahi Laining Leechat Kangleipak",
                                         maxLines: 1,
                                         overflow: TextOverflow.ellipsis,
                                         style: theme.textTheme.bodySmall?.copyWith(
                                           fontSize: 10.5,
                                           fontWeight: FontWeight.w500,
                                           color: theme.textTheme.bodySmall?.color?.withOpacity(0.7),
                                         ),
                                       ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        // Top Right Action Buttons
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Donate / Support Button
                            IconButton(
                              tooltip: "Support & Donate",
                              visualDensity: VisualDensity.compact,
                              padding: const EdgeInsets.all(6),
                              constraints: const BoxConstraints(),
                              icon: const Icon(
                                Icons.volunteer_activism_rounded,
                                color: Color(0xFFF43F5E),
                                size: 20,
                              ),
                              onPressed: () => DonationModal.show(context),
                            ),
                            const SizedBox(width: 6),
                            // Theme Switcher
                            IconButton(
                              tooltip: isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
                              visualDensity: VisualDensity.compact,
                              padding: const EdgeInsets.all(6),
                              constraints: const BoxConstraints(),
                              icon: Icon(
                                isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
                                size: 20,
                              ),
                              onPressed: () {
                                ref.read(themeModeProvider.notifier).toggle();
                              },
                            ),
                            const SizedBox(width: 6),
                            // Settings Button
                            IconButton(
                              tooltip: "Settings",
                              visualDensity: VisualDensity.compact,
                              padding: const EdgeInsets.all(6),
                              constraints: const BoxConstraints(),
                              icon: const Icon(
                                Icons.settings_outlined,
                                size: 20,
                              ),
                              onPressed: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute(builder: (_) => const SettingsScreen()),
                                );
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Search Bar
                    Container(
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1B1B21) : const Color(0xFFF1F1F5),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.04),
                        ),
                      ),
                      child: TextField(
                        controller: _searchController,
                        style: const TextStyle(fontSize: 14),
                        decoration: InputDecoration(
                          hintText: "Search titles, topics, or authors...",
                          hintStyle: TextStyle(
                            fontSize: 14,
                            color: theme.textTheme.bodyMedium?.color?.withOpacity(0.4),
                          ),
                          prefixIcon: Icon(
                            Icons.search_rounded,
                            size: 20,
                            color: theme.textTheme.bodyMedium?.color?.withOpacity(0.5),
                          ),
                          suffixIcon: _searchController.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.close_rounded, size: 18),
                                  onPressed: _clearSearch,
                                )
                              : null,
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        onChanged: (val) {
                          ref.read(searchQueryProvider.notifier).state = val;
                          setState(() {
                            _isSearching = val.isNotEmpty;
                          });
                        },
                      ),
                    ),
                    const SizedBox(height: 14),
                    // Horizontal Categories Scroll
                    if (categories.length > 1)
                      SizedBox(
                        height: 36,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          physics: const BouncingScrollPhysics(),
                          itemCount: categories.length,
                          separatorBuilder: (_, __) => const SizedBox(width: 8),
                          itemBuilder: (context, index) {
                            final cat = categories[index];
                            final isSelected = cat.toLowerCase() == selectedCategory.toLowerCase();

                            return GestureDetector(
                              onTap: () {
                                ref.read(selectedCategoryProvider.notifier).state = cat;
                              },
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? (isDark ? const Color(0xFF6366F1) : const Color(0xFF4F46E5))
                                      : (isDark ? const Color(0xFF18181D) : const Color(0xFFEEEEF2)),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: isSelected
                                        ? Colors.transparent
                                        : (isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05)),
                                  ),
                                ),
                                child: Text(
                                  cat,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                                    color: isSelected
                                        ? Colors.white
                                        : (isDark ? Colors.white70 : Colors.black87),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
          body: RefreshIndicator(
            color: const Color(0xFF6366F1),
            onRefresh: () async {
              await ref.read(postsProvider.notifier).refresh(showLoadingIfEmpty: false);
            },
            child: postsAsync.when(
              loading: () => _buildLoadingList(isDark),
              error: (err, _) => _buildErrorState(context, err.toString()),
              data: (posts) {
                if (filteredPosts.isEmpty) {
                  return _buildEmptyState(context, _searchController.text.isNotEmpty);
                }

                return ListView.builder(
                  padding: const EdgeInsets.only(top: 6, bottom: 32),
                  physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
                  itemCount: filteredPosts.length,
                  itemBuilder: (context, index) {
                    final post = filteredPosts[index];
                    // Make the top item featured when not searching
                    final isFeatured = index == 0 && !_isSearching && selectedCategory == "All";

                    return PostCard(
                      post: post,
                      isFeatured: isFeatured,
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => PostDetailScreen(post: post),
                          ),
                        );
                      },
                    );
                  },
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingList(bool isDark) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      itemCount: 4,
      itemBuilder: (_, __) => Padding(
        padding: const EdgeInsets.only(bottom: 20),
        child: Shimmer.fromColors(
          baseColor: isDark ? const Color(0xFF1C1C22) : const Color(0xFFE5E5E9),
          highlightColor: isDark ? const Color(0xFF282830) : const Color(0xFFF3F3F7),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 180,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              const SizedBox(height: 12),
              Container(
                height: 20,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(height: 8),
              Container(
                height: 14,
                width: 180,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, bool hasSearch) {
    final theme = Theme.of(context);
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(32),
      children: [
        const SizedBox(height: 60),
        Icon(
          hasSearch ? Icons.search_off_rounded : Icons.article_outlined,
          size: 64,
          color: theme.textTheme.bodyMedium?.color?.withOpacity(0.3),
        ),
        const SizedBox(height: 16),
        Text(
          hasSearch ? "No matching articles found" : "No articles published yet",
          textAlign: TextAlign.center,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          hasSearch
              ? "Try adjusting your search terms or selecting a different category."
              : "Newly published articles will instantly appear here with zero app updates required.",
          textAlign: TextAlign.center,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: theme.textTheme.bodyMedium?.color?.withOpacity(0.6),
          ),
        ),
        const SizedBox(height: 24),
        if (hasSearch)
          Center(
            child: TextButton.icon(
              onPressed: _clearSearch,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text("Clear Search Filters"),
            ),
          ),
      ],
    );
  }

  Widget _buildErrorState(BuildContext context, String message) {
    final theme = Theme.of(context);
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(32),
      children: [
        const SizedBox(height: 60),
        Icon(
          Icons.cloud_off_rounded,
          size: 64,
          color: theme.colorScheme.error.withOpacity(0.7),
        ),
        const SizedBox(height: 16),
        Text(
          "Unable to load articles",
          textAlign: TextAlign.center,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          "Check your internet connection and tap retry below to reload.",
          textAlign: TextAlign.center,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: theme.textTheme.bodyMedium?.color?.withOpacity(0.6),
          ),
        ),
        const SizedBox(height: 24),
        Center(
          child: ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6366F1),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              ref.read(postsProvider.notifier).refresh(showLoadingIfEmpty: true);
            },
            icon: const Icon(Icons.refresh_rounded, size: 18),
            label: const Text("Try Again"),
          ),
        ),
      ],
    );
  }
}
