import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../models/post.dart";
import "../services/api_service.dart";
import "../services/cache_service.dart";

final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

/// Posts Feed State Notifier with offline-first revalidation
class PostsNotifier extends StateNotifier<AsyncValue<List<Post>>> {
  final Ref _ref;

  PostsNotifier(this._ref) : super(const AsyncValue.loading()) {
    loadInitial();
  }

  Future<void> loadInitial() async {
    // 1. Instantly display cached posts if available for 0-lag launch
    final cached = await CacheService.getCachedPosts();
    if (cached.isNotEmpty) {
      state = AsyncValue.data(cached);
    }

    // 2. Fetch fresh manifest from GitHub in background
    await refresh(showLoadingIfEmpty: cached.isEmpty);
  }

  Future<void> refresh({bool showLoadingIfEmpty = false}) async {
    if (showLoadingIfEmpty && state.valueOrNull == null) {
      state = const AsyncValue.loading();
    }

    try {
      final api = _ref.read(apiServiceProvider);
      final remotePosts = await api.fetchPosts();

      // Save to offline cache
      await CacheService.savePosts(remotePosts);
      state = AsyncValue.data(remotePosts);
    } catch (err, stack) {
      // If we already had cached posts, keep them intact
      if (state.valueOrNull != null && state.valueOrNull!.isNotEmpty) {
        // Keep cached data
      } else {
        state = AsyncValue.error(err, stack);
      }
    }
  }
}

final postsProvider = StateNotifierProvider<PostsNotifier, AsyncValue<List<Post>>>((ref) {
  return PostsNotifier(ref);
});

/// Category & Search Filters
final selectedCategoryProvider = StateProvider<String>((ref) => "All");
final searchQueryProvider = StateProvider<String>((ref) => "");

/// Filtered Posts Provider
final filteredPostsProvider = Provider<List<Post>>((ref) {
  final postsAsync = ref.watch(postsProvider);
  final selectedCat = ref.watch(selectedCategoryProvider);
  final query = ref.watch(searchQueryProvider).trim().toLowerCase();

  return postsAsync.maybeWhen(
    data: (posts) {
      return posts.filter((p) {
        final matchesCat = selectedCat == "All" || p.category.toLowerCase() == selectedCat.toLowerCase();
        final matchesQuery = query.isEmpty ||
            p.title.toLowerCase().contains(query) ||
            p.summary.toLowerCase().contains(query) ||
            p.author.toLowerCase().contains(query);
        return matchesCat && matchesQuery;
      }).toList();
    },
    orElse: () => [],
  );
});

extension PostFilterExt on List<Post> {
  Iterable<Post> filter(bool Function(Post) predicate) {
    return where(predicate);
  }
}

/// Available Categories Provider
final categoriesProvider = Provider<List<String>>((ref) {
  final postsAsync = ref.watch(postsProvider);
  return postsAsync.maybeWhen(
    data: (posts) {
      final set = <String>{"All"};
      for (final p in posts) {
        if (p.category.isNotEmpty) set.add(p.category);
      }
      return set.toList();
    },
    orElse: () => ["All"],
  );
});

/// Theme Mode Notifier
class ThemeNotifier extends StateNotifier<ThemeMode> {
  ThemeNotifier() : super(ThemeMode.system) {
    _init();
  }

  Future<void> _init() async {
    final isDark = await CacheService.isDarkMode(true);
    state = isDark ? ThemeMode.dark : ThemeMode.light;
  }

  Future<void> toggle() async {
    final next = state == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    state = next;
    await CacheService.setThemeMode(next == ThemeMode.dark);
  }
}

final themeModeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  return ThemeNotifier();
});

/// Bookmarks Notifier
class BookmarksNotifier extends StateNotifier<Set<String>> {
  BookmarksNotifier() : super({}) {
    _init();
  }

  Future<void> _init() async {
    state = await CacheService.getBookmarks();
  }

  Future<void> toggle(String postId) async {
    await CacheService.toggleBookmark(postId);
    state = await CacheService.getBookmarks();
  }
}

final bookmarksProvider = StateNotifierProvider<BookmarksNotifier, Set<String>>((ref) {
  return BookmarksNotifier();
});

/// Reader Font Size Scale Notifier
class FontSizeNotifier extends StateNotifier<double> {
  FontSizeNotifier() : super(1.0) {
    _init();
  }

  Future<void> _init() async {
    state = await CacheService.getFontSizeScale();
  }

  Future<void> increase() async {
    if (state < 1.4) {
      state = double.parse((state + 0.1).toStringAsFixed(1));
      await CacheService.setFontSizeScale(state);
    }
  }

  Future<void> decrease() async {
    if (state > 0.8) {
      state = double.parse((state - 0.1).toStringAsFixed(1));
      await CacheService.setFontSizeScale(state);
    }
  }

  Future<void> reset() async {
    state = 1.0;
    await CacheService.setFontSizeScale(1.0);
  }
}

final fontSizeProvider = StateNotifierProvider<FontSizeNotifier, double>((ref) {
  return FontSizeNotifier();
});

/// Reader Paper Tone Notifier ("default", "sepia", "oled")
class PaperToneNotifier extends StateNotifier<String> {
  PaperToneNotifier() : super("default") {
    _init();
  }

  Future<void> _init() async {
    state = await CacheService.getPaperTone();
  }

  Future<void> setTone(String tone) async {
    state = tone;
    await CacheService.setPaperTone(tone);
  }
}

final paperToneProvider = StateNotifierProvider<PaperToneNotifier, String>((ref) {
  return PaperToneNotifier();
});

