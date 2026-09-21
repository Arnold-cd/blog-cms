class PdfDocument {
  final String id;
  final String title;
  final String description;
  final String author;
  final String category;
  final String language;
  final String publishedDate;
  final String fileName;
  final String pdfUrl;
  final String coverUrl;
  final int pageCount;
  final int fileSizeBytes;
  final String fileSizeFormatted;
  final bool featured;
  final List<String> tags;

  const PdfDocument({
    required this.id,
    required this.title,
    required this.description,
    required this.author,
    required this.category,
    required this.language,
    required this.publishedDate,
    required this.fileName,
    required this.pdfUrl,
    required this.coverUrl,
    required this.pageCount,
    required this.fileSizeBytes,
    required this.fileSizeFormatted,
    this.featured = false,
    this.tags = const [],
  });

  /// Sanitizes fileName to prevent Path Traversal attacks (CWE-22)
  static String sanitizeFileName(String? raw, {String fallbackId = ""}) {
    if (raw == null || raw.trim().isEmpty) {
      final safeFallback = fallbackId.replaceAll(RegExp(r"[^a-zA-Z0-9._-]"), "_");
      return safeFallback.isNotEmpty ? "$safeFallback.pdf" : "document.pdf";
    }
    // Strip directory traversal sequences, backslashes, slashes, and leading dots
    final stripped = raw.split(RegExp(r"[\\/]")).last.replaceAll(RegExp(r"^\.+"), "");
    final clean = stripped.replaceAll(RegExp(r"[^a-zA-Z0-9._-]"), "_");
    return clean.isEmpty ? "document.pdf" : clean;
  }

  factory PdfDocument.fromJson(Map<String, dynamic> json) {
    final rawTags = json["tags"];
    List<String> parsedTags = [];
    if (rawTags is List) {
      parsedTags = rawTags.map((t) => t.toString()).toList();
    }

    final docId = json["id"] as String? ?? "";
    final rawFileName = json["file_name"] as String? ?? json["fileName"] as String? ?? "";
    final safeFileName = sanitizeFileName(rawFileName, fallbackId: docId);

    return PdfDocument(
      id: docId,
      title: json["title"] as String? ?? "Untitled Document",
      description: json["description"] as String? ?? "",
      author: json["author"] as String? ?? "Unknown Author",
      category: json["category"] as String? ?? "General",
      language: json["language"] as String? ?? "en",
      publishedDate: json["published_date"] as String? ?? json["publishedDate"] as String? ?? "",
      fileName: safeFileName,
      pdfUrl: json["pdf_url"] as String? ?? json["pdfUrl"] as String? ?? "",
      coverUrl: json["cover_url"] as String? ?? json["coverUrl"] as String? ?? "",
      pageCount: (json["page_count"] as num?)?.toInt() ?? (json["pageCount"] as num?)?.toInt() ?? 1,
      fileSizeBytes: (json["file_size_bytes"] as num?)?.toInt() ?? (json["fileSizeBytes"] as num?)?.toInt() ?? 0,
      fileSizeFormatted: json["file_size_formatted"] as String? ?? json["fileSizeFormatted"] as String? ?? "PDF",
      featured: json["featured"] as bool? ?? false,
      tags: parsedTags,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "title": title,
      "description": description,
      "author": author,
      "category": category,
      "language": language,
      "published_date": publishedDate,
      "file_name": fileName,
      "pdf_url": pdfUrl,
      "cover_url": coverUrl,
      "page_count": pageCount,
      "file_size_bytes": fileSizeBytes,
      "file_size_formatted": fileSizeFormatted,
      "featured": featured,
      "tags": tags,
    };
  }

  PdfDocument copyWith({
    String? id,
    String? title,
    String? description,
    String? author,
    String? category,
    String? language,
    String? publishedDate,
    String? fileName,
    String? pdfUrl,
    String? coverUrl,
    int? pageCount,
    int? fileSizeBytes,
    String? fileSizeFormatted,
    bool? featured,
    List<String>? tags,
  }) {
    return PdfDocument(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      author: author ?? this.author,
      category: category ?? this.category,
      language: language ?? this.language,
      publishedDate: publishedDate ?? this.publishedDate,
      fileName: fileName ?? this.fileName,
      pdfUrl: pdfUrl ?? this.pdfUrl,
      coverUrl: coverUrl ?? this.coverUrl,
      pageCount: pageCount ?? this.pageCount,
      fileSizeBytes: fileSizeBytes ?? this.fileSizeBytes,
      fileSizeFormatted: fileSizeFormatted ?? this.fileSizeFormatted,
      featured: featured ?? this.featured,
      tags: tags ?? this.tags,
    );
  }
}
