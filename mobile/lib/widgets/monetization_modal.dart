import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/monetization_provider.dart';
import '../services/ad_service.dart';

class MonetizationModal extends ConsumerStatefulWidget {
  const MonetizationModal({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const MonetizationModal(),
    );
  }

  @override
  ConsumerState<MonetizationModal> createState() => _MonetizationModalState();
}

class _MonetizationModalState extends ConsumerState<MonetizationModal> {
  bool _isLoadingReward = false;
  bool _isLoadingPurchase = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final monState = ref.watch(monetizationProvider);
    final monNotifier = ref.read(monetizationProvider.notifier);

    final isAdFree = monState.isAdFreeActive;
    final isLifetime = monState.isLifetimeAdFree;
    final remainingTime = monState.remainingRewardedTime;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF141418) : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border.all(
          color: isDark
              ? Colors.white.withValues(alpha: 0.08)
              : Colors.black.withValues(alpha: 0.06),
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

            // Crown / Diamond Icon Badge
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isAdFree
                      ? [const Color(0xFF10B981), const Color(0xFF059669)]
                      : [const Color(0xFFF59E0B), const Color(0xFFD97706)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: (isAdFree ? const Color(0xFF10B981) : const Color(0xFFF59E0B))
                        .withValues(alpha: 0.35),
                    blurRadius: 14,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Icon(
                isLifetime
                    ? Icons.diamond_rounded
                    : (isAdFree ? Icons.check_circle_rounded : Icons.star_rounded),
                color: Colors.white,
                size: 30,
              ),
            ),
            const SizedBox(height: 16),

            // Title
            Text(
              isLifetime
                  ? "SLLK Lifetime Member"
                  : (isAdFree ? "Ad-Free Pass Active" : "Support SLLK & Remove Ads"),
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                letterSpacing: -0.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),

            // Subtitle status
            Text(
              isLifetime
                  ? "Thank you for supporting our cultural archive! All ads are permanently removed across the entire app."
                  : (isAdFree && remainingTime != null
                      ? "You have ${remainingTime.inHours > 0 ? '${remainingTime.inHours}h ' : ''}${remainingTime.inMinutes % 60}m of ad-free reading remaining from your rewarded pass."
                      : "Enjoy reading ancient manuscripts & cultural essays with zero distractions. Choose how you'd like to remove ads:"),
              style: theme.textTheme.bodyMedium?.copyWith(
                color: isDark ? Colors.grey[400] : Colors.grey[600],
                height: 1.4,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),

            if (!isLifetime) ...[
              // Option 1: Watch Rewarded Video for 1-Hour Pass
              Container(
                decoration: BoxDecoration(
                  color: isDark
                      ? Colors.white.withValues(alpha: 0.04)
                      : Colors.grey.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFF3B82F6).withValues(alpha: 0.25),
                  ),
                ),
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF3B82F6).withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.play_circle_fill_rounded,
                        color: Color(0xFF3B82F6),
                        size: 26,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Watch Short Video",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            "Free 1 Hour Ad-Free Pass",
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? Colors.grey[400] : Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF3B82F6),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      ),
                      onPressed: _isLoadingReward
                          ? null
                          : () async {
                              final messenger = ScaffoldMessenger.of(context);
                              setState(() => _isLoadingReward = true);
                              final shown = await AdService.instance.showRewardedAd(
                                onUserEarnedReward: () {
                                  monNotifier.grantRewardedPass();
                                  messenger.showSnackBar(
                                    const SnackBar(
                                      content: Text("🎉 1-Hour Ad-Free Pass Activated!"),
                                      backgroundColor: Color(0xFF10B981),
                                    ),
                                  );
                                },
                              );
                              if (mounted) {
                                setState(() => _isLoadingReward = false);
                                if (!shown) {
                                  messenger.showSnackBar(
                                    const SnackBar(
                                      content: Text("Ad is loading... Please try again in 5 seconds."),
                                    ),
                                  );
                                }
                              }
                            },
                      child: _isLoadingReward
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text("Watch", style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // Option 2: Lifetime In-App Purchase
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isDark
                        ? [
                            const Color(0xFFF59E0B).withValues(alpha: 0.12),
                            const Color(0xFFD97706).withValues(alpha: 0.05),
                          ]
                        : [
                            const Color(0xFFFEF3C7),
                            const Color(0xFFFFFBEB),
                          ],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFFF59E0B).withValues(alpha: 0.4),
                  ),
                ),
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.diamond_rounded,
                        color: Color(0xFFD97706),
                        size: 26,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Lifetime Pro",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            "One-time payment • Forever",
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? Colors.grey[400] : Colors.grey[700],
                            ),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFD97706),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      ),
                      onPressed: _isLoadingPurchase
                          ? null
                          : () async {
                              setState(() => _isLoadingPurchase = true);
                              await monNotifier.buyLifetimePass();
                              if (mounted) {
                                setState(() => _isLoadingPurchase = false);
                              }
                            },
                      child: _isLoadingPurchase
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text("Unlock", style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Restore Purchases link
              TextButton.icon(
                onPressed: () async {
                  final messenger = ScaffoldMessenger.of(context);
                  await monNotifier.restorePurchases();
                  if (mounted) {
                    messenger.showSnackBar(
                      const SnackBar(
                        content: Text("Checking for past purchases..."),
                      ),
                    );
                  }
                },
                icon: const Icon(Icons.restore_rounded, size: 18),
                label: const Text(
                  "Restore Past Purchases",
                  style: TextStyle(fontSize: 13),
                ),
              ),
            ] else ...[
              // Already lifetime pro!
              Container(
                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFF10B981).withValues(alpha: 0.3),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.verified_rounded, color: Color(0xFF10B981)),
                    SizedBox(width: 8),
                    Text(
                      "Lifetime Ad-Free Active",
                      style: TextStyle(
                        color: Color(0xFF10B981),
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
