import "dart:convert";
import "package:http/http.dart" as http;
import "../models/post.dart";
import "../models/pdf_document.dart";

class ApiService {
  static const String baseRawUrl = "https://raw.githubusercontent.com/Arnold-cd/blog-cms/main";
  static const String manifestUrl = "$baseRawUrl/posts.json";
  static const String libraryManifestUrl = "$baseRawUrl/library.json";

  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? http.Client();

  /// Resolves relative paths (e.g. images/banner.png or posts/intro.md) to full GitHub Raw URLs
  static String resolveUrl(String? raw) {
    if (raw == null || raw.trim().isEmpty) {
      return "$baseRawUrl/images/banner-philosophy.svg";
    }
    final trimmed = raw.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    final cleaned = trimmed.replaceFirst(RegExp(r"^\.?/"), "");
    return "$baseRawUrl/$cleaned";
  }

  /// Fetches latest posts manifest from GitHub repository with cache-busting
  Future<List<Post>> fetchPosts() async {
    final uri = Uri.parse("$manifestUrl?t=${DateTime.now().millisecondsSinceEpoch}");
    final response = await _client.get(
      uri,
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
      },
    );

    if (response.statusCode == 200) {
      final decoded = json.decode(utf8.decode(response.bodyBytes));
      if (decoded is List) {
        return decoded.map((item) {
          final post = Post.fromJson(item as Map<String, dynamic>);
          return post.copyWith(
            thumbnailUrl: resolveUrl(post.thumbnailUrl),
            contentUrl: resolveUrl(post.contentUrl),
          );
        }).toList();
      }
      return [];
    } else {
      throw Exception("Failed to load posts from GitHub (HTTP ${response.statusCode})");
    }
  }

  /// Fetches raw markdown body for a specific article
  Future<String> fetchPostContent(String url) async => fetchMarkdown(url);

  Future<String> fetchMarkdown(String url) async {
    final targetUrl = resolveUrl(url);
    final response = await _client.get(
      Uri.parse("$targetUrl?t=${DateTime.now().millisecondsSinceEpoch}"),
      headers: {"Accept": "text/plain; charset=utf-8"},
    );

    if (response.statusCode == 200) {
      return utf8.decode(response.bodyBytes);
    } else {
      throw Exception("Failed to load markdown content (HTTP ${response.statusCode})");
    }
  }

  /// Fetches latest PDF library manifest from GitHub repository
  Future<List<PdfDocument>> fetchLibraryDocuments() async {
    final uri = Uri.parse("$libraryManifestUrl?t=${DateTime.now().millisecondsSinceEpoch}");
    final response = await _client.get(
      uri,
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
      },
    );

    if (response.statusCode == 200) {
      final decoded = json.decode(utf8.decode(response.bodyBytes));
      if (decoded is List) {
        return decoded.map((item) {
          final doc = PdfDocument.fromJson(item as Map<String, dynamic>);
          return doc.copyWith(
            pdfUrl: resolveUrl(doc.pdfUrl),
            coverUrl: doc.coverUrl.isNotEmpty ? resolveUrl(doc.coverUrl) : "",
          );
        }).toList();
      }
      return [];
    } else {
      throw Exception("Failed to load PDF library from GitHub (HTTP ${response.statusCode})");
    }
  }
}
