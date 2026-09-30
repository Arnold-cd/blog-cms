import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

/// In-App Purchase Service for Lifetime Ad-Free Unlock
class PurchaseService {
  PurchaseService._();
  static final PurchaseService instance = PurchaseService._();

  final InAppPurchase _iap = InAppPurchase.instance;
  StreamSubscription<List<PurchaseDetails>>? _subscription;

  // The Product ID configured in Google Play Console & Apple App Store Connect
  static const String lifetimeAdFreeProductId = 'sllk_lifetime_ad_free';

  ProductDetails? lifetimeProduct;
  bool _isAvailable = false;
  bool get isAvailable => _isAvailable;

  Function(bool success)? onPurchaseSuccess;
  Function(String error)? onPurchaseError;

  Future<void> initialize({
    Function(bool success)? onPurchaseSuccess,
    Function(String error)? onPurchaseError,
  }) async {
    this.onPurchaseSuccess = onPurchaseSuccess;
    this.onPurchaseError = onPurchaseError;

    _isAvailable = await _iap.isAvailable();
    if (!_isAvailable) {
      debugPrint('[PurchaseService] Store not available');
      return;
    }

    _subscription = _iap.purchaseStream.listen(
      _handlePurchaseUpdates,
      onDone: () => _subscription?.cancel(),
      onError: (error) {
        debugPrint('[PurchaseService] Stream error: $error');
      },
    );

    await loadProducts();
  }

  Future<void> loadProducts() async {
    if (!_isAvailable) return;
    try {
      final response = await _iap.queryProductDetails({lifetimeAdFreeProductId});
      if (response.notFoundIDs.isNotEmpty) {
        debugPrint('[PurchaseService] Products not found: ${response.notFoundIDs}');
      }
      if (response.productDetails.isNotEmpty) {
        lifetimeProduct = response.productDetails.firstWhere(
          (p) => p.id == lifetimeAdFreeProductId,
          orElse: () => response.productDetails.first,
        );
      }
    } catch (e) {
      debugPrint('[PurchaseService] Failed to query product details: $e');
    }
  }

  /// Trigger One-Time Purchase
  Future<bool> buyLifetimeAdFree() async {
    if (!_isAvailable) {
      onPurchaseError?.call('Store is currently unavailable. Please try again later.');
      return false;
    }

    ProductDetails? product = lifetimeProduct;
    if (product == null) {
      await loadProducts();
      product = lifetimeProduct;
    }

    if (product == null) {
      // In development or before Play Console approval, report cleanly
      onPurchaseError?.call('Product details are being verified by Google Play. Please try again shortly.');
      return false;
    }

    final purchaseParam = PurchaseParam(productDetails: product);
    try {
      return await _iap.buyNonConsumable(purchaseParam: purchaseParam);
    } catch (e) {
      onPurchaseError?.call(e.toString());
      return false;
    }
  }

  /// Restore Past Purchases (Required by Apple & Play Store)
  Future<void> restorePurchases() async {
    if (!_isAvailable) return;
    try {
      await _iap.restorePurchases();
    } catch (e) {
      onPurchaseError?.call('Could not restore purchases: $e');
    }
  }

  Future<void> _handlePurchaseUpdates(List<PurchaseDetails> purchaseDetailsList) async {
    for (final purchaseDetails in purchaseDetailsList) {
      if (purchaseDetails.status == PurchaseStatus.pending) {
        debugPrint('[PurchaseService] Purchase pending...');
      } else if (purchaseDetails.status == PurchaseStatus.error) {
        debugPrint('[PurchaseService] Purchase error: ${purchaseDetails.error}');
        onPurchaseError?.call(purchaseDetails.error?.message ?? 'Purchase failed');
      } else if (purchaseDetails.status == PurchaseStatus.purchased ||
          purchaseDetails.status == PurchaseStatus.restored) {
        // Verify and grant
        if (purchaseDetails.productID == lifetimeAdFreeProductId) {
          onPurchaseSuccess?.call(true);
        }
      }

      // Complete pending purchase transactions
      if (purchaseDetails.pendingCompletePurchase) {
        await _iap.completePurchase(purchaseDetails);
      }
    }
  }

  void dispose() {
    _subscription?.cancel();
  }
}
