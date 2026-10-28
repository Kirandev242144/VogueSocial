import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class ShopFilterTabs extends StatelessWidget {
  final String activeTab;
  final ValueChanged<String> onTabChanged;

  const ShopFilterTabs({
    super.key,
    required this.activeTab,
    required this.onTabChanged,
  });

  static const List<Map<String, String>> tabs = [
    {'id': 'suggested', 'label': 'SUGGESTED FOR YOU'},
    {'id': 'trending', 'label': 'TRENDING'},
    {'id': 'new_arrivals', 'label': 'NEW ARRIVALS'},
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 38,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: AppTheme.borderColor, width: 1),
        ),
      ),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: tabs.length,
        separatorBuilder: (_, __) => const SizedBox(width: 18),
        itemBuilder: (context, index) {
          final tab = tabs[index];
          final tabId = tab['id']!;
          final isActive = activeTab == tabId;

          return GestureDetector(
            onTap: () => onTabChanged(tabId),
            behavior: HitTestBehavior.opaque,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  tab['label']!,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: isActive ? FontWeight.w800 : FontWeight.w600,
                    letterSpacing: 0.6,
                    color: isActive ? AppTheme.textColorPrimary : AppTheme.textColorSecondary,
                  ),
                ),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  height: 2.5,
                  width: isActive ? 44 : 0,
                  decoration: BoxDecoration(
                    color: isActive ? AppTheme.primaryColor : Colors.transparent,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
