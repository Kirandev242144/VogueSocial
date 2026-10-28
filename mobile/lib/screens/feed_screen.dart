import 'package:flutter/material.dart';
import '../models/product.dart';
import '../theme/app_theme.dart';
import '../widgets/feed/community_feed_view.dart';
import '../widgets/feed/feed_header.dart';
import '../widgets/feed/feed_tabs.dart';
import '../widgets/feed/merchant_feed_card.dart';
import '../widgets/feed/ugc_feed_card.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  String _activeTab = 'FOR YOU';
  final List<String> _tabs = ['FOR YOU', 'COMMUNITY', 'FOLLOWING', 'TRENDS', 'MEN', 'WOMEN'];

  List<Product> _allProducts = [];
  bool _isLoading = true;

  // Social creator profiles for UGC community try-on cards
  static const List<Map<String, String>> _creators = [
    {
      'name': 'Sarah Jen',
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
    },
    {
      'name': 'Marcus Vance',
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    },
    {
      'name': 'Aria Styles',
      'avatar': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150',
    },
    {
      'name': 'Elena Rostova',
      'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150',
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 150));

    if (mounted) {
      setState(() {
        _allProducts = Product.shopProducts;
        _isLoading = false;
      });
    }
  }

  List<Product> get _filteredProducts {
    if (_activeTab == 'TRENDS') {
      return _allProducts.where((p) => p.isTrending).toList();
    }
    if (_activeTab == 'FOLLOWING') {
      return _allProducts.where((p) => p.isSuggested || p.isNew).toList();
    }
    if (_activeTab == 'MEN') {
      final list = _allProducts.where((p) {
        final cat = p.category.toLowerCase();
        return cat.contains('jacket') || cat.contains('suit') || cat.contains('top');
      }).toList();
      return list.isNotEmpty ? list : _allProducts;
    }
    if (_activeTab == 'WOMEN') {
      final list = _allProducts.where((p) {
        final cat = p.category.toLowerCase();
        return cat.contains('dress') || cat.contains('skirt') || cat.contains('top') || cat.contains('one-piece');
      }).toList();
      return list.isNotEmpty ? list : _allProducts;
    }
    return _allProducts;
  }

  void _showSearchSheet() {
    final searchController = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE2E8F0),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Search VogueSocial',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: searchController,
                autofocus: true,
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.search, color: Color(0xFF64748B)),
                  hintText: 'Search styles, brands, garments...',
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final displayedProducts = _filteredProducts;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Logo & Action Bar
            FeedHeader(
              onSearchTap: _showSearchSheet,
            ),

            // 2. Navigation Category Tabs
            FeedTabs(
              tabs: _tabs,
              activeTab: _activeTab,
              onSelectTab: (tab) => setState(() => _activeTab = tab),
            ),
            const SizedBox(height: 8),

            // 3. Tab Body
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor))
                  : _activeTab == 'COMMUNITY'
                      ? const CommunityFeedView()
                      : displayedProducts.isEmpty
                          ? const Center(
                              child: Text('No posts found in this feed.', style: TextStyle(color: Colors.grey)),
                            )
                          : RefreshIndicator(
                              color: AppTheme.primaryColor,
                              onRefresh: _loadProducts,
                              child: ListView.builder(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                itemCount: displayedProducts.length,
                                itemBuilder: (context, index) {
                                  final product = displayedProducts[index];
                                  final creator = _creators[index % _creators.length];
                                  final isUgcPost = index % 2 == 1; // Alternate Vendor vs UGC

                                  if (isUgcPost) {
                                    return UgcFeedCard(
                                      product: product,
                                      creator: creator,
                                      allProducts: displayedProducts,
                                    );
                                  } else {
                                    return MerchantFeedCard(
                                      product: product,
                                      allProducts: displayedProducts,
                                    );
                                  }
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
