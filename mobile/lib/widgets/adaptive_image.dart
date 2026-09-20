import "package:flutter/material.dart";
import "package:flutter_svg/flutter_svg.dart";
import "package:cached_network_image/cached_network_image.dart";
import "package:shimmer/shimmer.dart";
import "../services/api_service.dart";

class AdaptiveImage extends StatelessWidget {
  final String imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;

  const AdaptiveImage({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
  });

  String get _resolvedUrl {
    final trimmed = imageUrl.trim();
    if (trimmed.isEmpty) return "";
    return ApiService.resolveUrl(trimmed);
  }

  bool get _isSvg {
    final clean = _resolvedUrl.toLowerCase().split("?").first;
    return clean.endsWith(".svg");
  }

  Widget _buildPlaceholder(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Shimmer.fromColors(
      baseColor: isDark ? const Color(0xFF1F1F24) : const Color(0xFFE2E8F0),
      highlightColor: isDark ? const Color(0xFF2A2A32) : const Color(0xFFF1F5F9),
      child: Container(
        width: width ?? double.infinity,
        height: height ?? 200,
        color: isDark ? Colors.black : Colors.white,
      ),
    );
  }

  Widget _buildFallback(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      width: width ?? double.infinity,
      height: height ?? 180,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1C1C22) : const Color(0xFFF1F5F9),
        borderRadius: borderRadius ?? BorderRadius.circular(12),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.image_outlined,
              color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.4),
              size: 32,
            ),
            const SizedBox(height: 6),
            Text(
              "Image unavailable",
              style: TextStyle(
                fontSize: 12,
                color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.5),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final url = _resolvedUrl;
    Widget imageWidget;

    if (url.isEmpty) {
      imageWidget = _buildFallback(context);
    } else if (_isSvg) {
      imageWidget = SvgPicture.network(
        url,
        width: width,
        height: height,
        fit: fit,
        placeholderBuilder: (ctx) => _buildPlaceholder(ctx),
      );
    } else {
      imageWidget = CachedNetworkImage(
        imageUrl: url,
        width: width,
        height: height,
        fit: fit,
        placeholder: (ctx, _) => _buildPlaceholder(ctx),
        errorWidget: (ctx, _, error) => _buildFallback(ctx),
      );
    }

    if (borderRadius != null) {
      return ClipRRect(
        borderRadius: borderRadius!,
        child: imageWidget,
      );
    }

    return imageWidget;
  }
}
