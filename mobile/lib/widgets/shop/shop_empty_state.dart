import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class ShopEmptyState extends StatelessWidget {
  final VoidCallback? onResetFilters;

  const ShopEmptyState({
    super.key,
    this.onResetFilters,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                shape: BoxShape.circle,
                border: Border.all(color: AppTheme.borderColor),
              ),
              child: Icon(
                Icons.checkroom_outlined,
                size: 44,
                color: Colors.grey.shade400,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'No matching outfits found',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppTheme.textColorPrimary,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Try adjusting your filter categories or search query.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: AppTheme.textColorSecondary),
            ),
            if (onResetFilters != null) ...[
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: onResetFilters,
                icon: const Icon(Icons.refresh, size: 16),
                label: const Text('Reset Filters'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppTheme.primaryColor,
                  side: const BorderSide(color: AppTheme.borderColor),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
