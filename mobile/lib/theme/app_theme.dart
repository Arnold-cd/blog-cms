import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";

class AppTheme {
  static const List<String> fontFallbacks = ["NotoSansMeeteiMayek"];

  // Dark Palette
  static const Color darkBg = Color(0xFF09090B);
  static const Color darkSurface = Color(0xFF141418);
  static const Color darkCard = Color(0xFF1B1B21);
  static const Color darkBorder = Color(0x1FFFFFFF);
  static const Color darkTextPrimary = Color(0xFFF4F4F5);
  static const Color darkTextSecondary = Color(0xFFA1A1AA);

  // Light Palette
  static const Color lightBg = Color(0xFFF8FAFC);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightCard = Color(0xFFFFFFFF);
  static const Color lightBorder = Color(0x1A000000);
  static const Color lightTextPrimary = Color(0xFF0F172A);
  static const Color lightTextSecondary = Color(0xFF64748B);

  // Accents
  static const Color cyanAccent = Color(0xFF0284C7);
  static const Color emeraldAccent = Color(0xFF10B981);
  static const Color roseAccent = Color(0xFFF43F5E);

  static ThemeData light() {
    final baseText = GoogleFonts.interTextTheme(ThemeData.light().textTheme);
    final fallbackText = baseText.apply(
      fontFamilyFallback: fontFallbacks,
      bodyColor: lightTextPrimary,
      displayColor: lightTextPrimary,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: lightBg,
      colorScheme: const ColorScheme.light(
        surface: lightSurface,
        primary: lightTextPrimary,
        secondary: cyanAccent,
        outline: lightBorder,
      ),
      textTheme: fallbackText,
      appBarTheme: AppBarTheme(
        backgroundColor: lightSurface.withOpacity(0.95),
        elevation: 0,
        scrolledUnderElevation: 1,
        titleTextStyle: fallbackText.titleMedium?.copyWith(
          color: lightTextPrimary,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
        ),
      ),
      cardTheme: CardThemeData(
        color: lightCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: lightBorder),
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }

  static ThemeData dark() {
    final baseText = GoogleFonts.interTextTheme(ThemeData.dark().textTheme);
    final fallbackText = baseText.apply(
      fontFamilyFallback: fontFallbacks,
      bodyColor: darkTextPrimary,
      displayColor: darkTextPrimary,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBg,
      colorScheme: const ColorScheme.dark(
        surface: darkSurface,
        primary: darkTextPrimary,
        secondary: cyanAccent,
        outline: darkBorder,
      ),
      textTheme: fallbackText,
      appBarTheme: AppBarTheme(
        backgroundColor: darkSurface.withOpacity(0.95),
        elevation: 0,
        scrolledUnderElevation: 1,
        titleTextStyle: fallbackText.titleMedium?.copyWith(
          color: darkTextPrimary,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
        ),
      ),
      cardTheme: CardThemeData(
        color: darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: darkBorder),
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }
}
