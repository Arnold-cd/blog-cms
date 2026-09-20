import "../models/meetei_character.dart";

class MeeteiData {
  static const List<MeeteiCharacter> core18Letters = [
    MeeteiCharacter(codePoint: "U+ABC0", char: "ꯀ", name: "Kok", meaning: "Head (ꯀꯣꯛ)", category: "core18", ipa: "[kɔk]", latin: "k"),
    MeeteiCharacter(codePoint: "U+ABC1", char: "ꯁ", name: "Sam", meaning: "Hair (ꯁꯝ)", category: "core18", ipa: "[səm]", latin: "s"),
    MeeteiCharacter(codePoint: "U+ABC2", char: "ꯂ", name: "Lai", meaning: "Forehead (ꯂꯥꯢ)", category: "core18", ipa: "[lai]", latin: "l"),
    MeeteiCharacter(codePoint: "U+ABC3", char: "ꯃ", name: "Mit", meaning: "Eye (ꯃꯤꯠ)", category: "core18", ipa: "[mit]", latin: "m"),
    MeeteiCharacter(codePoint: "U+ABC4", char: "ꯄ", name: "Pa", meaning: "Eyebrow / Eyelash (ꯄꯥ)", category: "core18", ipa: "[pa]", latin: "p"),
    MeeteiCharacter(codePoint: "U+ABC5", char: "ꯅ", name: "Na", meaning: "Ear (ꯅꯥ)", category: "core18", ipa: "[na]", latin: "n"),
    MeeteiCharacter(codePoint: "U+ABC6", char: "ꯆ", name: "Chil", meaning: "Lips (ꯆꯤꯜ)", category: "core18", ipa: "[tʃil]", latin: "ch"),
    MeeteiCharacter(codePoint: "U+ABC7", char: "ꯇ", name: "Til", meaning: "Saliva / Tongue (ꯇꯤꯜ)", category: "core18", ipa: "[til]", latin: "t"),
    MeeteiCharacter(codePoint: "U+ABC8", char: "ꯈ", name: "Khou", meaning: "Throat (ꯈꯧ)", category: "core18", ipa: "[kʰəw]", latin: "kh"),
    MeeteiCharacter(codePoint: "U+ABC9", char: "ꯉ", name: "Ngou", meaning: "Uvula / Neck (ꯉꯧ)", category: "core18", ipa: "[ŋəw]", latin: "ng"),
    MeeteiCharacter(codePoint: "U+ABCA", char: "ꯊ", name: "Thou", meaning: "Chest / Breast (ꯊꯧ)", category: "core18", ipa: "[tʰəw]", latin: "th"),
    MeeteiCharacter(codePoint: "U+ABCB", char: "ꯋ", name: "Wai", meaning: "Navel (ꯋꯥꯢ)", category: "core18", ipa: "[wai]", latin: "w / v"),
    MeeteiCharacter(codePoint: "U+ABCC", char: "ꯌ", name: "Yang", meaning: "Spine (ꯌꯥꯡ)", category: "core18", ipa: "[jaŋ]", latin: "y"),
    MeeteiCharacter(codePoint: "U+ABCD", char: "ꯍ", name: "Huk", meaning: "Pelvis / Spine base (ꯍꯨꯛ)", category: "core18", ipa: "[huk]", latin: "h"),
    MeeteiCharacter(codePoint: "U+ABCE", char: "ꯎ", name: "Un", meaning: "Skin (ꯎꯟ)", category: "core18", ipa: "[un]", latin: "u / u:"),
    MeeteiCharacter(codePoint: "U+ABCF", char: "ꯏ", name: "I", meaning: "Blood (ꯏ)", category: "core18", ipa: "[i]", latin: "i / i:"),
    MeeteiCharacter(codePoint: "U+ABD0", char: "ꯐ", name: "Pham", meaning: "Anus / Reproductive (ꯐꝝ)", category: "core18", ipa: "[pʰəm]", latin: "ph / f"),
    MeeteiCharacter(codePoint: "U+ABD1", char: "ꯑ", name: "Atiya", meaning: "Sky / Cosmos (ꯑꯇꯤꯌꯥ)", category: "core18", ipa: "[ətija]", latin: "a"),
  ];

  static const List<MeeteiCharacter> additional9Letters = [
    MeeteiCharacter(codePoint: "U+ABD2", char: "ꯒ", name: "Gok", meaning: "Voiced velar /g/", category: "consonant9", ipa: "[gɔk]", latin: "g"),
    MeeteiCharacter(codePoint: "U+ABD3", char: "ꯓ", name: "Jham", meaning: "Voiced aspirate /jh/", category: "consonant9", ipa: "[dʒʱəm]", latin: "jh"),
    MeeteiCharacter(codePoint: "U+ABD4", char: "ꯔ", name: "Rai", meaning: "Alveolar liquid /r/", category: "consonant9", ipa: "[rai]", latin: "r"),
    MeeteiCharacter(codePoint: "U+ABD5", char: "ꯕ", name: "Ba", meaning: "Voiced bilabial /b/", category: "consonant9", ipa: "[ba]", latin: "b"),
    MeeteiCharacter(codePoint: "U+ABD6", char: "ꯖ", name: "Jil", meaning: "Voiced palatal /j/", category: "consonant9", ipa: "[dʒil]", latin: "j / z"),
    MeeteiCharacter(codePoint: "U+ABD7", char: "ꯗ", name: "Dil", meaning: "Voiced dental /d/", category: "consonant9", ipa: "[dil]", latin: "d"),
    MeeteiCharacter(codePoint: "U+ABD8", char: "ꯘ", name: "Ghou", meaning: "Voiced aspirate /gh/", category: "consonant9", ipa: "[gʱəw]", latin: "gh"),
    MeeteiCharacter(codePoint: "U+ABD9", char: "ꯙ", name: "Dhou", meaning: "Voiced aspirate /dh/", category: "consonant9", ipa: "[dʱəw]", latin: "dh"),
    MeeteiCharacter(codePoint: "U+ABDA", char: "ꯚ", name: "Bham", meaning: "Voiced aspirate /bh/", category: "consonant9", ipa: "[bʱəm]", latin: "bh / v"),
  ];

  static const List<MeeteiCharacter> lonsum8Letters = [
    MeeteiCharacter(codePoint: "U+ABDB", char: "ꯛ", name: "Kok Lonsum", meaning: "Final -k", category: "lonsum", ipa: "[-k]", latin: "-k"),
    MeeteiCharacter(codePoint: "U+ABDC", char: "ꯜ", name: "Lai Lonsum", meaning: "Final -l", category: "lonsum", ipa: "[-l]", latin: "-l"),
    MeeteiCharacter(codePoint: "U+ABDD", char: "ꯝ", name: "Mit Lonsum", meaning: "Final -m", category: "lonsum", ipa: "[-m]", latin: "-m"),
    MeeteiCharacter(codePoint: "U+ABDE", char: "ꯞ", name: "Pa Lonsum", meaning: "Final -p", category: "lonsum", ipa: "[-p]", latin: "-p"),
    MeeteiCharacter(codePoint: "U+ABDF", char: "ꯟ", name: "Na Lonsum", meaning: "Final -n", category: "lonsum", ipa: "[-n]", latin: "-n"),
    MeeteiCharacter(codePoint: "U+ABE0", char: "ꯠ", name: "Til Lonsum", meaning: "Final -t", category: "lonsum", ipa: "[-t]", latin: "-t"),
    MeeteiCharacter(codePoint: "U+ABE1", char: "ꯡ", name: "Ngou Lonsum", meaning: "Final -ng", category: "lonsum", ipa: "[-ŋ]", latin: "-ng"),
    MeeteiCharacter(codePoint: "U+ABE2", char: "ꯢ", name: "I Lonsum", meaning: "Final -i", category: "lonsum", ipa: "[-i]", latin: "-i"),
  ];

  static const List<MeeteiCharacter> cheitap8Signs = [
    MeeteiCharacter(codePoint: "U+ABE5", char: "ꯥ", name: "aa-tap", meaning: "Vowel sign -aa (e.g. ꯀꯥ = ka)", category: "cheitap", ipa: "/a/", latin: "ā / aa"),
    MeeteiCharacter(codePoint: "U+ABE4", char: "ꯤ", name: "ee-nap", meaning: "Vowel sign -i / -ee (e.g. ꯀꯤ = ki)", category: "cheitap", ipa: "/i/", latin: "i / ee"),
    MeeteiCharacter(codePoint: "U+ABE8", char: "ꯨ", name: "uu-nap", meaning: "Vowel sign -u / -uu (e.g. ꯀꯨ = ku)", category: "cheitap", ipa: "/u/", latin: "u / uu"),
    MeeteiCharacter(codePoint: "U+ABE6", char: "ꯦ", name: "yet-nap", meaning: "Vowel sign -e (e.g. ꯀꯦ = ke)", category: "cheitap", ipa: "/e/", latin: "e"),
    MeeteiCharacter(codePoint: "U+ABE3", char: "ꯣ", name: "ot-nap", meaning: "Vowel sign -o (e.g. ꯀꯣ = ko)", category: "cheitap", ipa: "/o/", latin: "o"),
    MeeteiCharacter(codePoint: "U+ABE9", char: "ꯩ", name: "chei-nap", meaning: "Vowel sign -ei / -ai (e.g. ꯀꯩ = kei)", category: "cheitap", ipa: "/ej/ or /ai/", latin: "ei / ai"),
    MeeteiCharacter(codePoint: "U+ABE7", char: "ꯧ", name: "sou-nap", meaning: "Vowel sign -ou / -au (e.g. ꯀꯧ = kou)", category: "cheitap", ipa: "/ew/ or /ou/", latin: "ou / au"),
    MeeteiCharacter(codePoint: "U+ABEA", char: "ꯪ", name: "nung", meaning: "Anusvara nasal sign -ng (e.g. ꯀꯪ = kang)", category: "cheitap", ipa: "/əŋ/", latin: "ng"),
  ];

  static const List<MeeteiCharacter> numerals10 = [
    MeeteiCharacter(codePoint: "U+ABF0", char: "꯰", name: "Phun (0)", meaning: "Zero", category: "numeral", ipa: "[pʰun]", latin: "0"),
    MeeteiCharacter(codePoint: "U+ABF1", char: "꯱", name: "Ama (1)", meaning: "One", category: "numeral", ipa: "[əma]", latin: "1"),
    MeeteiCharacter(codePoint: "U+ABF2", char: "꯲", name: "Ani (2)", meaning: "Two", category: "numeral", ipa: "[əni]", latin: "2"),
    MeeteiCharacter(codePoint: "U+ABF3", char: "꯳", name: "Ahum (3)", meaning: "Three", category: "numeral", ipa: "[əhum]", latin: "3"),
    MeeteiCharacter(codePoint: "U+ABF4", char: "꯴", name: "Mari (4)", meaning: "Four", category: "numeral", ipa: "[məri]", latin: "4"),
    MeeteiCharacter(codePoint: "U+ABF5", char: "꯵", name: "Manga (5)", meaning: "Five", category: "numeral", ipa: "[maŋa]", latin: "5"),
    MeeteiCharacter(codePoint: "U+ABF6", char: "꯶", name: "Taruk (6)", meaning: "Six", category: "numeral", ipa: "[taruk]", latin: "6"),
    MeeteiCharacter(codePoint: "U+ABF7", char: "꯷", name: "Taret (7)", meaning: "Seven", category: "numeral", ipa: "[təret]", latin: "7"),
    MeeteiCharacter(codePoint: "U+ABF8", char: "꯸", name: "Nipal (8)", meaning: "Eight", category: "numeral", ipa: "[nipal]", latin: "8"),
    MeeteiCharacter(codePoint: "U+ABF9", char: "꯹", name: "Mapal (9)", meaning: "Nine", category: "numeral", ipa: "[mapəl]", latin: "9"),
  ];

  static const List<CheishingItem> cheishingNumbers = [
    CheishingItem(meeteiWord: "ꯑꯃ", digits: "꯱", romanName: "Ama", value: "1", meaning: "One (Units)"),
    CheishingItem(meeteiWord: "ꯇꯔꯥ", digits: "꯱꯰", romanName: "Tara", value: "10", meaning: "Ten (Tens)"),
    CheishingItem(meeteiWord: "ꯆꯥ", digits: "꯱꯰꯰", romanName: "Cha", value: "100", meaning: "Hundred"),
    CheishingItem(meeteiWord: "ꯂꯤꯁꯤꯡ", digits: "꯱꯰꯰꯰", romanName: "Leeshing", value: "1,000", meaning: "Thousand"),
    CheishingItem(meeteiWord: "ꯂꯤꯁꯤꯡ ꯇꯔꯥ", digits: "꯱꯰꯰꯰꯰", romanName: "Leeshing Tara", value: "10,000", meaning: "Ten Thousand"),
    CheishingItem(meeteiWord: "ꯂꯤꯆꯥ", digits: "꯱꯰꯰꯰꯰꯰", romanName: "Leecha", value: "100,000", meaning: "One Lakh (Hundred Thousand)"),
    CheishingItem(meeteiWord: "ꯂꯤꯆꯥ ꯇꯔꯥ", digits: "꯱꯰꯰꯰꯰꯰꯰", romanName: "Leecha Tara", value: "1,000,000", meaning: "Ten Lakhs (One Million)"),
    CheishingItem(meeteiWord: "ꯂꯤꯄꯨꯟ", digits: "꯱꯰꯰꯰꯰꯰꯰꯰", romanName: "Leepun", value: "10,000,000", meaning: "One Crore (Ten Million)"),
    CheishingItem(meeteiWord: "ꯂꯤꯄꯨꯟ ꯇꯔꯥ", digits: "꯱꯰꯰꯰꯰꯰꯰꯰꯰", romanName: "Leepun Tara", value: "100,000,000", meaning: "Ten Crores (Hundred Million)"),
    CheishingItem(meeteiWord: "ꯂꯤꯄꯣꯠ", digits: "꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰", romanName: "Leepot", value: "1,000,000,000", meaning: "One Billion (Arab)"),
    CheishingItem(meeteiWord: "ꯂꯤꯄꯣꯠ ꯇꯔꯥ", digits: "꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰", romanName: "Leepot Tara", value: "10,000,000,000", meaning: "Ten Billions"),
    CheishingItem(meeteiWord: "ꯂꯤꯀꯩ", digits: "꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰", romanName: "Leekei", value: "100,000,000,000", meaning: "Hundred Billions"),
    CheishingItem(meeteiWord: "ꯂꯤꯀꯩ ꯇꯔꯥ", digits: "꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰", romanName: "Leekei Tara", value: "1,000,000,000,000", meaning: "One Trillion"),
    CheishingItem(meeteiWord: "ꯄꯨ ꯑꯃ", digits: "꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰", romanName: "Puu Ama", value: "10,000,000,000,000", meaning: "Ten Trillions"),
  ];
}
