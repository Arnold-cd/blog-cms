/**
 * Meetei Mayek Translation & Transliteration Service
 * Reference: https://notofonts.github.io/meetei-mayek/ (Google Noto Sans Meetei Mayek)
 * Unicode Block: U+ABC0 - U+ABFF
 */

export interface MeeteiCharInfo {
  char: string;
  name: string;
  meaning: string;
  type: 'ipee' | 'lonsum' | 'cheitap' | 'numeral' | 'punctuation';
}

// The 18 Original Core Letters (Iyek Ipee) rooted in human anatomy
export const IYEK_IPEE: MeeteiCharInfo[] = [
  { char: 'ꯀ', name: 'Kok', meaning: 'Head (ꯀꯣꯛ)', type: 'ipee' },
  { char: 'ꯁ', name: 'Sam', meaning: 'Hair (ꯁꯝ)', type: 'ipee' },
  { char: 'ꯂ', name: 'Lai', meaning: 'Forehead (ꯂꯥꯢ)', type: 'ipee' },
  { char: 'ꯃ', name: 'Mit', meaning: 'Eye (ꯃꯤꯠ)', type: 'ipee' },
  { char: 'ꯄ', name: 'Pa', meaning: 'Eyebrow / Eyelash (ꯄꯥ)', type: 'ipee' },
  { char: 'ꯅ', name: 'Na', meaning: 'Ear (ꯅꯥ)', type: 'ipee' },
  { char: 'ꯆ', name: 'Chil', meaning: 'Lips (ꯆꯤꯜ)', type: 'ipee' },
  { char: 'ꯇ', name: 'Til', meaning: 'Saliva / Tongue (ꯇꯤꯜ)', type: 'ipee' },
  { char: 'ꯈ', name: 'Khou', meaning: 'Throat (ꯈꯧ)', type: 'ipee' },
  { char: 'ꯉ', name: 'Ngou', meaning: 'Uvula (ꯉꯧ)', type: 'ipee' },
  { char: 'ꯊ', name: 'Thou', meaning: 'Breast / Chest (ꯊꯧ)', type: 'ipee' },
  { char: 'ꯋ', name: 'Wai', meaning: 'Navel (ꯋꯥꯢ)', type: 'ipee' },
  { char: 'ꯌ', name: 'Yang', meaning: 'Spine (ꯌꯥꯡ)', type: 'ipee' },
  { char: 'ꯍ', name: 'Huk', meaning: 'Pelvis / Spine base (ꯍꯨꯛ)', type: 'ipee' },
  { char: 'ꯎ', name: 'Un', meaning: 'Skin (ꯎꯟ)', type: 'ipee' },
  { char: 'ꯏ', name: 'Ee', meaning: 'Blood (ꯏ)', type: 'ipee' },
  { char: 'ꯐ', name: 'Pham', meaning: 'Anus / Reproductive (ꯐꯝ)', type: 'ipee' },
  { char: 'ꯑ', name: 'Atiya', meaning: 'Sky / Cosmos (ꯑꯇꯤꯌꯥ)', type: 'ipee' },
];

// Additional Consonants
export const ADDITIONAL_IPEE: MeeteiCharInfo[] = [
  { char: 'ꯒ', name: 'Gok', meaning: 'G consonant', type: 'ipee' },
  { char: 'ꯓ', name: 'Jham', meaning: 'Jh consonant', type: 'ipee' },
  { char: 'ꯔ', name: 'Rai', meaning: 'R consonant', type: 'ipee' },
  { char: 'ꯕ', name: 'Ba', meaning: 'B consonant', type: 'ipee' },
  { char: 'ꯖ', name: 'Jil', meaning: 'J consonant', type: 'ipee' },
  { char: 'ꯗ', name: 'Dil', meaning: 'D consonant', type: 'ipee' },
  { char: 'ꯘ', name: 'Ghou', meaning: 'Gh consonant', type: 'ipee' },
  { char: 'ꯙ', name: 'Dhou', meaning: 'Dh consonant', type: 'ipee' },
  { char: 'ꯚ', name: 'Bham', meaning: 'Bh consonant', type: 'ipee' },
];

// Lonsum (Final dependent consonants)
export const LONSUM: MeeteiCharInfo[] = [
  { char: 'ꯛ', name: 'Kok Lonsum', meaning: 'Final k', type: 'lonsum' },
  { char: 'ꯜ', name: 'Lai Lonsum', meaning: 'Final l', type: 'lonsum' },
  { char: 'ꯝ', name: 'Mit Lonsum', meaning: 'Final m', type: 'lonsum' },
  { char: 'ꯞ', name: 'Pa Lonsum', meaning: 'Final p', type: 'lonsum' },
  { char: 'ꯟ', name: 'Na Lonsum', meaning: 'Final n', type: 'lonsum' },
  { char: 'ꯠ', name: 'Til Lonsum', meaning: 'Final t', type: 'lonsum' },
  { char: 'ꯡ', name: 'Ngou Lonsum', meaning: 'Final ng', type: 'lonsum' },
  { char: 'ꯢ', name: 'I Lonsum', meaning: 'Final i', type: 'lonsum' },
];

// Chetap (Vowel signs)
export const CHEITAP: MeeteiCharInfo[] = [
  { char: 'ꯥ', name: 'Aa-nap', meaning: 'Vowel aa', type: 'cheitap' },
  { char: 'ꯤ', name: 'I-nap', meaning: 'Vowel i', type: 'cheitap' },
  { char: 'ꯨ', name: 'U-nap', meaning: 'Vowel u', type: 'cheitap' },
  { char: 'ꯦ', name: 'Yenap', meaning: 'Vowel e', type: 'cheitap' },
  { char: 'ꯣ', name: 'O-nap', meaning: 'Vowel o', type: 'cheitap' },
  { char: 'ꯧ', name: 'Sou-nap', meaning: 'Vowel ou', type: 'cheitap' },
  { char: 'ꯩ', name: 'Chei-nap', meaning: 'Vowel ei', type: 'cheitap' },
  { char: 'ꯪ', name: 'Nung', meaning: 'Anusvara (ng)', type: 'cheitap' },
  { char: '꯫', name: 'Cheikhei', meaning: 'Full stop (।)', type: 'punctuation' },
  { char: '꯭', name: 'Apun Iyek', meaning: 'Virama / Conjunct', type: 'punctuation' },
];

// Meetei Mayek Numerals
export const NUMERALS: MeeteiCharInfo[] = [
  { char: '꯰', name: 'Zero', meaning: '0', type: 'numeral' },
  { char: '꯱', name: 'One', meaning: '1', type: 'numeral' },
  { char: '꯲', name: 'Two', meaning: '2', type: 'numeral' },
  { char: '꯳', name: 'Three', meaning: '3', type: 'numeral' },
  { char: '꯴', name: 'Four', meaning: '4', type: 'numeral' },
  { char: '꯵', name: 'Five', meaning: '5', type: 'numeral' },
  { char: '꯶', name: 'Six', meaning: '6', type: 'numeral' },
  { char: '꯷', name: 'Seven', meaning: '7', type: 'numeral' },
  { char: '꯸', name: 'Eight', meaning: '8', type: 'numeral' },
  { char: '꯹', name: 'Nine', meaning: '9', type: 'numeral' },
];

/**
 * Bengali script to Meetei Mayek script converter
 * Crucial for Manipuri literature printed in Bengali script during 1700-2000.
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
  '০': '꯰', '১': '꯱', '২': '꯲', '৩': '꯳', '৪': '꯴',
  '৫': '꯵', '৬': '꯶', '৭': '꯷', '৮': '꯸', '৯': '꯹',
};

/**
 * Phonetic Latin/English to Meetei Mayek word dictionary & syllabic mapping
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

  // 3. Syllable & character phonetic rules for remaining words
  const PHONETIC_CONSONANTS: [string, string][] = [
    ['kh', 'ꯈ'], ['gh', 'ꯘ'], ['ch', 'ꯆ'], ['jh', 'ꯓ'],
    ['th', 'ꯊ'], ['dh', 'ꯙ'], ['ph', 'ꯐ'], ['bh', 'ꯚ'],
    ['ng', 'ꯉ'], ['sh', 'ꯁ'],
    ['k', 'ꯀ'], ['s', 'ꯁ'], ['l', 'ꯂ'], ['m', 'ꯃ'],
    ['p', 'ꯄ'], ['n', 'ꯅ'], ['t', 'ꯇ'], ['w', 'ꯋ'],
    ['y', 'ꯌ'], ['h', 'ꯍ'], ['g', 'ꯒ'], ['r', 'ꯔ'],
    ['b', 'ꯕ'], ['j', 'ꯖ'], ['d', 'ꯗ'],
  ];

  // Digit transliteration
  const DIGITS: [string, string][] = [
    ['0', '꯰'], ['1', '꯱'], ['2', '꯲'], ['3', '꯳'], ['4', '꯴'],
    ['5', '꯵'], ['6', '꯶'], ['7', '꯷'], ['8', '꯸'], ['9', '꯹'],
  ];

  let converted = '';
  const tokens = text.split(/(\s+|[.,!?;:()[\]{}'"])/);

  for (const token of tokens) {
    // If already converted or punctuation
    if (/^[\s.,!?;:()[\]{}'"]+$/.test(token) || /[\uABC0-\uABFF]/.test(token)) {
      converted += token;
      continue;
    }

    let word = token.toLowerCase();

    // Digits
    for (const [d, m] of DIGITS) {
      word = word.split(d).join(m);
    }

    // Replace vowels and combinations
    word = word.replace(/kangleipak/g, 'ꯀꯪꯂꯩꯄꯥꯛ');
    word = word.replace(/manipur/g, 'ꯃꯅꯤꯄꯨꯔ');
    word = word.replace(/meetei/g, 'ꯃꯤꯇꯩ');
    word = word.replace(/puya/g, 'ꯄꯨꯌꯥ');

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
