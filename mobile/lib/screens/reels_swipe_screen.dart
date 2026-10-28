import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import '../models/product.dart';
import '../theme/app_theme.dart';
import '../widgets/product_image.dart';
import 'tryon_screen.dart';
import 'brand_profile_screen.dart';

class ReelsSwipeScreen extends StatefulWidget {
  final Product product;
  final List<Product>? allProducts; // optional: all products for swiping between them

  const ReelsSwipeScreen({
    super.key,
    required this.product,
    this.allProducts,
  });

  @override
  State<ReelsSwipeScreen> createState() => _ReelsSwipeScreenState();
}

class _ReelsSwipeScreenState extends State<ReelsSwipeScreen> {
  late List<Product> _products;
  late PageController _productPageController;
  int _currentProductIndex = 0;
  bool _isLiked = false;
  bool _isSaved = false;

  @override
  void initState() {
    super.initState();
    // Use all products if passed, otherwise show just the tapped one
    if (widget.allProducts != null && widget.allProducts!.isNotEmpty) {
      _products = widget.allProducts!;
      final startIndex = _products.indexWhere((p) => p.id == widget.product.id);
      _currentProductIndex = startIndex >= 0 ? startIndex : 0;
    } else {
      _products = [widget.product];
      _currentProductIndex = 0;
    }

    _productPageController = PageController(initialPage: _currentProductIndex);
  }

  @override
  void dispose() {
    _productPageController.dispose();
    super.dispose();
  }

  Product get _currentProduct => _products[_currentProductIndex];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Vertical PageView: each page = one product (its images as inner horizontal swipe)
          PageView.builder(
            controller: _productPageController,
            scrollDirection: Axis.vertical,
            itemCount: _products.length,
            onPageChanged: (index) {
              setState(() {
                _currentProductIndex = index;
                _isLiked = false;
                _isSaved = false;
              });
            },
            itemBuilder: (context, productIndex) {
              final product = _products[productIndex];
              return _ProductImageSlider(product: product);
            },
          ),

          // Top Header Row with back arrow and category label
          Positioned(
            top: MediaQuery.of(context).padding.top + 10,
            left: 10,
            right: 10,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 22),
                  onPressed: () => Navigator.pop(context),
                ),
                Column(
                  children: [
                    Text(
                      _currentProduct.category.toUpperCase().replaceAll('-', ' '),
                      style: const TextStyle(
                        color: Colors.white70,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.5,
                        fontSize: 12,
                      ),
                    ),
                    if (_products.length > 1)
                      Text(
                        '${_currentProductIndex + 1} / ${_products.length}',
                        style: const TextStyle(
                          color: Colors.white38,
                          fontSize: 10,
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 48),
              ],
            ),
          ),

          // Right side action panel
          Positioned(
            right: 16,
            bottom: 240,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _reelAction(
                  icon: _isLiked ? Icons.favorite : Icons.favorite_border,
                  color: _isLiked ? Colors.redAccent : Colors.white,
                  label: '1.4K',
                  onTap: () {
                    setState(() {
                      _isLiked = !_isLiked;
                    });
                  },
                ),
                const SizedBox(height: 20),
                _reelAction(
                  icon: _isSaved ? Icons.bookmark : Icons.bookmark_border,
                  color: _isSaved ? AppTheme.primaryColor : Colors.white,
                  label: 'Save',
                  onTap: () {
                    setState(() {
                      _isSaved = !_isSaved;
                    });
                  },
                ),
                const SizedBox(height: 20),
                _reelAction(
                  icon: Icons.share_outlined,
                  color: Colors.white,
                  label: 'Share',
                  onTap: () {},
                ),
                const SizedBox(height: 20),
                _reelAction(
                  icon: Icons.face_retouching_natural,
                  color: AppTheme.primaryColor,
                  label: 'Try On',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => TryOnScreen(product: _currentProduct),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 20),
                // Scroll hint dots
                if (_products.length > 1)
                  Column(
                    children: List.generate(
                      _products.length.clamp(0, 5),
                      (i) => Container(
                        margin: const EdgeInsets.symmetric(vertical: 2),
                        width: 4,
                        height: i == _currentProductIndex ? 14 : 4,
                        decoration: BoxDecoration(
                          color: i == _currentProductIndex
                              ? AppTheme.primaryColor
                              : Colors.white38,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),

          // Bottom Content Overlay — updates live when product changes
          Positioned(
            left: 16,
            right: 16,
            bottom: MediaQuery.of(context).padding.bottom + 20,
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              transitionBuilder: (child, animation) => FadeTransition(opacity: animation, child: child),
              child: _productInfoCard(_currentProduct, key: ValueKey(_currentProduct.id)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _productInfoCard(Product product, {Key? key}) {
    return GestureDetector(
      onTap: () => _showProductDetailsSheet(context, product),
      child: Container(
        key: key,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.65),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    product.name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Text(
                  '\$${product.price.toStringAsFixed(0)}',
                  style: const TextStyle(
                    color: AppTheme.primaryColor,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () {
                final brandName = product.brand.isNotEmpty && product.brand != 'VogueSocial'
                    ? product.brand
                    : 'Studio Label Paris';
                final brandHandle = brandName.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '');
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => BrandProfileScreen(
                      brandName: brandName,
                      brandHandle: brandHandle.isNotEmpty ? brandHandle : 'studiolabel',
                      avatarUrl: product.imageUrl,
                      category: product.category,
                    ),
                  ),
                );
              },
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    product.brand.isNotEmpty && product.brand != 'VogueSocial' ? product.brand : 'Studio Label Paris',
                    style: const TextStyle(
                      color: AppTheme.secondaryColor,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.verified, size: 12, color: AppTheme.secondaryColor),
                ],
              ),
            ),
            const SizedBox(height: 6),
            Text(
              product.description,
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 13,
                height: 1.4,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.keyboard_arrow_up_rounded, color: AppTheme.primaryColor.withOpacity(0.8), size: 18),
                const SizedBox(width: 4),
                Text(
                  'Tap for Product Details & Sizes',
                  style: TextStyle(
                    color: AppTheme.primaryColor.withOpacity(0.8),
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showProductDetailsSheet(BuildContext context, Product product) {
    String selectedSize = 'M';
    String selectedColor = 'Brown';

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return DraggableScrollableSheet(
              initialChildSize: 0.75,
              minChildSize: 0.5,
              maxChildSize: 0.95,
              expand: false,
              builder: (context, scrollController) {
                return SingleChildScrollView(
                  controller: scrollController,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          decoration: BoxDecoration(
                            color: AppTheme.borderColor,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Product summary row
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: ProductImage(
                              imagePath: product.imageUrl,
                              width: 80,
                              height: 80,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  product.name,
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.textColorPrimary,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  '\$${product.price.toStringAsFixed(2)}',
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.primaryColor,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Row(
                                  children: [
                                    const Icon(Icons.star, color: Colors.amber, size: 16),
                                    const Icon(Icons.star, color: Colors.amber, size: 16),
                                    const Icon(Icons.star, color: Colors.amber, size: 16),
                                    const Icon(Icons.star, color: Colors.amber, size: 16),
                                    const Icon(Icons.star_half, color: Colors.amber, size: 16),
                                    const SizedBox(width: 6),
                                    Text(
                                      '4.5 (120 reviews)',
                                      style: TextStyle(
                                        color: AppTheme.textColorSecondary,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                GestureDetector(
                                  behavior: HitTestBehavior.opaque,
                                  onTap: () {
                                    Navigator.pop(context);
                                    final brandName = product.brand.isNotEmpty && product.brand != 'VogueSocial'
                                        ? product.brand
                                        : 'Studio Label Paris';
                                    final brandHandle = brandName.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '');
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => BrandProfileScreen(
                                          brandName: brandName,
                                          brandHandle: brandHandle.isNotEmpty ? brandHandle : 'studiolabel',
                                          avatarUrl: product.imageUrl,
                                          category: product.category,
                                        ),
                                      ),
                                    );
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF1F5F9),
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(color: const Color(0xFFE2E8F0)),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.storefront_outlined, size: 13, color: Color(0xFF0F172A)),
                                        const SizedBox(width: 5),
                                        Text(
                                          product.brand.isNotEmpty && product.brand != 'VogueSocial'
                                              ? product.brand
                                              : 'Studio Label Paris',
                                          style: const TextStyle(
                                            fontSize: 11.5,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF0F172A),
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        const Icon(Icons.chevron_right, size: 13, color: Color(0xFF64748B)),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 20),
                      const Divider(color: AppTheme.borderColor),
                      const SizedBox(height: 12),
                      
                      // Description
                      const Text(
                        'Product Details',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textColorPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        product.description,
                        style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.textColorSecondary,
                          height: 1.5,
                        ),
                      ),
                      
                      const SizedBox(height: 20),
                      const Divider(color: AppTheme.borderColor),
                      const SizedBox(height: 12),
                      
                      // Size Selector
                      const Text(
                        'Select Size',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textColorPrimary,
                        ),
                      ),
                      const SizedBox(height: 10),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) {
                            final isSizeSelected = selectedSize == size;
                            return GestureDetector(
                              onTap: () {
                                setSheetState(() {
                                  selectedSize = size;
                                });
                              },
                              child: Container(
                                margin: const EdgeInsets.only(right: 10),
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                                decoration: BoxDecoration(
                                  color: isSizeSelected ? AppTheme.primaryColor : Colors.transparent,
                                  border: Border.all(
                                    color: isSizeSelected ? AppTheme.primaryColor : AppTheme.borderColor,
                                  ),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  size,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: isSizeSelected ? Colors.white : AppTheme.textColorPrimary,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      
                      const SizedBox(height: 24),
                      
                      // Color Selector
                      const Text(
                        'Select Color',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textColorPrimary,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          _colorDot(colorName: 'Brown', colorVal: const Color(0xFF8B4513), activeColor: selectedColor, onTap: (c) => setSheetState(() => selectedColor = c)),
                          _colorDot(colorName: 'Navy', colorVal: const Color(0xFF000080), activeColor: selectedColor, onTap: (c) => setSheetState(() => selectedColor = c)),
                          _colorDot(colorName: 'Black', colorVal: Colors.black, activeColor: selectedColor, onTap: (c) => setSheetState(() => selectedColor = c)),
                        ],
                      ),
                      
                      const SizedBox(height: 30),
                      
                      // Action buttons: Add to Cart, Buy Now, Try On
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              style: OutlinedButton.styleFrom(
                                side: const BorderSide(color: AppTheme.primaryColor),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                padding: const EdgeInsets.symmetric(vertical: 16),
                              ),
                              onPressed: () {
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Added to shopping bag!')),
                                );
                              },
                              child: const Text(
                                'ADD TO BAG',
                                style: TextStyle(
                                  color: AppTheme.primaryColor,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                padding: const EdgeInsets.symmetric(vertical: 16),
                              ),
                              onPressed: () {
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Order placed for size $selectedSize!')),
                                );
                              },
                              child: const Text(
                                'BUY NOW',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            );
          },
        );
      },
    );
  }

  Widget _colorDot({
    required String colorName,
    required Color colorVal,
    required String activeColor,
    required Function(String) onTap,
  }) {
    final isSelected = activeColor == colorName;
    return GestureDetector(
      onTap: () => onTap(colorName),
      child: Container(
        margin: const EdgeInsets.only(right: 14),
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: isSelected ? AppTheme.primaryColor : Colors.transparent,
            width: 2,
          ),
        ),
        child: Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: colorVal,
            shape: BoxShape.circle,
          ),
        ),
      ),
    );
  }

  Widget _reelAction({
    required IconData icon,
    required Color color,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.4),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white.withOpacity(0.06)),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

/// Inner widget: horizontal swipe through a single product's images and videos
class _ProductImageSlider extends StatefulWidget {
  final Product product;

  const _ProductImageSlider({required this.product});

  @override
  State<_ProductImageSlider> createState() => _ProductImageSliderState();
}

class _ProductImageSliderState extends State<_ProductImageSlider> {
  int _currentImageIndex = 0;
  VideoPlayerController? _videoController;
  bool _isVideoInitialized = false;

  @override
  void initState() {
    super.initState();
    if (widget.product.videoUrl != null) {
      final isAsset = !widget.product.videoUrl!.startsWith('http');
      _videoController = isAsset
          ? VideoPlayerController.asset(widget.product.videoUrl!)
          : VideoPlayerController.networkUrl(Uri.parse(widget.product.videoUrl!));

      _videoController!.initialize().then((_) {
        if (mounted) {
          setState(() {
            _isVideoInitialized = true;
          });
          _videoController!.setLooping(true);
          _videoController!.play();
        }
      });
    }
  }

  @override
  void dispose() {
    _videoController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hasVideo = widget.product.videoUrl != null;
    final images = widget.product.allImages;
    final totalSlides = hasVideo ? images.length + 1 : images.length;

    return Stack(
      fit: StackFit.expand,
      children: [
        // Horizontal page view through this product's multiple slides (video first, then images)
        PageView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: totalSlides,
          onPageChanged: (i) => setState(() => _currentImageIndex = i),
          itemBuilder: (context, slideIndex) {
            if (hasVideo && slideIndex == 0) {
              return _isVideoInitialized
                  ? GestureDetector(
                      onTap: () {
                        setState(() {
                          _videoController!.value.isPlaying
                              ? _videoController!.pause()
                              : _videoController!.play();
                        });
                      },
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox.expand(
                            child: FittedBox(
                              fit: BoxFit.cover,
                              clipBehavior: Clip.hardEdge,
                              child: SizedBox(
                                width: _videoController!.value.size.width,
                                height: _videoController!.value.size.height,
                                child: VideoPlayer(_videoController!),
                              ),
                            ),
                          ),
                          if (!_videoController!.value.isPlaying)
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: const BoxDecoration(
                                color: Colors.black38,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.play_arrow, color: Colors.white, size: 48),
                            ),
                        ],
                      ),
                    )
                  : const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor));
            }

            final imgIndex = hasVideo ? slideIndex - 1 : slideIndex;
            return ProductImage(
              imagePath: images[imgIndex],
              fit: BoxFit.cover,
            );
          },
        ),

        // Image indicator dots (bottom center)
        if (totalSlides > 1)
          Positioned(
            bottom: 260,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                totalSlides,
                (i) => Container(
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: i == _currentImageIndex ? 18 : 6,
                  height: 4,
                  decoration: BoxDecoration(
                    color: i == _currentImageIndex ? Colors.white : Colors.white38,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
            ),
          ),

        // Swipe hint on first load
        if (totalSlides > 1 && _currentImageIndex == 0)
          Positioned(
            top: MediaQuery.of(context).padding.top + 70,
            right: 70,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.5),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.swipe, color: Colors.white70, size: 14),
                  const SizedBox(width: 4),
                  Text(
                    '$totalSlides looks',
                    style: const TextStyle(color: Colors.white70, fontSize: 11),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
