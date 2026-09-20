/// Meetei Mayek Script Translation & Transliteration Engine
/// Faithfully ported from web/src/services/meeteiMayekService.ts
class MeeteiMayekService {
  static const Map<String, String> bengaliToMeeteiMap = {
    "ক": "ꯀ', 'খ': 'ꯈ', 'গ': 'ꯒ', 'ঘ': 'ꯘ', 'ঙ': 'ꯉ",
    "চ": "ꯆ', 'ছ': 'ꯆ', 'জ': 'ꯖ', 'ঝ': 'ꯓ', 'ঞ': 'ꯅ",
    "ট": "ꯇ', 'ঠ': 'ꯊ', 'ড': 'ꯗ', 'ঢ': 'ꯙ', 'ণ': 'ꯟ",
    "ত": "ꯇ', 'থ': 'ꯊ', 'দ': 'ꯗ', 'ধ': 'ꯙ', 'ন': 'ꯅ",
    "প": "ꯄ', 'ফ': 'ꯐ', 'ব': 'ꯕ', 'ভ': 'ꯚ', 'ম': 'ꯃ",
    "য": "ꯌ', 'র': 'ꯔ', 'ল': 'ꯂ', 'ৱ': 'ꯋ', 'শ': 'ꯁ",
    "ষ": "ꯁ', 'স': 'ꯁ', 'হ': 'ꯍ', 'ড়': 'ꯔ', 'ঢ়': 'ꯔ",
    "য়": "ꯌ', 'ৎ': 'ꯠ",
  // Vowels independent
    "অ": "ꯑ', 'আ': 'ꯑꯥ', 'ই': 'ꯏ', 'ঈ': 'ꯏ', 'উ': 'ꯎ', 'ঊ': 'ꯎ",
    "ঋ": "ꯔꯤ', 'এ': 'ꯑꯦ', 'ঐ': 'ꯑꯩ', 'ও': 'ꯑꯣ', 'ঔ': 'ꯑꯧ",
  // Matras / Vowel signs
    "া": "ꯥ', 'ি': 'ꯤ', 'ী': 'ꯤ', 'ু': 'ꯨ', 'ূ': 'ꯨ",
    "ৃ": "ꯔꯤ', 'ে': 'ꯦ', 'ৈ': 'ꯩ', 'ো': 'ꯣ', 'ৌ': 'ꯧ",
    "ং": "ꯪ', 'ঃ': '꯬', '্': '꯭",
  // Punctuation & digits
    "।": "꯫", "॥": "꯫꯫",
    "?": "꫱", ",": "꫰",
    "০": "꯰', '১': '꯱', '২': '꯲', '৩': '꯳', '৪': '꯴",
    "৫": "꯵', '৬': '꯶', '৭': '꯷', '৮': '꯸', '৯': '꯹",
  };

  static const Map<String, String> extendedVocabulary = {
  // Common Structural & Editorial Terms
    "introduction": "ꯑꯍꯥꯟꯕ ꯋꯥꯔꯣꯜ",
    "section": "ꯁꯔꯨꯛ",
    "conclusion": "ꯋꯥꯔꯣꯢꯁꯤꯟ",
    "summary": "ꯇꯦꯟꯊꯛ",
    "overview": "ꯃꯤꯠꯌꯦꯡ",
    "philosophy": "ꯋꯥꯈꯜꯂꯣꯟ",
    "wisdom": "ꯂꯧꯁꯤꯡ",
    "ancient": "ꯑꯔꯤꯕ",
    "manuscript": "ꯄꯨꯌꯥ",
    "manuscripts": "ꯄꯨꯌꯥꯁꯤꯡ",
    "history": "ꯄꯨꯋꯥꯔꯤ",
    "culture": "ꯆꯠꯅꯕꯤ",
    "tradition": "ꯆꯠꯅꯕꯤ",
    "time": "ꯃꯇꯝ",
    "life": "ꯄꯨꯟꯁꯤ",
    "nature": "ꯃꯍꯧꯁꯥ",
    "human": "ꯃꯤꯑꯣꯏꯕ",
    "world": "ꯃꯥꯂꯦꯝ",
    "universe": "ꯇꯥꯏꯕꯪ",
    "language": "ꯂꯣꯟ",
    "script": "ꯃꯌꯦꯛ",
    "science": "ꯁꯥꯏꯟꯁ",
    "technology": "ꯇꯦꯛꯅꯣꯂꯣꯖꯤ",
    "engineering": "ꯏꯟꯖꯤꯅꯤꯌꯔꯤꯡ",
    "architecture": "ꯑꯥꯔꯀꯤꯇꯦꯛꯆꯔ",
    "article": "ꯋꯥꯔꯦꯡ",
    "articles": "ꯋꯥꯔꯦꯡꯁꯤꯡ",
    "author": "ꯑꯏꯕ",
    "date": "ꯇꯥꯡ",
    "read": "ꯄꯥꯕ",
    "reading": "ꯄꯥꯕ",
    "write": "ꯏꯕ",
    "writing": "ꯏꯕ",
    "minute": "ꯃꯤꯅꯤꯠ",
    "minutes": "ꯃꯤꯅꯤꯠ",
    "hour": "ꯄꯨꯡ",
    "hours": "ꯄꯨꯡꯁꯤꯡ",
    "day": "ꯅꯨꯃꯤꯠ",
    "days": "ꯅꯨꯃꯤꯠꯁꯤꯡ",
    "year": "ꯆꯍꯤ",
    "years": "ꯆꯍꯤꯁꯤꯡ",
    "moment": "ꯃꯤꯀꯨꯞ",
    "moments": "ꯃꯤꯀꯨꯞꯁꯤꯡ",
    "second": "ꯁꯦꯀꯦꯟꯗ",
    "seconds": "ꯁꯦꯀꯦꯟꯗꯁꯤꯡ",
    "simplicity": "ꯂꯥꯏꯕ",
    "reliability": "ꯊꯥꯖꯕ ꯌꯥꯕ",
    "prerequisite": "ꯃꯔꯨꯑꯣꯏꯕ ꯇꯥꯡꯀꯛ",
    "fast": "ꯌꯥꯡꯕ",
    "portable": "ꯄꯨꯕ ꯌꯥꯕ",
    "standard": "ꯁ꯭ꯇꯦꯟꯗꯔꯗ",
    "serverless": "ꯁꯔꯚꯔꯂꯦꯁ",
    "headless": "ꯍꯦꯗꯂꯦꯁ",
    "markdown": "ꯃꯥꯔꯛꯗꯥꯎꯟ",
    "bold": "ꯃꯣꯇꯥ",
    "italics": "ꯏꯇꯥꯂꯤꯛ",
    "quotes": "ꯈꯣꯟꯊꯣꯛ",
    "tables": "ꯇꯦꯕꯜꯁꯤꯡ",
    "key": "ꯃꯔꯨ",
    "description": "ꯁꯟꯗꯣꯛꯅ ꯇꯥꯛꯄ",
    "idea": "ꯋꯥꯈꯜꯂꯣꯟ",
    "core": "ꯃꯔꯨꯑꯣꯏꯕ",
    "support": "ꯁꯧꯒꯠꯄ",
    "featured": "ꯃꯔꯨꯑꯣꯏꯕ",
    "general": "ꯃꯌꯥꯝ",
    "duration": "ꯃꯇꯝꯒꯤ ꯃꯇꯝ",
    "subjective": "ꯁꯕꯖꯦꯛꯇꯤꯚ",
    "objective": "ꯑꯣꯕꯖꯦꯛꯇꯤꯚ",
    "chronological": "ꯃꯇꯝꯒꯤ ꯃꯇꯨꯡ ꯏꯟꯅ",
    "physics": "ꯐꯤꯖꯤꯛꯁ",
    "versus": "ꯃꯥꯌꯣꯛꯇ",
    "vs": "ꯃꯥꯌꯣꯛꯇ",
    "vs.": "ꯃꯥꯌꯣꯛꯇ꯫",
    "phenomenological": "ꯐꯦꯅꯣꯃꯦꯅꯣꯂꯣꯖꯤꯀꯦꯜ",
    "consciousness": "ꯋꯥꯈꯜ",
    "constructs": "ꯁꯦꯝꯃꯤ",
    "construct": "ꯁꯦꯝꯕ",
    "illusion": "ꯑꯔꯥꯟꯕ ꯃꯤꯠꯌꯦꯡ",
    "temporal": "ꯃꯇꯝꯒꯤ",
    "flow": "ꯏꯆꯦꯜ",
    "why": "ꯀꯔꯤꯒꯤ",
    "stretch": "ꯂꯤꯡꯕ",
    "fly": "ꯄꯥꯏꯕ",
    "flies": "ꯄꯥꯏ",
    "often": "ꯀꯌꯥꯔꯛ",
    "measured": "ꯆꯥꯡ ꯌꯦꯡꯕ",
    "cold": "ꯑꯔꯤꯡꯕ",
    "mechanical": "ꯃꯦꯀꯥꯅꯤꯀꯦꯜ",
    "indifference": "ꯃꯤꯠꯌꯦꯡ ꯂꯩꯇꯕ",
    "quartz": "ꯀ꯭ꯋꯥꯔꯠꯖ",
    "oscillator": "ꯑꯣꯁꯤꯂꯦꯇꯔ",
    "vibrating": "ꯋꯥꯏꯕ꯭ꯔꯦꯇꯤꯡ",
    "times": "ꯃꯇꯝꯁꯤꯡ",
    "per": "ꯈꯨꯗꯤꯡꯒꯤ",
    "cesium": "ꯁꯤꯖꯤꯌꯝ",
    "atomic": "ꯑꯦꯇꯣꯃꯤꯛ",
    "clock": "ꯄꯨꯡ",
    "registering": "ꯔꯦꯖꯤꯁꯇꯔ ꯇꯧꯕ",
    "transition": "ꯍꯣꯡꯂꯛꯄ",
    "frequencies": "ꯐ꯭ꯔꯤꯛꯋꯦꯟꯁꯤꯁꯤꯡ",
    "energy": "ꯁꯛꯇꯤ",
    "states": "ꯐꯤꯚꯝꯁꯤꯡ",
    "inhabited": "ꯂꯩꯔꯛꯈꯤ",
    "live": "ꯍꯤꯡꯕ",
    "inside": "ꯃꯅꯨꯡꯗ",
    "elastic": "ꯏꯂꯥꯁꯇꯤꯛ",
    "psychological": "ꯋꯥꯈꯜꯂꯣꯟꯒꯤ",
    "expands": "ꯆꯥꯎꯈꯠꯄ",
    "during": "ꯃꯇꯝꯗ",
    "intense": "ꯀꯟꯅ",
    "focus": "ꯃꯤꯠꯌꯦꯡ",
    "fear": "ꯀꯤꯕ",
    "evaporates": "ꯃꯥꯡꯈꯤꯕ",
    "periods": "ꯃꯇꯝꯁꯤꯡ",
    "routine": "ꯅꯨꯃꯤꯠ ꯈꯨꯗꯤꯡꯒꯤ",
    "arnold": "ꯑꯥꯔꯅꯣꯜꯗ",
    "cd": "ꯁꯤꯗꯤ",
    "st": "ꯁꯦꯟꯠ",
    "augustine": "ꯑꯣꯒꯁ꯭ꯇꯤꯟ",
    "confessions": "ꯋꯥꯁꯛ",
    "chronos": "ꯈ꯭ꯔꯣꯅꯣꯁ",
    "kairos": "ꯀꯥꯏꯔꯣꯁ",
    "greeks": "ꯒ꯭ꯔꯤꯛꯁꯤꯡ",
    "greek": "ꯒ꯭ꯔꯤꯛ",
    "distinct": "ꯇꯣꯉꯥꯟꯕ",
    "dimensions": "ꯃꯥꯏꯀꯩꯁꯤꯡ",
    "dimension": "ꯃꯥꯏꯀꯩ",
    "memory": "ꯅꯤꯡꯁꯤꯡꯕ",
    "emotional": "ꯄꯨꯛꯅꯤꯡꯒꯤ",
    "experience": "ꯑꯦꯛꯁꯄꯔꯤꯌꯦꯟꯁ",
    "experiences": "ꯑꯦꯛꯁꯄꯔꯤꯌꯦꯟꯁꯁꯤꯡ",
    "between": "ꯃꯔꯛꯇ",
    "from": "ꯗꯒꯤ",
    "to": "ꯗ",
    "in": "ꯗ",
    "of": "ꯒꯤ",
    "for": "ꯒꯤꯗꯃꯛ",
    "with": "ꯒ ꯂꯣꯏꯅꯅ",
    "the": "ꯑꯗꯨ",
    "and": "ꯑꯃꯁꯨꯡ",
    "is": "ꯑꯣꯏ",
    "are": "ꯑꯣꯏꯔꯤ",
    "we": "ꯑꯩꯈꯣꯏ",
    "you": "ꯅꯍꯥꯛ",
    "they": "ꯃꯈꯣꯏ",
    "he": "ꯃꯍꯥꯛ",
    "she": "ꯃꯍꯥꯛ",
    "it": "ꯃꯁꯤ",
    "this": "ꯃꯁꯤ",
    "that": "ꯃꯗꯨ",
    "what": "ꯀꯔꯤ",
    "when": "ꯀꯗꯥꯏꯗ",
    "where": "ꯀꯗꯥꯏꯗ",
    "who": "ꯀꯅꯥ",
    "how": "ꯀꯔꯝꯅ",
    "all": "ꯄꯨꯝꯅꯃꯛ",
    "no": "ꯅꯠꯇꯦ",
    "not": "ꯅꯠꯇꯦ",
    "yes": "ꯍꯣꯏ",
    "if": "ꯀꯔꯤꯒꯨꯝꯕ",
    "then": "ꯑꯗꯨꯗꯤ",
    "me": "ꯑꯩꯉꯣꯟꯗ",
    "my": "ꯑꯩꯒꯤ",
    "him": "ꯃꯍꯥꯛꯄꯨ",
    "his": "ꯃꯍꯥꯛꯀꯤ",
    "her": "ꯃꯍꯥꯛꯀꯤ",
    "one": "ꯑꯃ",
    "two": "ꯑꯅꯤ",
    "three": "ꯑꯍꯨꯝ",
    "four": "ꯃꯔꯤ",
    "five": "ꯃꯉꯥ",
    "six": "ꯇꯔꯨꯛ",
    "seven": "ꯇꯔꯦꯠ",
    "eight": "ꯅꯤꯄꯥꯟ",
    "nine": "ꯃꯄꯥꯟ",
    "ten": "ꯇꯔꯥ",
  // Cheishing (Traditional Number System & Counting Scale)
    "cheishing": "ꯆꯩꯁꯤꯡ",
    "thiba": "ꯊꯤꯕ",
    "ama": "ꯑꯃ",
    "ani": "ꯑꯅꯤ",
    "ahum": "ꯑꯍꯨꯝ",
    "mari": "ꯃꯔꯤ",
    "manga": "ꯃꯉꯥ",
    "taruk": "ꯇꯔꯨꯛ",
    "taret": "ꯇꯔꯦꯠ",
    "nipal": "ꯅꯤꯄꯥꯜ",
    "nipan": "ꯅꯤꯄꯥꯟ",
    "mapal": "ꯃꯄꯥꯜ",
    "mapan": "ꯃꯄꯥꯟ",
    "tara": "ꯇꯔꯥ",
    "cha": "ꯆꯥ",
    "hundred": "ꯆꯥ",
    "leeshing": "ꯂꯤꯁꯤꯡ",
    "thousand": "ꯂꯤꯁꯤꯡ",
    "leecha": "ꯂꯤꯆꯥ",
    "lakh": "ꯂꯤꯆꯥ",
    "leepun": "ꯂꯤꯄꯨꯟ",
    "crore": "ꯂꯤꯄꯨꯟ",
    "leepot": "ꯂꯤꯄꯣꯠ",
    "billion": "ꯂꯤꯄꯣꯠ",
    "leekei": "ꯂꯤꯀꯩ",
    "trillion": "ꯂꯤꯀꯩ ꯇꯔꯥ",
    "puu": "ꯄꯨ",
    "puu ama": "ꯄꯨ ꯑꯃ",
  // Months
    "january": "ꯖꯥꯅꯨꯋꯥꯔꯤ",
    "february": "ꯐꯦꯕ꯭ꯔꯨꯋꯥꯔꯤ",
    "march": "ꯃꯥꯔꯆ",
    "april": "ꯑꯦꯞꯔꯤꯜ",
    "may": "ꯃꯦ",
    "june": "ꯖꯨꯟ",
    "july": "ꯖꯨꯂꯥꯏ",
    "august": "ꯑꯣꯒꯁ꯭ꯠ",
    "september": "ꯁꯦꯞꯇꯦꯝꯕꯔ",
    "october": "ꯑꯣꯛꯇꯣꯕꯔ",
    "november": "ꯅꯣꯚꯦꯝꯕꯔ",
    "december": "ꯗꯤꯁꯦꯝꯕꯔ",
  // Days of week
    "sunday": "ꯅꯣꯡꯃꯥꯏꯖꯤꯡ",
    "monday": "ꯅꯤꯡꯊꯧꯀꯥꯕ",
    "tuesday": "ꯂꯩꯄꯥꯛꯄꯣꯛꯄ",
    "wednesday": "ꯌꯨꯝꯁꯀꯩꯁꯥ",
    "thursday": "ꯁꯒꯣꯜꯁꯦꯟ",
    "friday": "ꯏꯔꯥꯏ",
    "saturday": "ꯊꯥꯡꯖ",
  };

  static const Map<String, String> commonPhoneticWords = {
    "oina": "ꯑꯣꯏꯅ",
    "oja": "ꯑꯣꯖꯥ",
    "kmdwrige": "ꯀꯃꯗꯧꯔꯤꯒꯦ",
    "kamdwrige": "ꯀꯃꯗꯧꯔꯤꯒꯦ",
    "kamdourige": "ꯀꯃꯗꯧꯔꯤꯒꯦ",
    "kmdwba": "ꯀꯃꯗꯧꯕ",
    "kamdwba": "ꯀꯃꯗꯧꯕ",
    "kmdwre": "ꯀꯃꯗꯧꯔꯦ",
    "kmdwri": "ꯀꯃꯗꯧꯔꯤ",
    "twrige": "ꯇꯧꯔꯤꯒꯦ",
    "tourige": "ꯇꯧꯔꯤꯒꯦ",
    "twba": "ꯇꯧꯕ",
    "touba": "ꯇꯧꯕ",
    "dwge": "ꯗꯧꯒꯦ",
    "douge": "ꯗꯧꯒꯦ",
    "kangleipak": "ꯀꯪꯂꯩꯄꯥꯛ",
    "manipur": "ꯃꯅꯤꯄꯨꯔ",
    "meetei": "ꯃꯤꯇꯩ",
    "meitei": "ꯃꯤꯇꯩ",
    "mayek": "ꯃꯌꯦꯛ",
    "puya": "ꯄꯨꯌꯥ",
    "khunung": "ꯈꯨꯅꯨꯡ",
    "khamba": "ꯈꯝꯕ",
    "thoibi": "ꯊꯣꯢꯕꯤ",
    "nongda": "ꯅꯣꯡꯗ",
    "lairen": "ꯂꯥꯢꯔꯦꯟ",
    "pakhangba": "ꯄꯥꯈꯪꯕ",
    "sanahi": "ꯁꯅꯥꯍꯤ",
    "sanamahi": "ꯁꯅꯥꯃꯍꯤ",
    "leishemba": "ꯂꯩꯁꯦꯝꯕ",
    "ima": "ꯏꯃꯥ",
    "iba": "ꯏꯕ",
    "khurumjari": "ꯈꯨꯔꯨꯝꯖꯔꯤ",
    "thagatchari": "ꯊꯥꯒꯠꯆꯔꯤ",
  };

  static const Map<String, String> greekTransliteration = {
  // Common Greek philosophical terms
    "Χρόνος": "ꯈ꯭ꯔꯣꯅꯣꯁ",
    "χρόνος": "ꯈ꯭ꯔꯣꯅꯣꯁ",
    "Καιρός": "ꯀꯥꯏꯔꯣꯁ",
    "καιρός": "ꯀꯥꯏꯔꯣꯁ",
  // Greek Uppercase (e.g. Χ and Κ which look identical to Latin X and K)
    "Α": "ꯑ', 'Β': 'ꯕ', 'Γ': 'ꯒ', 'Δ': 'ꯗ', 'Ε': 'ꯑꯦ",
    "Ζ": "ꯖ', 'Η': 'ꯑꯦ', 'Θ': 'ꯊ', 'Ι': 'ꯏ', 'Κ': 'ꯀ",
    "Λ": "ꯂ', 'Μ': 'ꯃ', 'Ν': 'ꯅ', 'Ξ': 'ꯛꯁ', 'Ο': 'ꯑꯣ",
    "Π": "ꯄ', 'Ρ': 'ꯔ', 'Σ': 'ꯁ', 'Τ': 'ꯇ', 'Υ': 'ꯎ",
    "Φ": "ꯐ', 'Χ': 'ꯈ', 'Ψ': 'ꯄꯁ', 'Ω': 'ꯑꯣ",
  // Greek Lowercase
    "α": "ꯑ', 'β': 'ꯕ', 'γ': 'ꯒ', 'δ': 'ꯗ', 'ε': 'ꯑꯦ",
    "ζ": "ꯖ', 'η': 'ꯑꯦ', 'θ': 'ꯊ', 'ι': 'ꯏ', 'κ': 'ꯀ",
    "λ": "ꯂ', 'μ': 'ꯃ', 'ν': 'ꯅ', 'ξ': 'ꯛꯁ', 'ο': 'ꯑꯣ",
    "π": "ꯄ', 'ρ': 'ꯔ', 'σ': 'ꯁ', 'ς': 'ꯁ', 'τ': 'ꯇ",
    "υ": "ꯎ', 'φ': 'ꯐ', 'χ': 'ꯈ', 'ψ': 'ꯄꯁ', 'ω': 'ꯑꯣ",
  // Greek with accents / tonos / dialytika
    "ά": "ꯑꯥ', 'έ': 'ꯑꯦ', 'ή': 'ꯑꯦ', 'ί': 'ꯏ', 'ό': 'ꯑꯣ",
    "ύ": "ꯎ', 'ώ': 'ꯑꯣ', 'Ά': 'ꯑꯥ', 'Έ': 'ꯑꯦ', 'Ή': 'ꯑꯦ",
    "Ί": "ꯏ', 'Ό': 'ꯑꯣ', 'Ύ': 'ꯎ', 'Ώ': 'ꯑꯣ",
    "ϊ": "ꯏ', 'ϋ': 'ꯎ', 'ΐ': 'ꯏ', 'ΰ': 'ꯎ",
  };

  static const List<List<String>> meeteiDigits = [
    ["0", "꯰"], ["1", "꯱"], ["2", "꯲"], ["3", "꯳"], ["4", "꯴"],
    ["5", "꯵"], ["6", "꯶"], ["7", "꯷"], ["8", "꯸"], ["9", "꯹"],
  ];

  static const Map<String, String> latinLetterFallback = {
    "a": "ꯑ', b: 'ꯕ', c: 'ꯀ', d: 'ꯗ', e: 'ꯑꯦ', f: 'ꯐ",
    "g": "ꯒ', h: 'ꯍ', i: 'ꯏ', j: 'ꯖ', k: 'ꯀ', l: 'ꯂ",
    "m": "ꯃ', n: 'ꯅ', o: 'ꯑꯣ', p: 'ꯄ', q: 'ꯀ', r: 'ꯔ",
    "s": "ꯁ', t: 'ꯇ', u: 'ꯎ', v: 'ꯋ', w: 'ꯋ', x: 'ꯛꯁ",
    "y": "ꯌ', z: 'ꯖ",
  };

  static String transliterateLatinWord(String token) {
    String word = token;
    for (final entry in greekTransliteration.entries) {
      word = word.replaceAll(entry.key, entry.value);
    }
    word = word.toLowerCase();

    // Manipuri phonetic typing rule: consonant + 'w' represents sou-nap (ꯧ /ou/)
    // e.g. dw -> d + sou-nap (ꯗꯧ), tw -> tou (ꯇꯧ), kmdwrige -> kamdourige -> ꯀꯃꯗꯧꯔꯤꯒꯦ
    word = word.replaceAllMapped(
      RegExp(r'([b-df-hj-np-tv-z])w(?=[b-df-hj-np-tv-z]|$|[ie])'),
      (m) => "${m[1]}ou",
    );
    word = word.replaceAllMapped(
      RegExp(r'([b-df-hj-np-tv-z])ow(?=[b-df-hj-np-tv-z]|$|[ie])'),
      (m) => "${m[1]}ou",
    );

    const clusters = [
      ["sch", "ꯁ꯭ꯀ"],
      ["tch", "ꯆ"],
      ["tion", "ꯁꯟ"],
      ["sion", "ꯁꯟ"],
      ["ight", "ꯑꯥꯏꯠ"],
      ["ous", "ꯑꯁ"],
      ["ing", "ꯤꯡ"],
      ["all", "ꯑꯣꯜ"],
      ["ell", "ꯑꯦꯜ"],
      ["ill", "ꯏꯜ"],
      ["ull", "ꯎꯜ"],
      ["wh", "ꯋ"],
      ["ck", "ꯛ"],
      ["qu", "ꯀ꯭ꯋ"],
      ["ph", "ꯐ"],
      ["ch", "ꯆ"],
      ["sh", "ꯁ"],
      ["th", "ꯊ"],
      ["dh", "ꯙ"],
      ["gh", "ꯘ"],
      ["jh", "ꯓ"],
      ["bh", "ꯚ"],
      ["kh", "ꯈ"],
      ["ng", "ꯉ"],
    ];

    for (final pair in clusters) {
      word = word.replaceAll(pair[0], pair[1]);
    }

    // Soft c before e, i, y -> Sam (ꯁ); hard c elsewhere -> Kok (ꯀ)
    word = word.replaceAllMapped(RegExp(r'c([eiy])'), (m) => "ꯁ${m[1]}");
    word = word.replaceAll('c', 'ꯀ');

    const consonants = [
      ["k", "ꯀ"], ["s", "ꯁ"], ["l", "ꯂ"], ["m", "ꯃ"],
      ["p", "ꯄ"], ["n", "ꯅ"], ["t", "ꯇ"], ["w", "ꯋ"],
      ["y", "ꯌ"], ["h", "ꯍ"], ["g", "ꯒ"], ["r", "ꯔ"],
      ["b", "ꯕ"], ["j", "ꯖ"], ["d", "ꯗ"], ["f", "ꯐ"],
      ["v", "ꯋ"], ["z", "ꯖ"], ["x", "ꯛꯁ"], ["q", "ꯀ"],
    ];

    for (final pair in consonants) {
      word = word.replaceAll(pair[0], pair[1]);
    }

    // Initial independent vowels
    final initialVowels = [
      [RegExp(r'^aa'), 'ꯑꯥ'], [RegExp(r'^ee'), 'ꯏ'], [RegExp(r'^ei'), 'ꯑꯩ'], [RegExp(r'^ai'), 'ꯑꯩ'],
      [RegExp(r'^ou'), 'ꯑꯧ'], [RegExp(r'^au'), 'ꯑꯧ'], [RegExp(r'^oo'), 'ꯎ'],
      [RegExp(r'^a'), 'ꯑ'], [RegExp(r'^i'), 'ꯏ'], [RegExp(r'^u'), 'ꯎ'], [RegExp(r'^e'), 'ꯑꯦ'], [RegExp(r'^o'), 'ꯑꯣ'],
    ];

    for (final iv in initialVowels) {
      word = word.replaceFirst(iv[0] as RegExp, iv[1] as String);
    }

    // Dependent vowel signs (Cheitap)
    const dependentVowels = [
      ["aa", "ꯥ"], ["ee", "ꯤ"], ["ei", "ꯩ"], ["ai", "ꯩ"],
      ["ou", "ꯧ"], ["au", "ꯧ"], ["oo", "ꯨ"],
      ["a", "ꯥ"], ["i", "ꯤ"], ["u", "ꯨ"], ["e", "ꯦ"], ["o", "ꯣ"],
    ];

    for (final pair in dependentVowels) {
      word = word.replaceAll(pair[0], pair[1]);
    }

    // Fallback pass: eliminate remaining Latin alphabet letters
    final sb = StringBuffer();
    for (int i = 0; i < word.length; i++) {
      final ch = word[i];
      sb.write(latinLetterFallback[ch] ?? ch);
    }

    return sb.toString();
  }

  static String cleanupOrphanedVowels(String text) {
    String clean = text;
    final pattern = RegExp(r'(^|[^ꯀ-ꯢꫠ-ꫪ])([ꯣ-ꯪ꯬])');
    while (pattern.hasMatch(clean)) {
      clean = clean.replaceAllMapped(pattern, (m) => "${m[1]}ꯑ${m[2]}");
    }

    clean = clean.replaceAll('ꯑꯤ', 'ꯏ');
    clean = clean.replaceAll('ꯑꯨ', 'ꯎ');
    return clean;
  }

  static String translateToMeeteiMayek(String input) {
    if (input.trim().isEmpty) return input;

    String text = input;

    final containsBengali = RegExp(r'[ঀ-৿]').hasMatch(text);
    if (containsBengali) {
      final sb = StringBuffer();
      for (int i = 0; i < text.length; i++) {
        final ch = text[i];
        sb.write(bengaliToMeeteiMap[ch] ?? ch);
      }
      return cleanupOrphanedVowels(sb.toString());
    }

    for (final entry in commonPhoneticWords.entries) {
      final regex = RegExp('\\b${entry.key}\\b', caseSensitive: false);
      text = text.replaceAll(regex, entry.value);
    }

    for (final entry in greekTransliteration.entries) {
      text = text.replaceAll(entry.key, entry.value);
    }

    final tokenRegex = RegExp(r'([a-zA-ZͰ-Ͽἀ-῿]+|[0-9]+)');
    final matches = tokenRegex.allMatches(text);
    
    final convertedParts = <String>[];
    int lastIndex = 0;

    for (final match in matches) {
      if (match.start > lastIndex) {
        String punct = text.substring(lastIndex, match.start);
        punct = punct.replaceAll('?', '꫱').replaceAll(',', '꫰').replaceAll('.', '꯫');
        convertedParts.add(punct);
      }
      final token = match.group(0)!;
      if (RegExp(r'^[a-zA-ZͰ-Ͽἀ-῿]+$').hasMatch(token)) {
        convertedParts.add(transliterateLatinWord(token));
      } else if (RegExp(r'^[0-9]+$').hasMatch(token)) {
        String d = token;
        for (final pair in meeteiDigits) {
          d = d.replaceAll(pair[0], pair[1]);
        }
        convertedParts.add(d);
      }
      lastIndex = match.end;
    }

    if (lastIndex < text.length) {
      String punct = text.substring(lastIndex);
      punct = punct.replaceAll('?', '꫱').replaceAll(',', '꫰').replaceAll('.', '꯫');
      convertedParts.add(punct);
    }

    return cleanupOrphanedVowels(convertedParts.join(''));
  }

  static String translateToMeeteiMayekWithVocab(String input) {
    if (input.isEmpty) return '';

    String text = input;

    for (final entry in extendedVocabulary.entries) {
      final regex = RegExp('\\b${entry.key}\\b', caseSensitive: false);
      text = text.replaceAll(regex, entry.value);
    }

    return translateToMeeteiMayek(text);
  }

  static String translateMarkdownToMeeteiMayek(String markdown) {
    if (markdown.isEmpty) return '';

    final lines = markdown.split('\n');
    bool inCodeBlock = false;
    final translatedLines = <String>[];

    for (final line in lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        translatedLines.add(line);
        continue;
      }

      if (inCodeBlock) {
        translatedLines.add(line);
        continue;
      }

      if (line.trim().isEmpty || line.trim() == '---' || line.trim() == '***') {
        translatedLines.add(line);
        continue;
      }

      // Headings
      final headingMatch = RegExp(r'^(#{1,6}\s+)(.*)$').firstMatch(line);
      if (headingMatch != null) {
        final hashes = headingMatch.group(1)!;
        final text = headingMatch.group(2)!;
        translatedLines.add("$hashes${_translateTextSegments(text)}");
        continue;
      }

      // Blockquote
      final quoteMatch = RegExp(r'^(\s*>\s*)(.*)$').firstMatch(line);
      if (quoteMatch != null) {
        final quotePrefix = quoteMatch.group(1)!;
        final text = quoteMatch.group(2)!;
        translatedLines.add("$quotePrefix${_translateTextSegments(text)}");
        continue;
      }

      // List items
      final listMatch = RegExp(r'^(\s*[-*+]\s+|\s*\d+\.\s+)(.*)$').firstMatch(line);
      if (listMatch != null) {
        final listPrefix = listMatch.group(1)!;
        final text = listMatch.group(2)!;
        translatedLines.add("$listPrefix${_translateTextSegments(text)}");
        continue;
      }

      // Table rows
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (RegExp(r'^\|\s*[-:]+[-|\s:]*\|$').hasMatch(line.trim())) {
          translatedLines.add(line);
          continue;
        }
        final cells = line.split('|');
        final translatedCells = cells.asMap().entries.map((e) {
          if (e.key == 0 || e.key == cells.length - 1) return e.value;
          return _translateTextSegments(e.value);
        }).toList();
        translatedLines.add(translatedCells.join('|'));
        continue;
      }

      // Paragraph text
      translatedLines.add(_translateTextSegments(line));
    }

    return translatedLines.join('\n');
  }

  static String _translateTextSegments(String text) {
    final tokenRegex = RegExp(r'(!?\[.*?\]\(.*?\)|`[^`]+`|<[^>]+>)');
    final matches = tokenRegex.allMatches(text);

    if (matches.isEmpty) {
      return translateToMeeteiMayekWithVocab(text);
    }

    final sb = StringBuffer();
    int lastIndex = 0;

    for (final match in matches) {
      if (match.start > lastIndex) {
        sb.write(translateToMeeteiMayekWithVocab(text.substring(lastIndex, match.start)));
      }
      final part = match.group(0)!;

      // Images
      final imgMatch = RegExp(r'^!\[(.*?)\]\((.*?)\)$').firstMatch(part);
      if (imgMatch != null) {
        final alt = imgMatch.group(1)!;
        final url = imgMatch.group(2)!;
        sb.write("![");
        sb.write(translateToMeeteiMayekWithVocab(alt));
        sb.write("]($url)");
      } else {
        // Links
        final linkMatch = RegExp(r'^\[(.*?)\]\((.*?)\)$').firstMatch(part);
        if (linkMatch != null) {
          final label = linkMatch.group(1)!;
          final url = linkMatch.group(2)!;
          sb.write("[");
          sb.write(translateToMeeteiMayekWithVocab(label));
          sb.write("]($url)");
        } else {
          sb.write(part);
        }
      }
      lastIndex = match.end;
    }

    if (lastIndex < text.length) {
      sb.write(translateToMeeteiMayekWithVocab(text.substring(lastIndex)));
    }

    return sb.toString();
  }
}
