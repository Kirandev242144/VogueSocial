import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/product.dart';
import '../../providers/tryon_provider.dart';
import '../../screens/brand_profile_screen.dart';
import '../../screens/tryon_screen.dart';
import '../../theme/app_theme.dart';
import 'feed_comments_sheet.dart';

class CommunityPostCard extends StatefulWidget {
  final Map<String, dynamic> post;

  const CommunityPostCard({
    super.key,
    required this.post,
  });

  @override
  State<CommunityPostCard> createState() => _CommunityPostCardState();
}

class _CommunityPostCardState extends State<CommunityPostCard> {
  int _likesCount = 0;
  bool _isLiked = false;
  int _commentsCount = 0;

  @override
  void initState() {
    super.initState();
    _loadEngagement();
  }

  Future<void> _loadEngagement() async {
    final provider = Provider.of<TryOnProvider>(context, listen: false);
    final likesInfo = await provider.fetchPostLikesInfo(widget.post['id'].toString());
    final comments = await provider.fetchPostComments(widget.post['id'].toString());
    if (mounted) {
      setState(() {
        _likesCount = likesInfo['totalLikes'] ?? 0;
        _isLiked = likesInfo['isLiked'] ?? false;
        _commentsCount = comments.length;
      });
    }
  }

  Future<void> _toggleLike() async {
    final provider = Provider.of<TryOnProvider>(context, listen: false);
    final nextState = !_isLiked;
    setState(() {
      _isLiked = nextState;
      _likesCount = nextState ? _likesCount + 1 : _likesCount - 1;
    });
    await provider.togglePostLike(widget.post['id'].toString(), nextState);
  }

  void _openComments() {
    FeedCommentsSheet.show(
      context,
      targetId: widget.post['id'].toString(),
      targetType: CommentTargetType.communityPost,
      onCommentAdded: _loadEngagement,
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<TryOnProvider>(context);
    final allItems = [...provider.customGarments, ...Product.shopProducts, ...Product.dummyProducts];

    // Resolve products from IDs
    final List<dynamic> rawIds = widget.post['product_ids'] is String
        ? jsonDecode(widget.post['product_ids'])
        : (widget.post['product_ids'] as List? ?? []);

    final List<Product> postProducts = [];
    for (final rawId in rawIds) {
      try {
        final id = rawId.toString();
        final prod = allItems.firstWhere((p) => p.id == id);
        postProducts.add(prod);
      } catch (_) {}
    }

    // Resolve canvas layout
    final dynamic rawLayout = widget.post['canvas_layout'];
    List<Map<String, dynamic>>? canvasLayout;
    if (rawLayout != null) {
      try {
        final decoded = rawLayout is String ? jsonDecode(rawLayout) : rawLayout;
        if (decoded is List) {
          canvasLayout = decoded.map((item) => Map<String, dynamic>.from(item as Map)).toList();
        }
      } catch (e) {
        debugPrint('Error parsing canvas layout: $e');
      }
    }

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
          // 1. Creator Row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () {
                    final creatorName = (widget.post['creator_name'] ?? 'Studio Label Paris').toString();
                    final creatorHandle = creatorName.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '');
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => BrandProfileScreen(
                          brandName: creatorName,
                          brandHandle: creatorHandle.isNotEmpty ? creatorHandle : 'studiolabel',
                          avatarUrl: widget.post['creator_avatar'],
                          category: 'Style Creator',
                          location: 'Global Boutique',
                          bio: 'Fashion curator styling cutting-edge silhouettes with luxury apparel.',
                        ),
                      ),
                    );
                  },
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundImage: NetworkImage(
                          widget.post['creator_avatar'] ??
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
                        ),
                        radius: 18,
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.post['creator_name'] ?? 'Creator',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          Text(
                            widget.post['is_tryon'] == true ||
                                    (widget.post['canvas_layout'] is Map &&
                                        widget.post['canvas_layout']['is_tryon'] == true)
                                ? 'Shared Try-On avatar look'
                                : 'Shared outfit creation',
                            style: TextStyle(color: Colors.grey[600], fontSize: 10),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.more_vert, size: 18),
                  onPressed: () {},
                ),
              ],
            ),
          ),

          // 2. Visual Content Layer (Try-on result image or outfit canvas)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14.0),
            child: Container(
              height: 240,
              decoration: BoxDecoration(
                color: AppTheme.backgroundColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderColor),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Builder(
                  builder: (context) {
                    final isTryOn = widget.post['is_tryon'] == true ||
                        (widget.post['canvas_layout'] is Map &&
                            widget.post['canvas_layout']['is_tryon'] == true);
                    final String? tryonImageUrl = widget.post['tryon_image_url'] ??
                        (widget.post['canvas_layout'] is Map
                            ? widget.post['canvas_layout']['tryon_image_url'] as String?
                            : null);

                    if (isTryOn && tryonImageUrl != null) {
                      final isAsset = tryonImageUrl.startsWith('assets/');
                      final isFile = File(tryonImageUrl).existsSync();

                      if (isAsset) {
                        return Image.asset(tryonImageUrl, fit: BoxFit.cover, width: double.infinity);
                      } else if (isFile) {
                        return Image.file(File(tryonImageUrl), fit: BoxFit.cover, width: double.infinity);
                      } else {
                        return Image.network(
                          tryonImageUrl,
                          fit: BoxFit.cover,
                          width: double.infinity,
                          errorBuilder: (_, __, ___) => Container(
                            color: Colors.grey[900],
                            child: const Center(
                              child: Icon(Icons.broken_image, color: Colors.grey),
                            ),
                          ),
                        );
                      }
                    } else {
                      return _buildOutfitThumbnail(canvasLayout, allItems, postProducts);
                    }
                  },
                ),
              ),
            ),
          ),

          // 3. Metadata & Actions Row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        (widget.post['outfit_name'] ?? 'Outfit Look').toString().toUpperCase(),
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 0.5),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: Icon(
                            _isLiked ? Icons.favorite : Icons.favorite_border,
                            size: 20,
                            color: _isLiked ? Colors.redAccent : AppTheme.textColorPrimary,
                          ),
                          onPressed: _toggleLike,
                        ),
                        Text('$_likesCount', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        const SizedBox(width: 12),
                        IconButton(
                          icon: const Icon(Icons.chat_bubble_outline, size: 20),
                          onPressed: _openComments,
                        ),
                        Text('$_commentsCount', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Try-On CTA Button
                SizedBox(
                  width: double.infinity,
                  height: 42,
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppTheme.primaryColor),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      if (postProducts.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('No garments linked to this creation')),
                        );
                        return;
                      }
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => TryOnScreen(product: postProducts.first),
                        ),
                      );
                    },
                    icon: const Icon(Icons.face_retouching_natural, size: 16, color: AppTheme.primaryColor),
                    label: const Text(
                      'TRY ON THIS LOOK',
                      style: TextStyle(
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
          ),
        ],
      ),
    );
  }

  Widget _buildOutfitThumbnail(
    List<Map<String, dynamic>>? canvasLayout,
    List<Product> allItems,
    List<Product> postProducts,
  ) {
    if (canvasLayout != null && canvasLayout.isNotEmpty) {
      return Container(
        color: AppTheme.surfaceColor,
        child: ClipRect(
          child: LayoutBuilder(
            builder: (context, constraints) {
              const baseWidth = 360.0;
              const baseHeight = 240.0;

              return Stack(
                children: canvasLayout.map((layout) {
                  final productId = layout['productId']?.toString() ?? '';
                  final product = allItems.firstWhere(
                    (p) => p.id == productId,
                    orElse: () => Product.dummyProducts.first,
                  );

                  final double scaleX = constraints.maxWidth / baseWidth;
                  final double scaleY = constraints.maxHeight / baseHeight;
                  final double scale = scaleX < scaleY ? scaleX : scaleY;

                  final double left = (layout['left'] ?? 0.0) * scaleX;
                  final double top = (layout['top'] ?? 0.0) * scaleY;
                  final double itemScale = (layout['scale'] ?? 1.0) * scale;
                  final double rotation = (layout['rotation'] ?? 0.0).toDouble();

                  final double itemWidth = 100 * itemScale;
                  final double itemHeight = 100 * itemScale;

                  return Positioned(
                    left: left,
                    top: top,
                    child: Transform.rotate(
                      angle: rotation,
                      child: SizedBox(
                        width: itemWidth,
                        height: itemHeight,
                        child: _buildItemImage(product),
                      ),
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ),
      );
    }

    return Row(
      children: postProducts.map((product) {
        final isCustom = product.id.startsWith('custom_');
        return Expanded(
          child: Container(
            margin: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Padding(
              padding: const EdgeInsets.all(6.0),
              child: isCustom
                  ? (File(product.imageUrl).existsSync()
                      ? Image.file(File(product.imageUrl), fit: BoxFit.contain)
                      : const Icon(Icons.checkroom, color: Colors.grey))
                  : Image.network(product.imageUrl, fit: BoxFit.contain),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildItemImage(Product product) {
    final isCustom = product.id.startsWith('custom_');
    if (isCustom && File(product.imageUrl).existsSync()) {
      return Image.file(File(product.imageUrl), fit: BoxFit.contain);
    }
    return Image.network(
      product.imageUrl,
      fit: BoxFit.contain,
      errorBuilder: (_, __, ___) => const Icon(Icons.checkroom, color: Colors.grey),
    );
  }
}
