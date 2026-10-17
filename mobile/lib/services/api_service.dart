import "dart:convert";
import "dart:io";
import "dart:async";
import "package:http/http.dart" as http;
import "../models/post.dart";
import "../models/pdf_document.dart";

class ApiService {
  static const String baseCdnUrl = "https://arnold-cd.github.io/blog-cms";
  static const String baseVercelUrl = "https://blog-cms-gilt.vercel.app";
  static const String baseRawUrl = "https://raw.githubusercontent.com/Arnold-cd/blog-cms/main";

  /// Extended Safe Download Limits requested by user
  static const int maxMarkdownBytes = 100 * 1024 * 1024; // 100 MB for markdown articles
  static const int maxPdfBytes = 150 * 1024 * 1024;      // 150 MB for library PDF documents

  /// Strict Domain Allowlist for CDN, Git repository, and Cloud Storage
  static const Set<String> allowedDomains = {
    "arnold-cd.github.io",
    "blog-cms-gilt.vercel.app",
    "raw.githubusercontent.com",
    "github.com",
    "archive.org",
    "drive.google.com",
    "docs.google.com",
  };

  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? http.Client();

  /// Verifies if a given URL belongs to approved CDN/Git/Cloud hosts
  static bool isAllowedDomain(String rawUrl) {
    if (rawUrl.isEmpty) return false;
    final uri = Uri.tryParse(rawUrl);
    if (uri == null) return false;
    final host = uri.host.toLowerCase();
    if (host.isEmpty) return true; // Relative URLs will resolve to baseCdnUrl
    return allowedDomains.contains(host) ||
        host.endsWith(".github.io") ||
        host.endsWith(".vercel.app") ||
        host.endsWith(".githubusercontent.com") ||
        host.endsWith(".archive.org") ||
        host.endsWith(".google.com") ||
        host.endsWith(".googleusercontent.com");
  }

  /// Resolves relative paths or GitHub Raw URLs into reliable GitHub Pages CDN URLs
  static String resolveUrl(String? raw) {
    if (raw == null || raw.trim().isEmpty) {
      return "";
    }
    final trimmed = raw.trim();

    // If points to GitHub raw for this repo, route to GitHub Pages CDN
    if (trimmed.startsWith("https://raw.githubusercontent.com/Arnold-cd/blog-cms/main/")) {
      return trimmed.replaceFirst(
        "https://raw.githubusercontent.com/Arnold-cd/blog-cms/main",
        baseCdnUrl,
      );
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    final cleaned = trimmed.replaceFirst(RegExp(r"^\.?/"), "");
    return "$baseCdnUrl/$cleaned";
  }

  /// Securely downloads a file directly to disk using chunked streaming.
  /// Prevents memory exhaustion (OOM), enforces max byte limits (150MB PDF / 100MB MD),
  /// checks domain allowlisting, and validates %PDF- magic bytes.
  static Future<File> downloadFileStreamed(
    String url,
    File destinationFile, {
    int maxBytes = maxPdfBytes,
    Duration timeout = const Duration(seconds: 90),
    Function(double progress)? onProgress,
    bool verifyPdfHeader = false,
    http.Client? client,
  }) async {
    final resolvedUrl = resolveUrl(url);
    if (!isAllowedDomain(resolvedUrl)) {
      throw Exception("Security restriction: Host '${Uri.tryParse(resolvedUrl)?.host}' is not in approved allowlist");
    }

    final httpClient = client ?? http.Client();
    final shouldCloseClient = client == null;
    IOSink? sink;
    File? stagingFile;
    try {
      final request = http.Request("GET", Uri.parse(resolvedUrl));
      request.headers["Accept"] = "*/*";

      final streamedResponse = await httpClient.send(request).timeout(
        const Duration(seconds: 20),
        onTimeout: () => throw TimeoutException("Connection timed out while reaching server"),
      );

      if (streamedResponse.statusCode != 200) {
        throw Exception("Server returned HTTP ${streamedResponse.statusCode}");
      }

      final contentLength = streamedResponse.contentLength;
      if (contentLength != null && contentLength > maxBytes) {
        throw Exception(
          "File size ($contentLength bytes) exceeds maximum security limit of ${maxBytes ~/ (1024 * 1024)}MB",
        );
      }

      // Ensure parent directory exists
      if (!await destinationFile.parent.exists()) {
        await destinationFile.parent.create(recursive: true);
      }

      // Atomic download pattern: stream to a staging part file first
      stagingFile = File("${destinationFile.path}.part_${DateTime.now().microsecondsSinceEpoch}");
      sink = stagingFile.openWrite();
      int received = 0;
      bool checkedHeader = false;

      await for (final chunk in streamedResponse.stream.timeout(timeout)) {
        // Validate PDF magic bytes on first chunk
        if (verifyPdfHeader && !checkedHeader && chunk.length >= 4) {
          final magic = String.fromCharCodes(chunk.take(5));
          if (!magic.startsWith("%PDF")) {
            throw Exception("Security alert: Corrupted or non-PDF file header ('$magic')");
          }
          checkedHeader = true;
        }

        received += chunk.length;
        if (received > maxBytes) {
          throw Exception("Download aborted: File exceeded ${maxBytes ~/ (1024 * 1024)}MB limit");
        }

        sink.add(chunk);
        if (contentLength != null && contentLength > 0 && onProgress != null) {
          onProgress(received / contentLength);
        }
      }

      await sink.flush();
      await sink.close();
      sink = null;

      // Ensure downloaded file has data
      if (await stagingFile.length() == 0) {
        throw Exception("Downloaded file is empty");
      }

      // Atomically replace destinationFile
      if (await destinationFile.exists()) {
        await destinationFile.delete();
      }
      try {
        await stagingFile.rename(destinationFile.path);
      } catch (_) {
        await stagingFile.copy(destinationFile.path);
        await stagingFile.delete();
      }

      return destinationFile;
    } catch (e) {
      if (sink != null) {
        try {
          await sink.close();
        } catch (_) {}
      }
      if (stagingFile != null && await stagingFile.exists()) {
        try {
          await stagingFile.delete();
        } catch (_) {}
      }
      rethrow;
    } finally {
      if (shouldCloseClient) {
        httpClient.close();
      }
    }
  }

  /// Fetches latest posts manifest from GitHub Pages CDN with fallback to GitHub
  Future<List<Post>> fetchPosts() async {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final primaryUri = Uri.parse("$baseCdnUrl/posts.json?t=$timestamp");
    final fallbackUri = Uri.parse("$baseRawUrl/posts.json?t=$timestamp");
    const timeout = Duration(seconds: 15);

    http.Response response;
    try {
      response = await _client.get(
        primaryUri,
        headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
      ).timeout(timeout);
      if (response.statusCode != 200) {
        response = await _client.get(
          fallbackUri,
          headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
        ).timeout(timeout);
      }
    } catch (_) {
      response = await _client.get(
        fallbackUri,
        headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
      ).timeout(timeout);
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
    if (!isAllowedDomain(targetUrl)) {
      throw Exception("Security restriction: Host '${Uri.tryParse(targetUrl)?.host}' not in approved allowlist");
    }
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    const timeout = Duration(seconds: 35);

    http.Response response;
    try {
      response = await _client.get(
        Uri.parse("$targetUrl?t=$timestamp"),
        headers: {"Accept": "text/plain; charset=utf-8"},
      ).timeout(timeout);
      if (response.statusCode != 200 && (targetUrl.startsWith(baseCdnUrl) || targetUrl.startsWith(baseVercelUrl))) {
        final fallbackUrl = targetUrl.startsWith(baseCdnUrl)
            ? targetUrl.replaceFirst(baseCdnUrl, baseRawUrl)
            : targetUrl.replaceFirst(baseVercelUrl, baseRawUrl);
        response = await _client.get(
          Uri.parse("$fallbackUrl?t=$timestamp"),
          headers: {"Accept": "text/plain; charset=utf-8"},
        ).timeout(timeout);
      }
    } catch (_) {
      final fallbackUrl = targetUrl.startsWith(baseCdnUrl)
          ? targetUrl.replaceFirst(baseCdnUrl, baseRawUrl)
          : (targetUrl.startsWith(baseVercelUrl)
              ? targetUrl.replaceFirst(baseVercelUrl, baseRawUrl)
              : targetUrl);
      response = await _client.get(
        Uri.parse("$fallbackUrl?t=$timestamp"),
        headers: {"Accept": "text/plain; charset=utf-8"},
      ).timeout(timeout);
    }

    if (response.statusCode == 200) {
      if (response.bodyBytes.length > maxMarkdownBytes) {
        throw Exception(
          "Security restriction: Markdown body exceeds maximum limit of ${maxMarkdownBytes ~/ (1024 * 1024)}MB",
        );
      }
      return utf8.decode(response.bodyBytes);
    } else {
      throw Exception("Failed to load markdown content (HTTP ${response.statusCode})");
    }
  }

  /// Fetches latest PDF library manifest from GitHub Pages CDN with fallback to GitHub
  Future<List<PdfDocument>> fetchLibraryDocuments() async {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final primaryUri = Uri.parse("$baseCdnUrl/library.json?t=$timestamp");
    final fallbackUri = Uri.parse("$baseRawUrl/library.json?t=$timestamp");
    const timeout = Duration(seconds: 15);

    http.Response response;
    try {
      response = await _client.get(
        primaryUri,
        headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
      ).timeout(timeout);
      if (response.statusCode != 200) {
        response = await _client.get(
          fallbackUri,
          headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
        ).timeout(timeout);
      }
    } catch (_) {
      response = await _client.get(
        fallbackUri,
        headers: {"Accept": "application/json", "Cache-Control": "no-cache"},
      ).timeout(timeout);
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
