import 'package:flutter/material.dart';
import '../../models/product.dart';
import '../../screens/brand_profile_screen.dart';
import '../../screens/reels_swipe_screen.dart';
import '../../screens/tryon_screen.dart';
import '../../theme/app_theme.dart';
import '../product_image.dart';

class ShopProductCard extends StatelessWidget {
  final Product product;
  final List<Product> allProducts;
  final bool isListLayout;

  const ShopProductCard({
    super.key,
    required this.product,
    required this.allProducts,
    this.isListLayout = false,
  });

  static Color parseHexColor(String hex) {
    try {
      String clean = hex.replaceAll('#', '').trim();
      if (clean.length == 6) {
        clean = 'FF$clean';
      }
      return Color(int.parse(clean, radix: 16));
    } catch (_) {
      return Colors.grey.shade400;
    }
  }

  void _openReels(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ReelsSwipeScreen(
          product: product,
          allProducts: allProducts,
        ),
      ),
    );
  }

  void _openTryOn(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TryOnScreen(product: product),
      ),
    );
  }

  void _openBrandProfile(BuildContext context) {
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
  }

  @override
  Widget build(BuildContext context) {
    if (isListLayout) {
      return _buildListCard(context);
    }
    return _buildGridCard(context);
  }

  Widget _buildGridCard(BuildContext context) {
    return GestureDetector(
      onTap: () => _openReels(context),
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.borderColor),
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
              // 3:4 Aspect Ratio Image Container with Badges & Try-On Pill
              Expanded(
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    ProductImage(
                      imagePath: product.imageUrl,
                      fit: BoxFit.cover,
                    ),

                    // Badge (New or Trending)
                    if (product.isNew || product.isTrending)
                      Positioned(
                        top: 8,
                        left: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                          decoration: BoxDecoration(
                            color: product.isNew ? AppTheme.primaryColor : AppTheme.secondaryColor,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            product.isNew ? 'NEW' : 'TRENDING',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.4,
                              color: product.isNew ? Colors.white : AppTheme.primaryColor,
                            ),
                          ),
                        ),
                      ),

                    // Virtual Try-On Sparkle Button
                    Positioned(
                      bottom: 8,
                      right: 8,
                      child: GestureDetector(
                        onTap: () => _openTryOn(context),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.78),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: AppTheme.secondaryColor.withValues(alpha: 0.6),
                              width: 1,
                            ),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.auto_awesome, size: 12, color: AppTheme.secondaryColor),
                              SizedBox(width: 4),
                              Text(
                                'Try On',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
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

              // Detail Info Row
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title and Price
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            product.shortName.isNotEmpty ? product.shortName : product.name,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textColorPrimary,
                              height: 1.2,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          product.priceDisplay,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textColorPrimary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 3),
                    GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () => _openBrandProfile(context),
                      child: Text(
                        product.brand.isNotEmpty && product.brand != 'VogueSocial'
                            ? product.brand
                            : 'Studio Label Paris',
                        style: const TextStyle(
                          fontSize: 10.5,
                          color: Color(0xFF64748B),
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(height: 5),

                    // Color Swatch Dots Row
                    if (product.colors.isNotEmpty)
                      Row(
                        children: [
                          ...product.colors.take(4).map((c) {
                            final color = parseHexColor(c);
                            return Container(
                              margin: const EdgeInsets.only(right: 4),
                              width: 10,
                              height: 10,
                              decoration: BoxDecoration(
                                color: color,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.grey.shade300, width: 1),
                              ),
                            );
                          }),
                          if (product.colors.length > 4)
                            Text(
                              '+${product.colors.length - 4}',
                              style: const TextStyle(fontSize: 9, color: AppTheme.textColorSecondary),
                            ),
                        ],
                      ),
                    const SizedBox(height: 5),

                    // Ratings Row
                    Row(
                      children: [
                        ...List.generate(
                          5,
                          (i) => const Icon(
                            Icons.star,
                            size: 11,
                            color: AppTheme.starYellow,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '(${product.reviewsCount})',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                            color: AppTheme.textColorSecondary,
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

  Widget _buildListCard(BuildContext context) {
    return GestureDetector(
      onTap: () => _openReels(context),
      child: Container(
        height: 120,
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppTheme.borderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            // Left Image
            ClipRRect(
              borderRadius: const BorderRadius.horizontal(left: Radius.circular(14)),
              child: SizedBox(
                width: 100,
                height: double.infinity,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    ProductImage(
                      imagePath: product.imageUrl,
                      fit: BoxFit.cover,
                    ),
                    if (product.isNew || product.isTrending)
                      Positioned(
                        top: 6,
                        left: 6,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: product.isNew ? AppTheme.primaryColor : AppTheme.secondaryColor,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            product.isNew ? 'NEW' : 'TRENDING',
                            style: TextStyle(
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                              color: product.isNew ? Colors.white : AppTheme.primaryColor,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // Right Info
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                product.shortName.isNotEmpty ? product.shortName : product.name,
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: AppTheme.textColorPrimary,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            Text(
                              product.priceDisplay,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w800,
                                color: AppTheme.textColorPrimary,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        GestureDetector(
                          behavior: HitTestBehavior.opaque,
                          onTap: () => _openBrandProfile(context),
                          child: Text(
                            product.brand.isNotEmpty && product.brand != 'VogueSocial'
                                ? product.brand
                                : 'Studio Label Paris',
                            style: const TextStyle(
                              fontSize: 11,
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Ratings
                        Row(
                          children: [
                            const Icon(Icons.star, size: 12, color: AppTheme.starYellow),
                            const SizedBox(width: 3),
                            Text(
                              '${product.rating} (${product.reviewsCount})',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                                color: AppTheme.textColorSecondary,
                              ),
                            ),
                          ],
                        ),

                        // Try-On Pill
                        GestureDetector(
                          onTap: () => _openTryOn(context),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.auto_awesome, size: 11, color: AppTheme.secondaryColor),
                                SizedBox(width: 4),
                                Text(
                                  'Try On',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
