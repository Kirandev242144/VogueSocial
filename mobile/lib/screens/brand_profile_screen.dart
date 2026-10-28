import 'package:flutter/material.dart';
import '../models/product.dart';
import '../widgets/product_image.dart';
import 'reels_swipe_screen.dart';
import 'tryon_screen.dart';

class BrandProfileScreen extends StatefulWidget {
  final String brandName;
  final String brandHandle;
  final String? avatarUrl;
  final String? category;
  final String? location;
  final String? bio;
  final int? initialFollowers;
  final int? initialFollowing;
  final List<Product>? products;

  const BrandProfileScreen({
    super.key,
    required this.brandName,
    this.brandHandle = 'studiolabel',
    this.avatarUrl,
    this.category,
    this.location,
    this.bio,
    this.initialFollowers,
    this.initialFollowing,
    this.products,
  });

  @override
  State<BrandProfileScreen> createState() => _BrandProfileScreenState();
}

class _BrandProfileScreenState extends State<BrandProfileScreen> {
  bool _isFollowing = false;
  late int _followersCount;
  late int _followingCount;
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Tops & Jackets',
    'Bottoms & Trousers',
    'Dresses & Jumpsuits',
    'Lifestyle & Others',
  ];

  @override
  void initState() {
    super.initState();
    _followersCount = widget.initialFollowers ?? 3800;
    _followingCount = widget.initialFollowing ?? 180;
  }

  List<Product> get _allBrandProducts {
    if (widget.products != null && widget.products!.isNotEmpty) {
      return widget.products!;
    }
    // Query synchronized shop products
    final exactMatches = Product.shopProducts.where((p) {
      final b = p.brand.trim().toLowerCase();
      final target = widget.brandName.trim().toLowerCase();
      return b.contains(target) || target.contains(b);
    }).toList();

    // If specific brand products found, return them; otherwise display the luxury shop collection
    return exactMatches.isNotEmpty ? exactMatches : Product.shopProducts;
  }

  String get _resolvedCoverImage {
    final list = _allBrandProducts;
    if (list.isNotEmpty) {
      // Pick secondary image if available for lookbook diversity, or first image
      if (list.first.secondaryImage != null && list.first.secondaryImage!.isNotEmpty) {
        return list.first.secondaryImage!;
      }
      return list.first.imageUrl;
    }
    return widget.avatarUrl ?? '/Shop_images/1/basic2-500x750.jpeg';
  }

  String get _resolvedAvatarImage {
    if (widget.avatarUrl != null && widget.avatarUrl!.isNotEmpty) {
      return widget.avatarUrl!;
    }
    final list = _allBrandProducts;
    if (list.isNotEmpty) {
      return list.first.imageUrl;
    }
    return '/Shop_images/1/basic2-500x750.jpeg';
  }

  List<Product> get _filteredProducts {
    final list = _allBrandProducts;
    if (_selectedCategory == 'All') return list;

    if (_selectedCategory == 'Tops & Jackets') {
      return list.where((p) {
        final cat = p.category.toLowerCase();
        return cat.contains('top') ||
            cat.contains('jacket') ||
            cat.contains('outer') ||
            cat.contains('suit') ||
            cat.contains('shirt');
      }).toList();
    } else if (_selectedCategory == 'Bottoms & Trousers') {
      return list.where((p) {
        final cat = p.category.toLowerCase();
        return cat.contains('bottom') ||
            cat.contains('pant') ||
            cat.contains('trouser') ||
            cat.contains('skirt') ||
            cat.contains('legging');
      }).toList();
    } else if (_selectedCategory == 'Dresses & Jumpsuits') {
      return list.where((p) {
        final cat = p.category.toLowerCase();
        return cat.contains('dress') || cat.contains('one-piece') || cat.contains('gown');
      }).toList();
    } else {
      return list.where((p) {
        final cat = p.category.toLowerCase();
        final isTop = cat.contains('top') || cat.contains('jacket') || cat.contains('outer') || cat.contains('shirt');
        final isBottom = cat.contains('bottom') || cat.contains('pant') || cat.contains('trouser') || cat.contains('skirt');
        final isDress = cat.contains('dress') || cat.contains('one-piece');
        return !isTop && !isBottom && !isDress;
      }).toList();
    }
  }

  void _toggleFollow() {
    setState(() {
      _isFollowing = !_isFollowing;
      _followersCount += _isFollowing ? 1 : -1;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _isFollowing ? 'Following ${widget.brandName}' : 'Unfollowed ${widget.brandName}',
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        duration: const Duration(seconds: 2),
        backgroundColor: const Color(0xFF0F172A),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  void _showMessageDialog() {
    final textController = TextEditingController();
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
            top: 24,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
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
              Row(
                children: [
                  CircleAvatar(
                    radius: 18,
                    backgroundColor: const Color(0xFFF1F5F9),
                    child: ClipOval(
                      child: ProductImage(
                        imagePath: _resolvedAvatarImage,
                        width: 36,
                        height: 36,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Message ${widget.brandName}',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      Text(
                        'Direct Atelier Concierge',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _presetChip('Custom sizing inquiry', textController),
                  _presetChip('Shipping timeline', textController),
                  _presetChip('Styling advice', textController),
                ],
              ),
              const SizedBox(height: 14),
              TextField(
                controller: textController,
                maxLines: 3,
                decoration: InputDecoration(
                  hintText: 'Type your message to ${widget.brandName}...',
                  hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 13),
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
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: Color(0xFF0F172A), width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Message sent to ${widget.brandName}!'),
                        backgroundColor: const Color(0xFF0F172A),
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0F172A),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: const Text('Send Message', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _presetChip(String label, TextEditingController controller) {
    return GestureDetector(
      onTap: () {
        controller.text = label;
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(99),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: Color(0xFF475569),
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  void _showStorefrontSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(24),
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
              const SizedBox(height: 20),
              Row(
                children: [
                  const Icon(Icons.verified_outlined, color: Color(0xFF0F172A), size: 24),
                  const SizedBox(width: 10),
                  Text(
                    '${widget.brandName} Atelier',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                'Official digital boutique hosted on VogueSocial. Browse verified looks, virtual try-on mirrors, and direct atelier pieces with carbon-neutral worldwide shipping.',
                style: TextStyle(
                  fontSize: 13,
                  color: Colors.grey.shade700,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.link, size: 16, color: Color(0xFF64748B)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'https://${widget.brandHandle}.voguesocial.com',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF0F172A),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const Icon(Icons.copy, size: 14, color: Color(0xFF64748B)),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(ctx),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0F172A),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: const Text('Browse Collection Below', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final coverImage = _resolvedCoverImage;
    final avatarImage = _resolvedAvatarImage;
    final displayProducts = _filteredProducts;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: CustomScrollView(
        slivers: [
          // 1. Unified Cover Banner + Brand Header Card + Category Filter in ONE Sliver
          SliverToBoxAdapter(
            child: Stack(
              children: [
                // Background Layer: Crisp, high-resolution lookbook cover banner
                SizedBox(
                  height: 230,
                  width: double.infinity,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      ProductImage(
                        imagePath: coverImage,
                        fit: BoxFit.cover,
                      ),
                      // Top & bottom gradient overlay for contrast and button readability
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withValues(alpha: 0.45),
                              Colors.transparent,
                              Colors.black.withValues(alpha: 0.35),
                            ],
                            stops: const [0.0, 0.5, 1.0],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Top Navigation Buttons: Back and Share
                SafeArea(
                  bottom: false,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Back Pill Button
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(99),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.08),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.arrow_back, size: 15, color: Color(0xFF334155)),
                                SizedBox(width: 6),
                                Text(
                                  'Back',
                                  style: TextStyle(
                                    color: Color(0xFF334155),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12.5,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        // Share Circular Button
                        GestureDetector(
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Copied link to ${widget.brandName} profile'),
                                duration: const Duration(seconds: 1),
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.08),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: const Icon(Icons.share_outlined, size: 16, color: Color(0xFF334155)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Foreground Layer: Overlapping Brand Card + Collection Section
                // Starts at 155dp down to seamlessly overlap the 230dp banner by 75dp
                Padding(
                  padding: const EdgeInsets.only(top: 155, left: 16, right: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. The Brand Header Card
                      _buildBrandCard(avatarImage),

                      const SizedBox(height: 24),

                      // 2. "The Collection" Header
                      Row(
                        children: [
                          const Text(
                            'The Collection',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF0F172A),
                              letterSpacing: -0.3,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE2E8F0),
                              borderRadius: BorderRadius.circular(99),
                            ),
                            child: Text(
                              displayProducts.length.toString(),
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF475569),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // 3. Category Filter Chips
                      SizedBox(
                        height: 36,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: _categories.length,
                          itemBuilder: (context, idx) {
                            final cat = _categories[idx];
                            final isSelected = _selectedCategory == cat;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ChoiceChip(
                                label: Text(cat),
                                selected: isSelected,
                                onSelected: (_) {
                                  setState(() {
                                    _selectedCategory = cat;
                                  });
                                },
                                selectedColor: const Color(0xFF0F172A),
                                backgroundColor: Colors.white,
                                labelStyle: TextStyle(
                                  fontSize: 11.5,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                                  color: isSelected ? Colors.white : const Color(0xFF64748B),
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(99),
                                  side: BorderSide(
                                    color: isSelected ? Colors.transparent : const Color(0xFFE2E8F0),
                                  ),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // 2. Product Grid Sliver
          if (displayProducts.isEmpty)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 40),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.shopping_bag_outlined, size: 48, color: Colors.grey.shade400),
                      const SizedBox(height: 10),
                      const Text(
                        'No products found in this category',
                        style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 40),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.60,
                  crossAxisSpacing: 14,
                  mainAxisSpacing: 16,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final product = displayProducts[index];
                    return _buildCollectionCard(product);
                  },
                  childCount: displayProducts.length,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBrandCard(String avatarImage) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFEDF2F7)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Profile Avatar + Info Row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar with thick white border
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white, width: 3.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 14,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: avatarImage.isNotEmpty
                      ? ProductImage(
                          imagePath: avatarImage,
                          fit: BoxFit.cover,
                        )
                      : Container(
                          color: const Color(0xFFF1F5F9),
                          alignment: Alignment.center,
                          child: Text(
                            widget.brandName.substring(0, 2).toUpperCase(),
                            style: const TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 22,
                              color: Color(0xFF64748B),
                            ),
                          ),
                        ),
                ),
              ),
              const SizedBox(width: 14),

              // Title, Category, Handle, Location
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            widget.brandName,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF0F172A),
                              letterSpacing: -0.3,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(99),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: Text(
                            (widget.category ?? 'LUXURY FASHION').toUpperCase(),
                            style: const TextStyle(
                              color: Color(0xFF475569),
                              fontSize: 8.5,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.4,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(
                      '@${widget.brandHandle}',
                      style: const TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined, size: 13, color: Color(0xFF64748B)),
                        const SizedBox(width: 3),
                        Text(
                          widget.location ?? 'Paris, France',
                          style: const TextStyle(
                            fontSize: 11.5,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Bio text
          Text(
            widget.bio ?? 'Curated premium fashion collection exploring modern silhouettes and high-end fabrics.',
            style: const TextStyle(
              fontSize: 12.5,
              color: Color(0xFF475569),
              height: 1.4,
            ),
          ),

          const SizedBox(height: 16),
          const Divider(height: 1, color: Color(0xFFF1F5F9)),
          const SizedBox(height: 14),

          // Metrics Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildMetricItem(_followersCount.toString(), 'Followers'),
              Container(width: 1, height: 26, color: const Color(0xFFE2E8F0)),
              _buildMetricItem(_followingCount.toString(), 'Following'),
              Container(width: 1, height: 26, color: const Color(0xFFE2E8F0)),
              _buildMetricItem(_allBrandProducts.length.toString(), 'Products'),
            ],
          ),

          const SizedBox(height: 16),

          // Action Buttons Row (Follow, Message, Storefront)
          Row(
            children: [
              // Follow Toggle Button
              Expanded(
                flex: 4,
                child: ElevatedButton(
                  onPressed: _toggleFollow,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isFollowing
                        ? const Color(0xFFF1F5F9)
                        : const Color(0xFFCBF382), // Web lime accent
                    foregroundColor: _isFollowing ? const Color(0xFF475569) : const Color(0xFF0F172A),
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: _isFollowing ? const BorderSide(color: Color(0xFFCBD5E1)) : BorderSide.none,
                    ),
                  ),
                  child: Text(
                    _isFollowing ? 'Following' : 'Follow Brand',
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 12.5,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),

              // Message Button
              Expanded(
                flex: 3,
                child: OutlinedButton(
                  onPressed: _showMessageDialog,
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF334155),
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.chat_bubble_outline, size: 14),
                      SizedBox(width: 4),
                      Text(
                        'Message',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),

              // Storefront Button
              Expanded(
                flex: 3,
                child: OutlinedButton(
                  onPressed: _showStorefrontSheet,
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF334155),
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.storefront_outlined, size: 14),
                      SizedBox(width: 4),
                      Text(
                        'Storefront',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricItem(String value, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.w900,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: Color(0xFF64748B),
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildCollectionCard(Product product) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ReelsSwipeScreen(
              product: product,
              allProducts: _allBrandProducts,
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product Image with Try-On Pill
              Expanded(
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    ProductImage(
                      imagePath: product.imageUrl,
                      fit: BoxFit.cover,
                    ),

                    // TRY-ON Badge (matching web frontend)
                    Positioned(
                      bottom: 8,
                      right: 8,
                      child: GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => TryOnScreen(product: product),
                            ),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.85),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: const Color(0xFFCBF382).withValues(alpha: 0.8),
                              width: 1,
                            ),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.checkroom_outlined, size: 11, color: Color(0xFFCBF382)),
                              SizedBox(width: 3),
                              Text(
                                'TRY-ON',
                                style: TextStyle(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Product Info
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.category.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF94A3B8),
                        letterSpacing: 0.4,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      product.name,
                      style: const TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF0F172A),
                        height: 1.2,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          product.priceDisplay,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const Text(
                          'View',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF6366F1),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
