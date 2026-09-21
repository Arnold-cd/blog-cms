import "package:flutter/material.dart";
import "package:share_plus/share_plus.dart";
import "../theme/app_theme.dart";

class DonationModal extends StatelessWidget {
  const DonationModal({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const DonationModal(),
    );
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
          color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
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
                color: Colors.grey.withValues(alpha: 0.4),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),

            // Heart Icon Badge
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFF43F5E), Color(0xFFE11D48)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFF43F5E).withValues(alpha: 0.35),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.volunteer_activism_rounded,
                color: Colors.white,
                size: 26,
              ),
            ),
            const SizedBox(height: 14),

            // Title
            const Text(
              "Support SLLK",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              "ꯃꯤꯇꯩ ꯃꯌꯦꯛ ꯑꯃꯁꯨꯡ ꯋꯥꯔꯦꯡ ꯁꯧꯒꯠꯄ",
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFFF43F5E),
                fontFamilyFallback: AppTheme.fontFallbacks,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              "Your contribution helps sustain independent essay writing, indigenous font research, and serverless hosting.",
              textAlign: TextAlign.center,
              style: theme.textTheme.bodySmall?.copyWith(
                fontSize: 12,
                height: 1.5,
                color: theme.textTheme.bodySmall?.color?.withValues(alpha: 0.7),
              ),
            ),
            const SizedBox(height: 20),

            // QR Code Box (Always on high-contrast white card for effortless camera scanning)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.12),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.asset(
                      "assets/images/donation_qr.png",
                      width: 220,
                      height: 220,
                      fit: BoxFit.contain,
                      errorBuilder: (ctx, err, stack) => const SizedBox(
                        width: 220,
                        height: 220,
                        child: Center(
                          child: Icon(Icons.qr_code_rounded, size: 64, color: Colors.black54),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.qr_code_scanner_rounded, size: 16, color: Colors.grey.shade700),
                      const SizedBox(width: 6),
                      Text(
                        "Scan with any UPI / Banking app",
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade800,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Share & Close Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      side: BorderSide(
                        color: isDark ? Colors.white.withValues(alpha: 0.15) : Colors.black.withValues(alpha: 0.15),
                      ),
                    ),
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    icon: const Icon(Icons.close_rounded, size: 18),
                    label: const Text("Close"),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF43F5E),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      final media = MediaQuery.of(context);
                      final screenW = media.size.width > 0 ? media.size.width : 375.0;
                      final screenH = media.size.height > 0 ? media.size.height : 667.0;
                      final box = context.findRenderObject() as RenderBox?;
                      final origin = (box != null && box.hasSize && box.size.width > 10 && box.size.height > 10)
                          ? (box.localToGlobal(Offset.zero) & box.size)
                          : Rect.fromLTWH(0, 0, screenW, screenH / 2);

                      Share.share(
                        "Support SLLK - Indigenous Meetei Mayek & English Publication\nhttps://blog-cms-gilt.vercel.app/",
                        sharePositionOrigin: origin,
                      );
                    },
                    icon: const Icon(Icons.share_rounded, size: 18),
                    label: const Text("Share SLLK"),
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
