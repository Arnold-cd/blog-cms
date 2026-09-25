class MeeteiCharacter {
  final String codePoint;
  final String char;
  final String name;
  final String meaning;
  final String category;
  final String? ipa;
  final String? latin;
  final String pukokKey;
  final String pukokWord;

  const MeeteiCharacter({
    required this.codePoint,
    required this.char,
    required this.name,
    required this.meaning,
    required this.category,
    this.ipa,
    this.latin,
    this.pukokKey = "",
    this.pukokWord = "",
  });
}

class CheishingItem {
  final String meeteiWord;
  final String digits;
  final String romanName;
  final String value;
  final String meaning;
  final String pukokKey;
  final String pukokWord;

  const CheishingItem({
    required this.meeteiWord,
    required this.digits,
    required this.romanName,
    required this.value,
    required this.meaning,
    this.pukokKey = "",
    this.pukokWord = "",
  });
}

class KhutamItem {
  final String name;
  final String mathSymbol;
  final String pukokKey;
  final String pukokWord;
  final String description;

  const KhutamItem({
    required this.name,
    required this.mathSymbol,
    required this.pukokKey,
    this.pukokWord = "",
    required this.description,
  });
}

class KhutamSignItem {
  final String name;
  final String sign;
  final String pukokKey;
  final String pukokWord;
  final String description;

  const KhutamSignItem({
    required this.name,
    required this.sign,
    required this.pukokKey,
    this.pukokWord = "",
    required this.description,
  });
}
