import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../providers/app_providers.dart";
import "../widgets/post_card.dart";
import "post_detail_screen.dart";

class BookmarksScreen extends ConsumerWidget {
  const BookmarksScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final bookmarks = ref.watch(bookmarksProvider);
    final postsAsync = ref.watch(postsProvider);

    final savedPosts = postsAsync.maybeWhen(
      data: (posts) => posts.where((p) => bookmarks.contains(p.id)).toList(),
      orElse: () => [],
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Saved Articles",
          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
        ),
        elevation: 0,
        actions: [
          if (savedPosts.isNotEmpty)
            IconButton(
              tooltip: "Clear All Bookmarks",
              icon: const Icon(Icons.delete_sweep_outlined, size: 22),
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text("Clear Bookmarks?"),
                    content: const Text("Are you sure you want to remove all saved articles?"),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.of(ctx).pop(),
                        child: const Text("Cancel"),
                      ),
                      TextButton(
                        onPressed: () {
                          for (final p in savedPosts) {
                            ref.read(bookmarksProvider.notifier).toggle(p.id);
                          }
                          Navigator.of(ctx).pop();
                        },
                        child: const Text(
                          "Clear All",
                          style: TextStyle(color: Colors.redAccent),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
      body: savedPosts.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.bookmark_border_rounded,
                      size: 64,
                      color: theme.textTheme.bodyMedium?.color?.withOpacity(0.3),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      "No saved articles yet",
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Bookmark articles from the SLLK feed to read them anytime, even when offline.",
                      textAlign: TextAlign.center,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.textTheme.bodyMedium?.color?.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 12),
              physics: const BouncingScrollPhysics(),
              itemCount: savedPosts.length,
              itemBuilder: (context, index) {
                final post = savedPosts[index];
                return PostCard(
                  post: post,
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => PostDetailScreen(post: post),
                      ),
                    );
                  },
                );
              },
            ),
    );
  }
}
