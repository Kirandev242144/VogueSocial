import 'package:flutter/material.dart';
import '../../models/product.dart';
import '../../screens/brand_profile_screen.dart';
import '../../theme/app_theme.dart';
import '../product_image.dart';

class PostCardHeader extends StatefulWidget {
  final Product product;
  final Map<String, String>? creator;
  final bool isUgcPost;

  const PostCardHeader({
    super.key,
    required this.product,
    this.creator,
    this.isUgcPost = false,
  });

  @override
  State<PostCardHeader> createState() => _PostCardHeaderState();
}

class _PostCardHeaderState extends State<PostCardHeader> {
  bool _isFollowed = false;

  void _navigateToBrandProfile() {
    final brandName = !widget.isUgcPost && widget.product.brand.isNotEmpty && widget.product.brand != 'VogueSocial'
        ? widget.product.brand
        : 'Studio Label Paris';
    final brandHandle = brandName.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '');

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BrandProfileScreen(
          brandName: brandName,
          brandHandle: brandHandle.isNotEmpty ? brandHandle : 'studiolabel',
          avatarUrl: widget.product.imageUrl,
          category: widget.product.category.isNotEmpty ? widget.product.category : 'Luxury Fashion',
          location: 'Paris, France',
          bio: 'Curated premium fashion collection exploring modern silhouettes and high-end fabrics.',
        ),
      ),
    );
  }

  void _toggleFollow() {
    setState(() {
      _isFollowed = !_isFollowed;
    });

    final targetName = widget.isUgcPost
        ? (widget.creator?['name'] ?? 'Creator')
        : (widget.product.brand.isNotEmpty && widget.product.brand != 'VogueSocial'
            ? widget.product.brand
            : 'Studio Label Paris');

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _isFollowed ? 'Following $targetName' : 'Unfollowed $targetName',
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        duration: const Duration(milliseconds: 1500),
        backgroundColor: const Color(0xFF0F172A),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authorName = widget.isUgcPost
        ? (widget.creator?['name'] ?? 'Sarah Jen')
        : (widget.product.brand.isNotEmpty && widget.product.brand != 'VogueSocial'
            ? widget.product.brand
            : 'Studio Label Paris');

    final subtitle = widget.isUgcPost ? 'wearing @StudioLabel' : '@studiolabel';

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        children: [
          // Author Avatar
          GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: _navigateToBrandProfile,
            child: CircleAvatar(
              radius: 18,
              backgroundColor: AppTheme.surfaceMuted,
              child: ClipOval(
                child: ProductImage(
                  imagePath: widget.product.imageUrl,
                  width: 36,
                  height: 36,
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),

          // Author Info Column
          Expanded(
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: _navigateToBrandProfile,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          authorName,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: AppTheme.textColorPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (!widget.isUgcPost) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                          decoration: BoxDecoration(
                            color: Colors.black,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'BRAND',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 8,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 1),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppTheme.textColorSecondary,
                      letterSpacing: 0.3,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ),

          // Follow Button
          TextButton(
            onPressed: _toggleFollow,
            style: TextButton.styleFrom(
              backgroundColor: _isFollowed ? AppTheme.surfaceMuted : AppTheme.secondaryColor,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: Text(
              _isFollowed ? 'Following' : 'Follow',
              style: TextStyle(
                color: _isFollowed ? AppTheme.textColorSecondary : AppTheme.primaryColor,
                fontSize: 11,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
