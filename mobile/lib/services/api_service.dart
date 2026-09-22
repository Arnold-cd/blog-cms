import "dart:convert";
import "package:http/http.dart" as http;
import "../models/post.dart";
import "../models/pdf_document.dart";

class ApiService {
  static const String baseVercelUrl = "https://blog-cms-gilt.vercel.app";
  static const String baseRawUrl = "https://raw.githubusercontent.com/Arnold-cd/blog-cms/main";

  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? http.Client();

  /// Resolves relative paths or GitHub Raw URLs into reliable Vercel CDN URLs
  static String resolveUrl(String? raw) {
    if (raw == null || raw.trim().isEmpty) {
      return "";
    }
    final trimmed = raw.trim();

    // If points to GitHub raw for this repo (which fails if repo is private), route to Vercel CDN
    if (trimmed.startsWith("https://raw.githubusercontent.com/Arnold-cd/blog-cms/main/")) {
      return trimmed.replaceFirst(
        "https://raw.githubusercontent.com/Arnold-cd/blog-cms/main",
        baseVercelUrl,
      );
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    final cleaned = trimmed.replaceFirst(RegExp(r"^\.?/"), "");
    return "$baseVercelUrl/$cleaned";
  }

  /// Fetches latest posts manifest from Vercel CDN with fallback to GitHub
  Future<List<Post>> fetchPosts() async {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final primaryUri = Uri.parse("$baseVercelUrl/posts.json?t=$timestamp");
    final fallbackUri = Uri.parse("$baseRawUrl/posts.json?t=$timestamp");

    http.Response response;
    try {
      response = await _client.get(
        primaryUri,
        headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
      );
      if (response.statusCode != 200) {
        response = await _client.get(
          fallbackUri,
          headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
        );
      }
    } catch (_) {
      response = await _client.get(
        fallbackUri,
        headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
      );
    }

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
      throw Exception("Failed to load posts (HTTP ${response.statusCode})");
    }
  }

  /// Fetches raw markdown body for a specific article
  Future<String> fetchPostContent(String url) async => fetchMarkdown(url);

  Future<String> fetchMarkdown(String url) async {
    final targetUrl = resolveUrl(url);
    final timestamp = DateTime.now().millisecondsSinceEpoch;

    http.Response response;
    try {
      response = await _client.get(
        Uri.parse("$targetUrl?t=$timestamp"),
        headers: {"Accept": "text/plain; charset=utf-8"},
      );
      if (response.statusCode != 200 && targetUrl.startsWith(baseVercelUrl)) {
        final fallbackUrl = targetUrl.replaceFirst(baseVercelUrl, baseRawUrl);
        response = await _client.get(
          Uri.parse("$fallbackUrl?t=$timestamp"),
          headers: {"Accept": "text/plain; charset=utf-8"},
        );
      }
    } catch (_) {
      final fallbackUrl = targetUrl.startsWith(baseVercelUrl)
          ? targetUrl.replaceFirst(baseVercelUrl, baseRawUrl)
          : targetUrl;
      response = await _client.get(
        Uri.parse("$fallbackUrl?t=$timestamp"),
        headers: {"Accept": "text/plain; charset=utf-8"},
      );
    }

    if (response.statusCode == 200) {
      return utf8.decode(response.bodyBytes);
    } else {
      throw Exception("Failed to load markdown content (HTTP ${response.statusCode})");
    }
  }

  /// Fetches latest PDF library manifest from Vercel CDN with fallback to GitHub
  Future<List<PdfDocument>> fetchLibraryDocuments() async {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final primaryUri = Uri.parse("$baseVercelUrl/library.json?t=$timestamp");
    final fallbackUri = Uri.parse("$baseRawUrl/library.json?t=$timestamp");

    http.Response response;
    try {
      response = await _client.get(
        primaryUri,
        headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
      );
      if (response.statusCode != 200) {
        response = await _client.get(
          fallbackUri,
          headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
        );
      }
    } catch (_) {
      response = await _client.get(
        fallbackUri,
        headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
      );
    }

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
      throw Exception("Failed to load PDF library (HTTP ${response.statusCode})");
    }
  }
}
