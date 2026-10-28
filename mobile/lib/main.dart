import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'providers/tryon_provider.dart';
import 'screens/splash_screen.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: 'https://kvlvxrefpscdnbhsgopm.supabase.co',
    anonKey: 'sb_publishable_XeZ5jMirBwLKf8e299bAVw_Ed33ViuI',
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => TryOnProvider()),
      ],
      child: const VogueSocialApp(),
    ),
  );
}

class VogueSocialApp extends StatelessWidget {
  const VogueSocialApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VogueSocial AI Try-On',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const SplashScreen(),
    );
  }
}
