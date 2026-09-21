import "dart:io";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:path_provider/path_provider.dart";
import "package:http/http.dart" as http;
import "../models/pdf_document.dart";
import "app_providers.dart";

/// State Notifier for PDF Library documents
class LibraryNotifier extends StateNotifier<AsyncValue<List<PdfDocument>>> {
  final Ref _ref;

  LibraryNotifier(this._ref) : super(const AsyncValue.loading()) {
    loadInitial();
  }

  Future<void> loadInitial() async {
    await refresh(showLoadingIfEmpty: true);
  }

  Future<void> refresh({bool showLoadingIfEmpty = false}) async {
    if (showLoadingIfEmpty && state.valueOrNull == null) {
      state = const AsyncValue.loading();
    }

    try {
      final api = _ref.read(apiServiceProvider);
      final remoteDocs = await api.fetchLibraryDocuments();
      state = AsyncValue.data(remoteDocs);
    } catch (err, stack) {
      if (state.valueOrNull != null && state.valueOrNull!.isNotEmpty) {
        // Keep existing documents in view
      } else {
        state = AsyncValue.error(err, stack);
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
      final filePath = "$path/${doc.fileName}";
      final file = File(filePath);

      if (await file.exists()) {
        state = {...state, doc.fileName: filePath};
        return filePath;
      }

      final response = await http.get(Uri.parse(doc.pdfUrl));
      if (response.statusCode == 200) {
        await file.writeAsBytes(response.bodyBytes);
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
}

final downloadedPdfsProvider =
    StateNotifierProvider<DownloadedPdfsNotifier, Map<String, String>>((ref) {
  return DownloadedPdfsNotifier();
});
