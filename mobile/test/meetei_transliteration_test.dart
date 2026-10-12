import 'package:flutter_test/flutter_test.dart';
import 'package:sllk/services/meetei_mayek_service.dart';
import 'package:sllk/services/meetei_data.dart';

void main() {
  test('transliteration: i is inap ꫫ and ee is Eenap ꯤ', () {
    final transI = MeeteiMayekService.translateToMeeteiMayek('nungairibo');
    final transEe = MeeteiMayekService.translateToMeeteiMayek('nungaireebo');

    expect(transI.contains('ꫫ'), isTrue, reason: 'nungairibo should contain inap ꫫ');
    expect(transI.contains('ꯤ'), isFalse, reason: 'nungairibo should NOT contain Eenap ꯤ');

    expect(transEe.contains('ꯤ'), isTrue, reason: 'nungaireebo should contain Eenap ꯤ');
    expect(transEe.contains('ꫫ'), isFalse, reason: 'nungaireebo should NOT contain inap ꫫ');

    // Test Pukok conversion
    expect(MeeteiMayekService.convertPukokToUnicode('i'), 'ꫫ');
    expect(MeeteiMayekService.convertPukokToUnicode('I'), 'ꯤ');

    // Test Unicode to Pukok
    expect(MeeteiMayekService.convertUnicodeToPukokFont('ꫫ'), 'i');
    expect(MeeteiMayekService.convertUnicodeToPukokFont('ꯤ'), 'I');

    // Test MeeteiData characters
    final eenapChar = MeeteiData.cheitap9Signs.firstWhere((c) => c.char == 'ꯤ');
    expect(eenapChar.name, 'Eenap');
    expect(eenapChar.latin, 'ee');
    expect(eenapChar.pukokKey, 'I');

    final inapChar = MeeteiData.cheitap9Signs.firstWhere((c) => c.char == 'ꫫ');
    expect(inapChar.name, 'inap');
    expect(inapChar.latin, 'i');
    expect(inapChar.pukokKey, 'i');
  });
}
