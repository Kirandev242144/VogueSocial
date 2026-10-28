import 'package:flutter/material.dart';
import '../../models/product.dart';
import '../../screens/tryon_screen.dart';
import '../../theme/app_theme.dart';
import '../product_image.dart';
import 'before_after_slider.dart';
import 'feed_comments_sheet.dart';
import 'post_card_footer.dart';
import 'post_card_header.dart';

class UgcFeedCard extends StatefulWidget {
  final Product product;
  final Map<String, String> creator;
  final List<Product> allProducts;

  const UgcFeedCard({
    super.key,
    required this.product,
    required this.creator,
    required this.allProducts,
  });

  @override
  State<UgcFeedCard> createState() => _UgcFeedCardState();
}

class _UgcFeedCardState extends State<UgcFeedCard> with SingleTickerProviderStateMixin {
  int _likesCount = 312;
  bool _isLiked = false;
  final bool _isLoadingEngagement = false;

  late AnimationController _likeAnimController;
  late Animation<double> _likeScaleAnimation;

  static const List<String> _ugcSelfieImages = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=250',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250',
  ];

  @override
  void initState() {
    super.initState();
    _likesCount = 200 + (widget.product.id.hashCode % 400).abs();

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

  void _openComparisonDialog() {
    final selfie = _ugcSelfieImages[widget.product.id.hashCode.abs() % _ugcSelfieImages.length];

    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, blurRadius: 16, offset: Offset(0, 8)),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${widget.creator['name']}\'s Try-On',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                              ),
                              const Text(
                                'Drag slider to compare Before & After',
                                style: TextStyle(color: Colors.grey, fontSize: 11),
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.close, size: 20),
                            onPressed: () => Navigator.pop(ctx),
                          ),
                        ],
                      ),
                    ),
                    BeforeAfterSlider(
                      beforeImage: selfie,
                      afterImage: widget.product.imageUrl.startsWith('http')
                          ? widget.product.imageUrl
                          : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600',
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: SizedBox(
                        width: double.infinity,
                        height: 42,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () {
                            Navigator.pop(ctx);
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => TryOnScreen(product: widget.product),
                              ),
                            );
                          },
                          icon: const Icon(Icons.auto_awesome, size: 16),
                          label: const Text('Try This Garment On Me', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ),
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

  void _openComments() {
    FeedCommentsSheet.show(
      context,
      targetId: widget.product.id,
      targetType: CommentTargetType.product,
    );
  }

  @override
  Widget build(BuildContext context) {
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
          // 1. Post Header (Creator info + wearing @Brand)
          PostCardHeader(
            product: widget.product,
            creator: widget.creator,
            isUgcPost: true,
          ),

          // 2. Main Visual Layer with "Tried via VogueSocial" Pill
          GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: _openComparisonDialog,
            child: AspectRatio(
              aspectRatio: 1.25,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  ProductImage(
                    imagePath: widget.product.imageUrl,
                    fit: BoxFit.cover,
                  ),
                  Positioned(
                    bottom: 10,
                    right: 10,
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
                          Icon(Icons.auto_awesome, size: 12, color: AppTheme.secondaryColor),
                          SizedBox(width: 4),
                          Text(
                            'Tried via VogueSocial',
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
                ],
              ),
            ),
          ),

          // 3. Post Footer (Metadata & Actions)
          PostCardFooter(
            product: widget.product,
            isUgcPost: true,
            likesCount: _likesCount,
            isLiked: _isLiked,
            isLoadingEngagement: _isLoadingEngagement,
            likeScaleAnimation: _likeScaleAnimation,
            onToggleLike: _handleLikeToggle,
            onCommentsTap: _openComments,
          ),
        ],
      ),
    );
  }
}
