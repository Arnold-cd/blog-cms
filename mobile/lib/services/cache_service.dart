import "dart:convert";
import "package:shared_preferences/shared_preferences.dart";
import "../models/post.dart";

class CacheService {
  static const String _keyPostsManifest = "sllk_cached_posts_manifest";
  static const String _keyBookmarks = "sllk_bookmarked_ids";
  static const String _keyThemeMode = "sllk_theme_mode";
  static const String _keyFontSize = "sllk_font_size_scale";

  /// Cache posts manifest locally
  static Future<void> savePosts(List<Post> posts) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = posts.map((p) => p.toJson()).toList();
    await prefs.setString(_keyPostsManifest, json.encode(jsonList));
  }

  /// Load cached posts manifest
  static Future<List<Post>> getCachedPosts() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyPostsManifest);
    if (raw == null || raw.isEmpty) return [];

    try {
      final decoded = json.decode(raw);
      if (decoded is List) {
        return decoded.map((e) => Post.fromJson(e as Map<String, dynamic>)).toList();
      }
    } catch (_) {}
    return [];
  }

  /// Cache markdown content for an article
  static Future<void> saveContent(String postId, String markdown) => cacheMarkdown(postId, markdown);
  static Future<String?> getCachedContent(String postId) => getCachedMarkdown(postId);

  static Future<void> cacheMarkdown(String postId, String markdown) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString("sllk_md_$postId", markdown);
  }

  /// Retrieve cached markdown content for an article
  static Future<String?> getCachedMarkdown(String postId) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("sllk_md_$postId");
  }

  /// Bookmarks management
  static Future<Set<String>> getBookmarks() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_keyBookmarks);
    return list?.toSet() ?? {};
  }

  static Future<void> toggleBookmark(String postId) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getBookmarks();
    if (current.contains(postId)) {
      current.remove(postId);
    } else {
      current.add(postId);
    }
    await prefs.setStringList(_keyBookmarks, current.toList());
  }

  /// Theme preference
  static Future<bool> isDarkMode(bool systemDark) async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_keyThemeMode);
    if (saved == "dark") return true;
    if (saved == "light") return false;
    return systemDark;
  }

  static Future<void> setThemeMode(bool isDark) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyThemeMode, isDark ? "dark" : "light");
  }

  /// Reader font size scale
  static Future<double> getFontSizeScale() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getDouble(_keyFontSize) ?? 1.0;
  }

  static Future<void> setFontSizeScale(double scale) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble(_keyFontSize, scale);
  }

  /// Paper Tone Preference ("default", "sepia", "oled")
  static Future<String> getPaperTone() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("sllk_paper_tone") ?? "default";
  }

  static Future<void> setPaperTone(String tone) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString("sllk_paper_tone", tone);
  }

  /// Transliteration hint preference
  static Future<bool> isTransliterationEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool("sllk_transliteration_enabled") ?? true;
  }

  static Future<void> setTransliteration(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool("sllk_transliteration_enabled", enabled);
  }

  /// TTS Speed preference
  static Future<double> getTtsSpeed() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getDouble("sllk_tts_speed") ?? 1.0;
  }

  static Future<void> setTtsSpeed(double speed) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble("sllk_tts_speed", speed);
  }

  /// Clears cached articles and temporary manifests
  static Future<void> clearCache() async {
    final prefs = await SharedPreferences.getInstance();
    final keys = prefs.getKeys();
    for (final key in keys) {
      if (key.startsWith("sllk_md_") || key == _keyPostsManifest) {
        await prefs.remove(key);
      }
    }
  }
}
