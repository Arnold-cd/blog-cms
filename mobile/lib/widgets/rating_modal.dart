import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:url_launcher/url_launcher.dart";
import "../theme/app_theme.dart";

class RatingModal extends StatefulWidget {
  const RatingModal({super.key});

  static const String playStoreUrl =
      "https://play.google.com/store/apps/details?id=sllk.kangleipak.app";
  static const String playStoreMarketUri =
      "market://details?id=sllk.kangleipak.app";
  static const String feedbackEmail =
      "sanamaheelainingleechatkanglei@gmail.com";

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const RatingModal(),
    );
  }

  @override
  State<RatingModal> createState() => _RatingModalState();
}

class _RatingModalState extends State<RatingModal> {
  int _selectedStars = 5;

  Future<void> _submitRating() async {
    HapticFeedback.mediumImpact();

    if (_selectedStars >= 4) {
      // High rating -> Prompt Store Review
      final marketUri = Uri.parse(RatingModal.playStoreMarketUri);
      final webUri = Uri.parse(RatingModal.playStoreUrl);

      try {
        final launched =
            await launchUrl(marketUri, mode: LaunchMode.externalApplication);
        if (!launched) {
          await launchUrl(webUri, mode: LaunchMode.externalApplication);
        }
      } catch (_) {
        try {
          await launchUrl(webUri, mode: LaunchMode.externalApplication);
        } catch (_) {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                  "Thank you for your 5-star rating! Review portal will open upon Play Store release."),
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      }
    } else {
      // Lower rating -> Send constructive feedback via email
      final mailUri = Uri(
        scheme: "mailto",
        path: RatingModal.feedbackEmail,
        queryParameters: {
          "subject": "SLLK App Feedback ($_selectedStars Stars)",
        },
      );

      try {
        await launchUrl(mailUri, mode: LaunchMode.externalApplication);
      } catch (_) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
                "Thank you for your feedback! Please email us at: ${RatingModal.feedbackEmail}"),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }

    if (mounted) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Thank you for rating SLLK $_selectedStars stars!"),
          behavior: SnackBarBehavior.floating,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final String ratingMessage = switch (_selectedStars) {
      5 => "Loved it! Excellent experience",
      4 => "Great reader! Very good",
      3 => "Good, with room to improve",
      2 => "Needs improvement",
      _ => "Disappointed",
    };

    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF141418) : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border.all(
          color: isDark
              ? Colors.white.withOpacity(0.08)
              : Colors.black.withOpacity(0.06),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Drag handle
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.withOpacity(0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),

            // Star Badge Icon
            Container(
              width: 54,
              height: 54,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFFBBF24), Color(0xFFF59E0B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFF59E0B).withOpacity(0.35),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(
                Icons.star_rounded,
                color: Colors.white,
                size: 32,
              ),
            ),
            const SizedBox(height: 14),

            // Title & Subtitle
            const Text(
              "Rate & Support SLLK",
              style: TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.4,
              ),
            ),
            const SizedBox(height: 3),
            const Text(
              "ꯁꯥꯅꯥꯃꯍꯤ  ꯂꯥꯏꫫꯅꯡ • Reader Community Support",
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: Color(0xFFD97706),
                fontFamilyFallback: AppTheme.fontFallbacks,
              ),
            ),
            const SizedBox(height: 12),

            Text(
              "Your rating helps share Manipuri literary traditions, ancient Puya archives, and Meetei Mayek script with readers worldwide.",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                height: 1.45,
                color: isDark ? Colors.white60 : Colors.black54,
              ),
            ),
            const SizedBox(height: 20),

            // Interactive Star Rating Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color:
                    isDark ? const Color(0xFF1E1E24) : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isDark
                      ? Colors.white.withOpacity(0.06)
                      : Colors.black.withOpacity(0.05),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (index) {
                      final starNumber = index + 1;
                      final isSelected = starNumber <= _selectedStars;
                      return GestureDetector(
                        onTap: () {
                          HapticFeedback.selectionClick();
                          setState(() => _selectedStars = starNumber);
                        },
                        behavior: HitTestBehavior.opaque,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 4),
                          child: Icon(
                            isSelected
                                ? Icons.star_rounded
                                : Icons.star_outline_rounded,
                            size: 38,
                            color: isSelected
                                ? const Color(0xFFF59E0B)
                                : (isDark ? Colors.white24 : Colors.black26),
                          ),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    ratingMessage,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: _selectedStars >= 4
                          ? const Color(0xFFF59E0B)
                          : (isDark ? Colors.white70 : Colors.black54),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      side: BorderSide(
                        color: isDark ? Colors.white24 : Colors.black26,
                      ),
                    ),
                    child: const Text("Maybe Later"),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _submitRating,
                    icon: Icon(
                      _selectedStars >= 4
                          ? Icons.rate_review_rounded
                          : Icons.feedback_outlined,
                      size: 16,
                    ),
                    label: Text(_selectedStars >= 4
                        ? "Rate on Store"
                        : "Send Feedback"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF59E0B),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
