import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

/// Centralized Google AdMob Service for SLLK
/// Handles Banner, Interstitial, and Rewarded Video Ads
class AdService {
  AdService._();
  static final AdService instance = AdService._();

  bool _isInitialized = false;
  InterstitialAd? _interstitialAd;
  bool _isInterstitialLoading = false;

  RewardedAd? _rewardedAd;
  bool _isRewardedLoading = false;

  int _articlesReadCount = 0;
  static const int interstitialInterval = 3; // Show every 3 articles read

  // -------------------------------------------------------------
  // AdMob Ad Unit IDs (Official Google Test IDs for Development)
  // Replace these with your real AdMob IDs before publishing
  // -------------------------------------------------------------
  static String get bannerAdUnitId {
    if (kDebugMode) {
      return Platform.isAndroid
          ? 'ca-app-pub-3940256099942544/6300978111'
          : 'ca-app-pub-3940256099942544/2934735716';
    }
    // Production IDs
    return Platform.isAndroid
        ? 'ca-app-pub-8232094123741508/8818970850'
        : 'ca-app-pub-3940256099942544/2934735716';
  }

  static String get interstitialAdUnitId {
    if (kDebugMode) {
      return Platform.isAndroid
          ? 'ca-app-pub-3940256099942544/1033173712'
          : 'ca-app-pub-3940256099942544/4411468910';
    }
    // Production IDs
    return Platform.isAndroid
        ? 'ca-app-pub-8232094123741508/8323223393'
        : 'ca-app-pub-3940256099942544/4411468910';
  }

  static String get rewardedAdUnitId {
    if (kDebugMode) {
      return Platform.isAndroid
          ? 'ca-app-pub-3940256099942544/5224354917'
          : 'ca-app-pub-3940256099942544/1712485313';
    }
    // Production IDs
    return Platform.isAndroid
        ? 'ca-app-pub-8232094123741508/9748909140'
        : 'ca-app-pub-3940256099942544/1712485313';
  }

  /// Initialize AdMob SDK
  Future<void> initialize() async {
    if (_isInitialized) return;
    try {
      await MobileAds.instance.initialize();
      _isInitialized = true;
      loadInterstitialAd();
      loadRewardedAd();
    } catch (e) {
      debugPrint('[AdService] Initialization error: $e');
    }
  }

  // =============================================================
  // INTERSTITIAL ADS
  // =============================================================

  void loadInterstitialAd() {
    if (_isInterstitialLoading || _interstitialAd != null) return;
    _isInterstitialLoading = true;

    InterstitialAd.load(
      adUnitId: interstitialAdUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitialAd = ad;
          _isInterstitialLoading = false;
          _interstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
            onAdDismissedFullScreenContent: (ad) {
              ad.dispose();
              _interstitialAd = null;
              loadInterstitialAd(); // Preload next
            },
            onAdFailedToShowFullScreenContent: (ad, error) {
              ad.dispose();
              _interstitialAd = null;
              loadInterstitialAd();
            },
          );
        },
        onAdFailedToLoad: (error) {
          debugPrint('[AdService] Interstitial failed to load: $error');
          _interstitialAd = null;
          _isInterstitialLoading = false;
        },
      ),
    );
  }

  /// Call this when an article is finished or dismissed.
  /// Shows ad every [interstitialInterval] times.
  void showInterstitialIfEligible({VoidCallback? onDismissed}) {
    _articlesReadCount++;
    if (_articlesReadCount % interstitialInterval == 0 && _interstitialAd != null) {
      _interstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
        onAdDismissedFullScreenContent: (ad) {
          ad.dispose();
          _interstitialAd = null;
          loadInterstitialAd();
          onDismissed?.call();
        },
        onAdFailedToShowFullScreenContent: (ad, error) {
          ad.dispose();
          _interstitialAd = null;
          loadInterstitialAd();
          onDismissed?.call();
        },
      );
      _interstitialAd!.show();
    } else {
      onDismissed?.call();
    }
  }

  // =============================================================
  // REWARDED ADS
  // =============================================================

  bool get isRewardedAdReady => _rewardedAd != null;

  void loadRewardedAd() {
    if (_isRewardedLoading || _rewardedAd != null) return;
    _isRewardedLoading = true;

    RewardedAd.load(
      adUnitId: rewardedAdUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          _rewardedAd = ad;
          _isRewardedLoading = false;
        },
        onAdFailedToLoad: (error) {
          debugPrint('[AdService] Rewarded ad failed to load: $error');
          _rewardedAd = null;
          _isRewardedLoading = false;
        },
      ),
    );
  }

  /// Show Rewarded Ad. Calls [onUserEarnedReward] when completed.
  Future<bool> showRewardedAd({
    required VoidCallback onUserEarnedReward,
    VoidCallback? onAdClosed,
  }) async {
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

/// A clean Banner Ad Widget that handles creation, display, and disposal
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

  void _loadAd() {
    _bannerAd = BannerAd(
      adUnitId: AdService.bannerAdUnitId,
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
          debugPrint('[BannerAd] Failed to load: $error');
          ad.dispose();
          if (mounted) {
            setState(() {
              _isLoaded = false;
            });
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
    if (!_isLoaded || _bannerAd == null) {
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
