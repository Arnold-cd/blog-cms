class MeeteiCharacter {
  final String codePoint;
  final String char;
  final String name;
  final String meaning;
  final String category;
  final String? ipa;
  final String? latin;

  const MeeteiCharacter({
    required this.codePoint,
    required this.char,
    required this.name,
    required this.meaning,
    required this.category,
    this.ipa,
    this.latin,
  });
}

class CheishingItem {
  final String meeteiWord;
  final String digits;
  final String romanName;
  final String value;
  final String meaning;

  const CheishingItem({
    required this.meeteiWord,
    required this.digits,
    required this.romanName,
    required this.value,
    required this.meaning,
  });
}
