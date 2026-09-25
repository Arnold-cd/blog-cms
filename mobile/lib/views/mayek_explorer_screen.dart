import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "../models/meetei_character.dart";
import "../services/meetei_data.dart";
import "../services/meetei_mayek_service.dart";
import "../theme/app_theme.dart";

class MayekExplorerScreen extends StatefulWidget {
  const MayekExplorerScreen({super.key});

  @override
  State<MayekExplorerScreen> createState() => _MayekExplorerScreenState();
}

class _MayekExplorerScreenState extends State<MayekExplorerScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _typeController = TextEditingController(text: "kmdwrige nungaiiribo");
  String _translatedOutput = "";
  String _cheitapGroup = 'core18';
  int _cheitapBaseIndex = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _updateTranslation(_typeController.text);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _typeController.dispose();
    super.dispose();
  }

  void _updateTranslation(String input) {
    setState(() {
      _translatedOutput = MeeteiMayekService.translateToMeeteiMayekWithVocab(input);
    });
  }

  void _insertChar(String char) {
    final text = _typeController.text;
    final selection = _typeController.selection;
    if (selection.start >= 0) {
      final newText = text.replaceRange(selection.start, selection.end, char);
      _typeController.value = TextEditingValue(
        text: newText,
        selection: TextSelection.collapsed(offset: selection.start + char.length),
      );
    } else {
      _typeController.text += char;
    }
    _updateTranslation(_typeController.text);
  }

  Widget _buildPukokFormula(
    String keyChar,
    String word, {
    double fontSize = 18,
    Color? color,
  }) {
    if (word.isEmpty) {
      return Text(
        keyChar,
        style: TextStyle(
          fontFamily: "PukokEeyek",
          fontSize: fontSize,
          fontWeight: FontWeight.normal,
          color: color,
          height: 1.1,
        ),
      );
    }
    return Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          keyChar,
          style: TextStyle(
            fontFamily: "PukokEeyek",
            fontSize: fontSize,
            fontWeight: FontWeight.normal,
            color: color,
            height: 1.1,
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 2.5),
          child: Text(
            ":",
            style: TextStyle(
              fontSize: fontSize * 0.72,
              fontWeight: FontWeight.bold,
              color: color?.withValues(alpha: 0.6) ?? Colors.grey,
              height: 1.1,
            ),
          ),
        ),
        Text(
          word,
          style: TextStyle(
            fontFamily: "PukokEeyek",
            fontSize: fontSize,
            fontWeight: FontWeight.normal,
            color: color,
            height: 1.1,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: isDark
                            ? [const Color(0xFF6366F1), const Color(0xFF4F46E5)]
                            : [const Color(0xFF4F46E5), const Color(0xFF4338CA)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      MeeteiMayekService.convertUnicodeToPukokFont("ꯃ"),
                      style: const TextStyle(
                        fontFamily: "PukokEeyek",
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            MeeteiMayekService.convertUnicodeToPukokFont("ꯃꯌꯦꯛ"),
                            style: const TextStyle(
                              fontFamily: "PukokEeyek",
                              fontSize: 22,
                              fontWeight: FontWeight.normal,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Text(
                            "Explorer",
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        "Meetei Mayek Script Guide & Sandbox",
                        style: theme.textTheme.bodySmall?.copyWith(
                          fontSize: 11,
                          color: theme.textTheme.bodySmall?.color?.withValues(alpha: 0.7),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Tab Bar
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E1E26) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isDark ? Colors.white.withValues(alpha: 0.06) : Colors.black.withValues(alpha: 0.05),
                ),
              ),
              child: TabBar(
                controller: _tabController,
                indicatorSize: TabBarIndicatorSize.tab,
                dividerColor: Colors.transparent,
                indicator: BoxDecoration(
                  color: isDark ? const Color(0xFF3B82F6) : Colors.white,
                  borderRadius: BorderRadius.circular(9),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.06),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                labelColor: isDark ? Colors.white : const Color(0xFF0F172A),
                unselectedLabelColor: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                labelStyle: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700),
                unselectedLabelStyle: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w500),
                labelPadding: EdgeInsets.zero,
                isScrollable: false,
                tabs: const [
                  Tab(text: "Sandbox"),
                  Tab(text: "Puya"),
                  Tab(text: "Letters"),
                  Tab(text: "Cheitap"),
                  Tab(text: "Numbers"),
                ],
              ),
            ),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildSandboxTab(context, isDark),
                  _buildPuyaTab(context, isDark),
                  _buildLettersTab(context, isDark),
                  _buildCheitapTab(context, isDark),
                  _buildNumbersTab(context, isDark),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 1. Sandbox Tab
  Widget _buildSandboxTab(BuildContext context, bool isDark) {
    final theme = Theme.of(context);

    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      children: [
        // Live Output Display Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF141418) : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Text(
                      "AUTHENTIC WAKOKLON PUKOK EEYEK",
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF6366F1),
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),
                  Row(
                    children: [
                      IconButton(
                        tooltip: "Copy Pukok Font Keys",
                        icon: const Icon(Icons.key_rounded, size: 18),
                        onPressed: () {
                          if (_translatedOutput.isNotEmpty) {
                            final pukokKeys = MeeteiMayekService.convertUnicodeToPukokFont(_translatedOutput);
                            Clipboard.setData(ClipboardData(text: pukokKeys));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                duration: Duration(seconds: 1),
                                content: Text("Pukok font keys copied to clipboard!"),
                              ),
                            );
                          }
                        },
                      ),
                      IconButton(
                        tooltip: "Copy Meetei Unicode",
                        icon: const Icon(Icons.copy_rounded, size: 18),
                        onPressed: () {
                          if (_translatedOutput.isNotEmpty) {
                            Clipboard.setData(ClipboardData(text: _translatedOutput));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                duration: Duration(seconds: 1),
                                content: Text("Meetei Mayek copied to clipboard!"),
                              ),
                            );
                          }
                        },
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 12),
              SelectableText(
                _translatedOutput.isEmpty
                    ? "..."
                    : MeeteiMayekService.convertUnicodeToPukokFont(_translatedOutput),
                style: TextStyle(
                  fontFamily: "PukokEeyek",
                  fontSize: 32,
                  fontWeight: FontWeight.normal,
                  height: 1.4,
                  color: isDark ? const Color(0xFFF1F5F9) : const Color(0xFF0F172A),
                ),
              ),
              if (_translatedOutput.isNotEmpty) ...[
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white.withValues(alpha: 0.04) : Colors.black.withValues(alpha: 0.03),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Text(
                        "Pukok keys: ",
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
                      ),
                      Expanded(
                        child: Text(
                          MeeteiMayekService.convertUnicodeToPukokFont(_translatedOutput),
                          style: const TextStyle(fontSize: 12, fontFamily: "monospace", color: Color(0xFF6366F1), fontWeight: FontWeight.bold),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Cheitap Quick Diacritic Inserter
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "QUICK CHEITAP DIACRITICS (DIRECT SCRIPT)",
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: theme.textTheme.bodySmall?.color?.withValues(alpha: 0.6),
                letterSpacing: 0.8,
              ),
            ),
            const SizedBox(height: 8),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Row(
                children: [
                  for (final sign in MeeteiData.cheitap9Signs)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ActionChip(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        backgroundColor: isDark ? const Color(0xFF1B1B21) : const Color(0xFFF1F5F9),
                        avatar: Text(
                          sign.pukokKey,
                          style: const TextStyle(
                            fontFamily: "PukokEeyek",
                            fontSize: 16,
                            color: Color(0xFF6366F1),
                          ),
                        ),
                        label: Text(
                          "${sign.pukokKey} (${sign.name})",
                          style: const TextStyle(fontSize: 12),
                        ),
                        onPressed: () => _insertChar(sign.char),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),

        const SizedBox(height: 16),

        // Input Text Area
        Container(
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1B1B21) : const Color(0xFFF1F1F5),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
            ),
          ),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "TYPE IN ROMAN OR PHONETIC MANIPURI",
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: theme.textTheme.bodySmall?.color?.withValues(alpha: 0.6),
                      letterSpacing: 0.8,
                    ),
                  ),
                  if (_typeController.text.isNotEmpty)
                    GestureDetector(
                      onTap: () {
                        _typeController.clear();
                        _updateTranslation("");
                      },
                      child: Text(
                        "Clear",
                        style: TextStyle(
                          fontSize: 12,
                          color: theme.colorScheme.error,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _typeController,
                maxLines: 4,
                style: const TextStyle(fontSize: 15, height: 1.5),
                decoration: InputDecoration(
                  hintText: "e.g. kmdwrige nungaiiribo, kangleipak, pukninggi warol...",
                  hintStyle: TextStyle(
                    fontSize: 14,
                    color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.4),
                  ),
                  border: InputBorder.none,
                ),
                onChanged: _updateTranslation,
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Sample Prompts Chips
        Text(
          "TRY EXAMPLES",
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: theme.textTheme.bodySmall?.color?.withValues(alpha: 0.6),
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final ex in [
              "kmdwrige nungaiiribo",
              "pukninggi warol",
              "kangleipak",
              "eikhoi meetei mayek",
              "cha ama leeshing tara",
              "new article philosophy",
            ])
              ActionChip(
                backgroundColor: isDark ? const Color(0xFF1B1B21) : const Color(0xFFEAEAF0),
                label: Text(ex, style: const TextStyle(fontSize: 12)),
                onPressed: () {
                  _typeController.text = ex;
                  _updateTranslation(ex);
                },
              ),
          ],
        ),
      ],
    );
  }

  // 2. Puya 18 vs 27 & Pukok Keyboard Tab
  Widget _buildPuyaTab(BuildContext context, bool isDark) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      children: [
        // Sacred Charter Banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: isDark
                  ? [const Color(0xFF1E2235), const Color(0xFF161824)]
                  : [const Color(0xFFF8FAFC), const Color(0xFFF1F5F9)],
            ),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isDark ? const Color(0xFF6366F1).withValues(alpha: 0.3) : const Color(0xFFE2E8F0),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.auto_stories_rounded,
                    color: isDark ? const Color(0xFF818CF8) : const Color(0xFF4F46E5),
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "Wakoklon Heelel Thilel Salai Ama-Ilon Pukok Puya",
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                "Authentic ancient Kanglei linguistic science from the sacred Puya manuscript and research by Wangkhemcha Chingtamlen. Includes the official QWERTY layout designed by Wakambam Macha Waanglel.",
                style: TextStyle(
                  fontSize: 12,
                  height: 1.5,
                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // 3 Foundational Concepts
        _buildPuyaConceptCard(
          title: "🩸 Singthalon Cheising Eeyek Ama & The Eelik",
          desc: "In the Puya, numeral 1 is written with an Eelik (dot '.'), representing the sacred blood drop of the Universal Father God Creator, Eapung Loinapa Apakpa. The 1980 Gazette version removed this dot.",
          color: const Color(0xFF6366F1),
          isDark: isDark,
        ),
        const SizedBox(height: 10),
        _buildPuyaConceptCard(
          title: "🧘 18 Indigenous Anatomical Roots (Ipi Eeyek)",
          desc: "The 18 core letters correspond to parts of human anatomy: Kok (head/brain), Sam (hair), Lai (forehead), Meet (eye), Paa (eyebrow/eyelash), Naa (ear), Chil (lips), Til (saliva/tongue), Khou (throat), Ngou (uvula/neck), Thou (chest/breast), Wai (navel), Yang (spine), Huk (pelvis/joint), Oon (skin), Ee (blood), Pham (seat/womb/reproductive), and Atingaa (sky/immortality/eternity).",
          color: const Color(0xFF3B82F6),
          isDark: isDark,
        ),
        const SizedBox(height: 10),
        _buildPuyaConceptCard(
          title: "🌿 Native Lom (Derivation) vs Borrowed 27 Scripts",
          desc: "In authentic Kanglei grammar, the 9 additional consonants derive naturally from the 18 root letters with the Lom inflection dot: Ga = (kok lom), Jha = (sam lom), Ra = (lai lom), Ba = (Paa lom), Ja = (chin lom), Da = (Tin lom), Gha = (khou lom), Dha = (thou lom), Bha = (Pham lom), preserving sacred linguistic science without borrowing foreign scripts.",
          color: const Color(0xFF10B981),
          isDark: isDark,
        ),
        const SizedBox(height: 22),

        // Pukok QWERTY Keyboard Reference
        _buildSectionHeader(
          "PUKOK-EEYEK QWERTY KEYBOARD GUIDE",
          "Official Wakambam Macha Waanglel key layout for PukokEeyek.otf font",
        ),
        const SizedBox(height: 12),

        // 18 Roots Key Grid
        Text(
          "18 Ipi Eeyek Roots (k - a):",
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF334155),
          ),
        ),
        const SizedBox(height: 8),
        _buildPukokKeyGrid(
          MeeteiData.core18Letters.map((c) => {
            "key": c.pukokKey,
            "word": c.pukokWord,
            "name": "(${c.name})",
          }).toList(),
          isDark,
        ),
        const SizedBox(height: 18),

        // 9 Lom Consonants Key Grid
        const Text(
          "9 Lom Consonants (Chei-eeyek / Lom 9):",
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
        ),
        const SizedBox(height: 8),
        _buildPukokKeyGrid(
          MeeteiData.lom9Letters.map((c) => {
            "key": c.pukokKey,
            "word": c.pukokWord,
            "name": "(${c.name})",
          }).toList(),
          isDark,
        ),
        const SizedBox(height: 18),

        // 10 Lolsum Consonants Key Grid
        const Text(
          "10 Lolsum Consonants (Meetei lolsum 10):",
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
        ),
        const SizedBox(height: 8),
        _buildPukokKeyGrid(
          MeeteiData.lolsum10Letters.map((c) => {
            "key": c.pukokKey,
            "word": c.pukokWord,
            "name": "(${c.name})",
          }).toList(),
          isDark,
        ),
        const SizedBox(height: 18),

        // 9 Cheitap Diacritics Key Grid (from PDF 3)
        const Text(
          "9 Cheitap-Cheinap Vowel Diacritics (from PDF 3):",
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFFEC4899)),
        ),
        const SizedBox(height: 8),
        _buildPukokKeyGrid(
          MeeteiData.cheitap9Signs.map((s) => {
            "key": s.pukokKey,
            "word": s.pukokWord,
            "name": "(${s.name})",
          }).toList(),
          isDark,
        ),
        const SizedBox(height: 18),

        // 5-Khutam Arithmetic Operators Key Grid
        const Text(
          "5-Khutam (Arithmetic Operators) • ':' is MANNABA (=):",
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFFF59E0B)),
        ),
        const SizedBox(height: 8),
        _buildPukokKeyGrid(
          MeeteiData.khutam5Operators.map((op) => {
            "key": op.pukokKey,
            "word": op.pukokWord,
            "name": "(${op.name})",
          }).toList(),
          isDark,
        ),
        const SizedBox(height: 18),

        // Khutam Eeyek Shing Punctuation Key Grid
        const Text(
          "Khutam Eeyek Shing (Punctuation Signs):",
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF06B6D4)),
        ),
        const SizedBox(height: 8),
        _buildPukokKeyGrid(
          MeeteiData.khutamSigns.map((s) => {
            "key": s.pukokKey,
            "word": s.pukokWord,
            "name": "(${s.name})",
          }).toList(),
          isDark,
        ),
        const SizedBox(height: 24),

        // 14-Tier Ancient Counting System Table
        _buildSectionHeader(
          "14-LEVEL ANCIENT NUMBER SCALE (ꯆꯩꯁꯤꯡ ꯊꯤꯕ)",
          "From unit (Ama) up to ten trillions (Puu Ama)",
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF141419) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
            ),
          ),
          child: Column(
            children: [
              for (final tier in MeeteiMayekService.pukokCountingHierarchy)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                        color: isDark ? Colors.white.withValues(alpha: 0.04) : Colors.black.withValues(alpha: 0.04),
                      ),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: const Color(0xFF6366F1).withValues(alpha: 0.12),
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          "${tier['level']}",
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              tier['name'] as String,
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              "${tier['value']} (${tier['zeroes']} zeroes)",
                              style: TextStyle(
                                fontSize: 11,
                                color: Theme.of(context).textTheme.bodySmall?.color,
                                fontFamily: "monospace",
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        MeeteiMayekService.convertUnicodeToPukokFont(tier['meitei'] as String),
                        style: TextStyle(
                          fontFamily: "PukokEeyek",
                          fontSize: 18,
                          fontWeight: FontWeight.normal,
                          color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF0284C7),
                          fontFamilyFallback: AppTheme.fontFallbacks,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildPuyaConceptCard({
    required String title,
    required String desc,
    required Color color,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF141419) : Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withValues(alpha: 0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: color),
          ),
          const SizedBox(height: 6),
          Text(
            desc,
            style: TextStyle(
              fontSize: 11.5,
              height: 1.45,
              color: isDark ? Colors.white70 : Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPukokKeyGrid(List<Map<String, String>> keys, bool isDark) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: keys.map((item) {
        final keyChar = item['key']!;
        final word = item['word'] ?? '';
        final name = item['name']!;

        return Container(
          width: 82,
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF141419) : const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.08),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              FittedBox(
                fit: BoxFit.scaleDown,
                child: _buildPukokFormula(
                  keyChar,
                  word,
                  fontSize: 20,
                  color: isDark ? const Color(0xFFF1F5F9) : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 4),
              FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  name,
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(height: 3),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1).withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  "key: $keyChar",
                  style: const TextStyle(
                    fontSize: 8.5,
                    fontFamily: "monospace",
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF6366F1),
                  ),
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  // 3. Letters Tab (Core 18 + Lom 9 + Lolsum 10)
  Widget _buildLettersTab(BuildContext context, bool isDark) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      children: [
        _buildSectionHeader("18 CORE ANATOMICAL LETTERS (ꯏꯌꯦꯛ ꯏꯄꯤ ꯱꯸)", "kok, sam, lai, Meet, pa, Na, Chil, til, khou, Ngou, thou, Wai, yang, huk, Oon, Ee, Pham, Atingaa"),
        const SizedBox(height: 10),
        _buildCharacterGrid(context, MeeteiData.core18Letters, isDark),

        const SizedBox(height: 24),
        _buildSectionHeader("9 LOM CONSONANTS (ꯏꯄꯦ ꯏꯌꯦꯛ ꯹)", "Ga (kok-lom), Jha (sam-lom), Ra (lai-lom), Ba (paa-lom), Ja (chin-lom), Da (tin-lom), Gha (khou-lom), Dha (thou-lom), Bha (Pham-lom)"),
        const SizedBox(height: 10),
        _buildCharacterGrid(context, MeeteiData.lom9Letters, isDark),

        const SizedBox(height: 24),
        _buildSectionHeader("10 LOLSUM FINAL CONSONANTS (ꯂꯣꯜꯁꯨꯝ ꯱꯰)", "kok, lai, meet, paa, Naa, til, Ngou, Oon, Ee, Atingaa lolsum"),
        const SizedBox(height: 10),
        _buildCharacterGrid(context, MeeteiData.lolsum10Letters, isDark),
      ],
    );
  }

  Widget _buildCheitapGroupChip(String label, String groupKey, bool isDark) {
    final isSelected = _cheitapGroup == groupKey;
    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: () {
          setState(() {
            _cheitapGroup = groupKey;
            _cheitapBaseIndex = 0;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected
                ? const Color(0xFF6366F1)
                : (isDark ? const Color(0xFF1E1E26) : const Color(0xFFF1F5F9)),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected
                  ? const Color(0xFF6366F1)
                  : (isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06)),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              color: isSelected ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
            ),
          ),
        ),
      ),
    );
  }

  // 3. Cheitap Tab
  Widget _buildCheitapTab(BuildContext context, bool isDark) {
    List<MeeteiCharacter> currentGroupList;
    String groupTitle;
    switch (_cheitapGroup) {
      case 'lom9':
        currentGroupList = MeeteiData.lom9Letters;
        groupTitle = "9 Lom Consonants (ꯂꯣꯝ ꯏꯌꯦꯛ ꯹)";
        break;
      case 'lolsum10':
        currentGroupList = MeeteiData.lolsum10Letters;
        groupTitle = "10 Lolsum Consonants (ꯂꯣꯜꯁꯨꯝ ꯱꯰)";
        break;
      case 'core18':
      default:
        currentGroupList = MeeteiData.core18Letters;
        groupTitle = "18 Core Roots (ꯏꯄꯤ ꯏꯌꯦꯛ ꯱꯸)";
        break;
    }

    final safeIndex = (_cheitapBaseIndex >= 0 && _cheitapBaseIndex < currentGroupList.length)
        ? _cheitapBaseIndex
        : 0;
    final selectedBase = currentGroupList[safeIndex];

    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      children: [
        _buildSectionHeader(
          "9 CHEITAP-CHENAP VOWEL DIACRITICS (ꯆꯩꯇꯥꯞ ꯹)",
          "Aa-tap, E-nap, Ee-nap, Yat-nap, Chei-nap, Shou-nap, Ot-nap, Uu-nap, Nung",
        ),
        const SizedBox(height: 12),

        // Interactive Syllable Generator Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF141419) : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isDark ? const Color(0xFF6366F1).withValues(alpha: 0.3) : const Color(0xFF6366F1).withValues(alpha: 0.2),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF6366F1).withValues(alpha: isDark ? 0.08 : 0.05),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.hub_outlined, color: Color(0xFF6366F1), size: 18),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Syllable Combinations Across Families",
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          "Combine Cheitap diacritics with 18 Core, 9 Lom, or 10 Lolsum",
                          style: TextStyle(
                            fontSize: 11,
                            color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.7),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Group Selector Chips
              Row(
                children: [
                  _buildCheitapGroupChip("18 Core", 'core18', isDark),
                  const SizedBox(width: 8),
                  _buildCheitapGroupChip("9 Lom", 'lom9', isDark),
                  const SizedBox(width: 8),
                  _buildCheitapGroupChip("10 Lolsum", 'lolsum10', isDark),
                ],
              ),
              const SizedBox(height: 14),

              // Base Letter Horizontal Selector
              Text(
                "Select Base Letter ($groupTitle):",
                style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Color(0xFF6366F1)),
              ),
              const SizedBox(height: 8),
              SizedBox(
                height: 58,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  itemCount: currentGroupList.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, idx) {
                    final char = currentGroupList[idx];
                    final isSelected = idx == safeIndex;
                    return InkWell(
                      borderRadius: BorderRadius.circular(10),
                      onTap: () {
                        setState(() {
                          _cheitapBaseIndex = idx;
                        });
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFF6366F1)
                              : (isDark ? const Color(0xFF1E1E26) : const Color(0xFFF1F5F9)),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isSelected
                                ? const Color(0xFF6366F1)
                                : (isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06)),
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              char.pukokKey,
                              style: TextStyle(
                                fontFamily: "PukokEeyek",
                                fontSize: 18,
                                color: isSelected ? Colors.white : (isDark ? Colors.white : Colors.black87),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              char.name.split("-")[0],
                              style: TextStyle(
                                fontSize: 9.5,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                color: isSelected ? Colors.white.withValues(alpha: 0.9) : (isDark ? Colors.white60 : Colors.black54),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 16),

              // Active Base Letter Summary Banner
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E1E26) : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Text(
                      selectedBase.pukokKey,
                      style: const TextStyle(fontFamily: "PukokEeyek", fontSize: 22, color: Color(0xFF6366F1)),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        "${selectedBase.name} (${selectedBase.char}) • Key: '${selectedBase.pukokKey}' • ${selectedBase.meaning}",
                        style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // 9-Syllable Combinations Grid (3x3)
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 10,
                  crossAxisSpacing: 10,
                  childAspectRatio: 0.88,
                ),
                itemCount: MeeteiData.cheitap9Signs.length,
                itemBuilder: (context, idx) {
                  final sign = MeeteiData.cheitap9Signs[idx];
                  final pukokCombo = "${selectedBase.pukokKey}${sign.pukokKey}";
                  final unicodeCombo = "${selectedBase.char}${sign.char}";
                  return InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: () {
                      _insertChar(unicodeCombo);
                      ScaffoldMessenger.of(context).hideCurrentSnackBar();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text("Inserted '$unicodeCombo' ($pukokCombo) into sandbox"),
                          duration: const Duration(seconds: 1),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E1E28) : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            pukokCombo,
                            style: const TextStyle(
                              fontFamily: "PukokEeyek",
                              fontSize: 26,
                              fontWeight: FontWeight.normal,
                              color: Color(0xFF6366F1),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            unicodeCombo,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            sign.name,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.8),
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                            decoration: BoxDecoration(
                              color: const Color(0xFF6366F1).withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              "${selectedBase.pukokKey}+${sign.pukokKey}",
                              style: const TextStyle(
                                fontSize: 9,
                                fontFamily: "monospace",
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF6366F1),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),
        _buildSectionHeader("9 INDIVIDUAL CHEITAP-CHEINAP SIGNS", "Standard diacritic keys and formulas from Wakoklon Puya"),
        const SizedBox(height: 12),
        for (final sign in MeeteiData.cheitap9Signs)
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF141418) : Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isDark ? Colors.white.withValues(alpha: 0.07) : Colors.black.withValues(alpha: 0.06),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF6366F1).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  alignment: Alignment.center,
                  child: _buildPukokFormula(
                    sign.pukokKey,
                    sign.pukokWord,
                    fontSize: 22,
                    color: const Color(0xFF6366F1),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            sign.name,
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF6366F1).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              "key: ${sign.pukokKey}",
                              style: const TextStyle(fontSize: 10, fontFamily: "monospace", color: Color(0xFF6366F1), fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        sign.meaning,
                        style: TextStyle(
                          fontSize: 12,
                          color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.7),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  // 4. Numbers, 5-Khutam & Signs Tab
  Widget _buildNumbersTab(BuildContext context, bool isDark) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      children: [
        _buildSectionHeader("10 CHEISHING DIGITS (ꯆꯩꯁꯤꯡ ꯱꯰)", "ama-1, ani-2, ahum-3, mali-4, maga-5, taluk-6, talet-7, nepal-8, Mapan-9, Tala-10, phun-0"),
        const SizedBox(height: 10),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 5,
            mainAxisSpacing: 8,
            crossAxisSpacing: 8,
            childAspectRatio: 0.72,
          ),
          itemCount: MeeteiData.cheishing10Numerals.length,
          itemBuilder: (context, index) {
            final num = MeeteiData.cheishing10Numerals[index];
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF141418) : Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isDark ? Colors.white.withValues(alpha: 0.07) : Colors.black.withValues(alpha: 0.06),
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    child: _buildPukokFormula(
                      num.pukokKey,
                      num.pukokWord,
                      fontSize: 15,
                      color: const Color(0xFF6366F1),
                    ),
                  ),
                  const SizedBox(height: 2),
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      "(${num.name.split(' ').first})",
                      style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600),
                    ),
                  ),
                  Text(
                    "key: ${num.pukokKey}",
                    style: TextStyle(
                      fontSize: 8.5,
                      color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.6),
                      fontFamily: "monospace",
                    ),
                  ),
                ],
              ),
            );
          },
        ),

        const SizedBox(height: 24),
        _buildSectionHeader(
          "5-KHUTAM ARITHMETIC OPERATORS (ꯈꯨꯇꯝ ꯵)",
          "khaitokpa (-), tinshinpa (+), punpa (*), yenthokpa (/), mannapa (=) • (:) is MANNABA in Meetei Mayek",
        ),
        const SizedBox(height: 10),
        Column(
          children: [
            for (final op in MeeteiData.khutam5Operators)
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF141418) : Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: isDark ? Colors.white.withValues(alpha: 0.07) : Colors.black.withValues(alpha: 0.06),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      alignment: Alignment.center,
                      child: _buildPukokFormula(
                        op.pukokKey,
                        op.pukokWord,
                        fontSize: 20,
                        color: const Color(0xFFF59E0B),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "${op.name} (${op.mathSymbol})",
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            op.description,
                            style: TextStyle(
                              fontSize: 11,
                              color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.7),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        "key: ${op.pukokKey}",
                        style: const TextStyle(fontSize: 10.5, fontFamily: "monospace", fontWeight: FontWeight.bold, color: Color(0xFFF59E0B)),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),

        const SizedBox(height: 24),
        _buildSectionHeader(
          "KHUTAM EEYEK SHING (PUNCTUATION SIGNS)",
          "Dedicated sign symbols from SLLK page 4 & Pukok Key Layout page 2",
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final s in MeeteiData.khutamSigns)
              Container(
                width: 108,
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF141418) : Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isDark ? Colors.white.withValues(alpha: 0.07) : Colors.black.withValues(alpha: 0.06),
                  ),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      child: _buildPukokFormula(
                        s.pukokKey,
                        s.pukokWord,
                        fontSize: 16,
                        color: const Color(0xFF06B6D4),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "(${s.name})",
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      "key: ${s.pukokKey}",
                      style: const TextStyle(fontSize: 9, fontFamily: "monospace", color: Colors.grey),
                    ),
                  ],
                ),
              ),
          ],
        ),

        const SizedBox(height: 28),
        _buildSectionHeader("TRADITIONAL COUNTING SCALE (ꯆꯩꯁꯤꯡ ꯊꯤꯕ)", "Preserved in ancient Manipuri Puya manuscripts"),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF141418) : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.07) : Colors.black.withValues(alpha: 0.06),
            ),
          ),
          child: Column(
            children: [
              for (int i = 0; i < MeeteiData.cheishingNumbers.length; i++) ...[
                if (i > 0) const Divider(height: 1),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: const Color(0xFF6366F1).withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          "${i + 1}",
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF6366F1),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              MeeteiMayekService.convertUnicodeToPukokFont(MeeteiData.cheishingNumbers[i].meeteiWord),
                              style: const TextStyle(
                                fontFamily: "PukokEeyek",
                                fontSize: 18,
                                fontWeight: FontWeight.normal,
                              ),
                            ),
                            Text(
                              "${MeeteiData.cheishingNumbers[i].romanName} • ${MeeteiData.cheishingNumbers[i].meaning}",
                              style: TextStyle(
                                fontSize: 11.5,
                                color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.7),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        MeeteiData.cheishingNumbers[i].value,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          fontFamily: "monospace",
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title, String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          subtitle,
          style: TextStyle(
            fontSize: 11,
            color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildCharacterGrid(BuildContext context, List<MeeteiCharacter> chars, bool isDark) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: 10,
        crossAxisSpacing: 10,
        childAspectRatio: 0.82,
      ),
      itemCount: chars.length,
      itemBuilder: (context, index) {
        final c = chars[index];
        return GestureDetector(
          onTap: () => _showCharacterDetails(context, c),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF141418) : Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isDark ? Colors.white.withValues(alpha: 0.07) : Colors.black.withValues(alpha: 0.06),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: _buildPukokFormula(
                    c.pukokKey,
                    c.pukokWord,
                    fontSize: 19,
                    color: isDark ? const Color(0xFFF1F5F9) : const Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 3),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    "(${c.name})",
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  c.meaning.split("(").first.trim(),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 9.5,
                    color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.6),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showCharacterDetails(BuildContext context, MeeteiCharacter char) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF6366F1).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      alignment: Alignment.center,
                      child: _buildPukokFormula(
                        char.pukokKey,
                        char.pukokWord,
                        fontSize: 28,
                        color: const Color(0xFF6366F1),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "(${char.name})",
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            char.meaning,
                            style: TextStyle(
                              fontSize: 13,
                              color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.7),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "Direct key: ${char.pukokKey} • ${char.codePoint}",
                            style: const TextStyle(fontSize: 11, fontFamily: "monospace"),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const Text(
                  "Cheitap Vowel Combinations (Direct Script):",
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final sign in MeeteiData.cheitap9Signs)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF1B1B21) : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
                          ),
                        ),
                        child: Text(
                          "${char.pukokKey}${sign.pukokKey}",
                          style: const TextStyle(
                            fontFamily: "PukokEeyek",
                            fontSize: 22,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        );
      },
    );
  }
}
