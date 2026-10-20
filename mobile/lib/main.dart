import "package:flutter/services.dart";
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "providers/app_providers.dart";
import "services/ad_service.dart";
import "services/notification_service.dart";
import "theme/app_theme.dart";
import "views/splash_screen.dart";

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  // Initialize Google Mobile Ads SDK in background
  AdService.instance.initialize();
  // Initialize Push Notifications in background
  NotificationService.instance.initialize();

  runApp(
    const ProviderScope(
      child: SLLKApp(),
    ),
  );
}

class SLLKApp extends ConsumerWidget {
  const SLLKApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp(
      title: "SLLK",
      debugShowCheckedModeBanner: false,
      navigatorKey: NotificationService.instance.navigatorKey,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: themeMode,
      home: const SplashScreen(),
    );
  }
}
