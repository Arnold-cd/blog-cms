# Disable aggressive R8 bytecode optimizations (method inlining, class merging,
# and signature rewriting) while keeping R8 code shrinking and obfuscation active
# for Google Play Console DEX optimization compliance.
-dontoptimize
-dontpreverify

# Flutter Engine & Embedding Rules
-keep class io.flutter.** { *; }
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.embedding.** { *; }
-keep class io.flutter.plugins.** { *; }
-dontwarn io.flutter.**

# Application & MainActivity
-keep class sllk.kangleipak.app.** { *; }

# Google Mobile Ads (AdMob) & User Messaging Platform (UMP Consent SDK)
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.mediation.** { *; }
-keep class com.google.android.gms.internal.ads.** { *; }
-keep class com.google.android.ump.** { *; }
-keep class com.google.android.gms.internal.consent_sdk.** { *; }
-dontwarn com.google.android.gms.**
-dontwarn com.google.android.ump.**

# In-App Purchase & Google Play Billing
-keep class com.android.billingclient.** { *; }
-keep class com.google.android.gms.internal.play_billing.** { *; }
-keep class io.flutter.plugins.inapppurchase.** { *; }
-dontwarn com.android.billingclient.**
-dontwarn com.google.android.gms.internal.play_billing.**

# Flutter PDFView & Barteksc AndroidPdfViewer
-keep class io.endigo.plugins.pdfviewflutter.** { *; }
-keep class com.github.barteksc.pdfviewer.** { *; }
-keep class com.github.barteksc.pdfview.** { *; }
-keep class com.shockwave.** { *; }
-dontwarn com.github.barteksc.**
-dontwarn io.endigo.plugins.pdfviewflutter.**

# Flutter TTS
-keep class com.eyedeadevelopment.fluttertts.** { *; }
-dontwarn com.eyedeadevelopment.fluttertts.**

# Share Plus
-keep class dev.fluttercommunity.plus.** { *; }
-dontwarn dev.fluttercommunity.plus.**

# Sqflite
-keep class com.tekartik.sqflite.** { *; }
-dontwarn com.tekartik.sqflite.**

# JNI & FFI bindings (used by in_app_purchase / dart_lang / path_provider)
-keepclasseswithmembernames class * {
    native <methods>;
}
-keep class com.github.dart_lang.jni.** { *; }
-keep class com.github.dart_lang.jni_flutter.** { *; }
-dontwarn com.github.dart_lang.**

# AndroidX Lifecycle, Window, DataStore & Core (used by FlutterActivity, FlutterView, SharedPreferences, SharePlus, AdMob)
-keep class androidx.lifecycle.** { *; }
-keep class androidx.window.** { *; }
-keep class androidx.datastore.** { *; }
-keep class androidx.core.content.FileProvider { *; }
-keep class androidx.startup.** { *; }
-dontwarn androidx.window.**
-dontwarn androidx.datastore.**

# Kotlin & Coroutines ServiceLoader (used by SharedPreferences DataStore & lifecycle at app startup)
-keep class kotlin.Metadata { *; }
-keep class kotlinx.coroutines.android.** { *; }
-keep class kotlinx.coroutines.internal.MainDispatcherFactory { *; }
-keep class kotlinx.coroutines.CoroutineExceptionHandler { *; }
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}
-dontwarn kotlinx.coroutines.**

# Keep models, reflection and debugging attributes
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod,SourceFile,LineNumberTable

