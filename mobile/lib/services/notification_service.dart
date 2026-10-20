import "package:firebase_core/firebase_core.dart";
import "package:firebase_messaging/firebase_messaging.dart";
import "package:flutter/material.dart";
import "api_service.dart";
import "../views/post_detail_screen.dart";
import "../views/pdf_viewer_screen.dart";

/// Top-level background message handler for Firebase Messaging
@pragma("vm:entry-point")
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
}

class NotificationService {
  NotificationService._();
  static final NotificationService instance = NotificationService._();

  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
  bool _initialized = false;

  /// Initializes Firebase and Push Notification handlers
  Future<void> initialize() async {
    if (_initialized) return;

    try {
      await Firebase.initializeApp();
      _initialized = true;

      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

      final messaging = FirebaseMessaging.instance;

      // Request notification permission for Android 13+ and iOS
      await messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );

      // Subscribe to topics
      await messaging.subscribeToTopic("all_users");
      await messaging.subscribeToTopic("new_articles");
      await messaging.subscribeToTopic("library_updates");

      // Handle interaction when app is opened from a terminated state
      final initialMessage = await messaging.getInitialMessage();
      if (initialMessage != null) {
        _handleMessageTap(initialMessage);
      }

      // Handle interaction when app is in background and tapped
      FirebaseMessaging.onMessageOpenedApp.listen((message) {
        _handleMessageTap(message);
      });

      // Handle foreground notifications with in-app banner
      FirebaseMessaging.onMessage.listen(_showInAppNotification);
    } catch (e) {
      debugPrint("NotificationService initialization failed: $e");
    }
  }

  void _showInAppNotification(RemoteMessage message) {
    final notification = message.notification;
    final context = navigatorKey.currentContext;
    if (notification != null && context != null && context.mounted) {
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        SnackBar(
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                notification.title ?? "New Update",
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              if (notification.body != null)
                Text(notification.body!, maxLines: 2, overflow: TextOverflow.ellipsis),
            ],
          ),
          behavior: SnackBarBehavior.floating,
          action: SnackBarAction(
            label: "View",
            onPressed: () => _handleMessageTap(message),
          ),
        ),
      );
    }
  }

/// Deep link handler when user taps a push notification
  void _handleMessageTap(RemoteMessage message) async {
    final type = message.data["type"]?.toString().toLowerCase();
    final pdfId = message.data["pdfId"] ?? message.data["pdf_id"] ?? message.data["docId"] ?? message.data["doc_id"];
    final postId = message.data["postId"] ?? message.data["post_id"] ?? message.data["id"];

    // Handle PDF / Library document notification tap
    if (type == "pdf" || type == "library" || (pdfId != null && pdfId.toString().trim().isNotEmpty)) {
      final targetId = (pdfId ?? postId)?.toString().trim();
      if (targetId != null && targetId.isNotEmpty) {
        try {
          final docs = await ApiService().fetchLibraryDocuments();
          final doc = docs.firstWhere(
            (d) => d.id == targetId,
            orElse: () => docs.first,
          );

          navigatorKey.currentState?.push(
            MaterialPageRoute(
              builder: (_) => PdfViewerScreen(document: doc),
            ),
          );
          return;
        } catch (e) {
          debugPrint("Failed to navigate to pdf from notification: $e");
        }
      }
    }

    // Handle Article / Post notification tap
    if (postId == null || postId.toString().trim().isEmpty) return;

    try {
      final posts = await ApiService().fetchPosts();
      final post = posts.firstWhere(
        (p) => p.id == postId,
        orElse: () => posts.first,
      );

      navigatorKey.currentState?.push(
        MaterialPageRoute(
          builder: (_) => PostDetailScreen(post: post),
        ),
      );
    } catch (e) {
      debugPrint("Failed to navigate to post from notification: $e");
    }
  }
}
