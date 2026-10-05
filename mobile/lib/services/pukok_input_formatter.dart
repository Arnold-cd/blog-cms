import 'package:flutter/services.dart';
import 'meetei_mayek_service.dart';

/// Target output mode for [PukokInputFormatter]
enum PukokFormatterMode {
  /// Converts Pukok QWERTY layout keystrokes into genuine Meetei Mayek Unicode
  /// (e.g., 'k' -> 'ꯀ', 'K' -> 'ꯛ', 'J' -> 'ꯥ', '1' -> '꯱', ';' -> '꯫')
  unicode,

  /// Converts Latin phonetic syllables into Meetei Mayek Unicode in real time
  /// (e.g., 'kangleipak' -> 'ꯀꯪꯂꯩꯄꯥꯛ')
  phonetic,

  /// Passthrough mode - retains ASCII keystrokes for display with PukokEeyek font
  pukokAscii,
}

/// A real-time [TextInputFormatter] that intercepts standard keyboard strokes
/// (from iOS/Android software keyboard or physical keyboard) and converts them
/// directly into Meetei Mayek script.
///
/// Usage:
/// ```dart
/// TextField(
///   controller: myController,
///   inputFormatters: [
///     PukokInputFormatter.unicode(),
///   ],
/// )
/// ```
class PukokInputFormatter extends TextInputFormatter {
  final PukokFormatterMode mode;
  final bool enabled;

  const PukokInputFormatter({
    this.mode = PukokFormatterMode.unicode,
    this.enabled = true,
  });

  /// Factory constructor for Pukok QWERTY -> Meetei Mayek Unicode
  factory PukokInputFormatter.unicode({bool enabled = true}) =>
      PukokInputFormatter(mode: PukokFormatterMode.unicode, enabled: enabled);

  /// Factory constructor for Phonetic Latin -> Meetei Mayek Unicode
  factory PukokInputFormatter.phonetic({bool enabled = true}) =>
      PukokInputFormatter(mode: PukokFormatterMode.phonetic, enabled: enabled);

  /// Factory constructor for raw Pukok ASCII font layout
  factory PukokInputFormatter.pukokAscii({bool enabled = true}) =>
      PukokInputFormatter(mode: PukokFormatterMode.pukokAscii, enabled: enabled);

  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    if (!enabled) return newValue;

    // Passthrough when text is unchanged or during backspace / deletion
    if (newValue.text == oldValue.text) return newValue;
    if (newValue.text.length < oldValue.text.length) {
      return newValue;
    }

    switch (mode) {
      case PukokFormatterMode.pukokAscii:
        return newValue;

      case PukokFormatterMode.unicode:
        return _formatPukokToUnicode(oldValue, newValue);

      case PukokFormatterMode.phonetic:
        return _formatPhoneticToUnicode(oldValue, newValue);
    }
  }

  /// Remaps Pukok QWERTY characters into Meetei Mayek Unicode characters
  TextEditingValue _formatPukokToUnicode(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    // If the input was already converted or has no new Pukok chars, return as-is
    final newText = newValue.text;
    if (newText.isEmpty) return newValue;

    // Convert string using the Pukok QWERTY mapping
    final sb = StringBuffer();
    for (int i = 0; i < newText.length; i++) {
      final ch = newText[i];
      sb.write(MeeteiMayekService.pukokToUnicodeMap[ch] ?? ch);
    }

    final formattedText = sb.toString();

    // Because Meetei Mayek characters are in the BMP (1 code unit in UTF-16, length 1),
    // mapping single Pukok ASCII chars to Unicode preserves exact 1:1 length.
    final selectionOffset = newValue.selection.end.clamp(0, formattedText.length);

    return TextEditingValue(
      text: formattedText,
      selection: TextSelection.collapsed(offset: selectionOffset),
      composing: TextRange.empty,
    );
  }

  /// Converts phonetic input into Meetei Mayek Unicode
  TextEditingValue _formatPhoneticToUnicode(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    if (newValue.text.isEmpty) return newValue;

    final translated =
        MeeteiMayekService.translateToMeeteiMayekWithVocab(newValue.text);

    return TextEditingValue(
      text: translated,
      selection: TextSelection.collapsed(offset: translated.length),
      composing: TextRange.empty,
    );
  }
}
