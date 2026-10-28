import 'package:flutter/material.dart';
import '../../models/product.dart';
import '../../screens/tryon_screen.dart';
import '../../theme/app_theme.dart';

class PostCardFooter extends StatelessWidget {
  final Product product;
  final bool isUgcPost;
  final int likesCount;
  final bool isLiked;
  final bool isLoadingEngagement;
  final Animation<double> likeScaleAnimation;
  final VoidCallback onToggleLike;
  final VoidCallback? onCommentsTap;

  const PostCardFooter({
    super.key,
    required this.product,
    this.isUgcPost = false,
    required this.likesCount,
    required this.isLiked,
    required this.isLoadingEngagement,
    required this.likeScaleAnimation,
    required this.onToggleLike,
    this.onCommentsTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title & Like / Share Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  product.name.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.5,
                    color: AppTheme.textColorPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Row(
                children: [
                  // Likes Icon with bounce animation
                  ScaleTransition(
                    scale: likeScaleAnimation,
                    child: IconButton(
                      icon: Icon(
                        isLiked ? Icons.favorite : Icons.favorite_border,
                        size: 20,
                        color: isLiked ? Colors.redAccent : AppTheme.textColorPrimary,
                      ),
                      onPressed: onToggleLike,
                      constraints: const BoxConstraints(),
                      padding: EdgeInsets.zero,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    isLoadingEngagement ? '...' : '$likesCount',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textColorPrimary,
                    ),
                  ),
                  const SizedBox(width: 14),
                  IconButton(
                    icon: const Icon(Icons.share_outlined, size: 18, color: AppTheme.textColorPrimary),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Sharing ${product.name}...'),
                          duration: const Duration(seconds: 1),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                    constraints: const BoxConstraints(),
                    padding: EdgeInsets.zero,
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Price & Category / Try Similar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '\$${product.price.toStringAsFixed(0)}  ·  ${product.category.toUpperCase().replaceAll('-', ' ')}',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppTheme.textColorSecondary,
                  fontWeight: FontWeight.w600,
                ),
              ),
              GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => TryOnScreen(product: product),
                    ),
                  );
                },
                child: const Row(
                  children: [
                    Icon(Icons.auto_awesome, size: 12, color: AppTheme.primaryColor),
                    SizedBox(width: 4),
                    Text(
                      'TRY SIMILAR',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.primaryColor,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Main Try-On CTA Button
          SizedBox(
            width: double.infinity,
            height: 40,
            child: OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppTheme.primaryColor, width: 1.2),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => TryOnScreen(product: product),
                  ),
                );
              },
              icon: const Icon(Icons.face_retouching_natural, size: 16, color: AppTheme.primaryColor),
              label: Text(
                isUgcPost ? 'TRY ON MYSELF' : 'TRY THIS ON',
                style: const TextStyle(
                  color: AppTheme.primaryColor,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
