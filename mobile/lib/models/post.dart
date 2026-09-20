class Post {
  final String id;
  final String title;
  final String summary;
  final String date;
  final String author;
  final String category;
  final String thumbnailUrl;
  final String contentUrl;
  final int readingTimeMin;
  final String language;
  final bool featured;
  final String? content;

  const Post({
    required this.id,
    required this.title,
    required this.summary,
    required this.date,
    required this.author,
    required this.category,
    required this.thumbnailUrl,
    required this.contentUrl,
    required this.readingTimeMin,
    required this.language,
    this.featured = false,
    this.content,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json["id"] as String? ?? "",
      title: json["title"] as String? ?? "Untitled Post",
      summary: json["summary"] as String? ?? "",
      date: json["date"] as String? ?? "",
      author: json["author"] as String? ?? "Anonymous",
      category: json["category"] as String? ?? "General",
      thumbnailUrl: json["thumbnail_url"] as String? ?? json["thumbnailUrl"] as String? ?? "",
      contentUrl: json["content_url"] as String? ?? json["contentUrl"] as String? ?? "",
      readingTimeMin: (json["reading_time_min"] as num?)?.toInt() ?? (json["readingTimeMin"] as num?)?.toInt() ?? 1,
      language: json["language"] as String? ?? "en",
      featured: json["featured"] as bool? ?? false,
      content: json["content"] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "title": title,
      "summary": summary,
      "date": date,
      "author": author,
      "category": category,
      "thumbnail_url": thumbnailUrl,
      "content_url": contentUrl,
      "reading_time_min": readingTimeMin,
      "language": language,
      "featured": featured,
      if (content != null) "content": content,
    };
  }

  Post copyWith({
    String? id,
    String? title,
    String? summary,
    String? date,
    String? author,
    String? category,
    String? thumbnailUrl,
    String? contentUrl,
    int? readingTimeMin,
    String? language,
    bool? featured,
    String? content,
  }) {
    return Post(
      id: id ?? this.id,
      title: title ?? this.title,
      summary: summary ?? this.summary,
      date: date ?? this.date,
      author: author ?? this.author,
      category: category ?? this.category,
      thumbnailUrl: thumbnailUrl ?? this.thumbnailUrl,
      contentUrl: contentUrl ?? this.contentUrl,
      readingTimeMin: readingTimeMin ?? this.readingTimeMin,
      language: language ?? this.language,
      featured: featured ?? this.featured,
      content: content ?? this.content,
    );
  }
}
