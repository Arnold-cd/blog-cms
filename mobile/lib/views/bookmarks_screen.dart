import "package:cached_network_image/cached_network_image.dart";
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../models/pdf_document.dart";
import "../providers/app_providers.dart";
import "../providers/library_providers.dart";
import "../services/ad_service.dart";
import "../widgets/monetization_modal.dart";
import "../widgets/post_card.dart";
import "pdf_viewer_screen.dart";
import "post_detail_screen.dart";

class BookmarksScreen extends ConsumerWidget {
  const BookmarksScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final bookmarks = ref.watch(bookmarksProvider);
    final postsAsync = ref.watch(postsProvider);
    final downloadedDocs = ref.watch(downloadedDocumentsProvider);

    final savedPosts = postsAsync.maybeWhen(
      data: (posts) => posts.where((p) => bookmarks.contains(p.id)).toList(),
      orElse: () => [],
    );

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            "Saved Offline",
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
          ),
          elevation: 0,
          actions: [
            IconButton(
              tooltip: "Free Ad-Free Pass (Watch Ad)",
              visualDensity: VisualDensity.compact,
              padding: const EdgeInsets.all(6),
              constraints: const BoxConstraints(),
              icon: const Icon(
                Icons.stars_rounded,
                color: Color(0xFFF59E0B),
                size: 22,
              ),
              onPressed: () => MonetizationModal.show(context),
            ),
            const SizedBox(width: 8),
          ],
          bottom: TabBar(
            indicatorColor: const Color(0xFFD97706),
            labelColor: const Color(0xFFD97706),
            unselectedLabelColor: isDark ? Colors.white60 : Colors.black54,
            labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
            unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13.5),
            tabs: [
              Tab(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.article_outlined, size: 17),
                    const SizedBox(width: 6),
                    Text("Articles (${savedPosts.length})"),
                  ],
                ),
              ),
              Tab(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.picture_as_pdf_outlined, size: 17),
                    const SizedBox(width: 6),
                    Text("PDF Books (${downloadedDocs.length})"),
                  ],
                ),
              ),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Tab 1: Saved Articles
            _buildArticlesTab(context, ref, savedPosts, theme),

            // Tab 2: Downloaded Offline PDFs
            _buildPdfTab(context, ref, downloadedDocs, isDark, theme),
          ],
        ),
      ),
    );
  }

  Widget _buildArticlesTab(
    BuildContext context,
    WidgetRef ref,
    List<dynamic> savedPosts,
    ThemeData theme,
  ) {
    if (savedPosts.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.bookmark_border_rounded,
                size: 64,
                color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.3),
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
                  color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.6),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Column(
      children: [
        if (savedPosts.isNotEmpty)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "${savedPosts.length} saved article${savedPosts.length == 1 ? '' : 's'}",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.6),
                  ),
                ),
                TextButton.icon(
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
                  icon: const Icon(Icons.delete_sweep_outlined, size: 16, color: Colors.redAccent),
                  label: const Text("Clear All", style: TextStyle(fontSize: 12, color: Colors.redAccent)),
                ),
              ],
            ),
          ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 4),
            physics: const BouncingScrollPhysics(),
            itemCount: savedPosts.length,
            itemBuilder: (context, index) {
              final post = savedPosts[index];
              return PostCard(
                post: post,
                onTap: () {
                  AdService.instance.showInterstitialIfEligible();
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => PostDetailScreen(post: post),
                    ),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPdfTab(
    BuildContext context,
    WidgetRef ref,
    List<PdfDocument> downloadedDocs,
    bool isDark,
    ThemeData theme,
  ) {
    if (downloadedDocs.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.file_download_off_rounded,
                size: 64,
                color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.3),
              ),
              const SizedBox(height: 16),
              Text(
                "No downloaded PDFs yet",
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                "Download manuscripts and books from the Library tab to read anytime without an internet connection.",
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.6),
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  ref.read(selectedNavIndexProvider.notifier).state = 1;
                },
                icon: const Icon(Icons.menu_book_rounded),
                label: const Text("Browse PDF Library"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFD97706),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "${downloadedDocs.length} downloaded PDF${downloadedDocs.length == 1 ? '' : 's'} available offline",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.6),
                ),
              ),
              TextButton.icon(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: const Text("Clear Offline PDFs?"),
                      content: const Text("Are you sure you want to remove all downloaded PDF files from offline storage?"),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.of(ctx).pop(),
                          child: const Text("Cancel"),
                        ),
                        TextButton(
                          onPressed: () async {
                            Navigator.of(ctx).pop();
                            await ref.read(downloadedPdfsProvider.notifier).clearAllDownloads();
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
                icon: const Icon(Icons.delete_sweep_outlined, size: 16, color: Colors.redAccent),
                label: const Text("Clear All", style: TextStyle(fontSize: 12, color: Colors.redAccent)),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.fromLTRB(16, 6, 16, 20),
            physics: const BouncingScrollPhysics(),
            itemCount: downloadedDocs.length,
            itemBuilder: (context, index) {
              final doc = downloadedDocs[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1C1C22) : Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: InkWell(
                  onTap: () {
                    AdService.instance.showInterstitialIfEligible();
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => PdfViewerScreen(document: doc),
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(14),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Cover or Icon
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            width: 60,
                            height: 84,
                            color: isDark ? const Color(0xFF282830) : const Color(0xFFF3F4F6),
                            child: doc.coverUrl.isNotEmpty
                                ? CachedNetworkImage(
                                    imageUrl: doc.coverUrl,
                                    fit: BoxFit.cover,
                                    errorWidget: (context, url, error) => const Center(
                                      child: Icon(Icons.picture_as_pdf_rounded, color: Color(0xFFD97706), size: 30),
                                    ),
                                  )
                                : const Center(
                                    child: Icon(Icons.picture_as_pdf_rounded, color: Color(0xFFD97706), size: 30),
                                  ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        // Details
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF10B981).withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(5),
                                    ),
                                    child: const Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 10),
                                        SizedBox(width: 3),
                                        Text(
                                          "Ready Offline",
                                          style: TextStyle(
                                            color: Color(0xFF10B981),
                                            fontSize: 9.5,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    doc.category,
                                    style: TextStyle(
                                      fontSize: 10.5,
                                      color: isDark ? Colors.white54 : Colors.black54,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(
                                doc.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  height: 1.25,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                "${doc.author} • ${doc.displayFileSize}",
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 11.5,
                                  color: isDark ? Colors.white54 : Colors.black54,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Delete Button
                        IconButton(
                          icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 20),
                          tooltip: "Remove from offline storage",
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder: (ctx) => AlertDialog(
                                title: const Text("Delete Offline PDF?"),
                                content: Text("Remove '${doc.title}' from your device storage?"),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.of(ctx).pop(),
                                    child: const Text("Cancel"),
                                  ),
                                  TextButton(
                                    onPressed: () async {
                                      Navigator.of(ctx).pop();
                                      await ref.read(downloadedPdfsProvider.notifier).deletePdf(doc.fileName);
                                    },
                                    child: const Text(
                                      "Delete",
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
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
