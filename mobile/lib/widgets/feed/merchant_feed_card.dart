import 'package:flutter/material.dart';
import '../../models/product.dart';
import '../../screens/reels_swipe_screen.dart';
import '../../screens/tryon_screen.dart';
import '../../theme/app_theme.dart';
import '../product_image.dart';
import 'post_card_footer.dart';
import 'post_card_header.dart';

class MerchantFeedCard extends StatefulWidget {
  final Product product;
  final List<Product> allProducts;

  const MerchantFeedCard({
    super.key,
    required this.product,
    required this.allProducts,
  });

  @override
  State<MerchantFeedCard> createState() => _MerchantFeedCardState();
}

class _MerchantFeedCardState extends State<MerchantFeedCard> with SingleTickerProviderStateMixin {
  int _likesCount = 248;
  bool _isLiked = false;
  final bool _isLoadingEngagement = false;

  late AnimationController _likeAnimController;
  late Animation<double> _likeScaleAnimation;

  @override
  void initState() {
    super.initState();
    _likesCount = 120 + (widget.product.name.hashCode % 300).abs();

    _likeAnimController = AnimationController(
      duration: const Duration(milliseconds: 250),
      vsync: this,
    );

    _likeScaleAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween<double>(begin: 1.0, end: 1.3), weight: 50),
      TweenSequenceItem(tween: Tween<double>(begin: 1.3, end: 1.0), weight: 50),
    ]).animate(_likeAnimController);
  }

  @override
  void dispose() {
    _likeAnimController.dispose();
    super.dispose();
  }

  void _handleLikeToggle() {
    setState(() {
      _isLiked = !_isLiked;
      _likesCount += _isLiked ? 1 : -1;
    });
    if (_isLiked) {
      _likeAnimController.forward(from: 0.0);
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasThreeImages = widget.product.allImages.length >= 3;

    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Post Header (Brand info + Follow button)
          PostCardHeader(
            product: widget.product,
            isUgcPost: false,
          ),

          // 2. Main Visual Layer (Split gallery or single image)
          GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ReelsSwipeScreen(
                    product: widget.product,
                    allProducts: widget.allProducts,
                  ),
                ),
              );
            },
            child: hasThreeImages
                ? _buildSplitImageLayout(widget.product)
                : _buildSingleImageLayout(widget.product),
          ),

          // 3. Post Footer (Metadata & Actions)
          PostCardFooter(
            product: widget.product,
            isUgcPost: false,
            likesCount: _likesCount,
            isLiked: _isLiked,
            isLoadingEngagement: _isLoadingEngagement,
            likeScaleAnimation: _likeScaleAnimation,
            onToggleLike: _handleLikeToggle,
          ),
        ],
      ),
    );
  }

  Widget _buildSplitImageLayout(Product product) {
    final images = product.allImages;
    final main = images.isNotEmpty ? images[0] : product.imageUrl;
    final top = images.length > 1 ? images[1] : main;
    final bottom = images.length > 2 ? images[2] : main;

    return AspectRatio(
      aspectRatio: 1.35,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                flex: 6,
                child: ProductImage(
                  imagePath: main,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 2),
              Expanded(
                flex: 4,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Expanded(
                      child: ProductImage(
                        imagePath: top,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Expanded(
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          ProductImage(
                            imagePath: bottom,
                            fit: BoxFit.cover,
                          ),
                          Container(
                            color: Colors.black.withOpacity(0.4),
                            child: const Center(
                              child: Text(
                                '+12',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          Positioned(
            bottom: 10,
            left: 10,
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
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.75),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.secondaryColor.withOpacity(0.6), width: 1),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.checkroom, size: 13, color: AppTheme.secondaryColor),
                    SizedBox(width: 4),
                    Text(
                      'Try On',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSingleImageLayout(Product product) {
    return AspectRatio(
      aspectRatio: 1.25,
      child: Stack(
        fit: StackFit.expand,
        children: [
          ProductImage(
            imagePath: product.imageUrl,
            fit: BoxFit.cover,
          ),
          Positioned(
            bottom: 10,
            left: 10,
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
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.75),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.secondaryColor.withOpacity(0.6), width: 1),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.checkroom, size: 13, color: AppTheme.secondaryColor),
                    SizedBox(width: 4),
                    Text(
                      'Try On',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
