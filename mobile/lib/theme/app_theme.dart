import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryColor = Color(0xFF0F172A); // Slate 900
  static const Color secondaryColor = Color(0xFFCBF382); // Lime Green Accent
  static const Color accentColor = Color(0xFFCBF382); // Lime Green Accent
  static const Color backgroundColor = Color(0xFFFFFFFF); // Pure White Background
  static const Color surfaceColor = Color(0xFFF8F9FA); // Light Grey Surface
  static const Color surfaceMuted = Color(0xFFF1F5F9); // Muted Surface
  static const Color textColorPrimary = Color(0xFF0F172A); // Slate 900 Text
  static const Color textColorSecondary = Color(0xFF64748B); // Slate 500 Text
  static const Color borderColor = Color(0xFFE2E8F0); // Light Slate Border
  static const Color starYellow = Color(0xFFEAB308); // Rating Star Yellow

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: primaryColor,
      scaffoldBackgroundColor: backgroundColor,
      cardColor: surfaceColor,
      colorScheme: const ColorScheme.light(
        primary: primaryColor,
        secondary: secondaryColor,
        background: backgroundColor,
        surface: surfaceColor,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: backgroundColor,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: textColorPrimary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.5,
        ),
        iconTheme: IconThemeData(color: textColorPrimary),
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(color: textColorPrimary, fontSize: 30, fontWeight: FontWeight.bold),
        titleLarge: TextStyle(color: textColorPrimary, fontSize: 18, fontWeight: FontWeight.w600),
        bodyLarge: TextStyle(color: textColorPrimary, fontSize: 16, fontWeight: FontWeight.normal),
        bodyMedium: TextStyle(color: textColorSecondary, fontSize: 14, fontWeight: FontWeight.normal),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: secondaryColor,
          foregroundColor: primaryColor,
          elevation: 0,
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }

  static BoxDecoration get buttonDecoration {
    return BoxDecoration(
      color: secondaryColor,
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: primaryColor.withOpacity(0.1)),
    );
  }
}
