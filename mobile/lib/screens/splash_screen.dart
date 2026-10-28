import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../providers/tryon_provider.dart';
import '../theme/app_theme.dart';
import 'login_screen.dart';
import 'main_screen.dart';
import 'onboarding_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  double _logoOpacity = 0.0;
  double _logoScale = 0.8;

  @override
  void initState() {
    super.initState();

    // Trigger onboarding load immediately during splash screen
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<TryOnProvider>(context, listen: false).loadOnboardingStatus();
    });

    // Animate logo entrance
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) {
        setState(() {
          _logoOpacity = 1.0;
          _logoScale = 1.0;
        });
      }
    });

    // Navigate dynamically after 8 seconds
    Timer(const Duration(seconds: 8), () {
      if (mounted) {
        final provider = Provider.of<TryOnProvider>(context, listen: false);
        
        final session = Supabase.instance.client.auth.currentSession;
        final Widget nextScreen;
        
        if (session != null) {
          nextScreen = provider.isOnboardingCompleted
              ? const MainScreen()
              : const OnboardingScreen();
        } else {
          nextScreen = const LoginScreen();
        }

        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => nextScreen),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background Animated WebP - Rendered natively and smoothly by the 
          // Flutter framework without relying on native decoders or causing deadlock.
          Image.asset(
            'assets/video_fashion.webp',
            fit: BoxFit.cover,
            gaplessPlayback: true,
          ),

          // Light elegant white overlay wash (makes video softer and background white/light)
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.white.withOpacity(0.65),
                  Colors.white.withOpacity(0.85),
                ],
              ),
            ),
          ),

          // Centered Logo and Tagline with animation
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AnimatedOpacity(
                  opacity: _logoOpacity,
                  duration: const Duration(seconds: 1),
                  curve: Curves.easeOutCubic,
                  child: AnimatedScale(
                    scale: _logoScale,
                    duration: const Duration(seconds: 1),
                    curve: Curves.easeOutCubic,
                    child: Hero(
                      tag: 'app_logo',
                      child: SvgPicture.asset(
                        'assets/logo.svg',
                        height: 52,
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 28),
                // Premium Tagline (dark grey / black for maximum readability on white wash)
                AnimatedOpacity(
                  opacity: _logoOpacity,
                  duration: const Duration(milliseconds: 1200),
                  child: Column(
                    children: [
                      Text(
                        'V O G U E S O C I A L',
                        style: TextStyle(
                          color: Colors.black.withOpacity(0.85),
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 4,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'The Future of Fashion Discovery',
                        style: TextStyle(
                          color: Colors.black.withOpacity(0.55),
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          letterSpacing: 1,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Bottom Loading indicator
          Positioned(
            bottom: 60,
            left: 0,
            right: 0,
            child: Center(
              child: SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    AppTheme.primaryColor.withOpacity(0.8),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
