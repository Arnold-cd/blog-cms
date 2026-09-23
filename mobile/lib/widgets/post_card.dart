import "package:flutter/material.dart";
import "package:intl/intl.dart";
import "../models/post.dart";
import "../services/meetei_mayek_service.dart";
import "adaptive_image.dart";

class PostCard extends StatelessWidget {
  final Post post;
  final VoidCallback onTap;
  final bool isFeatured;

  const PostCard({
    super.key,
    required this.post,
    required this.onTap,
    this.isFeatured = false,
  });

  String _formatDate(String rawDate) {
    if (rawDate.isEmpty) return "";
    try {
      final parsed = DateTime.parse(rawDate);
      return DateFormat("MMM d, yyyy").format(parsed);
    } catch (_) {
      return rawDate;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Card(
      margin: EdgeInsets.symmetric(
        horizontal: isFeatured ? 16 : 16,
        vertical: isFeatured ? 8 : 6,
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner Image
            AspectRatio(
              aspectRatio: isFeatured ? 16 / 9 : 21 / 9,
              child: AdaptiveImage(
                imageUrl: post.thumbnailUrl,
                fit: BoxFit.cover,
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Meta row (Category & Reading Time)
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0x2A38BDF8) : const Color(0x150284C7),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isDark ? const Color(0x4D38BDF8) : const Color(0x330284C7),
                          ),
                        ),
                        child: Text(
                          post.category.toUpperCase(),
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.5,
                            color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF0284C7),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        "${post.readingTimeMin} min read",
                        style: theme.textTheme.bodySmall?.copyWith(
                          fontSize: 11,
                          color: theme.textTheme.bodySmall?.color?.withOpacity(0.7),
                        ),
                      ),
                      if (post.language == "mni") ...[
                        const SizedBox(width: 6),
                        const Text("•"),
                        const SizedBox(width: 6),
                        Text(
                          MeeteiMayekService.convertUnicodeToPukokFont("ꯃꯤꯇꯩ ꯃꯌꯦꯛ"),
                          style: const TextStyle(
                            fontFamily: "PukokEeyek",
                            fontSize: 12,
                            fontWeight: FontWeight.normal,
                            color: Color(0xFFF43F5E),
                          ),
                        ),
                      ],
                    ],
                  ),

                  const SizedBox(height: 10),

                  // Title
                  Text(
                    post.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                      fontSize: isFeatured ? 18 : 16,
                      height: 1.25,
                      letterSpacing: -0.2,
                    ),
                  ),

                  if (post.summary.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    Text(
                      post.summary,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontSize: 12,
                        height: 1.4,
                        color: theme.textTheme.bodySmall?.color?.withOpacity(0.8),
                      ),
                    ),
                  ],

                  const SizedBox(height: 12),

                  // Author & Date
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 10,
                        backgroundColor: theme.colorScheme.primary.withOpacity(0.12),
                        child: Text(
                          post.author.isNotEmpty ? post.author[0].toUpperCase() : "A",
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        post.author,
                        style: theme.textTheme.bodySmall?.copyWith(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        _formatDate(post.date),
                        style: theme.textTheme.bodySmall?.copyWith(
                          fontSize: 11,
                          color: theme.textTheme.bodySmall?.color?.withOpacity(0.6),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
