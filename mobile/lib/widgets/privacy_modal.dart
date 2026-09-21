import "package:flutter/material.dart";

class PrivacyPolicyModal extends StatelessWidget {
  const PrivacyPolicyModal({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const PrivacyPolicyModal(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF14141E) : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.3),
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF6366F1).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        Icons.shield_outlined,
                        color: Color(0xFF6366F1),
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Privacy & Data Safety",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          "Official Google Play Disclosure",
                          style: TextStyle(
                            fontSize: 12,
                            color: isDark ? Colors.white54 : Colors.black54,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Policy Content
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                _buildCard(
                  isDark: isDark,
                  icon: Icons.check_circle_outline_rounded,
                  iconColor: const Color(0xFF10B981),
                  title: "Zero Personal Tracking",
                  body:
                      "SLLK does not require any account creation, login, or personal identifiers. We do not collect names, emails, phone numbers, or device location.",
                ),
                const SizedBox(height: 12),
                _buildCard(
                  isDark: isDark,
                  icon: Icons.sd_storage_outlined,
                  iconColor: const Color(0xFF6366F1),
                  title: "Local Device Storage",
                  body:
                      "Your reading history, bookmarked articles, custom font size settings, and downloaded PDF documents stay strictly on your local device.",
                ),
                const SizedBox(height: 12),
                _buildCard(
                  isDark: isDark,
                  icon: Icons.record_voice_over_outlined,
                  iconColor: const Color(0xFF8B5CF6),
                  title: "On-Device Audio Narration",
                  body:
                      "When using text-to-speech, your device's native speech synthesis engine is utilized. No voice recordings or text excerpts are uploaded to any server.",
                ),
                const SizedBox(height: 12),
                _buildCard(
                  isDark: isDark,
                  icon: Icons.delete_outline_rounded,
                  iconColor: const Color(0xFFEF4444),
                  title: "Complete User Data Control",
                  body:
                      "You can instantly delete all cached articles, thumbnail data, and offline PDFs at any time from the Storage section in Settings.",
                ),
                const SizedBox(height: 20),
                Center(
                  child: Text(
                    "Effective Date: September 2026 • v1.0.0\nPublic Policy: https://arnold-cd.github.io/sllk-privacy/",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark ? Colors.white38 : Colors.black38,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCard({
    required bool isDark,
    required IconData icon,
    required Color iconColor,
    required String title,
    required String body,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E2C) : const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.06),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: iconColor, size: 22),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 4),
                Text(
                  body,
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.4,
                    color: isDark ? Colors.white70 : Colors.black87,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
