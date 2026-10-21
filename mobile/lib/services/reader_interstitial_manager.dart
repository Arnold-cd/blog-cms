import 'package:flutter/foundation.dart';

/// MX Player-inspired Ad Immersion & Interstitial Manager
///
/// Features:
/// 1. Cooldown throttling: Enforces a strict 3-minute cooldown between full-screen ads.
/// 2. Immersion protection: Interstitials never appear while a user is actively reading.
/// 3. Exit trigger: Interstitial only triggers upon natural chapter completion or back navigation.
/// 4. Ad-Free guard: Automatically bypassed if the user has purchased lifetime or has an active pass.
/// 5. Graceful fallback: If cooldown is active or ad is not yet cached, navigation proceeds immediately.
class ReaderInterstitialManager {
  ReaderInterstitialManager._();
  static final ReaderInterstitialManager instance = ReaderInterstitialManager._();

  DateTime? _lastAdShownTime;

  /// MX Player Strategy: 3-minute cooldown between full-screen ads
  static const Duration adCooldown = Duration(minutes: 3);

  /// Checks if cooldown period has elapsed since last interstitial
  bool get isCooledDown {
    if (_lastAdShownTime == null) return true;
    return DateTime.now().difference(_lastAdShownTime!) >= adCooldown;
  }

  /// Triggers exit interstitial when a user leaves the reader view (Back button, Gesture)
  void showExitInterstitialIfEligible({
    required bool isAdFree,
    required VoidCallback onProceed,
  }) {
    // Interstitials disabled under Option 2
    onProceed();
  }
}
