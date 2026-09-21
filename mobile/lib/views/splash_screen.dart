import "dart:async";
import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:google_fonts/google_fonts.dart";
import "main_navigation_screen.dart";

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _logoScaleAnimation;
  late Animation<double> _logoFadeAnimation;
  late Animation<double> _textFadeAnimation;
  late Animation<double> _glowAnimation;
  Timer? _timer;

  @override
  void initState() {
    super.initState();

    // Set immersive navigation/status bar for luxury feel
    SystemChrome.setEnabledSystemUIMode(
      SystemUiMode.edgeToEdge,
      overlays: [SystemUiOverlay.top],
    );

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );

    // Staggered luxury entrance curves
    _logoScaleAnimation = Tween<double>(begin: 0.82, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.65, curve: Curves.easeOutCubic),
      ),
    );

    _logoFadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.45, curve: Curves.easeIn),
      ),
    );

    _glowAnimation = Tween<double>(begin: 0.2, end: 0.65).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.3, 0.85, curve: Curves.easeInOut),
      ),
    );

    _textFadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.35, 0.95, curve: Curves.easeOut),
      ),
    );

    _controller.forward();

    // Transition smoothly after 2.3 seconds
    _timer = Timer(const Duration(milliseconds: 2300), _navigateToHome);
  }

  void _navigateToHome() {
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 700),
        pageBuilder: (context, animation, secondaryAnimation) =>
            const MainNavigationScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(
            opacity: CurvedAnimation(
              parent: animation,
              curve: Curves.easeInOutCubic,
            ),
            child: child,
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07090E),
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _navigateToHome, // Allow user to tap anywhere to skip
        child: Stack(
          children: [
            // 1. Subtle classic radial background glow
            Positioned.fill(
              child: AnimatedBuilder(
                animation: _glowAnimation,
                builder: (context, _) {
                  return Container(
                    decoration: BoxDecoration(
                      gradient: RadialGradient(
                        center: const Alignment(0.0, -0.15),
                        radius: 1.1,
                        colors: [
                          const Color(0xFFD97706)
                              .withOpacity(_glowAnimation.value * 0.22),
                          const Color(0xFF4F46E5)
                              .withOpacity(_glowAnimation.value * 0.16),
                          const Color(0xFF07090E),
                        ],
                        stops: const [0.0, 0.45, 1.0],
                      ),
                    ),
                  );
                },
              ),
            ),

            // 2. Subtle corner heritage decorative lines
            Positioned(
              top: 50,
              left: 30,
              right: 30,
              child: FadeTransition(
                opacity: _textFadeAnimation,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      width: 32,
                      height: 1,
                      color: const Color(0xFFD4AF37).withOpacity(0.3),
                    ),
                    Text(
                      "HERITAGE ARCHIVE",
                      style: GoogleFonts.cinzel(
                        fontSize: 9,
                        letterSpacing: 3.5,
                        color: const Color(0xFFD4AF37).withOpacity(0.55),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Container(
                      width: 32,
                      height: 1,
                      color: const Color(0xFFD4AF37).withOpacity(0.3),
                    ),
                  ],
                ),
              ),
            ),

            // 3. Center Classic Logo & Typography Brand
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 28),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Brand Logo with Golden Halo Shadow
                    AnimatedBuilder(
                      animation: _controller,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: _logoScaleAnimation.value,
                          child: Opacity(
                            opacity: _logoFadeAnimation.value,
                            child: Container(
                              width: 104,
                              height: 104,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(26),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFFD97706)
                                        .withOpacity(0.28 * _glowAnimation.value),
                                    blurRadius: 36,
                                    spreadRadius: 6,
                                  ),
                                  BoxShadow(
                                    color: const Color(0xFF6366F1)
                                        .withOpacity(0.20 * _glowAnimation.value),
                                    blurRadius: 48,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                              child: Stack(
                                children: [
                                  // Logo Image
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(26),
                                    child: Image.asset(
                                      "assets/images/app_logo.png",
                                      width: 104,
                                      height: 104,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                  // Regal Glass Border Accent
                                  Container(
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(26),
                                      border: Border.all(
                                        color: const Color(0xFFD4AF37)
                                            .withOpacity(0.35),
                                        width: 1.2,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: 32),

                    // Brand Typography
                    FadeTransition(
                      opacity: _textFadeAnimation,
                      child: Column(
                        children: [
                          // Classic Regal Title
                          Text(
                            "S L L K",
                            style: GoogleFonts.cinzel(
                              fontSize: 28,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 10.0,
                              color: const Color(0xFFFAF7F2),
                            ),
                          ),

                          const SizedBox(height: 10),

                          // Ancient Meetei Mayek Inscription
                          const Text(
                            "ꯄꯨꯌꯥ ꯂꯥꯏꯔꯤꯛ ꯑꯃꯁꯨꯡ ꯂꯣꯏꯅꯁꯤꯟꯂꯣꯟ",
                            style: TextStyle(
                              fontFamily: "NotoSansMeeteiMayek",
                              fontSize: 13.5,
                              letterSpacing: 0.5,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFFD4AF37), // Heritage Gold
                            ),
                          ),

                          const SizedBox(height: 14),

                          // Decorative Gold Hairline Divider with Diamond
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 44,
                                height: 1,
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      Colors.transparent,
                                      const Color(0xFFD4AF37).withOpacity(0.5),
                                    ],
                                  ),
                                ),
                              ),
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 8),
                                child: Text(
                                  "◆",
                                  style: TextStyle(
                                    fontSize: 7,
                                    color: const Color(0xFFD4AF37)
                                        .withOpacity(0.7),
                                  ),
                                ),
                              ),
                              Container(
                                width: 44,
                                height: 1,
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      const Color(0xFFD4AF37).withOpacity(0.5),
                                      Colors.transparent,
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 14),

                          // English Subtitle
                          Text(
                            "ANCIENT MANUSCRIPTS & DIGITAL ARCHIVE",
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 10.5,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 2.2,
                              color: Colors.white.withOpacity(0.65),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // 4. Elegant Minimal Footer Loading Indicator
            Positioned(
              bottom: 44,
              left: 0,
              right: 0,
              child: FadeTransition(
                opacity: _textFadeAnimation,
                child: Column(
                  children: [
                    // Sleek golden hairline progress bar
                    SizedBox(
                      width: 48,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(2),
                        child: LinearProgressIndicator(
                          minHeight: 1.8,
                          backgroundColor: Colors.white.withOpacity(0.08),
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            Color(0xFFD4AF37),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      "Preserving Cultural Heritage",
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10,
                        letterSpacing: 1.4,
                        color: Colors.white.withOpacity(0.38),
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
