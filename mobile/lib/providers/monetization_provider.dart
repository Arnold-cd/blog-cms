import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/ad_service.dart';
import '../services/purchase_service.dart';

class MonetizationState {
  final bool isLifetimeAdFree;
  final DateTime? rewardedAdFreeUntil;

  const MonetizationState({
    this.isLifetimeAdFree = false,
    this.rewardedAdFreeUntil,
  });

  /// Computed status: true if user should NOT see any ads
  bool get isAdFreeActive {
    if (isLifetimeAdFree) return true;
    if (rewardedAdFreeUntil != null && rewardedAdFreeUntil!.isAfter(DateTime.now())) {
      return true;
    }
    return false;
  }

  /// Remaining duration of rewarded ad pass
  Duration? get remainingRewardedTime {
    if (rewardedAdFreeUntil == null) return null;
    final diff = rewardedAdFreeUntil!.difference(DateTime.now());
    return diff.isNegative ? null : diff;
  }

  MonetizationState copyWith({
    bool? isLifetimeAdFree,
    DateTime? rewardedAdFreeUntil,
  }) {
    return MonetizationState(
      isLifetimeAdFree: isLifetimeAdFree ?? this.isLifetimeAdFree,
      rewardedAdFreeUntil: rewardedAdFreeUntil ?? this.rewardedAdFreeUntil,
    );
  }
}

class MonetizationNotifier extends StateNotifier<MonetizationState> {
  MonetizationNotifier() : super(const MonetizationState()) {
    _loadState();
    _initPurchaseService();
  }

  static const String _prefLifetimeKey = 'sllk_lifetime_ad_free';
  static const String _prefRewardedUntilKey = 'sllk_rewarded_until';

  Future<void> _loadState() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final isLifetime = prefs.getBool(_prefLifetimeKey) ?? false;
      final rewardedUntilStr = prefs.getString(_prefRewardedUntilKey);
      DateTime? rewardedUntil;
      if (rewardedUntilStr != null) {
        rewardedUntil = DateTime.tryParse(rewardedUntilStr);
      }

      state = MonetizationState(
        isLifetimeAdFree: isLifetime,
        rewardedAdFreeUntil: rewardedUntil,
      );
      AdService.instance.setAdFree(state.isAdFreeActive);
    } catch (e) {
      debugPrint('[MonetizationNotifier] Error loading prefs: $e');
    }
  }

  void _initPurchaseService() {
    PurchaseService.instance.initialize(
      onPurchaseSuccess: (success) {
        if (success) {
          setLifetimeAdFree(true);
        }
      },
    );
  }

  /// Set lifetime ad-free status (from IAP purchase or restore)
  Future<void> setLifetimeAdFree(bool value) async {
    state = state.copyWith(isLifetimeAdFree: value);
    AdService.instance.setAdFree(state.isAdFreeActive);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefLifetimeKey, value);
  }

  /// Grant 1-hour ad-free pass from rewarded video
  Future<void> grantRewardedPass({Duration duration = const Duration(hours: 1)}) async {
    final expiry = DateTime.now().add(duration);
    state = state.copyWith(rewardedAdFreeUntil: expiry);
    AdService.instance.setAdFree(state.isAdFreeActive);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefRewardedUntilKey, expiry.toIso8601String());
  }

  /// Request Lifetime In-App Purchase
  Future<bool> buyLifetimePass() async {
    return await PurchaseService.instance.buyLifetimeAdFree();
  }

  /// Restore Past In-App Purchases
  Future<void> restorePurchases() async {
    await PurchaseService.instance.restorePurchases();
  }
}

final monetizationProvider =
    StateNotifierProvider<MonetizationNotifier, MonetizationState>((ref) {
  return MonetizationNotifier();
});
