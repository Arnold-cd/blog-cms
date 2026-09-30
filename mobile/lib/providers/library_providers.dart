import "dart:convert";
import "dart:io";
import "package:flutter/services.dart" show rootBundle;
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:flutter_riverpod/legacy.dart";
import "package:path_provider/path_provider.dart";
import "../models/pdf_document.dart";
import "../services/api_service.dart";
import "../services/cache_service.dart";
import "app_providers.dart";

/// State Notifier for PDF Library documents (Offline-First)
class LibraryNotifier extends StateNotifier<AsyncValue<List<PdfDocument>>> {
  final Ref _ref;

  LibraryNotifier(this._ref) : super(const AsyncValue.loading()) {
    loadInitial();
  }

  Future<void> loadInitial() async {
    // 1. Instantly display cached library if available from previous sessions
    var cached = await CacheService.getCachedLibrary();

    // 2. If no cache yet (first run / offline), load pre-bundled library.json asset
    if (cached.isEmpty) {
      cached = await _loadBundledLibrary();
      if (cached.isNotEmpty) {
        await CacheService.saveLibrary(cached);
      }
    }

    if (cached.isNotEmpty) {
      state = AsyncValue.data(cached);
    }

    // 3. Fetch fresh manifest from GitHub in background
    await refresh(showLoadingIfEmpty: cached.isEmpty);
  }

  Future<List<PdfDocument>> _loadBundledLibrary() async {
    try {
      final raw = await rootBundle.loadString("assets/library.json");
      final decoded = json.decode(raw);
      if (decoded is List) {
        return decoded
            .map((item) => PdfDocument.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {}
    return [];
  }

  Future<void> refresh({bool showLoadingIfEmpty = false}) async {
    if (showLoadingIfEmpty && state.value == null) {
      state = const AsyncValue.loading();
    }

    try {
      final api = _ref.read(apiServiceProvider);
      final remoteDocs = await api.fetchLibraryDocuments();

      // Save to offline cache
      await CacheService.saveLibrary(remoteDocs);
      state = AsyncValue.data(remoteDocs);
    } catch (err, stack) {
      // Offline fallback: keep existing data or restore from cache/bundle
      if (state.value != null && state.value!.isNotEmpty) {
        // Keep cached data in view
      } else {
        final cached = await CacheService.getCachedLibrary();
        if (cached.isNotEmpty) {
          state = AsyncValue.data(cached);
        } else {
          final bundled = await _loadBundledLibrary();
          if (bundled.isNotEmpty) {
            state = AsyncValue.data(bundled);
          } else {
            state = AsyncValue.error(err, stack);
          }
        }
      }
    }
  }
}

final libraryProvider = StateNotifierProvider<LibraryNotifier, AsyncValue<List<PdfDocument>>>((ref) {
  return LibraryNotifier(ref);
});

/// Category & Search Filters for Library
final libraryCategoryProvider = StateProvider<String>((ref) => "All");
final librarySearchQueryProvider = StateProvider<String>((ref) => "");

/// Filtered Library Documents
final filteredLibraryProvider = Provider<List<PdfDocument>>((ref) {
  final docsAsync = ref.watch(libraryProvider);
  final selectedCat = ref.watch(libraryCategoryProvider);
  final query = ref.watch(librarySearchQueryProvider).trim().toLowerCase();

  return docsAsync.maybeWhen(
    data: (docs) {
      return docs.where((doc) {
        final matchesCat = selectedCat == "All" ||
            doc.category.toLowerCase() == selectedCat.toLowerCase();
        final matchesQuery = query.isEmpty ||
            doc.title.toLowerCase().contains(query) ||
            doc.author.toLowerCase().contains(query) ||
            doc.description.toLowerCase().contains(query) ||
            doc.tags.any((t) => t.toLowerCase().contains(query));
        return matchesCat && matchesQuery;
      }).toList();
    },
    orElse: () => [],
  );
});

/// Unique categories in Library
final libraryCategoriesProvider = Provider<List<String>>((ref) {
  final docsAsync = ref.watch(libraryProvider);
  return docsAsync.maybeWhen(
    data: (docs) {
      final set = <String>{"All"};
      for (final doc in docs) {
        if (doc.category.isNotEmpty) set.add(doc.category);
      }
      return set.toList();
    },
    orElse: () => ["All"],
  );
});

/// Offline Download Manager Provider for PDFs
class DownloadedPdfsNotifier extends StateNotifier<Map<String, String>> {
  DownloadedPdfsNotifier() : super({}) {
    checkDownloaded();
  }

  Future<String> _getAppDir() async {
    final dir = await getApplicationDocumentsDirectory();
    final pdfDir = Directory("${dir.path}/pdfs");
    if (!await pdfDir.exists()) {
      await pdfDir.create(recursive: true);
    }
    return pdfDir.path;
  }

  Future<void> checkDownloaded() async {
    try {
      final path = await _getAppDir();
      final dir = Directory(path);
      if (await dir.exists()) {
        final files = dir.listSync();
        final map = <String, String>{};
        for (final f in files) {
          if (f is File && f.path.endsWith(".pdf")) {
            final fileName = f.uri.pathSegments.last;
            map[fileName] = f.path;
          }
        }
        state = map;
      }
    } catch (_) {}
  }

  Future<String?> downloadPdf(PdfDocument doc, {Function(double)? onProgress}) async {
    try {
      final path = await _getAppDir();
      final safeName = PdfDocument.sanitizeFileName(doc.fileName, fallbackId: doc.id);
      final filePath = "$path/$safeName";
      final file = File(filePath);

      if (await file.exists()) {
        state = {...state, doc.fileName: filePath};
        return filePath;
      }

      final downloaded = await ApiService.downloadFileStreamed(
        doc.pdfUrl,
        file,
        maxBytes: ApiService.maxPdfBytes, // 150 MB safe limit
        verifyPdfHeader: true,             // Verifies %PDF- magic bytes
        onProgress: onProgress,
      );
      if (await downloaded.exists()) {
        state = {...state, doc.fileName: filePath};
        return filePath;
      }
    } catch (_) {
      // Ignore network download exceptions gracefully
    }
    return null;
  }

  bool isDownloaded(String fileName) => state.containsKey(fileName);

  String? getLocalPath(String fileName) => state[fileName];

  Future<void> deletePdf(String fileName) async {
    final path = state[fileName];
    if (path != null) {
      try {
        final file = File(path);
        if (await file.exists()) {
          await file.delete();
        }
      } catch (_) {}
      final next = Map<String, String>.from(state)..remove(fileName);
      state = next;
    }
  }

  Future<void> clearAllDownloads() async {
    try {
      final path = await _getAppDir();
      final dir = Directory(path);
      if (await dir.exists()) {
        final files = dir.listSync();
        for (final f in files) {
          if (f is File) {
            await f.delete();
          }
        }
      }
    } catch (_) {}
    state = {};
  }

  int getTotalStorageBytes() {
    int total = 0;
    for (final path in state.values) {
      try {
        final file = File(path);
        if (file.existsSync()) {
          total += file.lengthSync();
        }
      } catch (_) {}
    }
    return total;
  }
}

final downloadedPdfsProvider =
    StateNotifierProvider<DownloadedPdfsNotifier, Map<String, String>>((ref) {
  return DownloadedPdfsNotifier();
});

/// Provider for list of all offline downloaded PDF documents with full metadata
final downloadedDocumentsProvider = Provider<List<PdfDocument>>((ref) {
  final downloadedMap = ref.watch(downloadedPdfsProvider);
  final allDocs = ref.watch(libraryProvider).value ?? [];

  final list = <PdfDocument>[];
  for (final entry in downloadedMap.entries) {
    final fileName = entry.key;
    final match = allDocs.where((d) => d.fileName == fileName).firstOrNull;
    if (match != null) {
      list.add(match);
    } else {
      final cleanTitle = fileName
          .replaceAll(RegExp(r'\.pdf$', caseSensitive: false), '')
          .replaceAll('_', ' ');
      list.add(PdfDocument(
        id: fileName,
        title: cleanTitle,
        description: "Saved for offline reading",
        author: "Downloaded Document",
        category: "Offline",
        language: "mni",
        publishedDate: "",
        fileName: fileName,
        pdfUrl: "",
        coverUrl: "",
        pageCount: 1,
        fileSizeBytes: 0,
        fileSizeFormatted: "Offline",
      ));
    }
  }
  return list;
});
