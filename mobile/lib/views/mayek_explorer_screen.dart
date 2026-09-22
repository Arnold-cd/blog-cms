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
                    child: const Text(
                      "ꯃ",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        fontFamilyFallback: AppTheme.fontFallbacks,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "ꯃꯌꯦꯛ Explorer",
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.5,
                          fontFamilyFallback: AppTheme.fontFallbacks,
                        ),
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
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFF6366F1).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          "MEETEI MAYEK SCRIPT",
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF6366F1),
                            letterSpacing: 0.8,
                          ),
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    tooltip: "Copy to Clipboard",
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
              const SizedBox(height: 12),
              SelectableText(
                _translatedOutput.isEmpty ? "..." : _translatedOutput,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w700,
                  height: 1.4,
                  fontFamilyFallback: AppTheme.fontFallbacks,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF16161D) : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isDark ? Colors.white.withValues(alpha: 0.08) : const Color(0xFFE2E8F0),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              Container(
                                width: 6,
                                height: 6,
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF0284C7),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  "AUTHENTIC WAKOKLON PUKOK EEYEK (PUYA)",
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        InkWell(
                          onTap: () {
                            final pukok = MeeteiMayekService.convertUnicodeToPukokFont(_translatedOutput);
                            if (pukok.isNotEmpty) {
                              Clipboard.setData(ClipboardData(text: pukok));
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  duration: Duration(seconds: 1),
                                  content: Text("Pukok font keys copied to clipboard!"),
                                ),
                              );
                            }
                          },
                          borderRadius: BorderRadius.circular(6),
                          child: Padding(
                            padding: const EdgeInsets.all(4),
                            child: Icon(
                              Icons.copy_rounded,
                              size: 14,
                              color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    SelectableText(
                      MeeteiMayekService.convertUnicodeToPukokFont(_translatedOutput),
                      style: TextStyle(
                        fontFamily: "PukokEeyek",
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        height: 1.3,
                        color: isDark ? const Color(0xFFF1F5F9) : const Color(0xFF0F172A),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Cheitap Quick Diacritic Inserter
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "QUICK CHEITAP DIACRITICS",
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
                  for (final item in [
                    ["ꯥ", "onap (aa)"],
                    ["ꯤ", "inap (i)"],
                    ["ꯨ", "unap (u)"],
                    ["ꯦ", "yetnap (e)"],
                    ["ꯣ", "otnap (o)"],
                    ["ꯩ", "cheinap (ei)"],
                    ["ꯧ", "sounap (ou)"],
                    ["ꯪ", "nung (ng)"],
                    ["꯭", "apun (virama)"],
                    ["꯫", "cheikhei (.)"],
                  ])
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ActionChip(
                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                        backgroundColor: isDark ? const Color(0xFF1B1B21) : const Color(0xFFF1F5F9),
                        label: Text(
                          "${item[0]} ${item[1]}",
                          style: const TextStyle(
                            fontSize: 12,
                            fontFamilyFallback: AppTheme.fontFallbacks,
                          ),
                        ),
                        onPressed: () => _insertChar(item[0]),
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
          desc: "The 18 core letters correspond to parts of human anatomy (Kok = head, Sam = hair, Lai = forehead, Meet = eye, Paa = ear, Naa = nose, Chil = mouth, etc.) reflecting early cosmological human science.",
          color: const Color(0xFF3B82F6),
          isDark: isDark,
        ),
        const SizedBox(height: 10),
        _buildPuyaConceptCard(
          title: "🌿 Native Lom (Derivation) vs Borrowed 27 Scripts",
          desc: "In authentic Kanglei grammar, the 9 additional consonants derive naturally from the 18 root letters with the Lom inflection dot (Gok from Kok, Zam from Sam, Rai from Lai, etc.), preserving linguistic integrity.",
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
        _buildPukokKeyGrid([
          {"key": "k", "uni": "ꯀ", "name": "Kok"},
          {"key": "s", "uni": "ꯁ", "name": "Sam"},
          {"key": "l", "uni": "ꯂ", "name": "Lai"},
          {"key": "m", "uni": "ꯃ", "name": "Meet"},
          {"key": "p", "uni": "ꯄ", "name": "Paa"},
          {"key": "n", "uni": "ꯅ", "name": "Naa"},
          {"key": "c", "uni": "ꯆ", "name": "Chil"},
          {"key": "t", "uni": "ꯇ", "name": "Til"},
          {"key": "x", "uni": "ꯈ", "name": "Khou"},
          {"key": "q", "uni": "ꯉ", "name": "Ngou"},
          {"key": "z", "uni": "ꯊ", "name": "Thou"},
          {"key": "w", "uni": "ꯋ", "name": "Wai"},
          {"key": "y", "uni": "ꯌ", "name": "Yang"},
          {"key": "h", "uni": "ꯍ", "name": "Huk"},
          {"key": "u", "uni": "ꯎ", "name": "Oon"},
          {"key": "e", "uni": "ꯏ", "name": "Ee"},
          {"key": "f", "uni": "ꯐ", "name": "Pham"},
          {"key": "a", "uni": "ꯑ", "name": "Atingaa"},
        ], isDark),
        const SizedBox(height: 18),

        // 9 Lom Consonants Key Grid
        const Text(
          "9 Lom Consonants (Chei-eeyek / Lom 9):",
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
        ),
        const SizedBox(height: 8),
        _buildPukokKeyGrid([
          {"key": "g", "uni": "ꯒ", "name": "Gok"},
          {"key": "S", "uni": "ꯓ", "name": "Zam"},
          {"key": "R", "uni": "ꯔ", "name": "Rai"},
          {"key": "b", "uni": "ꯕ", "name": "Bok"},
          {"key": "j", "uni": "ꯖ", "name": "Jhil"},
          {"key": "d", "uni": "ꯗ", "name": "Dil"},
          {"key": "G", "uni": "ꯘ", "name": "Ghou"},
          {"key": "D", "uni": "ꯙ", "name": "Dhou"},
          {"key": "v", "uni": "ꯚ", "name": "Bham"},
        ], isDark),
        const SizedBox(height: 18),

        // 10 Lolsum Consonants Key Grid
        const Text(
          "10 Lolsum Consonants (Eeyek Lonsum 10):",
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
        ),
        const SizedBox(height: 8),
        _buildPukokKeyGrid([
          {"key": "K", "uni": "ꯛ", "name": "Kok L."},
          {"key": "L", "uni": "ꯜ", "name": "Lai L."},
          {"key": "M", "uni": "ꯝ", "name": "Meet L."},
          {"key": "P", "uni": "ꯞ", "name": "Paa L."},
          {"key": "N", "uni": "ꯟ", "name": "Naa L."},
          {"key": "T", "uni": "ꯠ", "name": "Til L."},
          {"key": "Q", "uni": "ꯡ", "name": "Ngou L."},
          {"key": "U", "uni": "ꯎ", "name": "Oon L."},
          {"key": "E", "uni": "ꯢ", "name": "Ee L."},
          {"key": "A", "uni": "ꯑ", "name": "Yei L."},
        ], isDark),
        const SizedBox(height: 18),

        // 9 Cheitap Diacritics & Punctuation Key Grid
        const Text(
          "9 Cheitap Diacritics & Puya Punctuation:",
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFFEC4899)),
        ),
        const SizedBox(height: 8),
        _buildPukokKeyGrid([
          {"key": "F", "uni": "ꯥ", "name": "Takchei"},
          {"key": "i", "uni": "ꯤ", "name": "Inap"},
          {"key": "I", "uni": "ꯤ", "name": "Ee Ch."},
          {"key": "J", "uni": "ꯨ", "name": "Oon Ch."},
          {"key": "Y", "uni": "ꯦ", "name": "Yenap"},
          {"key": "o", "uni": "ꯣ", "name": "Otap"},
          {"key": "O", "uni": "ꯧ", "name": "Sou"},
          {"key": "C", "uni": "ꯩ", "name": "Cheinap"},
          {"key": "H", "uni": "ꯪ", "name": "Nung"},
          {"key": "#", "uni": "꯱", "name": "Sacred 1"},
          {"key": ".", "uni": "꫰", "name": "Cheikhan"},
          {"key": ";", "uni": "꫱", "name": "Cheishei"},
          {"key": ":", "uni": "=", "name": "Mannaba"},
          {"key": "!", "uni": "꯫", "name": "Apakpa"},
        ], isDark),
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
                        tier['meitei'] as String,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
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
        final uniChar = item['uni']!;
        final name = item['name']!;

        return Container(
          width: 72,
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
              Text(
                keyChar,
                style: TextStyle(
                  fontFamily: 'PukokEeyek',
                  fontSize: 22,
                  color: isDark ? const Color(0xFFF1F5F9) : const Color(0xFF0F172A),
                  height: 1.1,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                uniChar,
                style: const TextStyle(
                  fontSize: 11,
                  color: Colors.grey,
                  fontFamilyFallback: AppTheme.fontFallbacks,
                ),
              ),
              Text(
                name,
                style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold),
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1).withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  keyChar,
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
        );
      }).toList(),
    );
  }

  // 3. Letters Tab (Core 18 + Additional 9 + Lonsum 8 = 35)
  Widget _buildLettersTab(BuildContext context, bool isDark) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      children: [
        _buildSectionHeader("18 CORE ANATOMICAL LETTERS (ꯏꯌꯦꯛ ꯏꯄꯤ)", "Derived from parts of the human body"),
        const SizedBox(height: 10),
        _buildCharacterGrid(context, MeeteiData.core18Letters, isDark),

        const SizedBox(height: 24),
        _buildSectionHeader("9 ADDITIONAL CONSONANTS", "Voiced and aspirate consonants"),
        const SizedBox(height: 10),
        _buildCharacterGrid(context, MeeteiData.additional9Letters, isDark),

        const SizedBox(height: 24),
        _buildSectionHeader("8 LONSUM FINAL CONSONANTS (ꯂꯣꯟꯁꯨꯝ)", "Syllable-coda consonants with inherent vowel suppressed"),
        const SizedBox(height: 10),
        _buildCharacterGrid(context, MeeteiData.lonsum8Letters, isDark),
      ],
    );
  }

  // 3. Cheitap Tab
  Widget _buildCheitapTab(BuildContext context, bool isDark) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      children: [
        _buildSectionHeader("8 CHEITAP VOWEL SIGNS (ꯆꯩꯇꯥꯞ)", "Diacritic vowel modifiers attaching to any letter"),
        const SizedBox(height: 12),
        for (final sign in MeeteiData.cheitap8Signs)
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
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: const Color(0xFF6366F1).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    "ꯀ${sign.char}",
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF6366F1),
                      fontFamilyFallback: AppTheme.fontFallbacks,
                    ),
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
                              color: Colors.grey.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              sign.codePoint,
                              style: const TextStyle(fontSize: 10, fontFamily: "monospace"),
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
                          fontFamilyFallback: AppTheme.fontFallbacks,
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

  // 4. Numbers & Cheishing Tab
  Widget _buildNumbersTab(BuildContext context, bool isDark) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      children: [
        _buildSectionHeader("10 MEETEI NUMERALS (ꯆꯩꯁꯤꯡ ꯃꯌꯦꯛ)", "Indigenous base-10 numerical digits"),
        const SizedBox(height: 10),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 5,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 0.85,
          ),
          itemCount: MeeteiData.numerals10.length,
          itemBuilder: (context, index) {
            final num = MeeteiData.numerals10[index];
            return Container(
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF141418) : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isDark ? Colors.white.withValues(alpha: 0.07) : Colors.black.withValues(alpha: 0.06),
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    num.char,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF6366F1),
                      fontFamilyFallback: AppTheme.fontFallbacks,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    num.latin ?? "$index",
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                  ),
                  Text(
                    num.name.split(" ").first,
                    style: TextStyle(
                      fontSize: 9,
                      color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.6),
                    ),
                  ),
                ],
              ),
            );
          },
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
                              MeeteiData.cheishingNumbers[i].meeteiWord,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                fontFamilyFallback: AppTheme.fontFallbacks,
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
            fontFamilyFallback: AppTheme.fontFallbacks,
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
        childAspectRatio: 0.95,
      ),
      itemCount: chars.length,
      itemBuilder: (context, index) {
        final c = chars[index];
        return GestureDetector(
          onTap: () => _showCharacterDetails(context, c),
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF141418) : Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isDark ? Colors.white.withValues(alpha: 0.07) : Colors.black.withValues(alpha: 0.06),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  c.char,
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    fontFamilyFallback: AppTheme.fontFallbacks,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  c.name,
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                ),
                Text(
                  c.meaning.split("(").first.trim(),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 10,
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
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: const Color(0xFF6366F1).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        char.char,
                        style: const TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF6366F1),
                          fontFamilyFallback: AppTheme.fontFallbacks,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "${char.name} (${char.char})",
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              fontFamilyFallback: AppTheme.fontFallbacks,
                            ),
                          ),
                          Text(
                            char.meaning,
                            style: TextStyle(
                              fontSize: 13,
                              color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.7),
                              fontFamilyFallback: AppTheme.fontFallbacks,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "${char.codePoint} • Sound: ${char.ipa ?? char.latin ?? ''}",
                            style: const TextStyle(fontSize: 11, fontFamily: "monospace"),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const Text(
                  "Cheitap Vowel Combinations:",
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final sign in MeeteiData.cheitap8Signs)
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
                          "${char.char}${sign.char}",
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            fontFamilyFallback: AppTheme.fontFallbacks,
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
