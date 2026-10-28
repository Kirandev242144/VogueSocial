import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/tryon_provider.dart';
import '../../theme/app_theme.dart';
import 'community_post_card.dart';

class CommunityFeedView extends StatefulWidget {
  const CommunityFeedView({super.key});

  @override
  State<CommunityFeedView> createState() => _CommunityFeedViewState();
}

class _CommunityFeedViewState extends State<CommunityFeedView> {
  List<Map<String, dynamic>> _posts = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPosts();
  }

  Future<void> _loadPosts() async {
    final provider = Provider.of<TryOnProvider>(context, listen: false);
    final list = await provider.fetchCommunityPosts();

    // Inject mock UGC posts if database is empty for visual showcase
    if (list.isEmpty) {
      list.addAll([
        {
          'id': 'mock_post_1',
          'outfit_name': 'Urban Fall Look',
          'creator_name': 'Aria Styles',
          'creator_avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
          'product_ids': ['1', '2', '3'],
          'created_at': DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
        },
        {
          'id': 'mock_post_2',
          'outfit_name': 'Minimalist Monochrome',
          'creator_name': 'Marcus Vance',
          'creator_avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
          'product_ids': ['4', '5'],
          'created_at': DateTime.now().subtract(const Duration(hours: 5)).toIso8601String(),
        },
        {
          'id': 'mock_post_3',
          'outfit_name': 'Evening Elegance',
          'creator_name': 'Elena Rostova',
          'creator_avatar': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150',
          'product_ids': ['post-1', 'post-3'],
          'created_at': DateTime.now().subtract(const Duration(hours: 8)).toIso8601String(),
        },
      ]);
    }

    if (mounted) {
      setState(() {
        _posts = list;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor));
    }

    if (_posts.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.style_outlined, size: 54, color: Colors.grey.shade400),
            const SizedBox(height: 14),
            const Text(
              'No community creations yet',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textColorPrimary),
            ),
            const SizedBox(height: 6),
            const Text(
              'Create and share your favorite looks to inspire the community!',
              style: TextStyle(color: AppTheme.textColorSecondary, fontSize: 12),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      color: AppTheme.primaryColor,
      onRefresh: _loadPosts,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        itemCount: _posts.length,
        itemBuilder: (context, index) {
          final post = _posts[index];
          return CommunityPostCard(post: post);
        },
      ),
    );
  }
}
