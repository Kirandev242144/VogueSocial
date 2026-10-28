import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../theme/app_theme.dart';
import 'main_screen.dart';
import 'onboarding_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isLoading = false;

  Future<void> _handleGoogleSignIn() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Trigger Supabase OAuth sign-in flow
      // It launches the browser, handles OAuth, and redirects back via io.supabase.flutter scheme
      await Supabase.instance.client.auth.signInWithOAuth(
        OAuthProvider.google,
        redirectTo: 'io.supabase.flutter://login-callback',
      );
      
      // Wait for auth state change callback (Supabase listens to deep link redirects natively)
    } catch (e) {
      debugPrint('LoginScreen: OAuth failed: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Google Sign-In failed: $e. Falling back to Guest mode.'),
            backgroundColor: Colors.redAccent,
          ),
        );
        // Fallback bypass for local emulator testing
        _handleGuestLogin();
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _handleGuestLogin() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate login delay
    await Future.delayed(const Duration(milliseconds: 1000));

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
      
      // Proceed directly to onboarding or home screen
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => const OnboardingScreen(),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background loop video / WebP
          Image.asset(
            'assets/video_fashion.webp',
            fit: BoxFit.cover,
            gaplessPlayback: true,
          ),

          // Glassmorphic / light overlay wash
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.white.withOpacity(0.6),
                  Colors.white.withOpacity(0.85),
                ],
              ),
            ),
          ),

          // Main contents
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Spacer(flex: 3),

                  // Brand identity
                  SvgPicture.asset(
                    'assets/logo.svg',
                    height: 48,
                    fit: BoxFit.contain,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'V O G U E S O C I A L',
                    style: TextStyle(
                      color: Colors.black.withOpacity(0.85),
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 4,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Welcome to VogueSocial',
                    style: TextStyle(
                      color: Colors.black.withOpacity(0.7),
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Sign in to unlock your personal wardrobe',
                    style: TextStyle(
                      color: Colors.black.withOpacity(0.5),
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const Spacer(flex: 4),

                  if (_isLoading)
                    const Center(
                      child: CircularProgressIndicator(color: AppTheme.primaryColor),
                    )
                  else ...[
                    // Google Sign-In Button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.black,
                          elevation: 1,
                          side: BorderSide(color: Colors.grey.withOpacity(0.15)),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(26),
                          ),
                        ),
                        onPressed: _handleGoogleSignIn,
                        icon: SvgPicture.network(
                          'https://www.svgrepo.com/show/475656/google-color.svg',
                          width: 20,
                          height: 20,
                        ),
                        label: const Text(
                          'Continue with Google',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            letterSpacing: 0.2,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    Row(
                      children: [
                        Expanded(child: Divider(color: Colors.grey.withOpacity(0.3))),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          child: Text(
                            'or',
                            style: TextStyle(color: Colors.grey.withOpacity(0.6), fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                        ),
                        Expanded(child: Divider(color: Colors.grey.withOpacity(0.3))),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Continue with Email / Guest button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: TextButton(
                        style: TextButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(26),
                          ),
                        ),
                        onPressed: _handleGuestLogin,
                        child: const Text(
                          'Continue with Email / Guest Access',
                          style: TextStyle(
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ),
                  ],

                  const Spacer(flex: 1),

                  Text(
                    'By proceeding, you agree to our Terms of Service and Privacy Policy.',
                    style: TextStyle(
                      color: Colors.grey.withOpacity(0.7),
                      fontSize: 10,
                      fontWeight: FontWeight.w400,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
