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
  category: 'core18' | 'consonant9' | 'lom9' | 'lolsum' | 'lonsum' | 'cheitap' | 'special' | 'numeral' | 'extension' | 'khutam5' | 'khutamsign';
  ipa?: string;
  latin?: string;
  pukokKey?: string;
  pukokWord?: string;
}

export interface CheishingEntry {
  meeteiWord: string;
  digits: string;
  romanName: string;
  value: string;
  meaning: string;
  pukokKey?: string;
  pukokWord?: string;
}

export interface KhutamItem {
  name: string;
  mathSymbol: string;
  pukokKey: string;
  pukokWord?: string;
  description: string;
}

export interface KhutamSignItem {
  name: string;
  sign: string;
  pukokKey: string;
  pukokWord?: string;
  description: string;
}

/**
 * Traditional Meetei Mayek Counting & Large Number System (Cheishing Thiba)
 * Preserved in indigenous Manipuri Puya manuscripts
 */
export const CHEISHING_THIBA: CheishingEntry[] = [
  { meeteiWord: 'ꯑꯃ', digits: '꯱', romanName: 'Ama', value: '1', meaning: 'One (Units)', pukokKey: '#' },
  { meeteiWord: 'ꯇꯂꯥ', digits: '꯱꯰', romanName: 'Tala', value: '10', meaning: 'Ten (Canonical Tala)', pukokKey: '10' },
  { meeteiWord: 'ꯆꯥ', digits: '꯱꯰꯰', romanName: 'Cha', value: '100', meaning: 'Hundred', pukokKey: '100' },
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

// 1. Core 18 Anatomical Letters (Meetei Eepi-eeyek laiyek 18) - Canonical Wakoklon Puya & SLLK
export const CORE_18_IPEE: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABC0', char: 'ꯀ', name: 'Kok', meaning: 'Head / Brain', category: 'core18', ipa: '[kɔk]', latin: 'k', pukokKey: 'k', pukokWord: 'koK' },
  { codePoint: 'U+ABC1', char: 'ꯁ', name: 'Sam', meaning: 'Hair', category: 'core18', ipa: '[səm]', latin: 's', pukokKey: 's', pukokWord: 'sM' },
  { codePoint: 'U+ABC2', char: 'ꯂ', name: 'Lai', meaning: 'Forehead', category: 'core18', ipa: '[lai]', latin: 'l', pukokKey: 'l', pukokWord: 'lJe' },
  { codePoint: 'U+ABC3', char: 'ꯃ', name: 'Meet', meaning: 'Eye', category: 'core18', ipa: '[mit]', latin: 'm', pukokKey: 'm', pukokWord: 'imT' },
  { codePoint: 'U+ABC4', char: 'ꯄ', name: 'Paa', meaning: 'Eyebrow / Eyelash', category: 'core18', ipa: '[pa]', latin: 'p', pukokKey: 'p', pukokWord: 'pJ' },
  { codePoint: 'U+ABC5', char: 'ꯅ', name: 'Naa', meaning: 'Ear', category: 'core18', ipa: '[na]', latin: 'n', pukokKey: 'n', pukokWord: 'nJ' },
  { codePoint: 'U+ABC6', char: 'ꯆ', name: 'Chil', meaning: 'Lips', category: 'core18', ipa: '[tʃil]', latin: 'ch', pukokKey: 'c', pukokWord: 'ciL' },
  { codePoint: 'U+ABC7', char: 'ꯇ', name: 'Til', meaning: 'Saliva / Tongue', category: 'core18', ipa: '[til]', latin: 't', pukokKey: 't', pukokWord: 'itL' },
  { codePoint: 'U+ABC8', char: 'ꯈ', name: 'Khou', meaning: 'Throat', category: 'core18', ipa: '[kʰəw]', latin: 'kh', pukokKey: 'x', pukokWord: 'xH' },
  { codePoint: 'U+ABC9', char: 'ꯉ', name: 'Ngou', meaning: 'Uvula / Neck', category: 'core18', ipa: '[ŋəw]', latin: 'ng', pukokKey: 'q', pukokWord: 'qH' },
  { codePoint: 'U+ABCA', char: 'ꯊ', name: 'Thou', meaning: 'Chest / Breast', category: 'core18', ipa: '[tʰəw]', latin: 'th', pukokKey: 'z', pukokWord: 'zH' },
  { codePoint: 'U+ABCB', char: 'ꯋ', name: 'Wai', meaning: 'Navel', category: 'core18', ipa: '[wai]', latin: 'w', pukokKey: 'w', pukokWord: 'wJe' },
  { codePoint: 'U+ABCC', char: 'ꯌ', name: 'Yang', meaning: 'Spine / Vertebrae', category: 'core18', ipa: '[jaŋ]', latin: 'y', pukokKey: 'y', pukokWord: 'yJQ' },
  { codePoint: 'U+ABCD', char: 'ꯍ', name: 'Huk', meaning: 'Pelvis / Joint', category: 'core18', ipa: '[huk]', latin: 'h', pukokKey: 'h', pukokWord: 'hFK' },
  { codePoint: 'U+ABCE', char: 'ꯎ', name: 'Oon', meaning: 'Skin', category: 'core18', ipa: '[un]', latin: 'u', pukokKey: 'u', pukokWord: 'uN' },
  { codePoint: 'U+ABCF', char: 'ꯏ', name: 'Ee', meaning: 'Blood', category: 'core18', ipa: '[i]', latin: 'e', pukokKey: 'e', pukokWord: 'e' },
  { codePoint: 'U+ABD0', char: 'ꯐ', name: 'Pham', meaning: 'Seat / Womb', category: 'core18', ipa: '[pʰəm]', latin: 'ph / f', pukokKey: 'f', pukokWord: 'fM' },
  { codePoint: 'U+ABD1', char: 'ꯑ', name: 'Atingaa', meaning: 'Sky / Eternity', category: 'core18', ipa: '[ətija]', latin: 'a', pukokKey: 'a', pukokWord: 'atInJ' },
];

// 2. Meetei lom eepe-eyek 9 letters (9 additional consonants for non-indigenous loanwords)
export const LOM_9_CONSONANTS: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABD2', char: 'ꯒ', name: 'Ga', meaning: 'kok lom', category: 'lom9', ipa: '[gɔk]', latin: 'g', pukokKey: 'g', pukokWord: 'k loM' },
  { codePoint: 'U+ABD3', char: 'ꯓ', name: 'Jha', meaning: 'sam lom', category: 'lom9', ipa: '[dʒʱəm]', latin: 'jh', pukokKey: 'S', pukokWord: 's loM' },
  { codePoint: 'U+ABD4', char: 'ꯔ', name: 'Ra', meaning: 'lai lom', category: 'lom9', ipa: '[rai]', latin: 'r', pukokKey: 'r', pukokWord: 'l loM' },
  { codePoint: 'U+ABD5', char: 'ꯕ', name: 'Ba', meaning: 'Paa lom', category: 'lom9', ipa: '[ba]', latin: 'b', pukokKey: 'b', pukokWord: 'p loM' },
  { codePoint: 'U+ABD6', char: 'ꯖ', name: 'Ja', meaning: 'chin lom', category: 'lom9', ipa: '[dʒil]', latin: 'j', pukokKey: 'j', pukokWord: 'c loM' },
  { codePoint: 'U+ABD7', char: 'ꯗ', name: 'Da', meaning: 'Tin lom', category: 'lom9', ipa: '[dil]', latin: 'd', pukokKey: 'd', pukokWord: 't loM' },
  { codePoint: 'U+ABD8', char: 'ꯘ', name: 'Gha', meaning: 'khou lom', category: 'lom9', ipa: '[gʱəw]', latin: 'gh', pukokKey: 'G', pukokWord: 'x loM' },
  { codePoint: 'U+ABD9', char: 'ꯙ', name: 'Dha', meaning: 'thou lom', category: 'lom9', ipa: '[dʱəw]', latin: 'dh', pukokKey: 'D', pukokWord: 'z loM' },
  { codePoint: 'U+ABDA', char: 'ꯚ', name: 'Bha', meaning: 'Pham lom', category: 'lom9', ipa: '[bʱəm]', latin: 'bh / v', pukokKey: 'v', pukokWord: 'f loM' },
];

export const ADDITIONAL_9_CONSONANTS = LOM_9_CONSONANTS;

// All 27 Modern Alphabets (18 Core + 9 Lom)
export const ALL_27_MAIN_LETTERS = [...CORE_18_IPEE, ...LOM_9_CONSONANTS];

// 3. Meetei lolsum (not lonsum) eeyek laiyek 10 (10 lolsum final consonants)
export const LOLSUM_10: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABDB', char: 'ꯛ', name: 'kok-lolsum', meaning: 'Kok lolsum (Final -k)', category: 'lolsum', ipa: '[-k]', latin: '-k', pukokKey: 'K', pukokWord: 'k loLsuM' },
  { codePoint: 'U+ABDC', char: 'ꯜ', name: 'lai-lolsum', meaning: 'Lai lolsum (Final -l)', category: 'lolsum', ipa: '[-l]', latin: '-l', pukokKey: 'L', pukokWord: 'l loLsuM' },
  { codePoint: 'U+ABDD', char: 'ꯝ', name: 'meet-lolsum', meaning: 'Meet lolsum (Final -m)', category: 'lolsum', ipa: '[-m]', latin: '-m', pukokKey: 'M', pukokWord: 'm loLsuM' },
  { codePoint: 'U+ABDE', char: 'ꯞ', name: 'paa-lolsum', meaning: 'Paa lolsum (Final -p)', category: 'lolsum', ipa: '[-p]', latin: '-p', pukokKey: 'P', pukokWord: 'p loLsuM' },
  { codePoint: 'U+ABDF', char: 'ꯟ', name: 'Naa-lolsum', meaning: 'Naa lolsum (Final -n)', category: 'lolsum', ipa: '[-n]', latin: '-n', pukokKey: 'N', pukokWord: 'n loLsuM' },
  { codePoint: 'U+ABE0', char: 'ꯠ', name: 'til-lolsum', meaning: 'Til lolsum (Final -t)', category: 'lolsum', ipa: '[-t]', latin: '-t', pukokKey: 'T', pukokWord: 't loLsuM' },
  { codePoint: 'U+ABE1', char: 'ꯡ', name: 'Ngou-lolsum', meaning: 'Ngou lolsum (Final -ng)', category: 'lolsum', ipa: '[-ŋ]', latin: '-ng', pukokKey: 'Q', pukokWord: 'q loLsuM' },
  { codePoint: 'U+ABCE', char: 'ꯎ', name: 'Oon-lolsum', meaning: 'Oon lolsum (Final -u)', category: 'lolsum', ipa: '[-u]', latin: '-u', pukokKey: 'U', pukokWord: 'u loLsuM' },
  { codePoint: 'U+ABE2', char: 'ꯢ', name: 'Ee-lolsum', meaning: 'Ee lolsum (Final -i)', category: 'lolsum', ipa: '[-i]', latin: '-i', pukokKey: 'E', pukokWord: 'e loLsuM' },
  { codePoint: 'U+ABD1', char: 'ꯑ', name: 'Atingaa-lolsum', meaning: 'Atingaa lolsum (Final -a)', category: 'lolsum', ipa: '[-a]', latin: '-a', pukokKey: 'A', pukokWord: 'a loLsuM' },
];

export const LONSUM_8: MeeteiUnicodeChar[] = LOLSUM_10.slice(0, 8);

// All 37 Letters (27 Main Letters + 10 Lolsum Letters) capable of taking Cheitap diacritics
export const ALL_LETTERS_MAIN_AND_LONSUM: MeeteiUnicodeChar[] = [...ALL_27_MAIN_LETTERS, ...LOLSUM_10];

// 4. Meetei cheitap-chenap 9 (9 cheitap-cheinap vowel diacritics) - SLLK & Wakambam QWERTY
export const CHEITAP_9: MeeteiUnicodeChar[] = [
  { codePoint: 'U+ABE5', char: 'ꯥ', name: 'Aa-tap', meaning: 'Vowel sign -aa (e.g. ꯀꯥ = ka)', category: 'cheitap', ipa: '/a/', latin: 'J', pukokKey: 'J', pukokWord: 'atJp' },
  { codePoint: 'U+ABE4', char: 'ꯤ', name: 'E-nap', meaning: 'Vowel sign -i / -e (e.g. ꯀꯤ = ki)', category: 'cheitap', ipa: '/i/', latin: 'i', pukokKey: 'i', pukokWord: 'EnJp' },
  { codePoint: 'U+AAEB', char: 'ꫫ', name: 'Ee-nap', meaning: 'Long vowel sign -ee (Puya Ee-nap)', category: 'cheitap', ipa: '/iː/', latin: 'I', pukokKey: 'I', pukokWord: 'enJp' },
  { codePoint: 'U+ABE6', char: 'ꯦ', name: 'Yat-nap', meaning: 'Vowel sign -e (sounds like yet-nap, e.g. ꯀꯦ = ke)', category: 'cheitap', ipa: '/e/', latin: 'Y', pukokKey: 'Y', pukokWord: 'yYTnJp' },
  { codePoint: 'U+ABE9', char: 'ꯩ', name: 'Chei-nap', meaning: 'Vowel sign -ei (e.g. ꯀꯩ = kei)', category: 'cheitap', ipa: '/ei/', latin: 'C', pukokKey: 'C', pukokWord: 'cCnJp' },
  { codePoint: 'U+ABE7', char: 'ꯧ', name: 'Shou-nap', meaning: 'Vowel sign -ou (e.g. ꯀꯧ = kou)', category: 'cheitap', ipa: '/ou/', latin: 'O', pukokKey: 'O', pukokWord: 'sOnJp' },
  { codePoint: 'U+ABE3', char: 'ꯣ', name: 'Ot-nap', meaning: 'Vowel sign -o (e.g. ꯀꯣ = ko)', category: 'cheitap', ipa: '/o/', latin: 'o', pukokKey: 'o', pukokWord: 'aoTnJp' },
  { codePoint: 'U+ABE8', char: 'ꯨ', name: 'Uu-nap', meaning: 'Vowel sign -u / -uu (e.g. ꯀꯨ = ku)', category: 'cheitap', ipa: '/u/', latin: 'F', pukokKey: 'F', pukokWord: 'uFnJp' },
  { codePoint: 'U+ABEA', char: 'ꯪ', name: 'Nung', meaning: 'Anusvara nasal sign -ng (e.g. ꯀꯪ = kang)', category: 'cheitap', ipa: '/əŋ/', latin: 'H', pukokKey: 'H', pukokWord: 'nFC' },
];

export const CHEITAP_8: MeeteiUnicodeChar[] = CHEITAP_9.filter(c => c.char !== 'ꫫ');

// 5. 5-Khutam (Arithmetic Operators with Equal Sign)
export const KHUTAM_5: KhutamItem[] = [
  { name: 'khaitokpa', mathSymbol: '-', pukokKey: '\\', pukokWord: 'xEtYkpJ', description: '-(minus) Subtraction' },
  { name: 'tinshinpa', mathSymbol: '+', pukokKey: '/', pukokWord: 'tinsinpJ', description: '+(plus) Addition' },
  { name: 'punpa', mathSymbol: 'x / *', pukokKey: '-', pukokWord: 'punpJ', description: 'x(multiply) Multiplication' },
  { name: 'yenthokpa', mathSymbol: '/', pukokKey: '|', pukokWord: 'yentYkpJ', description: '/(division) Division' },
  { name: 'mannapa', mathSymbol: '=', pukokKey: ':', pukokWord: 'mJnnJpJ', description: '=(equal) Equal To • (:) is MANNABA in Meetei Mayek' },
];

// 6. Khutam Eeyek Shing (Dedicated Punctuation & Sign Symbols)
export const KHUTAM_SIGNS: KhutamSignItem[] = [
  { name: 'khakpa', sign: '(', pukokKey: 'i', pukokWord: 'xJkpJ', description: 'Sentence delimiter / Pause' },
  { name: 'cheikhan', sign: '|', pukokKey: ',', pukokWord: 'cexJn', description: 'Comma / Single stroke' },
  { name: 'kheipa', sign: '||', pukokKey: '.', pukokWord: 'xEpJ', description: 'Full stop / Double stroke' },
  { name: 'cheikhei', sign: '||', pukokKey: ';', pukokWord: 'cexE', description: 'Sentence end / Double danda' },
  { name: 'lompa', sign: '.', pukokKey: ']', pukokWord: 'lYmpJ', description: 'Lom inflection mark (dot)' },
  { name: 'lumpa', sign: '..', pukokKey: '[', pukokWord: 'lumpJ', description: 'Double dot mark' },
  { name: 'punpa', sign: '-', pukokKey: '-', pukokWord: 'punpJ', description: 'Hyphen / Joining mark' },
  { name: 'apun', sign: '--', pukokKey: ':', pukokWord: 'apun', description: 'Apun conjunct underline' },
  { name: 'angakpa', sign: '!', pukokKey: '!', pukokWord: 'a.qJkpJ', description: 'Exclamation mark' },
  { name: 'hangpa', sign: '?', pukokKey: '?', pukokWord: 'hQpJ', description: 'Question mark' },
  { name: 'sampal', sign: '( )', pukokKey: '()', pukokWord: 'sMpl', description: 'Parentheses / Brackets' },
  { name: 'leihoulon pulon 5', sign: '.....', pukokKey: 'V', pukokWord: 'le.hHlYn pulYn 5', description: 'Leihoulon pulon sign (5 dots)' },
  { name: 'eemulon 6', sign: '......', pukokKey: 'X', pukokWord: 'e.mulYn 6', description: 'Eemulon sign (6 dots)' },
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
  { codePoint: 'U+ABF0', char: '꯰', name: 'phun (0)', meaning: 'Zero / Phun', category: 'numeral', ipa: '[pʰun]', latin: '0', pukokKey: '0', pukokWord: 'fuN' },
  { codePoint: 'U+ABF1', char: '꯱', name: 'ama (1)', meaning: 'One / Ama', category: 'numeral', ipa: '[əma]', latin: '1', pukokKey: '1', pukokWord: 'a.mJ' },
  { codePoint: 'U+ABF2', char: '꯲', name: 'ani (2)', meaning: 'Two / Ani', category: 'numeral', ipa: '[əni]', latin: '2', pukokKey: '2', pukokWord: 'a.ni' },
  { codePoint: 'U+ABF3', char: '꯳', name: 'ahum (3)', meaning: 'Three / Ahum', category: 'numeral', ipa: '[əhum]', latin: '3', pukokKey: '3', pukokWord: 'a.huM' },
  { codePoint: 'U+ABF4', char: '꯴', name: 'mali (4)', meaning: 'Four / Mali', category: 'numeral', ipa: '[məli]', latin: '4', pukokKey: '4', pukokWord: 'm.li' },
  { codePoint: 'U+ABF5', char: '꯵', name: 'maga (5)', meaning: 'Five / Maga', category: 'numeral', ipa: '[maŋa]', latin: '5', pukokKey: '5', pukokWord: 'm.qJ' },
  { codePoint: 'U+ABF6', char: '꯶', name: 'taluk (6)', meaning: 'Six / Taluk', category: 'numeral', ipa: '[taluk]', latin: '6', pukokKey: '6', pukokWord: 't.luK' },
  { codePoint: 'U+ABF7', char: '꯷', name: 'talet (7)', meaning: 'Seven / Talet', category: 'numeral', ipa: '[təlet]', latin: '7', pukokKey: '7', pukokWord: 't.leT' },
  { codePoint: 'U+ABF8', char: '꯸', name: 'nepal (8)', meaning: 'Eight / Nepal (sound like nee-pal)', category: 'numeral', ipa: '[nepal]', latin: '8', pukokKey: '8', pukokWord: 'ne.pJN' },
  { codePoint: 'U+ABF9', char: '꯹', name: 'Mapan (9)', meaning: 'Nine / Mapan', category: 'numeral', ipa: '[mapan]', latin: '9', pukokKey: '9', pukokWord: 'm.pJN' },
  { codePoint: 'U+ABF1_ABF0', char: '꯱꯰', name: 'Tala (10)', meaning: 'Ten / Tala', category: 'numeral', ipa: '[təla]', latin: '10', pukokKey: '10', pukokWord: 't.lJ' },
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
  // 18 Indigenous Anatomical Root Letters (Meetei Eepi-eeyek laiyek 18)
  'ꯀ': 'k', 'ꯁ': 's', 'ꯂ': 'l', 'ꯃ': 'm', 'ꯄ': 'p',
  'ꯅ': 'n', 'ꯆ': 'c', 'ꯇ': 't', 'ꯈ': 'x', 'ꯉ': 'q',
  'ꯊ': 'z', 'ꯋ': 'w', 'ꯌ': 'y', 'ꯍ': 'h', 'ꯎ': 'u',
  'ꯏ': 'e', 'ꯐ': 'f', 'ꯑ': 'a',

  // 9 Lom Consonants (Meetei lom eepe-eyek 9 letters)
  'ꯒ': 'g', // Ga (kok-lom)
  'ꯓ': 'S', // Jha (sam-lom)
  'ꯔ': 'r', // Ra (lai-lom)
  'ꯕ': 'b', // Ba (paa-lom)
  'ꯖ': 'j', // Ja (chin-lom)
  'ꯗ': 'd', // Da (tin-lom)
  'ꯘ': 'G', // Gha (khou-lom)
  'ꯙ': 'D', // Dha (thou-lom)
  'ꯚ': 'v', // Bha (Pham-lom)

  // 10 Lolsum Consonants (Meetei lolsum eeyek laiyek 10)
  'ꯛ': 'K', // Kok-lolsum
  'ꯜ': 'L', // Lai-lolsum
  'ꯝ': 'M', // Meet-lolsum
  'ꯞ': 'P', // Paa-lolsum
  'ꯟ': 'N', // Naa-lolsum
  'ꯠ': 'T', // Til-lolsum
  'ꯡ': 'Q', // Ngou-lolsum
  'ꯢ': 'E', // Ee-lolsum
  // Note: In Pukok font, 'U' is Oon-lolsum and 'A' is Atingaa-lolsum

  // 9 Cheitap-Cheinap Vowel Diacritics (from PDF 2 Page 1 & PDF 1 Page 3)
  'ꯥ': 'J', // Aa-tap
  'ꯤ': 'i', // E-nap
  'ꫫ': 'I', // Ee-nap
  'ꯦ': 'Y', // Yat-nap (sounds like yet-nap)
  'ꯩ': 'C', // Chei-nap
  'ꯧ': 'O', // Shou-nap
  'ꯣ': 'o', // Ot-nap
  'ꯨ': 'F', // Uu-nap
  'ꯪ': 'H', // Nung
  '꯭': '',  // Apun / Virama (handled natively)

  // 10 Cheishing Digits (0-9)
  '꯰': '0', '꯱': '1', '꯲': '2', '꯳': '3', '꯴': '4',
  '꯵': '5', '꯶': '6', '꯷': '7', '꯸': '8', '꯹': '9',

  // 5-Khutam Arithmetic Operators & Equals
  '=': ':',  // Mannaba (colon : is equal to = in Meetei Mayek)
  '+': '/',  // Tinshinpa (+)
  '-': '\\', // Khaitokpa (-)
  '*': '-',  // Punpa (*)
  '/': '|',  // Yenthokpa (/)

  // Khutam Eeyek Shing Punctuation Signs
  '꯫': ';',  // Cheikhei / sentence terminal
  '꫰': ',',  // Cheikhan
  '꫱': ';',  // Cheishei
  ':': ':',  // Mannaba (equals/colon)
  ',': ',',  // Cheikhan
  '.': '.',  // Kheipa
  '!': '!',  // Angakpa
  '?': '?',  // Hangpa
  '(': '(',  // Sampal
  ')': ')',  // Sampal
  '꯬': '',   // Lum Iyek
  'ꫲ': '#',  // Anji (1)
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
 * Converts Unicode Meetei Mayek Markdown into Pukok Eeyek ASCII key sequences
 * while strictly preserving all image URLs `![alt](URL)`, link URLs `[text](URL)`,
 * code blocks, and HTML tags intact so images and links never break.
 */
export function convertMarkdownToPukokFont(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  let inCodeBlock = false;
  const convertedLines: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      convertedLines.push(line);
      continue;
    }

    if (inCodeBlock) {
      convertedLines.push(line);
      continue;
    }

    if (!line.trim() || line.trim() === '---' || line.trim() === '***') {
      convertedLines.push(line);
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6}\s+)(.*)$/);
    if (headingMatch) {
      const hashes = headingMatch[1];
      const text = headingMatch[2];
      convertedLines.push(`${hashes}${convertMarkdownTextSegmentsToPukok(text)}`);
      continue;
    }

    // Blockquote
    const quoteMatch = line.match(/^(\s*>\s*)(.*)$/);
    if (quoteMatch) {
      const quotePrefix = quoteMatch[1];
      const text = quoteMatch[2];
      convertedLines.push(`${quotePrefix}${convertMarkdownTextSegmentsToPukok(text)}`);
      continue;
    }

    // List items
    const listMatch = line.match(/^(\s*[-*+]\s+|\s*\d+\.\s+)(.*)$/);
    if (listMatch) {
      const listPrefix = listMatch[1];
      const text = listMatch[2];
      convertedLines.push(`${listPrefix}${convertMarkdownTextSegmentsToPukok(text)}`);
      continue;
    }

    // Table rows
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (/^\|\s*[-:]+[-|\s:]*\|$/.test(line.trim())) {
        convertedLines.push(line);
        continue;
      }
      const cells = line.split('|');
      const convertedCells = cells.map((cell, idx) => {
        if (idx === 0 || idx === cells.length - 1) return cell;
        return convertMarkdownTextSegmentsToPukok(cell);
      });
      convertedLines.push(convertedCells.join('|'));
      continue;
    }

    // Paragraph text
    convertedLines.push(convertMarkdownTextSegmentsToPukok(line));
  }

  return convertedLines.join('\n');
}

function convertMarkdownTextSegmentsToPukok(text: string): string {
  const tokenRegex = /(!?\[.*?\]\(.*?\)|`[^`]+`|<[^>]+>)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part) => {
    // Images: ![alt](url) -> only convert alt text to Pukok, NEVER touch the url!
    const imgMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const url = imgMatch[2];
      return `![${convertUnicodeToPukokFont(alt)}](${url})`;
    }

    // Links: [label](url) -> only convert label text to Pukok, NEVER touch the url!
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const url = linkMatch[2];
      return `[${convertUnicodeToPukokFont(label)}](${url})`;
    }

    // Code or HTML
    if (part.startsWith('`') || part.startsWith('<')) {
      return part;
    }

    return convertUnicodeToPukokFont(part);
  }).join('');
}

/**
 * High-level translator: converts Latin/English text into Pukok Eeyek calligraphy font string
 */
export function translateToPukokFontWithVocab(input: string): string {
  const unicodeText = translateToMeeteiMayekWithVocab(input);
  return convertUnicodeToPukokFont(unicodeText);
}

/**
 * Translates full Markdown text into Pukok Eeyek font string while keeping all image URLs and links intact
 */
export function translateMarkdownToPukok(markdown: string): string {
  const unicodeMd = translateMarkdownToMeeteiMayek(markdown);
  return convertMarkdownToPukokFont(unicodeMd);
}
