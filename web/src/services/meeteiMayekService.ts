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
}

// 1. Core 18 Anatomical Letters (Iyek Ipee) - U+ABC0 to U+ABD1
export const CORE_18_IPEE: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABC0', char: 'ꯀ', name: 'Kok', meaning: 'Head (ꯀꯣꯛ)', category: 'core18' },
  { codePoint: 'U+ABC1', char: 'ꯁ', name: 'Sam', meaning: 'Hair (ꯁꯝ)', category: 'core18' },
  { codePoint: 'U+ABC2', char: 'ꯂ', name: 'Lai', meaning: 'Forehead (ꯂꯥꯢ)', category: 'core18' },
  { codePoint: 'U+ABC3', char: 'ꯃ', name: 'Mit', meaning: 'Eye (ꯃꯤꯠ)', category: 'core18' },
  { codePoint: 'U+ABC4', char: 'ꯄ', name: 'Pa', meaning: 'Eyebrow / Eyelash (ꯄꯥ)', category: 'core18' },
  { codePoint: 'U+ABC5', char: 'ꯅ', name: 'Na', meaning: 'Ear (ꯅꯥ)', category: 'core18' },
  { codePoint: 'U+ABC6', char: 'ꯆ', name: 'Chil', meaning: 'Lips (ꯆꯤꯜ)', category: 'core18' },
  { codePoint: 'U+ABC7', char: 'ꯇ', name: 'Til', meaning: 'Saliva / Tongue (ꯇꯤꯜ)', category: 'core18' },
  { codePoint: 'U+ABC8', char: 'ꯈ', name: 'Khou', meaning: 'Throat (ꯈꯧ)', category: 'core18' },
  { codePoint: 'U+ABC9', char: 'ꯉ', name: 'Ngou', meaning: 'Uvula / Neck (ꯉꯧ)', category: 'core18' },
  { codePoint: 'U+ABCA', char: 'ꯊ', name: 'Thou', meaning: 'Chest / Breast (ꯊꯧ)', category: 'core18' },
  { codePoint: 'U+ABCB', char: 'ꯋ', name: 'Wai', meaning: 'Navel (ꯋꯥꯢ)', category: 'core18' },
  { codePoint: 'U+ABCC', char: 'ꯌ', name: 'Yang', meaning: 'Spine (ꯌꯥꯡ)', category: 'core18' },
  { codePoint: 'U+ABCD', char: 'ꯍ', name: 'Huk', meaning: 'Pelvis / Spine base (ꯍꯨꯛ)', category: 'core18' },
  { codePoint: 'U+ABCE', char: 'ꯎ', name: 'Un', meaning: 'Skin (ꯎꯟ)', category: 'core18' },
  { codePoint: 'U+ABCF', char: 'ꯏ', name: 'I', meaning: 'Blood (ꯏ)', category: 'core18' },
  { codePoint: 'U+ABD0', char: 'ꯐ', name: 'Pham', meaning: 'Anus / Reproductive (ꯐꝝ)', category: 'core18' },
  { codePoint: 'U+ABD1', char: 'ꯑ', name: 'Atiya', meaning: 'Sky / Cosmos (ꯑꯇꯤꯌꯥ)', category: 'core18' },
];

// 2. Additional 9 Consonants - U+ABD2 to U+ABDA
export const ADDITIONAL_9_CONSONANTS: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABD2', char: 'ꯒ', name: 'Gok', meaning: 'Voiced velar /g/', category: 'consonant9' },
  { codePoint: 'U+ABD3', char: 'ꯓ', name: 'Jham', meaning: 'Voiced aspirate /jh/', category: 'consonant9' },
  { codePoint: 'U+ABD4', char: 'ꯔ', name: 'Rai', meaning: 'Alveolar liquid /r/', category: 'consonant9' },
  { codePoint: 'U+ABD5', char: 'ꯕ', name: 'Ba', meaning: 'Voiced bilabial /b/', category: 'consonant9' },
  { codePoint: 'U+ABD6', char: 'ꯖ', name: 'Jil', meaning: 'Voiced palatal /j/', category: 'consonant9' },
  { codePoint: 'U+ABD7', char: 'ꯗ', name: 'Dil', meaning: 'Voiced dental /d/', category: 'consonant9' },
  { codePoint: 'U+ABD8', char: 'ꯘ', name: 'Ghou', meaning: 'Voiced aspirate /gh/', category: 'consonant9' },
  { codePoint: 'U+ABD9', char: 'ꯙ', name: 'Dhou', meaning: 'Voiced aspirate /dh/', category: 'consonant9' },
  { codePoint: 'U+ABDA', char: 'ꯚ', name: 'Bham', meaning: 'Voiced aspirate /bh/', category: 'consonant9' },
];

// All 27 Modern Alphabets (18 Core + 9 Additional)
export const ALL_27_MAIN_LETTERS = [...CORE_18_IPEE, ...ADDITIONAL_9_CONSONANTS];

// 3. 8 Dependent Final Consonants (Lonsum) - U+ABDB to U+ABE2
export const LONSUM_8: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABDB', char: 'ꯛ', name: 'Kok Lonsum', meaning: 'Final -k', category: 'lonsum' },
  { codePoint: 'U+ABDC', char: 'ꯜ', name: 'Lai Lonsum', meaning: 'Final -l', category: 'lonsum' },
  { codePoint: 'U+ABDD', char: 'ꯝ', name: 'Mit Lonsum', meaning: 'Final -m', category: 'lonsum' },
  { codePoint: 'U+ABDE', char: 'ꯞ', name: 'Pa Lonsum', meaning: 'Final -p', category: 'lonsum' },
  { codePoint: 'U+ABDF', char: 'ꯟ', name: 'Na Lonsum', meaning: 'Final -n', category: 'lonsum' },
  { codePoint: 'U+ABE0', char: 'ꯠ', name: 'Til Lonsum', meaning: 'Final -t', category: 'lonsum' },
  { codePoint: 'U+ABE1', char: 'ꯡ', name: 'Ngou Lonsum', meaning: 'Final -ng', category: 'lonsum' },
  { codePoint: 'U+ABE2', char: 'ꯢ', name: 'I Lonsum', meaning: 'Final -i', category: 'lonsum' },
];

// 4. 8 Dependent Vowel Diacritics (Cheitap) - U+ABE3 to U+ABEA
export const CHEITAP_8: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABE3', char: 'ꯣ', name: 'Onap', meaning: 'Vowel sign -o', category: 'cheitap' },
  { codePoint: 'U+ABE4', char: 'ꯤ', name: 'Inap', meaning: 'Vowel sign -i', category: 'cheitap' },
  { codePoint: 'U+ABE5', char: 'ꯥ', name: 'Anap', meaning: 'Vowel sign -aa', category: 'cheitap' },
  { codePoint: 'U+ABE6', char: 'ꯦ', name: 'Yenap', meaning: 'Vowel sign -e', category: 'cheitap' },
  { codePoint: 'U+ABE7', char: 'ꯧ', name: 'Sounap', meaning: 'Vowel sign -ou', category: 'cheitap' },
  { codePoint: 'U+ABE8', char: 'ꯨ', name: 'Unap', meaning: 'Vowel sign -u', category: 'cheitap' },
  { codePoint: 'U+ABE9', char: 'ꯩ', name: 'Cheinap', meaning: 'Vowel sign -ei', category: 'cheitap' },
  { codePoint: 'U+ABEA', char: 'ꯪ', name: 'Nung', meaning: 'Anusvara nasal sign', category: 'cheitap' },
];

// 5. 3 Special Marks & Punctuation - U+ABEB to U+ABED
export const SPECIAL_MARKS_3: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABEB', char: '꯫', name: 'Cheikhei', meaning: 'Sentence terminal / Full stop', category: 'special' },
  { codePoint: 'U+ABEC', char: '꯬', name: 'Lum Iyek', meaning: 'Heavy falling tone marker', category: 'special' },
  { codePoint: 'U+ABED', char: '꯭', name: 'Apun Iyek', meaning: 'Virama / Conjunct underline', category: 'special' },
];

// 6. 10 Digits - U+ABF0 to U+ABF9
export const NUMERALS_10: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABF0', char: '꯰', name: 'Phun (0)', meaning: 'Zero', category: 'numeral' },
  { codePoint: 'U+ABF1', char: '꯱', name: 'Ama (1)', meaning: 'One', category: 'numeral' },
  { codePoint: 'U+ABF2', char: '꯲', name: 'Ani (2)', meaning: 'Two', category: 'numeral' },
  { codePoint: 'U+ABF3', char: '꯳', name: 'Ahum (3)', meaning: 'Three', category: 'numeral' },
  { codePoint: 'U+ABF4', char: '꯴', name: 'Mari (4)', meaning: 'Four', category: 'numeral' },
  { codePoint: 'U+ABF5', char: '꯵', name: 'Manga (5)', meaning: 'Five', category: 'numeral' },
  { codePoint: 'U+ABF6', char: '꯶', name: 'Taruk (6)', meaning: 'Six', category: 'numeral' },
  { codePoint: 'U+ABF7', char: '꯷', name: 'Taret (7)', meaning: 'Seven', category: 'numeral' },
  { codePoint: 'U+ABF8', char: '꯸', name: 'Nipan (8)', meaning: 'Eight', category: 'numeral' },
  { codePoint: 'U+ABF9', char: '꯹', name: 'Mapan (9)', meaning: 'Nine', category: 'numeral' },
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
  minute: 'ꯃꯤꯅꯤꯠ',
  minutes: 'ꯃꯤꯅꯤꯠ',
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
  the: 'ꯑꯗꯨ',
  and: 'ꯑꯃꯁꯨꯡ',
  is: 'ꯑꯣꯏ',
  are: 'ꯑꯣꯏꯔꯤ',
  of: 'ꯒꯤ',
  in: 'ꯗ',
  for: 'ꯒꯤꯗꯃꯛ',
  with: 'ꯒ ꯂꯣꯏꯅꯅ',
};

/**
 * Phonetic transliteration dictionary for Manipuri names & terms
 */
const COMMON_PHONETIC_WORDS: Record<string, string> = {
  kangleipak: 'ꯀꯪꯂꯩꯄꯥꯛ',
  manipur: 'ꯃꯅꯤꯄꯨꯔ',
  meetei: 'ꯃꯤꯇꯩ',
  meitei: 'ꯃꯤꯇꯩ',
  mayek: 'ꯃꯌꯦꯛ',
  puya: 'ꯄꯨꯌꯥ',
  khunung: 'ꯈꯨꯅꯨꯡ',
  iyek: 'ꯏꯌꯦꯛ',
  ipee: 'ꯏꯄꯤ',
  lonsum: 'ꯂꯣꯟꯁꯨꯝ',
  cheitap: 'ꯆꯩꯇꯥꯞ',
  wakhal: 'ꯋꯥꯈꯜ',
  wakhalon: 'ꯋꯥꯈꯜꯂꯣꯟ',
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

/**
 * Translate / Transliterate text from Latin or Bengali into Meetei Mayek Unicode
 */
export function translateToMeeteiMayek(input: string): string {
  if (!input || !input.trim()) return '';

  let text = input;

  // 1. Check if input contains Bengali characters
  const containsBengali = /[\u0980-\u09FF]/.test(text);
  if (containsBengali) {
    let result = '';
    for (const char of text) {
      result += BENGALI_TO_MEETEI_MAP[char] || char;
    }
    return result;
  }

  // 2. Latin word-level transliteration for common Manipuri vocabulary
  for (const [latin, meetei] of Object.entries(COMMON_PHONETIC_WORDS)) {
    const regex = new RegExp(`\\b${latin}\\b`, 'gi');
    text = text.replace(regex, meetei);
  }

  // 3. Phonetic mapping
  const PHONETIC_CONSONANTS: [string, string][] = [
    ['kh', 'ꯈ'], ['gh', 'ꯘ'], ['ch', 'ꯆ'], ['jh', 'ꯓ'],
    ['th', 'ꯊ'], ['dh', 'ꯙ'], ['ph', 'ꯐ'], ['bh', 'ꯚ'],
    ['ng', 'ꯉ'], ['sh', 'ꯁ'],
    ['k', 'ꯀ'], ['s', 'ꯁ'], ['l', 'ꯂ'], ['m', 'ꯃ'],
    ['p', 'ꯄ'], ['n', 'ꯅ'], ['t', 'ꯇ'], ['w', 'ꯋ'],
    ['y', 'ꯌ'], ['h', 'ꯍ'], ['g', 'ꯒ'], ['r', 'ꯔ'],
    ['b', 'ꯕ'], ['j', 'ꯖ'], ['d', 'ꯗ'],
  ];

  // Digit transliteration U+ABF0 - U+ABF9
  const DIGITS: [string, string][] = [
    ['0', '꯰'], ['1', '꯱'], ['2', '꯲'], ['3', '꯳'], ['4', '꯴'],
    ['5', '꯵'], ['6', '꯶'], ['7', '꯷'], ['8', '꯸'], ['9', '꯹'],
  ];

  let converted = '';
  const tokens = text.split(/(\s+|[.,!?;:()[\]{}'"])/);

  for (const token of tokens) {
    if (/^[\s.,!?;:()[\]{}'"]+$/.test(token) || /[\uABC0-\uABFF\uAAE0-\uAAFF]/.test(token)) {
      // Convert standard punctuation to Meetei Mayek Unicode punctuation
      let p = token;
      p = p.replace(/\?/g, '꫱'); // U+AAF1 Ahang Khudam (Question mark)
      p = p.replace(/,/g, '꫰');  // U+AAF0 Cheikhan (Single danda)
      p = p.replace(/\./g, '꯫');  // U+ABEB Cheikhei (Full stop)
      converted += p;
      continue;
    }

    let word = token.toLowerCase();

    // Digits
    for (const [d, m] of DIGITS) {
      word = word.split(d).join(m);
    }

    // Phonetic replacements
    for (const [c, m] of PHONETIC_CONSONANTS) {
      word = word.split(c).join(m);
    }

    // Vowel markers
    word = word.replace(/aa/g, 'ꯥ');
    word = word.replace(/ee/g, 'ꯤ');
    word = word.replace(/ei/g, 'ꯩ');
    word = word.replace(/ou/g, 'ꯧ');
    word = word.replace(/oo/g, 'ꯨ');
    word = word.replace(/a/g, 'ꯥ');
    word = word.replace(/i/g, 'ꯤ');
    word = word.replace(/u/g, 'ꯨ');
    word = word.replace(/e/g, 'ꯦ');
    word = word.replace(/o/g, 'ꯣ');

    converted += word;
  }

  return converted;
}

/**
 * Translates text applying extended vocabulary and punctuation conversion
 */
export function translateToMeeteiMayekWithVocab(input: string): string {
  if (!input) return '';

  let text = input;

  // Apply extended vocabulary replacements
  for (const [en, mni] of Object.entries(EXTENDED_VOCABULARY)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    text = text.replace(regex, mni);
  }

  // Core transliteration with Unicode punctuation (꫱, ꫰, ꯫)
  return translateToMeeteiMayek(text);
}

/**
 * Translates a complete Markdown document into Meetei Mayek while preserving:
 * - Code blocks (``` ... ``` and inline `code`)
 * - Images (![alt](url) -> ![translated_alt](url))
 * - Links ([text](url) -> [translated_text](url))
 * - HTML tags (<...>)
 * - Table pipes and markdown formatting marks (#, >, *, -, etc.)
 */
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

/**
 * Translates segments of text preserving markdown markup
 */
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
