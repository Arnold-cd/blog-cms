import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

/// Centralized Google AdMob Service for SLLK
/// Handles Banner, Interstitial, and Rewarded Video Ads with smart test fallback
class AdService {
  AdService._();
  static final AdService instance = AdService._();

  bool _isInitialized = false;
  bool _isAdFree = false;
  bool get isAdFree => _isAdFree;

  /// Global ad-free guard to pause/resume all ads
  void setAdFree(bool value) {
    _isAdFree = value;
    if (_isAdFree) {
      _interstitialAd?.dispose();
      _interstitialAd = null;
      _rewardedAd?.dispose();
      _rewardedAd = null;
      debugPrint('[AdService] Ad-Free mode activated. All ads paused and cleared.');
    }
  }

  InterstitialAd? _interstitialAd;

  RewardedAd? _rewardedAd;
  bool _isRewardedLoading = false;

  // -------------------------------------------------------------
  // Official Google Sample Test Ad Unit IDs (Always 100% Fill)
  // -------------------------------------------------------------
  static String get testBannerAdUnitId => Platform.isAndroid
      ? 'ca-app-pub-3940256099942544/6300978111'
      : 'ca-app-pub-3940256099942544/2934735716';

  static String get testInterstitialAdUnitId => Platform.isAndroid
      ? 'ca-app-pub-3940256099942544/1033173712'
      : 'ca-app-pub-3940256099942544/4411468910';

  static String get testRewardedAdUnitId => Platform.isAndroid
      ? 'ca-app-pub-3940256099942544/5224354917'
      : 'ca-app-pub-3940256099942544/1712485313';

  // -------------------------------------------------------------
  // Production Ad Unit IDs
  // -------------------------------------------------------------
  static String get productionBannerAdUnitId => Platform.isAndroid
      ? 'ca-app-pub-8232094123741508/8818970850'
      : testBannerAdUnitId;

  static String get productionInterstitialAdUnitId => Platform.isAndroid
      ? 'ca-app-pub-8232094123741508/8323223393'
      : testInterstitialAdUnitId;

  static String get productionRewardedAdUnitId => Platform.isAndroid
      ? 'ca-app-pub-8232094123741508/9748909140'
      : testRewardedAdUnitId;

  // Active default IDs (Debug mode uses test IDs; Release uses production)
  static String get bannerAdUnitId =>
      kDebugMode ? testBannerAdUnitId : productionBannerAdUnitId;

  static String get interstitialAdUnitId =>
      kDebugMode ? testInterstitialAdUnitId : productionInterstitialAdUnitId;

  static String get rewardedAdUnitId =>
      kDebugMode ? testRewardedAdUnitId : productionRewardedAdUnitId;

  /// Initialize AdMob SDK
  Future<void> initialize() async {
    if (_isInitialized) return;
    try {
      await MobileAds.instance.initialize();
      // Enforce family-friendly rating (PG) to block sensitive/mature/suggestive ads
      await MobileAds.instance.updateRequestConfiguration(
        RequestConfiguration(
          maxAdContentRating: MaxAdContentRating.pg,
        ),
      );
      _isInitialized = true;
      // Preload rewarded video ad for the free 1-hour ad-free pass (Option 2)
      loadRewardedAd();
    } catch (e) {
      debugPrint('[AdService] Initialization error: $e');
    }
  }

  // =============================================================
  // INTERSTITIAL ADS (Disabled under Option 2: Zero-Interstitial Model)
  // =============================================================

  bool get isInterstitialReady => false;

  void loadInterstitialAd({bool useFallback = false}) {
    // Interstitials disabled to prevent user disruption
  }

  /// Under Option 2, interstitials are bypassed immediately
  void showInterstitialIfEligible({VoidCallback? onDismissed}) {
    onDismissed?.call();
  }

  // =============================================================
  // REWARDED ADS
  // =============================================================

  bool get isRewardedAdReady => _rewardedAd != null;

  void loadRewardedAd({bool useFallback = false}) {
    if (_isAdFree || _isRewardedLoading || _rewardedAd != null) return;
    _isRewardedLoading = true;

    final adUnitId = kDebugMode || useFallback
        ? testRewardedAdUnitId
        : productionRewardedAdUnitId;

    RewardedAd.load(
      adUnitId: adUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          _rewardedAd = ad;
          _isRewardedLoading = false;
          debugPrint(
              '[AdService] Rewarded ad loaded (${useFallback ? "Test Fallback" : "Live"}).');
        },
        onAdFailedToLoad: (error) {
          debugPrint(
              '[AdService] Rewarded ad failed to load (Code ${error.code}): ${error.message}');
          _rewardedAd = null;
          _isRewardedLoading = false;

          // If production ad fails with No Fill (Code 3) or error, fallback to test ad so testers can earn pass
          if (!useFallback && !kDebugMode) {
            debugPrint(
                '[AdService] Production rewarded ad unavailable. Falling back to test unit for testers...');
            loadRewardedAd(useFallback: true);
          } else {
            // Auto-retry in 30 seconds
            Future.delayed(const Duration(seconds: 30), () {
              if (_rewardedAd == null) {
                loadRewardedAd();
              }
            });
          }
        },
      ),
    );
  }

  /// Show Rewarded Ad. Calls [onUserEarnedReward] when completed.
  Future<bool> showRewardedAd({
    required VoidCallback onUserEarnedReward,
    VoidCallback? onAdClosed,
  }) async {
    if (_isAdFree) {
      onUserEarnedReward();
      onAdClosed?.call();
      return true;
    }

    if (_rewardedAd == null) {
      loadRewardedAd();
      return false;
    }

    bool earned = false;
    _rewardedAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _rewardedAd = null;
        loadRewardedAd(); // Preload next
        if (earned) {
          onUserEarnedReward();
        }
        onAdClosed?.call();
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        debugPrint('[AdService] Rewarded ad failed to show: $error');
        ad.dispose();
        _rewardedAd = null;
        loadRewardedAd();
        onAdClosed?.call();
      },
    );

    await _rewardedAd!.show(
      onUserEarnedReward: (AdWithoutView ad, RewardItem reward) {
        earned = true;
      },
    );

    return true;
  }
}

/// A clean Banner Ad Widget with automatic test fallback on error
class BannerAdWidget extends StatefulWidget {
  final AdSize adSize;
  const BannerAdWidget({
    super.key,
    this.adSize = AdSize.banner,
  });

  @override
  State<BannerAdWidget> createState() => _BannerAdWidgetState();
}

class _BannerAdWidgetState extends State<BannerAdWidget> {
  BannerAd? _bannerAd;
  bool _isLoaded = false;

  @override
  void initState() {
    super.initState();
    _loadAd();
  }

  void _loadAd({bool useFallback = false}) {
    if (AdService.instance.isAdFree) return;
    final adUnitId = kDebugMode || useFallback
        ? AdService.testBannerAdUnitId
        : AdService.bannerAdUnitId;

    _bannerAd = BannerAd(
      adUnitId: adUnitId,
      size: widget.adSize,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (ad) {
          if (mounted) {
            setState(() {
              _isLoaded = true;
            });
          }
        },
        onAdFailedToLoad: (ad, error) {
          debugPrint(
              '[BannerAd] Failed to load (code ${error.code}): ${error.message}');
          ad.dispose();
          if (mounted) {
            setState(() {
              _isLoaded = false;
            });
          }
          if (!useFallback && !kDebugMode) {
            _loadAd(useFallback: true);
          }
        },
      ),
    );

    _bannerAd?.load();
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (AdService.instance.isAdFree || !_isLoaded || _bannerAd == null) {
      return const SizedBox.shrink();
    }

    return Container(
      alignment: Alignment.center,
      width: _bannerAd!.size.width.toDouble(),
      height: _bannerAd!.size.height.toDouble(),
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: AdWidget(ad: _bannerAd!),
    );
  }
}
