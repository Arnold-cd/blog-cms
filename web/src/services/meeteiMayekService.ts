/**
 * Meetei Mayek Complete Unicode Service
 * Official Specifications:
 * - Base Block (U+ABC0 - U+ABFF): https://unicode.org/charts/PDF/UABC0.pdf
 * - Extensions Block (U+AAE0 - U+AAFF): https://unicode.org/charts/PDF/UAAE0.pdf
 * - Reference: https://en.wikipedia.org/wiki/Meitei_script
 */

export interface MeeteiUnicodeChar {
  codePoint: string;
  char: string;
  name: string;
  meaning?: string;
  category: 'core18' | 'consonant9' | 'lonsum' | 'cheitap' | 'special' | 'numeral' | 'extension';
  ipa?: string;
  latin?: string;
}

export interface CheishingEntry {
  meeteiWord: string;
  digits: string;
  romanName: string;
  value: string;
  meaning: string;
}

/**
 * Traditional Meetei Mayek Counting & Large Number System (Cheishing Thiba)
 * Preserved in indigenous Manipuri Puya manuscripts
 */
export const CHEISHING_THIBA: CheishingEntry[] = [
  { meeteiWord: 'ꯑꯃ', digits: '꯱', romanName: 'Ama', value: '1', meaning: 'One (Units)' },
  { meeteiWord: 'ꯇꯔꯥ', digits: '꯱꯰', romanName: 'Tara', value: '10', meaning: 'Ten (Tens)' },
  { meeteiWord: 'ꯆꯥ', digits: '꯱꯰꯰', romanName: 'Cha', value: '100', meaning: 'Hundred' },
  { meeteiWord: 'ꯂꯤꯁꯤꯡ', digits: '꯱꯰꯰꯰', romanName: 'Leeshing', value: '1,000', meaning: 'Thousand' },
  { meeteiWord: 'ꯂꯤꯁꯤꯡ ꯇꯔꯥ', digits: '꯱꯰꯰꯰꯰', romanName: 'Leeshing Tara', value: '10,000', meaning: 'Ten Thousand' },
  { meeteiWord: 'ꯂꯤꯆꯥ', digits: '꯱꯰꯰꯰꯰꯰', romanName: 'Leecha', value: '100,000', meaning: 'One Lakh (Hundred Thousand)' },
  { meeteiWord: 'ꯂꯤꯆꯥ ꯇꯔꯥ', digits: '꯱꯰꯰꯰꯰꯰꯰', romanName: 'Leecha Tara', value: '1,000,000', meaning: 'Ten Lakhs (One Million)' },
  { meeteiWord: 'ꯂꯤꯄꯨꯟ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰', romanName: 'Leepun', value: '10,000,000', meaning: 'One Crore (Ten Million)' },
  { meeteiWord: 'ꯂꯤꯄꯨꯟ ꯇꯔꯥ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Leepun Tara', value: '100,000,000', meaning: 'Ten Crores (Hundred Million)' },
  { meeteiWord: 'ꯂꯤꯄꯣꯠ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Leepot', value: '1,000,000,000', meaning: 'One Billion (Arab)' },
  { meeteiWord: 'ꯂꯤꯄꯣꯠ ꯇꯔꯥ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Leepot Tara', value: '10,000,000,000', meaning: 'Ten Billions' },
  { meeteiWord: 'ꯂꯤꯀꯩ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Leekei', value: '100,000,000,000', meaning: 'Hundred Billions' },
  { meeteiWord: 'ꯂꯤꯀꯩ ꯇꯔꯥ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Leekei Tara', value: '1,000,000,000,000', meaning: 'One Trillion' },
  { meeteiWord: 'ꯄꯨ ꯑꯃ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Puu Ama', value: '10,000,000,000,000', meaning: 'Ten Trillions' },
];

// 1. Core 18 Anatomical Letters (Iyek Ipee) - U+ABC0 to U+ABD1
export const CORE_18_IPEE: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABC0', char: 'ꯀ', name: 'Kok', meaning: 'Head (ꯀꯣꯛ)', category: 'core18', ipa: '[kɔk]', latin: 'k' },
  { codePoint: 'U+ABC1', char: 'ꯁ', name: 'Sam', meaning: 'Hair (ꯁꯝ)', category: 'core18', ipa: '[səm]', latin: 's' },
  { codePoint: 'U+ABC2', char: 'ꯂ', name: 'Lai', meaning: 'Forehead (ꯂꯥꯢ)', category: 'core18', ipa: '[lai]', latin: 'l' },
  { codePoint: 'U+ABC3', char: 'ꯃ', name: 'Mit', meaning: 'Eye (ꯃꯤꯠ)', category: 'core18', ipa: '[mit]', latin: 'm' },
  { codePoint: 'U+ABC4', char: 'ꯄ', name: 'Pa', meaning: 'Eyebrow / Eyelash (ꯄꯥ)', category: 'core18', ipa: '[pa]', latin: 'p' },
  { codePoint: 'U+ABC5', char: 'ꯅ', name: 'Na', meaning: 'Ear (ꯅꯥ)', category: 'core18', ipa: '[na]', latin: 'n' },
  { codePoint: 'U+ABC6', char: 'ꯆ', name: 'Chil', meaning: 'Lips (ꯆꯤꯜ)', category: 'core18', ipa: '[tʃil]', latin: 'ch' },
  { codePoint: 'U+ABC7', char: 'ꯇ', name: 'Til', meaning: 'Saliva / Tongue (ꯇꯤꯜ)', category: 'core18', ipa: '[til]', latin: 't' },
  { codePoint: 'U+ABC8', char: 'ꯈ', name: 'Khou', meaning: 'Throat (ꯈꯧ)', category: 'core18', ipa: '[kʰəw]', latin: 'kh' },
  { codePoint: 'U+ABC9', char: 'ꯉ', name: 'Ngou', meaning: 'Uvula / Neck (ꯉꯧ)', category: 'core18', ipa: '[ŋəw]', latin: 'ng' },
  { codePoint: 'U+ABCA', char: 'ꯊ', name: 'Thou', meaning: 'Chest / Breast (ꯊꯧ)', category: 'core18', ipa: '[tʰəw]', latin: 'th' },
  { codePoint: 'U+ABCB', char: 'ꯋ', name: 'Wai', meaning: 'Navel (ꯋꯥꯢ)', category: 'core18', ipa: '[wai]', latin: 'w / v' },
  { codePoint: 'U+ABCC', char: 'ꯌ', name: 'Yang', meaning: 'Spine (ꯌꯥꯡ)', category: 'core18', ipa: '[jaŋ]', latin: 'y' },
  { codePoint: 'U+ABCD', char: 'ꯍ', name: 'Huk', meaning: 'Pelvis / Spine base (ꯍꯨꯛ)', category: 'core18', ipa: '[huk]', latin: 'h' },
  { codePoint: 'U+ABCE', char: 'ꯎ', name: 'Un', meaning: 'Skin (ꯎꯟ)', category: 'core18', ipa: '[un]', latin: 'u / u:' },
  { codePoint: 'U+ABCF', char: 'ꯏ', name: 'I', meaning: 'Blood (ꯏ)', category: 'core18', ipa: '[i]', latin: 'i / i:' },
  { codePoint: 'U+ABD0', char: 'ꯐ', name: 'Pham', meaning: 'Anus / Reproductive (ꯐꝝ)', category: 'core18', ipa: '[pʰəm]', latin: 'ph / f' },
  { codePoint: 'U+ABD1', char: 'ꯑ', name: 'Atiya', meaning: 'Sky / Cosmos (ꯑꯇꯤꯌꯥ)', category: 'core18', ipa: '[ətija]', latin: 'a' },
];

// 2. Additional 9 Consonants - U+ABD2 to U+ABDA
export const ADDITIONAL_9_CONSONANTS: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABD2', char: 'ꯒ', name: 'Gok', meaning: 'Voiced velar /g/', category: 'consonant9', ipa: '[gɔk]', latin: 'g' },
  { codePoint: 'U+ABD3', char: 'ꯓ', name: 'Jham', meaning: 'Voiced aspirate /jh/', category: 'consonant9', ipa: '[dʒʱəm]', latin: 'jh' },
  { codePoint: 'U+ABD4', char: 'ꯔ', name: 'Rai', meaning: 'Alveolar liquid /r/', category: 'consonant9', ipa: '[rai]', latin: 'r' },
  { codePoint: 'U+ABD5', char: 'ꯕ', name: 'Ba', meaning: 'Voiced bilabial /b/', category: 'consonant9', ipa: '[ba]', latin: 'b' },
  { codePoint: 'U+ABD6', char: 'ꯖ', name: 'Jil', meaning: 'Voiced palatal /j/', category: 'consonant9', ipa: '[dʒil]', latin: 'j / z' },
  { codePoint: 'U+ABD7', char: 'ꯗ', name: 'Dil', meaning: 'Voiced dental /d/', category: 'consonant9', ipa: '[dil]', latin: 'd' },
  { codePoint: 'U+ABD8', char: 'ꯘ', name: 'Ghou', meaning: 'Voiced aspirate /gh/', category: 'consonant9', ipa: '[gʱəw]', latin: 'gh' },
  { codePoint: 'U+ABD9', char: 'ꯙ', name: 'Dhou', meaning: 'Voiced aspirate /dh/', category: 'consonant9', ipa: '[dʱəw]', latin: 'dh' },
  { codePoint: 'U+ABDA', char: 'ꯚ', name: 'Bham', meaning: 'Voiced aspirate /bh/', category: 'consonant9', ipa: '[bʱəm]', latin: 'bh / v' },
];

// All 27 Modern Alphabets (18 Core + 9 Additional)
export const ALL_27_MAIN_LETTERS = [...CORE_18_IPEE, ...ADDITIONAL_9_CONSONANTS];

// 3. 8 Dependent Final Consonants (Lonsum) - U+ABDB to U+ABE2
export const LONSUM_8: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABDB', char: 'ꯛ', name: 'Kok Lonsum', meaning: 'Final -k', category: 'lonsum', ipa: '[-k]', latin: '-k' },
  { codePoint: 'U+ABDC', char: 'ꯜ', name: 'Lai Lonsum', meaning: 'Final -l', category: 'lonsum', ipa: '[-l]', latin: '-l' },
  { codePoint: 'U+ABDD', char: 'ꯝ', name: 'Mit Lonsum', meaning: 'Final -m', category: 'lonsum', ipa: '[-m]', latin: '-m' },
  { codePoint: 'U+ABDE', char: 'ꯞ', name: 'Pa Lonsum', meaning: 'Final -p', category: 'lonsum', ipa: '[-p]', latin: '-p' },
  { codePoint: 'U+ABDF', char: 'ꯟ', name: 'Na Lonsum', meaning: 'Final -n', category: 'lonsum', ipa: '[-n]', latin: '-n' },
  { codePoint: 'U+ABE0', char: 'ꯠ', name: 'Til Lonsum', meaning: 'Final -t', category: 'lonsum', ipa: '[-t]', latin: '-t' },
  { codePoint: 'U+ABE1', char: 'ꯡ', name: 'Ngou Lonsum', meaning: 'Final -ng', category: 'lonsum', ipa: '[-ŋ]', latin: '-ng' },
  { codePoint: 'U+ABE2', char: 'ꯢ', name: 'I Lonsum', meaning: 'Final -i', category: 'lonsum', ipa: '[-i]', latin: '-i' },
];

// 4. 8 Dependent Vowel Diacritics (Cheitap) - U+ABE3 to U+ABEA
export const CHEITAP_8: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABE5', char: 'ꯥ', name: 'Anap (kā)', meaning: 'Vowel sign -aa', category: 'cheitap', ipa: '[ka]', latin: 'ā / aa' },
  { codePoint: 'U+ABE4', char: 'ꯤ', name: 'Inap (ki)', meaning: 'Vowel sign -i', category: 'cheitap', ipa: '[ki]', latin: 'i' },
  { codePoint: 'U+ABE8', char: 'ꯨ', name: 'Unap (ku)', meaning: 'Vowel sign -u', category: 'cheitap', ipa: '[ku]', latin: 'u' },
  { codePoint: 'U+ABE6', char: 'ꯦ', name: 'Yenap (ke)', meaning: 'Vowel sign -e', category: 'cheitap', ipa: '[ke]', latin: 'e' },
  { codePoint: 'U+ABE9', char: 'ꯩ', name: 'Cheinap (kei)', meaning: 'Vowel sign -ei', category: 'cheitap', ipa: '[kej]', latin: 'ei' },
  { codePoint: 'U+ABE3', char: 'ꯣ', name: 'Onap (ko)', meaning: 'Vowel sign -o', category: 'cheitap', ipa: '[ko]', latin: 'o' },
  { codePoint: 'U+ABE7', char: 'ꯧ', name: 'Sounap (kou)', meaning: 'Vowel sign -ou', category: 'cheitap', ipa: '[kəw]', latin: 'ou' },
  { codePoint: 'U+ABEA', char: 'ꯪ', name: 'Nung (kang)', meaning: 'Anusvara nasal sign -ng', category: 'cheitap', ipa: '[kəŋ]', latin: 'ng' },
];

// 5. 3 Special Marks & Punctuation - U+ABEB to U+ABED
export const SPECIAL_MARKS_3: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABEB', char: '꯫', name: 'Cheikhei', meaning: 'Sentence terminal / Full stop', category: 'special' },
  { codePoint: 'U+ABEC', char: '꯬', name: 'Lum Iyek', meaning: 'Heavy falling tone marker', category: 'special' },
  { codePoint: 'U+ABED', char: '꯭', name: 'Apun Iyek', meaning: 'Virama / Conjunct underline', category: 'special' },
];

// 6. 10 Digits - U+ABF0 to U+ABF9
export const NUMERALS_10: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABF0', char: '꯰', name: 'Phun (0)', meaning: 'Zero', category: 'numeral', ipa: '[pʰun]', latin: '0' },
  { codePoint: 'U+ABF1', char: '꯱', name: 'Ama (1)', meaning: 'One', category: 'numeral', ipa: '[əma]', latin: '1' },
  { codePoint: 'U+ABF2', char: '꯲', name: 'Ani (2)', meaning: 'Two', category: 'numeral', ipa: '[əni]', latin: '2' },
  { codePoint: 'U+ABF3', char: '꯳', name: 'Ahum (3)', meaning: 'Three', category: 'numeral', ipa: '[əhum]', latin: '3' },
  { codePoint: 'U+ABF4', char: '꯴', name: 'Mari (4)', meaning: 'Four', category: 'numeral', ipa: '[məri]', latin: '4' },
  { codePoint: 'U+ABF5', char: '꯵', name: 'Manga (5)', meaning: 'Five', category: 'numeral', ipa: '[maŋa]', latin: '5' },
  { codePoint: 'U+ABF6', char: '꯶', name: 'Taruk (6)', meaning: 'Six', category: 'numeral', ipa: '[taruk]', latin: '6' },
  { codePoint: 'U+ABF7', char: '꯷', name: 'Taret (7)', meaning: 'Seven', category: 'numeral', ipa: '[təret]', latin: '7' },
  { codePoint: 'U+ABF8', char: '꯸', name: 'Nipal (8)', meaning: 'Eight', category: 'numeral', ipa: '[nipal]', latin: '8' },
  { codePoint: 'U+ABF9', char: '꯹', name: 'Mapal (9)', meaning: 'Nine', category: 'numeral', ipa: '[mapəl]', latin: '9' },
];

// 7. Meetei Mayek Extensions (U+AAE0 to U+AAFF) from Unicode PDF UAAE0.pdf
export const EXTENSIONS_BLOCK: MeeteiUnicodeChar[] = [
  // Independent vowels
  { codePoint: 'U+AAE0', char: 'ꫠ', name: 'Letter E', meaning: 'Independent vowel E', category: 'extension' },
  { codePoint: 'U+AAE1', char: 'ꫡ', name: 'Letter O', meaning: 'Independent vowel O', category: 'extension' },
  // Historical consonants
  { codePoint: 'U+AAE2', char: 'ꫢ', name: 'Letter Cha', meaning: 'Extension consonant cha', category: 'extension' },
  { codePoint: 'U+AAE3', char: 'ꫣ', name: 'Letter Nya', meaning: 'Extension consonant nya', category: 'extension' },
  { codePoint: 'U+AAE4', char: 'ꫤ', name: 'Letter Tta', meaning: 'Retroflex consonant tta', category: 'extension' },
  { codePoint: 'U+AAE5', char: 'ꫥ', name: 'Letter Ttha', meaning: 'Retroflex consonant ttha', category: 'extension' },
  { codePoint: 'U+AAE6', char: 'ꫦ', name: 'Letter Dda', meaning: 'Retroflex consonant dda', category: 'extension' },
  { codePoint: 'U+AAE7', char: 'ꫧ', name: 'Letter Ddha', meaning: 'Retroflex consonant ddha', category: 'extension' },
  { codePoint: 'U+AAE8', char: 'ꫨ', name: 'Letter Nna', meaning: 'Retroflex consonant nna', category: 'extension' },
  { codePoint: 'U+AAE9', char: 'ꫩ', name: 'Letter Sha', meaning: 'Sibilant sha', category: 'extension' },
  { codePoint: 'U+AAEA', char: 'ꫪ', name: 'Letter Ssa', meaning: 'Retroflex ssa', category: 'extension' },
  // Historical vowel signs
  { codePoint: 'U+AAEB', char: 'ꫫ', name: 'Vowel Sign II', meaning: 'Long vowel sign ii', category: 'extension' },
  { codePoint: 'U+AAEC', char: 'ꫬ', name: 'Vowel Sign UU', meaning: 'Long vowel sign uu', category: 'extension' },
  { codePoint: 'U+AAED', char: 'ꫭ', name: 'Vowel Sign AAI', meaning: 'Vowel sign aai', category: 'extension' },
  { codePoint: 'U+AAEE', char: 'ꫮ', name: 'Vowel Sign AU', meaning: 'Vowel sign au', category: 'extension' },
  { codePoint: 'U+AAEF', char: 'ꫯ', name: 'Vowel Sign AAU', meaning: 'Vowel sign aau', category: 'extension' },
  // Punctuation & Puya Sacred Signs
  { codePoint: 'U+AAF0', char: '꫰', name: 'Cheikhan', meaning: 'Single danda / Comma', category: 'extension' },
  { codePoint: 'U+AAF1', char: '꫱', name: 'Ahang Khudam', meaning: 'Meetei Mayek Question Mark (?)', category: 'extension' },
  { codePoint: 'U+AAF2', char: 'ꫲ', name: 'Anji', meaning: 'Puya Sacred Invocatory sign', category: 'extension' },
  { codePoint: 'U+AAF3', char: 'ꫳ', name: 'Syllable Repetition', meaning: 'Repeats preceding syllable', category: 'extension' },
  { codePoint: 'U+AAF4', char: 'ꫴ', name: 'Word Repetition', meaning: 'Repeats preceding word', category: 'extension' },
  { codePoint: 'U+AAF5', char: 'ꫵ', name: 'Visarga', meaning: 'Meetei Mayek Visarga', category: 'extension' },
  { codePoint: 'U+AAF6', char: '꫶', name: 'Virama', meaning: 'Extension Virama mark', category: 'extension' },
];

/**
 * Bengali script to Meetei Mayek script converter
 */
const BENGALI_TO_MEETEI_MAP: Record<string, string> = {
  'ক': 'ꯀ', 'খ': 'ꯈ', 'গ': 'ꯒ', 'ঘ': 'ꯘ', 'ঙ': 'ꯉ',
  'চ': 'ꯆ', 'ছ': 'ꯆ', 'জ': 'ꯖ', 'ঝ': 'ꯓ', 'ঞ': 'ꯅ',
  'ট': 'ꯇ', 'ঠ': 'ꯊ', 'ড': 'ꯗ', 'ঢ': 'ꯙ', 'ণ': 'ꯟ',
  'ত': 'ꯇ', 'থ': 'ꯊ', 'দ': 'ꯗ', 'ধ': 'ꯙ', 'ন': 'ꯅ',
  'প': 'ꯄ', 'ফ': 'ꯐ', 'ব': 'ꯕ', 'ভ': 'ꯚ', 'ম': 'ꯃ',
  'য': 'ꯌ', 'র': 'ꯔ', 'ল': 'ꯂ', 'ৱ': 'ꯋ', 'শ': 'ꯁ',
  'ষ': 'ꯁ', 'স': 'ꯁ', 'হ': 'ꯍ', 'ড়': 'ꯔ', 'ঢ়': 'ꯔ',
  'য়': 'ꯌ', 'ৎ': 'ꯠ',
  // Vowels independent
  'অ': 'ꯑ', 'আ': 'ꯑꯥ', 'ই': 'ꯏ', 'ঈ': 'ꯏ', 'উ': 'ꯎ', 'ঊ': 'ꯎ',
  'ঋ': 'ꯔꯤ', 'এ': 'ꯑꯦ', 'ঐ': 'ꯑꯩ', 'ও': 'ꯑꯣ', 'ঔ': 'ꯑꯧ',
  // Matras / Vowel signs
  'া': 'ꯥ', 'ি': 'ꯤ', 'ী': 'ꯤ', 'ু': 'ꯨ', 'ূ': 'ꯨ',
  'ৃ': 'ꯔꯤ', 'ে': 'ꯦ', 'ৈ': 'ꯩ', 'ো': 'ꯣ', 'ৌ': 'ꯧ',
  'ং': 'ꯪ', 'ঃ': '꯬', '্': '꯭',
  // Punctuation & digits
  '।': '꯫', '॥': '꯫꯫',
  '?': '꫱', ',': '꫰',
  '০': '꯰', '১': '꯱', '২': '꯲', '৩': '꯳', '৪': '꯴',
  '৫': '꯵', '৬': '꯶', '৭': '꯷', '৮': '꯸', '৯': '꯹',
};

/**
 * Extended English-to-Meetei vocabulary dictionary
 */
const EXTENDED_VOCABULARY: Record<string, string> = {
  // Common Structural & Editorial Terms
  introduction: 'ꯑꯍꯥꯟꯕ ꯋꯥꯔꯣꯜ',
  section: 'ꯁꯔꯨꯛ',
  conclusion: 'ꯋꯥꯔꯣꯢꯁꯤꯟ',
  summary: 'ꯇꯦꯟꯊꯛ',
  overview: 'ꯃꯤꯠꯌꯦꯡ',
  philosophy: 'ꯋꯥꯈꯜꯂꯣꯟ',
  wisdom: 'ꯂꯧꯁꯤꯡ',
  ancient: 'ꯑꯔꯤꯕ',
  manuscript: 'ꯄꯨꯌꯥ',
  manuscripts: 'ꯄꯨꯌꯥꯁꯤꯡ',
  history: 'ꯄꯨꯋꯥꯔꯤ',
  culture: 'ꯆꯠꯅꯕꯤ',
  tradition: 'ꯆꯠꯅꯕꯤ',
  time: 'ꯃꯇꯝ',
  life: 'ꯄꯨꯟꯁꯤ',
  nature: 'ꯃꯍꯧꯁꯥ',
  human: 'ꯃꯤꯑꯣꯏꯕ',
  world: 'ꯃꯥꯂꯦꯝ',
  universe: 'ꯇꯥꯏꯕꯪ',
  language: 'ꯂꯣꯟ',
  script: 'ꯃꯌꯦꯛ',
  science: 'ꯁꯥꯏꯟꯁ',
  technology: 'ꯇꯦꯛꯅꯣꯂꯣꯖꯤ',
  engineering: 'ꯏꯟꯖꯤꯅꯤꯌꯔꯤꯡ',
  architecture: 'ꯑꯥꯔꯀꯤꯇꯦꯛꯆꯔ',
  article: 'ꯋꯥꯔꯦꯡ',
  articles: 'ꯋꯥꯔꯦꯡꯁꯤꯡ',
  author: 'ꯑꯏꯕ',
  date: 'ꯇꯥꯡ',
  read: 'ꯄꯥꯕ',
  reading: 'ꯄꯥꯕ',
  write: 'ꯏꯕ',
  writing: 'ꯏꯕ',
  minute: 'ꯃꯤꯅꯤꯠ',
  minutes: 'ꯃꯤꯅꯤꯠ',
  hour: 'ꯄꯨꯡ',
  hours: 'ꯄꯨꯡꯁꯤꯡ',
  day: 'ꯅꯨꯃꯤꯠ',
  days: 'ꯅꯨꯃꯤꯠꯁꯤꯡ',
  year: 'ꯆꯍꯤ',
  years: 'ꯆꯍꯤꯁꯤꯡ',
  moment: 'ꯃꯤꯀꯨꯞ',
  moments: 'ꯃꯤꯀꯨꯞꯁꯤꯡ',
  second: 'ꯁꯦꯀꯦꯟꯗ',
  seconds: 'ꯁꯦꯀꯦꯟꯗꯁꯤꯡ',
  simplicity: 'ꯂꯥꯏꯕ',
  reliability: 'ꯊꯥꯖꯕ ꯌꯥꯕ',
  prerequisite: 'ꯃꯔꯨꯑꯣꯏꯕ ꯇꯥꯡꯀꯛ',
  fast: 'ꯌꯥꯡꯕ',
  portable: 'ꯄꯨꯕ ꯌꯥꯕ',
  standard: 'ꯁ꯭ꯇꯦꯟꯗꯔꯗ',
  serverless: 'ꯁꯔꯚꯔꯂꯦꯁ',
  headless: 'ꯍꯦꯗꯂꯦꯁ',
  markdown: 'ꯃꯥꯔꯛꯗꯥꯎꯟ',
  bold: 'ꯃꯣꯇꯥ',
  italics: 'ꯏꯇꯥꯂꯤꯛ',
  quotes: 'ꯈꯣꯟꯊꯣꯛ',
  tables: 'ꯇꯦꯕꯜꯁꯤꯡ',
  key: 'ꯃꯔꯨ',
  description: 'ꯁꯟꯗꯣꯛꯅ ꯇꯥꯛꯄ',
  idea: 'ꯋꯥꯈꯜꯂꯣꯟ',
  core: 'ꯃꯔꯨꯑꯣꯏꯕ',
  support: 'ꯁꯧꯒꯠꯄ',
  featured: 'ꯃꯔꯨꯑꯣꯏꯕ',
  general: 'ꯃꯌꯥꯝ',
  duration: 'ꯃꯇꯝꯒꯤ ꯃꯇꯝ',
  subjective: 'ꯁꯕꯖꯦꯛꯇꯤꯚ',
  objective: 'ꯑꯣꯕꯖꯦꯛꯇꯤꯚ',
  chronological: 'ꯃꯇꯝꯒꯤ ꯃꯇꯨꯡ ꯏꯟꯅ',
  physics: 'ꯐꯤꯖꯤꯛꯁ',
  versus: 'ꯃꯥꯌꯣꯛꯇ',
  vs: 'ꯃꯥꯌꯣꯛꯇ',
  'vs.': 'ꯃꯥꯌꯣꯛꯇ꯫',
  phenomenological: 'ꯐꯦꯅꯣꯃꯦꯅꯣꯂꯣꯖꯤꯀꯦꯜ',
  consciousness: 'ꯋꯥꯈꯜ',
  constructs: 'ꯁꯦꯝꯃꯤ',
  construct: 'ꯁꯦꯝꯕ',
  illusion: 'ꯑꯔꯥꯟꯕ ꯃꯤꯠꯌꯦꯡ',
  temporal: 'ꯃꯇꯝꯒꯤ',
  flow: 'ꯏꯆꯦꯜ',
  why: 'ꯀꯔꯤꯒꯤ',
  stretch: 'ꯂꯤꯡꯕ',
  fly: 'ꯄꯥꯏꯕ',
  flies: 'ꯄꯥꯏ',
  often: 'ꯀꯌꯥꯔꯛ',
  measured: 'ꯆꯥꯡ ꯌꯦꯡꯕ',
  cold: 'ꯑꯔꯤꯡꯕ',
  mechanical: 'ꯃꯦꯀꯥꯅꯤꯀꯦꯜ',
  indifference: 'ꯃꯤꯠꯌꯦꯡ ꯂꯩꯇꯕ',
  quartz: 'ꯀ꯭ꯋꯥꯔꯠꯖ',
  oscillator: 'ꯑꯣꯁꯤꯂꯦꯇꯔ',
  vibrating: 'ꯋꯥꯏꯕ꯭ꯔꯦꯇꯤꯡ',
  times: 'ꯃꯇꯝꯁꯤꯡ',
  per: 'ꯈꯨꯗꯤꯡꯒꯤ',
  cesium: 'ꯁꯤꯖꯤꯌꯝ',
  atomic: 'ꯑꯦꯇꯣꯃꯤꯛ',
  clock: 'ꯄꯨꯡ',
  registering: 'ꯔꯦꯖꯤꯁꯇꯔ ꯇꯧꯕ',
  transition: 'ꯍꯣꯡꯂꯛꯄ',
  frequencies: 'ꯐ꯭ꯔꯤꯛꯋꯦꯟꯁꯤꯁꯤꯡ',
  energy: 'ꯁꯛꯇꯤ',
  states: 'ꯐꯤꯚꯝꯁꯤꯡ',
  inhabited: 'ꯂꯩꯔꯛꯈꯤ',
  live: 'ꯍꯤꯡꯕ',
  inside: 'ꯃꯅꯨꯡꯗ',
  elastic: 'ꯏꯂꯥꯁꯇꯤꯛ',
  psychological: 'ꯋꯥꯈꯜꯂꯣꯟꯒꯤ',
  expands: 'ꯆꯥꯎꯈꯠꯄ',
  during: 'ꯃꯇꯝꯗ',
  intense: 'ꯀꯟꯅ',
  focus: 'ꯃꯤꯠꯌꯦꯡ',
  fear: 'ꯀꯤꯕ',
  evaporates: 'ꯃꯥꯡꯈꯤꯕ',
  periods: 'ꯃꯇꯝꯁꯤꯡ',
  routine: 'ꯅꯨꯃꯤꯠ ꯈꯨꯗꯤꯡꯒꯤ',
  arnold: 'ꯑꯥꯔꯅꯣꯜꯗ',
  cd: 'ꯁꯤꯗꯤ',
  st: 'ꯁꯦꯟꯠ',
  augustine: 'ꯑꯣꯒꯁ꯭ꯇꯤꯟ',
  confessions: 'ꯋꯥꯁꯛ',
  chronos: 'ꯈ꯭ꯔꯣꯅꯣꯁ',
  kairos: 'ꯀꯥꯏꯔꯣꯁ',
  greeks: 'ꯒ꯭ꯔꯤꯛꯁꯤꯡ',
  greek: 'ꯒ꯭ꯔꯤꯛ',
  distinct: 'ꯇꯣꯉꯥꯟꯕ',
  dimensions: 'ꯃꯥꯏꯀꯩꯁꯤꯡ',
  dimension: 'ꯃꯥꯏꯀꯩ',
  memory: 'ꯅꯤꯡꯁꯤꯡꯕ',
  emotional: 'ꯄꯨꯛꯅꯤꯡꯒꯤ',
  experience: 'ꯑꯦꯛꯁꯄꯔꯤꯌꯦꯟꯁ',
  experiences: 'ꯑꯦꯛꯁꯄꯔꯤꯌꯦꯟꯁꯁꯤꯡ',
  between: 'ꯃꯔꯛꯇ',
  from: 'ꯗꯒꯤ',
  to: 'ꯗ',
  in: 'ꯗ',
  of: 'ꯒꯤ',
  for: 'ꯒꯤꯗꯃꯛ',
  with: 'ꯒ ꯂꯣꯏꯅꯅ',
  the: 'ꯑꯗꯨ',
  and: 'ꯑꯃꯁꯨꯡ',
  is: 'ꯑꯣꯏ',
  are: 'ꯑꯣꯏꯔꯤ',
  we: 'ꯑꯩꯈꯣꯏ',
  you: 'ꯅꯍꯥꯛ',
  they: 'ꯃꯈꯣꯏ',
  he: 'ꯃꯍꯥꯛ',
  she: 'ꯃꯍꯥꯛ',
  it: 'ꯃꯁꯤ',
  this: 'ꯃꯁꯤ',
  that: 'ꯃꯗꯨ',
  what: 'ꯀꯔꯤ',
  when: 'ꯀꯗꯥꯏꯗ',
  where: 'ꯀꯗꯥꯏꯗ',
  who: 'ꯀꯅꯥ',
  how: 'ꯀꯔꯝꯅ',
  all: 'ꯄꯨꯝꯅꯃꯛ',
  no: 'ꯅꯠꯇꯦ',
  not: 'ꯅꯠꯇꯦ',
  yes: 'ꯍꯣꯏ',
  if: 'ꯀꯔꯤꯒꯨꯝꯕ',
  then: 'ꯑꯗꯨꯗꯤ',
  me: 'ꯑꯩꯉꯣꯟꯗ',
  my: 'ꯑꯩꯒꯤ',
  him: 'ꯃꯍꯥꯛꯄꯨ',
  his: 'ꯃꯍꯥꯛꯀꯤ',
  her: 'ꯃꯍꯥꯛꯀꯤ',
  one: 'ꯑꯃ',
  two: 'ꯑꯅꯤ',
  three: 'ꯑꯍꯨꯝ',
  four: 'ꯃꯔꯤ',
  five: 'ꯃꯉꯥ',
  six: 'ꯇꯔꯨꯛ',
  seven: 'ꯇꯔꯦꯠ',
  eight: 'ꯅꯤꯄꯥꯟ',
  nine: 'ꯃꯄꯥꯟ',
  ten: 'ꯇꯔꯥ',
  // Cheishing (Traditional Number System & Counting Scale)
  cheishing: 'ꯆꯩꯁꯤꯡ',
  thiba: 'ꯊꯤꯕ',
  ama: 'ꯑꯃ',
  ani: 'ꯑꯅꯤ',
  ahum: 'ꯑꯍꯨꯝ',
  mari: 'ꯃꯔꯤ',
  manga: 'ꯃꯉꯥ',
  taruk: 'ꯇꯔꯨꯛ',
  taret: 'ꯇꯔꯦꯠ',
  nipal: 'ꯅꯤꯄꯥꯜ',
  nipan: 'ꯅꯤꯄꯥꯟ',
  mapal: 'ꯃꯄꯥꯜ',
  mapan: 'ꯃꯄꯥꯟ',
  tara: 'ꯇꯔꯥ',
  cha: 'ꯆꯥ',
  hundred: 'ꯆꯥ',
  leeshing: 'ꯂꯤꯁꯤꯡ',
  thousand: 'ꯂꯤꯁꯤꯡ',
  leecha: 'ꯂꯤꯆꯥ',
  lakh: 'ꯂꯤꯆꯥ',
  leepun: 'ꯂꯤꯄꯨꯟ',
  crore: 'ꯂꯤꯄꯨꯟ',
  leepot: 'ꯂꯤꯄꯣꯠ',
  billion: 'ꯂꯤꯄꯣꯠ',
  leekei: 'ꯂꯤꯀꯩ',
  trillion: 'ꯂꯤꯀꯩ ꯇꯔꯥ',
  puu: 'ꯄꯨ',
  'puu ama': 'ꯄꯨ ꯑꯃ',

  // Months
  january: 'ꯖꯥꯅꯨꯋꯥꯔꯤ',
  february: 'ꯐꯦꯕ꯭ꯔꯨꯋꯥꯔꯤ',
  march: 'ꯃꯥꯔꯆ',
  april: 'ꯑꯦꯞꯔꯤꯜ',
  may: 'ꯃꯦ',
  june: 'ꯖꯨꯟ',
  july: 'ꯖꯨꯂꯥꯏ',
  august: 'ꯑꯣꯒꯁ꯭ꯠ',
  september: 'ꯁꯦꯞꯇꯦꯝꯕꯔ',
  october: 'ꯑꯣꯛꯇꯣꯕꯔ',
  november: 'ꯅꯣꯚꯦꯝꯕꯔ',
  december: 'ꯗꯤꯁꯦꯝꯕꯔ',
  // Days of week
  sunday: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ',
  monday: 'ꯅꯤꯡꯊꯧꯀꯥꯕ',
  tuesday: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ',
  wednesday: 'ꯌꯨꯝꯁꯀꯩꯁꯥ',
  thursday: 'ꯁꯒꯣꯜꯁꯦꯟ',
  friday: 'ꯏꯔꯥꯏ',
  saturday: 'ꯊꯥꯡꯖ',
};

const COMMON_PHONETIC_WORDS: Record<string, string> = {
  kangleipak: 'ꯀꯪꯂꯩꯄꯥꯛ',
  manipur: 'ꯃꯅꯤꯄꯨꯔ',
  meetei: 'ꯃꯤꯇꯩ',
  meitei: 'ꯃꯤꯇꯩ',
  mayek: 'ꯃꯌꯦꯛ',
  puya: 'ꯄꯨꯌꯥ',
  khunung: 'ꯈꯨꯅꯨꯡ',
  khamba: 'ꯈꯝꯕ',
  thoibi: 'ꯊꯣꯢꯕꯤ',
  nongda: 'ꯅꯣꯡꯗ',
  lairen: 'ꯂꯥꯢꯔꯦꯟ',
  pakhangba: 'ꯄꯥꯈꯪꯕ',
  sanahi: 'ꯁꯅꯥꯍꯤ',
  sanamahi: 'ꯁꯅꯥꯃꯍꯤ',
  leishemba: 'ꯂꯩꯁꯦꯝꯕ',
  ima: 'ꯏꯃꯥ',
  iba: 'ꯏꯕ',
  khurumjari: 'ꯈꯨꯔꯨꯝꯖꯔꯤ',
  thagatchari: 'ꯊꯥꯒꯠꯆꯔꯤ',
};

const GREEK_TRANSLITERATION: Record<string, string> = {
  // Common Greek philosophical terms
  'Χρόνος': 'ꯈ꯭ꯔꯣꯅꯣꯁ',
  'χρόνος': 'ꯈ꯭ꯔꯣꯅꯣꯁ',
  'Καιρός': 'ꯀꯥꯏꯔꯣꯁ',
  'καιρός': 'ꯀꯥꯏꯔꯣꯁ',
  // Greek Uppercase (e.g. Χ and Κ which look identical to Latin X and K)
  'Α': 'ꯑ', 'Β': 'ꯕ', 'Γ': 'ꯒ', 'Δ': 'ꯗ', 'Ε': 'ꯑꯦ',
  'Ζ': 'ꯖ', 'Η': 'ꯑꯦ', 'Θ': 'ꯊ', 'Ι': 'ꯏ', 'Κ': 'ꯀ',
  'Λ': 'ꯂ', 'Μ': 'ꯃ', 'Ν': 'ꯅ', 'Ξ': 'ꯛꯁ', 'Ο': 'ꯑꯣ',
  'Π': 'ꯄ', 'Ρ': 'ꯔ', 'Σ': 'ꯁ', 'Τ': 'ꯇ', 'Υ': 'ꯎ',
  'Φ': 'ꯐ', 'Χ': 'ꯈ', 'Ψ': 'ꯄꯁ', 'Ω': 'ꯑꯣ',
  // Greek Lowercase
  'α': 'ꯑ', 'β': 'ꯕ', 'γ': 'ꯒ', 'δ': 'ꯗ', 'ε': 'ꯑꯦ',
  'ζ': 'ꯖ', 'η': 'ꯑꯦ', 'θ': 'ꯊ', 'ι': 'ꯏ', 'κ': 'ꯀ',
  'λ': 'ꯂ', 'μ': 'ꯃ', 'ν': 'ꯅ', 'ξ': 'ꯛꯁ', 'ο': 'ꯑꯣ',
  'π': 'ꯄ', 'ρ': 'ꯔ', 'σ': 'ꯁ', 'ς': 'ꯁ', 'τ': 'ꯇ',
  'υ': 'ꯎ', 'φ': 'ꯐ', 'χ': 'ꯈ', 'ψ': 'ꯄꯁ', 'ω': 'ꯑꯣ',
  // Greek with accents / tonos / dialytika
  'ά': 'ꯑꯥ', 'έ': 'ꯑꯦ', 'ή': 'ꯑꯦ', 'ί': 'ꯏ', 'ό': 'ꯑꯣ',
  'ύ': 'ꯎ', 'ώ': 'ꯑꯣ', 'Ά': 'ꯑꯥ', 'Έ': 'ꯑꯦ', 'Ή': 'ꯑꯦ',
  'Ί': 'ꯏ', 'Ό': 'ꯑꯣ', 'Ύ': 'ꯎ', 'Ώ': 'ꯑꯣ',
  'ϊ': 'ꯏ', 'ϋ': 'ꯎ', 'ΐ': 'ꯏ', 'ΰ': 'ꯎ',
};

const MEETEI_DIGITS: [string, string][] = [
  ['0', '꯰'], ['1', '꯱'], ['2', '꯲'], ['3', '꯳'], ['4', '꯴'],
  ['5', '꯵'], ['6', '꯶'], ['7', '꯷'], ['8', '꯸'], ['9', '꯹'],
];

const LATIN_LETTER_FALLBACK: Record<string, string> = {
  a: 'ꯑ', b: 'ꯕ', c: 'ꯀ', d: 'ꯗ', e: 'ꯑꯦ', f: 'ꯐ',
  g: 'ꯒ', h: 'ꯍ', i: 'ꯏ', j: 'ꯖ', k: 'ꯀ', l: 'ꯂ',
  m: 'ꯃ', n: 'ꯅ', o: 'ꯑꯣ', p: 'ꯄ', q: 'ꯀ', r: 'ꯔ',
  s: 'ꯁ', t: 'ꯇ', u: 'ꯎ', v: 'ꯋ', w: 'ꯋ', x: 'ꯛꯁ',
  y: 'ꯌ', z: 'ꯖ',
};

function transliterateLatinWord(token: string): string {
  let word = token;
  for (const [grk, rep] of Object.entries(GREEK_TRANSLITERATION)) {
    word = word.split(grk).join(rep);
  }
  word = word.toLowerCase();

  const clusters: [string, string][] = [
    ['sch', 'ꯁ꯭ꯀ'],
    ['tch', 'ꯆ'],
    ['tion', 'ꯁꯟ'],
    ['sion', 'ꯁꯟ'],
    ['ight', 'ꯑꯥꯏꯠ'],
    ['ous', 'ꯑꯁ'],
    ['ing', 'ꯤꯡ'],
    ['all', 'ꯑꯣꯜ'],
    ['ell', 'ꯑꯦꯜ'],
    ['ill', 'ꯏꯜ'],
    ['ull', 'ꯎꯜ'],
    ['wh', 'ꯋ'],
    ['ck', 'ꯛ'],
    ['qu', 'ꯀ꯭ꯋ'],
    ['ph', 'ꯐ'],
    ['ch', 'ꯆ'],
    ['sh', 'ꯁ'],
    ['th', 'ꯊ'],
    ['dh', 'ꯙ'],
    ['gh', 'ꯘ'],
    ['jh', 'ꯓ'],
    ['bh', 'ꯚ'],
    ['kh', 'ꯈ'],
    ['ng', 'ꯉ'],
  ];

  for (const [pat, rep] of clusters) {
    word = word.split(pat).join(rep);
  }

  // Soft c before e, i, y -> Sam (ꯁ); hard c elsewhere -> Kok (ꯀ)
  word = word.replace(/c([eiy])/g, 'ꯁ$1');
  word = word.split('c').join('ꯀ');

  const consonants: [string, string][] = [
    ['k', 'ꯀ'], ['s', 'ꯁ'], ['l', 'ꯂ'], ['m', 'ꯃ'],
    ['p', 'ꯄ'], ['n', 'ꯅ'], ['t', 'ꯇ'], ['w', 'ꯋ'],
    ['y', 'ꯌ'], ['h', 'ꯍ'], ['g', 'ꯒ'], ['r', 'ꯔ'],
    ['b', 'ꯕ'], ['j', 'ꯖ'], ['d', 'ꯗ'], ['f', 'ꯐ'],
    ['v', 'ꯋ'], ['z', 'ꯖ'], ['x', 'ꯛꯁ'], ['q', 'ꯀ'],
  ];

  for (const [c, rep] of consonants) {
    word = word.split(c).join(rep);
  }

  // Initial independent vowels
  const initialVowels: [RegExp, string][] = [
    [/^aa/, 'ꯑꯥ'], [/^ee/, 'ꯏ'], [/^ei/, 'ꯑꯩ'], [/^ai/, 'ꯑꯩ'],
    [/^ou/, 'ꯑꯧ'], [/^au/, 'ꯑꯧ'], [/^oo/, 'ꯎ'],
    [/^a/, 'ꯑ'], [/^i/, 'ꯏ'], [/^u/, 'ꯎ'], [/^e/, 'ꯑꯦ'], [/^o/, 'ꯑꯣ'],
  ];

  for (const [re, rep] of initialVowels) {
    word = word.replace(re, rep);
  }

  // Dependent vowel signs (Cheitap)
  const dependentVowels: [string, string][] = [
    ['aa', 'ꯥ'], ['ee', 'ꯤ'], ['ei', 'ꯩ'], ['ai', 'ꯩ'],
    ['ou', 'ꯧ'], ['au', 'ꯧ'], ['oo', 'ꯨ'],
    ['a', 'ꯥ'], ['i', 'ꯤ'], ['u', 'ꯨ'], ['e', 'ꯦ'], ['o', 'ꯣ'],
  ];

  for (const [v, rep] of dependentVowels) {
    word = word.split(v).join(rep);
  }

  // Fallback pass: eliminate 100% of ANY remaining English alphabet letter
  let safeWord = '';
  for (const char of word) {
    safeWord += LATIN_LETTER_FALLBACK[char] || char;
  }

  return safeWord;
}

function cleanupOrphanedVowels(text: string): string {
  let clean = text;
  const pattern = /(^|[^ꯀ-ꯚꯎꯏꯑ])([ꯣ-ꯪ꯬])/g;
  while (pattern.test(clean)) {
    clean = clean.replace(pattern, '$1ꯑ$2');
  }

  clean = clean.split('ꯑꯤ').join('ꯏ');
  clean = clean.split('ꯑꯨ').join('ꯎ');
  return clean;
}

export function translateToMeeteiMayek(input: string): string {
  if (!input || !input.trim()) return '';

  let text = input;

  const containsBengali = /[ঀ-৿]/.test(text);
  if (containsBengali) {
    let result = '';
    for (const char of text) {
      result += BENGALI_TO_MEETEI_MAP[char] || char;
    }
    return cleanupOrphanedVowels(result);
  }

  for (const [latin, meetei] of Object.entries(COMMON_PHONETIC_WORDS)) {
    const regex = new RegExp(`\\b${latin}\\b`, 'gi');
    text = text.replace(regex, meetei);
  }

  for (const [grk, meetei] of Object.entries(GREEK_TRANSLITERATION)) {
    text = text.split(grk).join(meetei);
  }

  const tokens = text.split(/([a-zA-Z\u0370-\u03FF\u1F00-\u1FFF]+|[0-9]+)/);
  const convertedParts: string[] = [];

  for (const token of tokens) {
    if (!token) continue;

    if (/^[a-zA-Z\u0370-\u03FF\u1F00-\u1FFF]+$/.test(token)) {
      convertedParts.push(transliterateLatinWord(token));
    } else if (/^[0-9]+$/.test(token)) {
      let d = token;
      for (const [digit, meeteiDigit] of MEETEI_DIGITS) {
        d = d.split(digit).join(meeteiDigit);
      }
      convertedParts.push(d);
    } else {
      let p = token;
      p = p.replace(/\?/g, '꫱');
      p = p.replace(/,/g, '꫰');
      p = p.replace(/\./g, '꯫');
      convertedParts.push(p);
    }
  }

  return cleanupOrphanedVowels(convertedParts.join(''));
}

export function translateToMeeteiMayekWithVocab(input: string): string {
  if (!input) return '';

  let text = input;

  for (const [en, mni] of Object.entries(EXTENDED_VOCABULARY)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    text = text.replace(regex, mni);
  }

  return translateToMeeteiMayek(text);
}

export function translateMarkdownToMeeteiMayek(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  let inCodeBlock = false;
  const translatedLines: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      translatedLines.push(line);
      continue;
    }

    if (inCodeBlock) {
      translatedLines.push(line);
      continue;
    }

    if (!line.trim() || line.trim() === '---' || line.trim() === '***') {
      translatedLines.push(line);
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6}\s+)(.*)$/);
    if (headingMatch) {
      const hashes = headingMatch[1];
      const text = headingMatch[2];
      translatedLines.push(`${hashes}${translateTextSegments(text)}`);
      continue;
    }

    // Blockquote
    const quoteMatch = line.match(/^(\s*>\s*)(.*)$/);
    if (quoteMatch) {
      const quotePrefix = quoteMatch[1];
      const text = quoteMatch[2];
      translatedLines.push(`${quotePrefix}${translateTextSegments(text)}`);
      continue;
    }

    // List items
    const listMatch = line.match(/^(\s*[-*+]\s+|\s*\d+\.\s+)(.*)$/);
    if (listMatch) {
      const listPrefix = listMatch[1];
      const text = listMatch[2];
      translatedLines.push(`${listPrefix}${translateTextSegments(text)}`);
      continue;
    }

    // Table rows
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (/^\|\s*[-:]+[-|\s:]*\|$/.test(line.trim())) {
        translatedLines.push(line);
        continue;
      }
      const cells = line.split('|');
      const translatedCells = cells.map((cell, idx) => {
        if (idx === 0 || idx === cells.length - 1) return cell;
        return translateTextSegments(cell);
      });
      translatedLines.push(translatedCells.join('|'));
      continue;
    }

    // Paragraph text
    translatedLines.push(translateTextSegments(line));
  }

  return translatedLines.join('\n');
}

function translateTextSegments(text: string): string {
  const tokenRegex = /(!?\[.*?\]\(.*?\)|`[^`]+`|<[^>]+>)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part) => {
    // Images
    const imgMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const url = imgMatch[2];
      return `![${translateToMeeteiMayekWithVocab(alt)}](${url})`;
    }

    // Links
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const url = linkMatch[2];
      return `[${translateToMeeteiMayekWithVocab(label)}](${url})`;
    }

    // Code or HTML
    if (part.startsWith('`') || part.startsWith('<')) {
      return part;
    }

    return translateToMeeteiMayekWithVocab(part);
  }).join('');
}
