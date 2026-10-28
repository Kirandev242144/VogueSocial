import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class ShopCategoryChips extends StatelessWidget {
  final String selectedCategory;
  final ValueChanged<String> onCategoryChanged;
  final String sortBy;
  final ValueChanged<String> onSortChanged;
  final bool isGridView;
  final ValueChanged<bool>? onViewModeChanged;

  const ShopCategoryChips({
    super.key,
    required this.selectedCategory,
    required this.onCategoryChanged,
    required this.sortBy,
    required this.onSortChanged,
    this.isGridView = true,
    this.onViewModeChanged,
  });

  static const List<Map<String, String>> categories = [
    {'id': 'all', 'label': 'All'},
    {'id': 'tops', 'label': 'Tops'},
    {'id': 'bottoms', 'label': 'Bottoms'},
    {'id': 'outerwear', 'label': 'Outerwear'},
    {'id': 'dresses', 'label': 'Dresses'},
    {'id': 'shoes', 'label': 'Shoes'},
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          // Scrollable category pills
          Expanded(
            child: SizedBox(
              height: 36,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: categories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final cat = categories[index];
                  final catId = cat['id']!;
                  final isSelected = selectedCategory.toLowerCase() == catId.toLowerCase();

                  return GestureDetector(
                    onTap: () => onCategoryChanged(catId),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: isSelected ? AppTheme.primaryColor : AppTheme.surfaceColor,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(
                          color: isSelected ? AppTheme.primaryColor : AppTheme.borderColor,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          cat['label']!,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            color: isSelected ? Colors.white : AppTheme.textColorSecondary,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          const SizedBox(width: 8),

          // Grid / List toggle if provided
          if (onViewModeChanged != null) ...[
            Container(
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppTheme.borderColor),
              ),
              child: InkWell(
                borderRadius: BorderRadius.circular(8),
                onTap: () => onViewModeChanged!(!isGridView),
                child: Padding(
                  padding: const EdgeInsets.all(6),
                  child: Icon(
                    isGridView ? Icons.view_list_rounded : Icons.grid_view_rounded,
                    size: 18,
                    color: AppTheme.textColorPrimary,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 6),
          ],

          // Sort Menu Button
          PopupMenuButton<String>(
            initialValue: sortBy,
            tooltip: 'Sort by',
            onSelected: onSortChanged,
            icon: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppTheme.borderColor),
              ),
              child: const Icon(Icons.sort, size: 18, color: AppTheme.textColorPrimary),
            ),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'featured', child: Text('Featured')),
              const PopupMenuItem(value: 'price_low', child: Text('Price: Low to High')),
              const PopupMenuItem(value: 'price_high', child: Text('Price: High to Low')),
              const PopupMenuItem(value: 'rating', child: Text('Highest Rated')),
            ],
          ),
        ],
      ),
    );
  }
}
