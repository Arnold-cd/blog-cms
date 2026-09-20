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
    _tabController = TabController(length: 4, vsync: this);
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
              margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1B1B21) : const Color(0xFFEFEFF4),
                borderRadius: BorderRadius.circular(12),
              ),
              child: TabBar(
                controller: _tabController,
                indicatorSize: TabBarIndicatorSize.tab,
                dividerColor: Colors.transparent,
                indicator: BoxDecoration(
                  color: isDark ? const Color(0xFF6366F1) : const Color(0xFF4F46E5),
                  borderRadius: BorderRadius.circular(10),
                ),
                labelColor: Colors.white,
                unselectedLabelColor: isDark ? Colors.white60 : Colors.black54,
                labelStyle: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700),
                tabs: const [
                  Tab(text: "✍️ Sandbox"),
                  Tab(text: "🔤 Letters"),
                  Tab(text: "✒️ Cheitap"),
                  Tab(text: "🔢 Numbers"),
                ],
              ),
            ),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildSandboxTab(context, isDark),
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

  // 2. Letters Tab (Core 18 + Additional 9 + Lonsum 8 = 35)
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
