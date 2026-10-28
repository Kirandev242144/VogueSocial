import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../theme/app_theme.dart';
import '../../screens/notifications_screen.dart';

class FeedHeader extends StatelessWidget {
  final VoidCallback? onSearchTap;

  const FeedHeader({
    super.key,
    this.onSearchTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              SvgPicture.asset(
                'assets/logo.svg',
                height: 24,
                placeholderBuilder: (_) => const Text(
                  'VogueSocial',
                  style: TextStyle(
                    fontFamily: 'Playfair',
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.5,
                    color: AppTheme.textColorPrimary,
                  ),
                ),
              ),
              const SizedBox(width: 6),
              const Icon(
                Icons.auto_awesome,
                size: 14,
                color: AppTheme.primaryColor,
              ),
            ],
          ),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.search, color: AppTheme.textColorPrimary, size: 22),
                onPressed: onSearchTap ?? () {},
              ),
              const SizedBox(width: 4),
              IconButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const NotificationsScreen()),
                  );
                },
                icon: const Badge(
                  label: Text('3', style: TextStyle(color: Colors.white, fontSize: 10)),
                  child: Icon(Icons.notifications_none_outlined, color: AppTheme.textColorPrimary),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
