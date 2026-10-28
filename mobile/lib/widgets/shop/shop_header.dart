import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../theme/app_theme.dart';

class ShopHeader extends StatelessWidget {
  final VoidCallback onSettingsPressed;

  const ShopHeader({
    super.key,
    required this.onSettingsPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          SvgPicture.asset(
            'assets/logo.svg',
            height: 26,
            fit: BoxFit.contain,
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: AppTheme.textColorPrimary),
            tooltip: 'API Settings',
            onPressed: onSettingsPressed,
          ),
        ],
      ),
    );
  }
}
