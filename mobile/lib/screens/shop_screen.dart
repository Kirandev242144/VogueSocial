import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/tryon_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/shop/api_settings_dialog.dart';
import '../widgets/shop/shop_category_chips.dart';
import '../widgets/shop/shop_empty_state.dart';
import '../widgets/shop/shop_filter_tabs.dart';
import '../widgets/shop/shop_header.dart';
import '../widgets/shop/shop_product_card.dart';
import '../widgets/shop/shop_search_bar.dart';

class ShopScreen extends StatefulWidget {
  const ShopScreen({super.key});

  @override
  State<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends State<ShopScreen> {
  String _activeTab = 'suggested'; // 'suggested' | 'trending' | 'new_arrivals'
  String _selectedCategory = 'all';
  String _sortBy = 'featured'; // 'featured' | 'price_low' | 'price_high' | 'rating'
  String _searchQuery = '';
  bool _isGridView = true;

  final TextEditingController _searchController = TextEditingController();
  final List<Product> _allProducts = Product.shopProducts;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _resetFilters() {
    setState(() {
      _searchController.clear();
      _searchQuery = '';
      _selectedCategory = 'all';
      _activeTab = 'suggested';
      _sortBy = 'featured';
    });
  }

  List<Product> get _filteredProducts {
    var list = _allProducts.where((p) {
      // 1. Search filter
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final matchName = p.name.toLowerCase().contains(q) || p.shortName.toLowerCase().contains(q);
        final matchCat = p.category.toLowerCase().contains(q);
        if (!matchName && !matchCat) return false;
      }

      // 2. Tab filter
      if (_activeTab == 'trending' && !p.isTrending) return false;
      if (_activeTab == 'new_arrivals' && !p.isNew) return false;
      if (_activeTab == 'suggested' && !p.isSuggested) return false;

      // 3. Category filter
      if (_selectedCategory != 'all' && p.category.toLowerCase() != _selectedCategory.toLowerCase()) {
        return false;
      }

      return true;
    }).toList();

    // Sorting
    switch (_sortBy) {
      case 'price_low':
        list.sort((a, b) => a.price.compareTo(b.price));
        break;
      case 'price_high':
        list.sort((a, b) => b.price.compareTo(a.price));
        break;
      case 'rating':
        list.sort((a, b) => b.rating.compareTo(a.rating));
        break;
      case 'featured':
      default:
        break;
    }

    return list;
  }

  @override
  Widget build(BuildContext context) {
    final tryOnProvider = Provider.of<TryOnProvider>(context, listen: false);
    final displayedProducts = _filteredProducts;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Top branding logo & settings
            ShopHeader(
              onSettingsPressed: () => ApiSettingsDialog.show(context, tryOnProvider),
            ),

            // Search Bar
            ShopSearchBar(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val),
              onClear: () {
                _searchController.clear();
                setState(() => _searchQuery = '');
              },
            ),
            const SizedBox(height: 8),

            // Subtabs Row (SUGGESTED FOR YOU | TRENDING | NEW ARRIVALS)
            ShopFilterTabs(
              activeTab: _activeTab,
              onTabChanged: (tabId) => setState(() => _activeTab = tabId),
            ),
            const SizedBox(height: 8),

            // Horizontal Category Pills, View Toggle & Sort Dropdown
            ShopCategoryChips(
              selectedCategory: _selectedCategory,
              onCategoryChanged: (catId) => setState(() => _selectedCategory = catId),
              sortBy: _sortBy,
              onSortChanged: (sortVal) => setState(() => _sortBy = sortVal),
              isGridView: _isGridView,
              onViewModeChanged: (val) => setState(() => _isGridView = val),
            ),
            const SizedBox(height: 12),

            // Product Grid or List View
            Expanded(
              child: displayedProducts.isEmpty
                  ? ShopEmptyState(onResetFilters: _resetFilters)
                  : Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: _isGridView
                          ? GridView.builder(
                              physics: const BouncingScrollPhysics(),
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                childAspectRatio: 0.58,
                                crossAxisSpacing: 14,
                                mainAxisSpacing: 16,
                              ),
                              itemCount: displayedProducts.length,
                              itemBuilder: (context, index) {
                                final product = displayedProducts[index];
                                return ShopProductCard(
                                  product: product,
                                  allProducts: displayedProducts,
                                  isListLayout: false,
                                );
                              },
                            )
                          : ListView.builder(
                              physics: const BouncingScrollPhysics(),
                              itemCount: displayedProducts.length,
                              itemBuilder: (context, index) {
                                final product = displayedProducts[index];
                                return ShopProductCard(
                                  product: product,
                                  allProducts: displayedProducts,
                                  isListLayout: true,
                                );
                              },
                            ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
