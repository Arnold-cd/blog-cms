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
  { meeteiWord: 'ꯇꯂꯥ', digits: '꯱꯰', romanName: 'Tala', value: '10', meaning: 'Ten (Canonical Tala)' },
  { meeteiWord: 'ꯆꯥ', digits: '꯱꯰꯰', romanName: 'Cha', value: '100', meaning: 'Hundred' },
  { meeteiWord: 'ꯂꯤꯁꯤꯡ', digits: '꯱꯰꯰꯰', romanName: 'Lishing', value: '1,000', meaning: 'Thousand' },
  { meeteiWord: 'ꯂꯤꯁꯤꯡ ꯇꯂꯥ', digits: '꯱꯰꯰꯰꯰', romanName: 'Lishing Tala', value: '10,000', meaning: 'Ten Thousand' },
  { meeteiWord: 'ꯂꯤꯆꯥ', digits: '꯱꯰꯰꯰꯰꯰', romanName: 'Licha', value: '100,000', meaning: 'One Lakh (Hundred Thousand)' },
  { meeteiWord: 'ꯂꯤꯆꯥ ꯇꯂꯥ', digits: '꯱꯰꯰꯰꯰꯰꯰', romanName: 'Licha Tala', value: '1,000,000', meaning: 'Ten Lakhs (One Million)' },
  { meeteiWord: 'ꯂꯤꯄꯨꯟ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰', romanName: 'Lipun', value: '10,000,000', meaning: 'One Crore (Ten Million)' },
  { meeteiWord: 'ꯂꯤꯄꯨꯟ ꯇꯂꯥ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Lipun Tala', value: '100,000,000', meaning: 'Ten Crores (Hundred Million)' },
  { meeteiWord: 'ꯂꯤꯄꯣꯛ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Lipok', value: '1,000,000,000', meaning: 'One Billion (Lipok)' },
  { meeteiWord: 'ꯂꯤꯄꯣꯛ ꯇꯂꯥ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Lipok Tala', value: '10,000,000,000', meaning: 'Ten Billions' },
  { meeteiWord: 'ꯂꯤꯀꯩ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Likei', value: '100,000,000,000', meaning: 'Hundred Billions' },
  { meeteiWord: 'ꯂꯤꯀꯩ ꯇꯂꯥ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Likei Tala', value: '1,000,000,000,000', meaning: 'One Trillion' },
  { meeteiWord: 'ꯄꯨ ꯑꯃ', digits: '꯱꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰꯰', romanName: 'Puu Ama', value: '10,000,000,000,000', meaning: 'Ten Trillions' },
];

// 1. Core 18 Anatomical Letters (Iyek Ipee / Eepi-eeyek 18) - Canonical Wakoklon Puya
export const CORE_18_IPEE: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABC0', char: 'ꯀ', name: 'Kok', meaning: 'Head (ꯀꯣꯛ)', category: 'core18', ipa: '[kɔk]', latin: 'k' },
  { codePoint: 'U+ABC1', char: 'ꯁ', name: 'Sam', meaning: 'Hair (ꯁꯝ)', category: 'core18', ipa: '[səm]', latin: 's' },
  { codePoint: 'U+ABC2', char: 'ꯂ', name: 'Lai', meaning: 'Forehead (ꯂꯥꯢ)', category: 'core18', ipa: '[lai]', latin: 'l' },
  { codePoint: 'U+ABC3', char: 'ꯃ', name: 'Meet', meaning: 'Eye (ꯃꯤꯠ, Canonical Puya: Meet)', category: 'core18', ipa: '[mit]', latin: 'm' },
  { codePoint: 'U+ABC4', char: 'ꯄ', name: 'Paa', meaning: 'Eyebrow / Eyelash (ꯄꯥ, Canonical Puya: Paa)', category: 'core18', ipa: '[pa]', latin: 'p' },
  { codePoint: 'U+ABC5', char: 'ꯅ', name: 'Naa', meaning: 'Ear (ꯅꯥ, Canonical Puya: Naa)', category: 'core18', ipa: '[na]', latin: 'n' },
  { codePoint: 'U+ABC6', char: 'ꯆ', name: 'Chil', meaning: 'Lips (ꯆꯤꯜ)', category: 'core18', ipa: '[tʃil]', latin: 'ch' },
  { codePoint: 'U+ABC7', char: 'ꯇ', name: 'Til', meaning: 'Saliva / Tongue (ꯇꯤꯜ)', category: 'core18', ipa: '[til]', latin: 't' },
  { codePoint: 'U+ABC8', char: 'ꯈ', name: 'Khou', meaning: 'Throat (ꯈꯧ)', category: 'core18', ipa: '[kʰəw]', latin: 'kh' },
  { codePoint: 'U+ABC9', char: 'ꯉ', name: 'Ngou', meaning: 'Uvula / Neck (ꯉꯧ)', category: 'core18', ipa: '[ŋəw]', latin: 'ng' },
  { codePoint: 'U+ABCA', char: 'ꯊ', name: 'Thou', meaning: 'Chest / Breast (ꯊꯧ)', category: 'core18', ipa: '[tʰəw]', latin: 'th' },
  { codePoint: 'U+ABCB', char: 'ꯋ', name: 'Wai', meaning: 'Navel (ꯋꯥꯢ)', category: 'core18', ipa: '[wai]', latin: 'w / v' },
  { codePoint: 'U+ABCC', char: 'ꯌ', name: 'Yang', meaning: 'Spine (ꯌꯥꯡ)', category: 'core18', ipa: '[jaŋ]', latin: 'y' },
  { codePoint: 'U+ABCD', char: 'ꯍ', name: 'Huk', meaning: 'Pelvis / Spine base (ꯍꯨꯛ)', category: 'core18', ipa: '[huk]', latin: 'h' },
  { codePoint: 'U+ABCE', char: 'ꯎ', name: 'Oon', meaning: 'Skin (ꯎꯟ, Canonical Puya: Oon)', category: 'core18', ipa: '[un]', latin: 'u / u:' },
  { codePoint: 'U+ABCF', char: 'ꯏ', name: 'Ee', meaning: 'Blood (ꯏ, Canonical Puya: Ee)', category: 'core18', ipa: '[i]', latin: 'i / i:' },
  { codePoint: 'U+ABD0', char: 'ꯐ', name: 'Pham', meaning: 'Anus / Reproductive (ꯐꝝ)', category: 'core18', ipa: '[pʰəm]', latin: 'ph / f' },
  { codePoint: 'U+ABD1', char: 'ꯑ', name: 'Atingaa', meaning: 'Sky / Cosmos (ꯑꯇꯤꯡꯑꯥ, Canonical Puya: Atingaa)', category: 'core18', ipa: '[ətija]', latin: 'a' },
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

// All 35 Letters (27 Main Letters + 8 Lonsum Letters) capable of taking Cheitap diacritics
export const ALL_LETTERS_MAIN_AND_LONSUM: MeeteiUnicodeChar[] = [...ALL_27_MAIN_LETTERS, ...LONSUM_8];

// 4. 8 Dependent Vowel Diacritics (Cheitap Eeyek) - Official Unicode U+ABE3 to U+ABEA
export const CHEITAP_8: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABE5', char: 'ꯥ', name: 'aa-tap', meaning: 'Vowel sign -aa (e.g. ꯀꯥ = ka)', category: 'cheitap', ipa: '/a/', latin: 'ā / aa' },
  { codePoint: 'U+ABE4', char: 'ꯤ', name: 'ee-nap', meaning: 'Vowel sign -i / -ee (e.g. ꯀꯤ = ki)', category: 'cheitap', ipa: '/i/', latin: 'i / ee' },
  { codePoint: 'U+ABE8', char: 'ꯨ', name: "uu-nap", meaning: 'Vowel sign -u / -uu (e.g. ꯀꯨ = ku)', category: 'cheitap', ipa: '/u/', latin: 'u / uu' },
  { codePoint: 'U+ABE6', char: 'ꯦ', name: 'yet-nap', meaning: 'Vowel sign -e (e.g. ꯀꯦ = ke)', category: 'cheitap', ipa: '/e/', latin: 'e' },
  { codePoint: 'U+ABE3', char: 'ꯣ', name: 'ot-nap', meaning: 'Vowel sign -o (e.g. ꯀꯣ = ko)', category: 'cheitap', ipa: '/o/', latin: 'o' },
  { codePoint: 'U+ABE9', char: 'ꯩ', name: 'chei-nap', meaning: 'Vowel sign -ei / -ai (e.g. ꯀꯩ = kei)', category: 'cheitap', ipa: '/ej/ or /ai/', latin: 'ei / ai' },
  { codePoint: 'U+ABE7', char: 'ꯧ', name: 'sou-nap', meaning: 'Vowel sign -ou / -au (e.g. ꯀꯧ = kou)', category: 'cheitap', ipa: '/ew/ or /ou/', latin: 'ou / au' },
  { codePoint: 'U+ABEA', char: 'ꯪ', name: 'nung', meaning: 'Anusvara nasal sign -ng (e.g. ꯀꯪ = kang)', category: 'cheitap', ipa: '/əŋ/', latin: 'ng' },
];

/**
 * Seven Independent Vowel Letters of Meitei Mayek
 * Based on official Unicode and Meitei orthography standard:
 * Includes 〈ꯑ〉 which is used as the default vowel carrier.
 */
export interface IndependentVowel {
  char: string;
  name: string;
  carrier: string;
  ipa: string;
  latin: string;
  description: string;
  components: string;
  example: string;
  exampleMeaning: string;
}

export const INDEPENDENT_VOWELS_7: IndependentVowel[] = [
  {
    char: 'ꯑ',
    name: 'Atiya (Carrier)',
    carrier: 'Default Vowel Carrier',
    ipa: '/ə/',
    latin: 'a / ə',
    description: 'Base vowel /ə/ and universal carrier for compound vowels',
    components: 'Letter Atiya (U+ABCE)',
    example: 'ꯑꯃ (ama)',
    exampleMeaning: 'one',
  },
  {
    char: 'ꯏ',
    name: 'I',
    carrier: 'Independent letter',
    ipa: '/i/',
    latin: 'i',
    description: 'Independent vowel I (used word-initially or in vowel hiatus)',
    components: 'Letter I (U+ABCF)',
    example: 'ꯏꯃꯥ (ima)',
    exampleMeaning: 'mother',
  },
  {
    char: 'ꯎ',
    name: 'U',
    carrier: 'Independent letter',
    ipa: '/u/',
    latin: 'u',
    description: 'Independent vowel U (used word-initially or in vowel hiatus)',
    components: 'Letter U (U+ABD0)',
    example: 'ꯎꯆꯦꯛ (uchek)',
    exampleMeaning: 'bird',
  },
  {
    char: 'ꯑꯣ',
    name: 'O',
    carrier: 'Carrier + Ot-nap',
    ipa: '/o/',
    latin: 'o',
    description: 'Independent vowel O formed with carrier Atiya + Ot-nap',
    components: 'ꯑ (U+ABCE) + ꯣ (U+ABE3)',
    example: 'ꯑꯣꯏꯅ (oina) / ꯑꯣꯖꯥ (oja)',
    exampleMeaning: 'like, left / teacher',
  },
  {
    char: 'ꯑꯦ',
    name: 'E',
    carrier: 'Carrier + Yet-nap',
    ipa: '/e/',
    latin: 'e',
    description: 'Independent vowel E formed with carrier Atiya + Yet-nap',
    components: 'ꯑ (U+ABCE) + ꯦ (U+ABE6)',
    example: 'ꯑꯦꯞꯔꯤꯜ (april)',
    exampleMeaning: 'April',
  },
  {
    char: 'ꯑꯧ',
    name: 'OU / AU',
    carrier: 'Carrier + Sou-nap',
    ipa: '/ou/ or /ew/',
    latin: 'ou / au',
    description: 'Independent diphthong OU/AU formed with carrier Atiya + Sou-nap',
    components: 'ꯑ (U+ABCE) + ꯧ (U+ABE7)',
    example: 'ꯑꯧꯔꯥꯡꯕ (aurangba)',
    exampleMeaning: 'bright',
  },
  {
    char: 'ꯑꯩ',
    name: 'AI / EI',
    carrier: 'Carrier + Chei-nap',
    ipa: '/ai/ or /ej/',
    latin: 'ai / ei',
    description: 'Independent diphthong AI/EI formed with carrier Atiya + Chei-nap',
    components: 'ꯑ (U+ABCE) + ꯩ (U+ABE9)',
    example: 'ꯑꯩꯈꯣꯏ (eikhoi)',
    exampleMeaning: 'we / us',
  },
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
  { codePoint: 'U+ABF8', char: '꯸', name: 'Nipan (8)', meaning: 'Eight', category: 'numeral', ipa: '[nipan]', latin: '8' },
  { codePoint: 'U+ABF9', char: '꯹', name: 'Mapan (9)', meaning: 'Nine', category: 'numeral', ipa: '[mapan]', latin: '9' },
];

/**
 * 14-Level Ancient Meetei Number Hierarchy from Wakoklon Heelel Thilel Salai Ama-Ilon Pukok Puya
 * (Documented in Meetei-lang/Pukok Key Layout_QWERTY Keyboard.pdf page 2)
 */
export const PUKOK_COUNTING_HIERARCHY = [
  { level: 1, name: 'Ama', meitei: 'ꯑꯃ', value: '1', zeroes: 0 },
  { level: 2, name: 'Tara', meitei: 'ꯇꯔꯥ', value: '10', zeroes: 1 },
  { level: 3, name: 'Chama', meitei: 'ꯆꯥꯃ', value: '100', zeroes: 2 },
  { level: 4, name: 'Lishing', meitei: 'ꯂꯤꯁꯤꯡ', value: '1,000', zeroes: 3 },
  { level: 5, name: 'Lishing Tara', meitei: 'ꯂꯤꯁꯤꯡ ꯇꯔꯥ', value: '10,000', zeroes: 4 },
  { level: 6, name: 'Licha', meitei: 'ꯂꯤꯆꯥ', value: '100,000', zeroes: 5 },
  { level: 7, name: 'Licha Tara', meitei: 'ꯂꯤꯆꯥ ꯇꯔꯥ', value: '1,000,000', zeroes: 6 },
  { level: 8, name: 'Lipun', meitei: 'ꯂꯤꯄꯨꯟ', value: '10,000,000', zeroes: 7 },
  { level: 9, name: 'Lipun Tara', meitei: 'ꯂꯤꯄꯨꯟ ꯇꯔꯥ', value: '100,000,000', zeroes: 8 },
  { level: 10, name: 'Lipok', meitei: 'ꯂꯤꯄꯣꯛ', value: '1,000,000,000', zeroes: 9 },
  { level: 11, name: 'Lipok Tara', meitei: 'ꯂꯤꯄꯣꯛ ꯇꯔꯥ', value: '10,000,000,000', zeroes: 10 },
  { level: 12, name: 'Likei', meitei: 'ꯂꯤꯀꯩ', value: '100,000,000,000', zeroes: 11 },
  { level: 13, name: 'Likei Tara', meitei: 'ꯂꯤꯀꯩ ꯇꯔꯥ', value: '1,000,000,000,000', zeroes: 12 },
  { level: 14, name: 'Puu Ama', meitei: 'ꯄꯨ ꯑꯃ', value: '10,000,000,000,000', zeroes: 13 },
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
  // SLLK & Canonical Puya Manuscript Terms
  sllk: 'ꯁꯥꯅꯥꯃꯍꯤ  ꯂꯥꯏꫫꯅꯡ  ꯂꯤꯆꯠ ꫰  ꯀꯪꯂꯩꯄꯥꯛ',
  sanamahi: 'ꯁꯥꯅꯥꯃꯍꯤ',
  kangleipak: 'ꯀꯪꯂꯩꯄꯥꯛ',
  puya: 'ꯄꯨꯌꯥ',
  puyas: 'ꯄꯨꯌꯥꯁꯤꯡ',
  pukok: 'ꯄꯨꯀꯣꯛ',
  wakoklon: 'ꯋꯥꯀꯣꯛꯂꯣꯟ',
  hilel: 'ꯍꯤꯂꯦꯜ',
  thilel: 'ꯊꯤꯂꯦꯜ',
  salai: 'ꯁꯥꯂꯥꯢ',
  eelon: 'ꯏꯂꯣꯟ',
  eeyek: 'ꯏꯌꯦꯛ',
  eepi: 'ꯏꯄꯤ',
  eepe: 'ꯏꯄꯦ',
  cheitap: 'ꯆꯩꯇꯥꯞ',
  lolsum: 'ꯂꯣꯜꯁꯨꯝ',
  khutam: 'ꯈꯨꯇꯝ',
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
  oina: 'ꯑꯣꯏꯅ',
  oja: 'ꯑꯣꯖꯥ',
  kmdwrige: 'ꯀꯃꯗꯧꯔꯤꯒꯦ',
  kamdwrige: 'ꯀꯃꯗꯧꯔꯤꯒꯦ',
  kamdourige: 'ꯀꯃꯗꯧꯔꯤꯒꯦ',
  kmdwba: 'ꯀꯃꯗꯧꯕ',
  kamdwba: 'ꯀꯃꯗꯧꯕ',
  kmdwre: 'ꯀꯃꯗꯧꯔꯦ',
  kmdwri: 'ꯀꯃꯗꯧꯔꯤ',
  twrige: 'ꯇꯧꯔꯤꯒꯦ',
  tourige: 'ꯇꯧꯔꯤꯒꯦ',
  twba: 'ꯇꯧꯕ',
  touba: 'ꯇꯧꯕ',
  dwge: 'ꯗꯧꯒꯦ',
  douge: 'ꯗꯧꯒꯦ',
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

  // Manipuri phonetic typing rule: consonant + 'w' represents sou-nap (ꯧ /ou/)
  // e.g. dw -> d + sou-nap (ꯗꯧ), tw -> tou (ꯇꯧ), kmdwrige -> kamdourige -> ꯀꯃꯗꯧꯔꯤꯒꯦ
  word = word.replace(/([b-df-hj-np-tv-z])w(?=[b-df-hj-np-tv-z]|$|[ie])/g, '$1ou');
  word = word.replace(/([b-df-hj-np-tv-z])ow(?=[b-df-hj-np-tv-z]|$|[ie])/g, '$1ou');

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
  const pattern = /(^|[^ꯀ-ꯢꫠ-ꫪ])([ꯣ-ꯪ꯬])/g;
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

/**
 * Authentic Pukok Eeyek Keyboard Mapping (Wakoklon Puya Font)
 * Developed by Wakambam Macha Waanglel for printing:
 * WAKOKLON HEELEL THILEL SALAI AMA_ILON PUKOK PUYA (from Meetei-lang/Pukok Key Layout_QWERTY Keyboard.pdf)
 */
export const UNICODE_TO_PUKOK_KEYMAP: Record<string, string> = {
  // 18 Indigenous Anatomical Root Letters (Eepi-eeyek 18)
  'ꯀ': 'k', 'ꯁ': 's', 'ꯂ': 'l', 'ꯃ': 'm', 'ꯄ': 'p',
  'ꯅ': 'n', 'ꯆ': 'c', 'ꯇ': 't', 'ꯈ': 'x', 'ꯉ': 'q',
  'ꯊ': 'z', 'ꯋ': 'w', 'ꯌ': 'y', 'ꯍ': 'h', 'ꯎ': 'u',
  'ꯏ': 'e', 'ꯐ': 'f', 'ꯑ': 'a',

  // 9 Lom Consonants (Meetei Lom Eeyek 9)
  'ꯒ': 'g', // Gok (Kok Lom)
  'ꯓ': 'S', // Zam (Sam Lom)
  'ꯔ': 'R', // Rai (Lai Lom)
  'ꯕ': 'b', // Bok (Paa Lom)
  'ꯖ': 'j', // Jhil (Chil Lom)
  'ꯗ': 'd', // Dil (Til Lom)
  'ꯘ': 'G', // Ghou (Khou Lom)
  'ꯙ': 'D', // Dhou (Thou Lom)
  'ꯚ': 'v', // Bham (Pham Lom)

  // 10 Lolsum Consonants (Meetei Lolsum 10)
  'ꯛ': 'K', 'ꯜ': 'L', 'ꯝ': 'M', 'ꯞ': 'P', 'ꯟ': 'N',
  'ꯠ': 'T', 'ꯡ': 'Q', 'ꯢ': 'E',

  // 9 Cheitap Vowel Diacritics (Wakambam Macha Waanglel QWERTY)
  'ꯥ': 'F', // Takchei / Atep (aa)
  'ꯤ': 'i', // Inap / Ee (i short)
  'ꯨ': 'J', // Oon Cheitap (u)
  'ꯦ': 'Y', // Yenap (e)
  'ꯣ': 'o', // Otap (o)
  'ꯩ': 'C', // Cheinap (ei)
  'ꯧ': 'O', // Sou (ou)
  'ꯪ': 'H', // Nung (anusvara)
  '꯭': '',  // Virama / Apun (handled natively)

  // 10 Cheishing Digits (0-9)
  '꯰': '0', '꯱': '1', '꯲': '2', '꯳': '3', '꯴': '4',
  '꯵': '5', '꯶': '6', '꯷': '7', '꯸': '8', '꯹': '9',

  // Punctuation & Khutam (from Pukok Key Layout page 2)
  '꯫': '!',  // Apakpa
  '꫰': '.',  // Cheikhan (Single Danda)
  '꫱': ';',  // Cheishei (Double Danda)
  ':': ':',  // Mannaba (equals/colon)
  ',': ',',  // Cheikhei
  'ꫫ': 'I',  // Meetei Mayek Vowel Sign II -> Pukok Eeyek font key 'I' (renders pure ꫫ without dotted circle!)
  '\u25CC': '', // Dotted circle
  '\u25CB': '', // White circle
};

/**
 * Converts Unicode Meetei Mayek text into ASCII key sequences that render
 * with authentic Pukok Eeyek calligraphy when styled with `font-family: 'Pukok Eeyek'`.
 */
export function convertUnicodeToPukokFont(text: string): string {
  if (!text) return '';
  const sanitized = text.replace(/[\u25CC\u25CB]/g, '');
  let result = '';
  for (const ch of sanitized) {
    result += UNICODE_TO_PUKOK_KEYMAP[ch] || ch;
  }
  return result.replace(/\u25CC/g, '');
}

/**
 * High-level translator: converts Latin/English text into Pukok Eeyek calligraphy font string
 */
export function translateToPukokFontWithVocab(input: string): string {
  const unicodeText = translateToMeeteiMayekWithVocab(input);
  return convertUnicodeToPukokFont(unicodeText);
}
