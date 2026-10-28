import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class FeedTabs extends StatelessWidget {
  final List<String> tabs;
  final String activeTab;
  final ValueChanged<String> onSelectTab;

  const FeedTabs({
    super.key,
    required this.tabs,
    required this.activeTab,
    required this.onSelectTab,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 42,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: tabs.length,
        itemBuilder: (context, index) {
          final tabName = tabs[index];
          final isActive = activeTab == tabName;

          return GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: () => onSelectTab(tabName),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    tabName,
                    style: TextStyle(
                      fontSize: 12.5,
                      fontWeight: isActive ? FontWeight.w800 : FontWeight.w600,
                      color: isActive ? AppTheme.textColorPrimary : Colors.grey.shade500,
                      letterSpacing: 0.6,
                    ),
                  ),
                  const SizedBox(height: 6),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    curve: Curves.easeOut,
                    height: 2.5,
                    width: isActive ? 28 : 0,
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
