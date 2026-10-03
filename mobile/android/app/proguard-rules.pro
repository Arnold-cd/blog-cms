# Flutter Rules
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }
-dontwarn io.flutter.**

# Flutter PDFView & Barteksc AndroidPdfViewer
-keep class io.endigo.plugins.pdfviewflutter.** { *; }
-keep class com.github.barteksc.pdfviewer.** { *; }
-keep class com.github.barteksc.pdfview.** { *; }
-keep class com.shockwave.** { *; }
-dontwarn com.github.barteksc.**
-dontwarn io.endigo.plugins.pdfviewflutter.**

# Google Mobile Ads
-keep public class com.google.android.gms.ads.** { *; }
-keep public class com.google.ads.mediation.** { *; }
-dontwarn com.google.android.gms.ads.**

# In-App Purchase / Google Play Billing
-keep class com.android.billingclient.** { *; }
-keep class io.flutter.plugins.inapppurchase.** { *; }
-dontwarn com.android.billingclient.**

# Flutter TTS
-keep class com.eyedeadevelopment.fluttertts.** { *; }
-dontwarn com.eyedeadevelopment.fluttertts.**

# JNI & FFI bindings (used by in_app_purchase / dart_lang)
-keepclasseswithmembernames class * {
    native <methods>;
}
-keep class com.github.dart_lang.jni.** { *; }
-keep class com.github.dart_lang.jni_flutter.** { *; }
-dontwarn com.github.dart_lang.**

# Keep models and reflection
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
