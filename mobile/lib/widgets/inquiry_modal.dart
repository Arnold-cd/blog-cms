import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:url_launcher/url_launcher.dart";
import "../theme/app_theme.dart";

class InquiryModal extends StatefulWidget {
  const InquiryModal({super.key});

  static const String inquiryEmail = "sanamaheelainingleechatkanglei@gmail.com";

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const InquiryModal(),
    );
  }

  @override
  State<InquiryModal> createState() => _InquiryModalState();
}

class _InquiryModalState extends State<InquiryModal> {
  bool _copied = false;

  Future<void> _launchMail() async {
    final uri = Uri(
      scheme: "mailto",
      path: InquiryModal.inquiryEmail,
      queryParameters: {
        "subject": "SLLK App Inquiry",
      },
    );

    try {
      final launched = await launchUrl(uri, mode: LaunchMode.externalApplication);
      if (!launched) {
        if (!mounted) return;
        _copyEmail(showFeedback: true);
      }
    } catch (_) {
      if (!mounted) return;
      _copyEmail(showFeedback: true);
    }
  }

  void _copyEmail({bool showFeedback = true}) {
    HapticFeedback.selectionClick();
    Clipboard.setData(const ClipboardData(text: InquiryModal.inquiryEmail));
    setState(() => _copied = true);

    if (showFeedback && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Email copied to clipboard: ${InquiryModal.inquiryEmail}"),
          behavior: SnackBarBehavior.floating,
          duration: Duration(seconds: 3),
        ),
      );
    }

    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF141418) : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.08) : Colors.black.withOpacity(0.06),
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

            // Mail Icon Badge
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0284C7), Color(0xFF0369A1)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF0284C7).withOpacity(0.35),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(
                Icons.mail_outline_rounded,
                color: Colors.white,
                size: 26,
              ),
            ),
            const SizedBox(height: 14),

            // Title & Subtitle
            const Text(
              "App Inquiries & Contact",
              style: TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.4,
              ),
            ),
            const SizedBox(height: 3),
            Text(
              "ꯋꯥꯍꯪ ꯄꯥꯎꯍꯨꯝ • Direct Editorial & Technical Desk",
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF0284C7),
                fontFamilyFallback: AppTheme.fontFallbacks,
              ),
            ),
            const SizedBox(height: 12),

            Text(
              "Have questions about literary submissions, ancient Puya manuscripts, bug reports, or general app feedback? Reach out directly via email.",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                height: 1.45,
                color: isDark ? Colors.white60 : Colors.black54,
              ),
            ),
            const SizedBox(height: 20),

            // Email Address Display Card
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E1E24) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isDark ? Colors.white.withOpacity(0.08) : Colors.black.withOpacity(0.06),
                ),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.alternate_email_rounded,
                    size: 18,
                    color: Color(0xFF0284C7),
                  ),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: SelectableText(
                      InquiryModal.inquiryEmail,
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w600,
                        letterSpacing: -0.2,
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: _copyEmail,
                    borderRadius: BorderRadius.circular(8),
                    child: Padding(
                      padding: const EdgeInsets.all(6),
                      child: Icon(
                        _copied ? Icons.check_circle_rounded : Icons.copy_rounded,
                        size: 18,
                        color: _copied ? const Color(0xFF10B981) : (isDark ? Colors.white70 : Colors.black54),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _copyEmail,
                    icon: Icon(
                      _copied ? Icons.check_rounded : Icons.copy_rounded,
                      size: 16,
                    ),
                    label: Text(_copied ? "Copied" : "Copy Mail"),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      side: BorderSide(
                        color: isDark ? Colors.white24 : Colors.black26,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _launchMail,
                    icon: const Icon(Icons.send_rounded, size: 16),
                    label: const Text("Open Mail App"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0284C7),
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
