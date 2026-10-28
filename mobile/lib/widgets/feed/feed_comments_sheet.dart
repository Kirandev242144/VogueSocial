import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../providers/tryon_provider.dart';
import '../../theme/app_theme.dart';

enum CommentTargetType { product, communityPost }

class FeedCommentsSheet extends StatefulWidget {
  final String targetId;
  final CommentTargetType targetType;
  final VoidCallback? onCommentAdded;

  const FeedCommentsSheet({
    super.key,
    required this.targetId,
    required this.targetType,
    this.onCommentAdded,
  });

  static Future<void> show(
    BuildContext context, {
    required String targetId,
    required CommentTargetType targetType,
    VoidCallback? onCommentAdded,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => FeedCommentsSheet(
        targetId: targetId,
        targetType: targetType,
        onCommentAdded: onCommentAdded,
      ),
    );
  }

  @override
  State<FeedCommentsSheet> createState() => _FeedCommentsSheetState();
}

class _FeedCommentsSheetState extends State<FeedCommentsSheet> {
  final TextEditingController _commentTextController = TextEditingController();
  List<Map<String, dynamic>> _comments = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadComments();
  }

  @override
  void dispose() {
    _commentTextController.dispose();
    super.dispose();
  }

  Future<void> _loadComments() async {
    final provider = Provider.of<TryOnProvider>(context, listen: false);
    List<Map<String, dynamic>> list = [];
    if (widget.targetType == CommentTargetType.product) {
      list = await provider.fetchComments(widget.targetId);
    } else {
      list = await provider.fetchPostComments(widget.targetId);
    }

    if (mounted) {
      setState(() {
        _comments = list;
        _loading = false;
      });
    }
  }

  Future<void> _postComment() async {
    final text = _commentTextController.text.trim();
    if (text.isEmpty) return;

    final provider = Provider.of<TryOnProvider>(context, listen: false);
    final user = Supabase.instance.client.auth.currentUser;
    String name = 'VogueUser';
    String avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100';

    if (user != null) {
      name = user.userMetadata?['full_name'] ?? user.email?.split('@').first ?? 'VogueUser';
      avatar = user.userMetadata?['avatar_url'] ?? avatar;
    } else {
      final userIdSuffix = provider.uniqueUserId.length > 4
          ? provider.uniqueUserId.substring(provider.uniqueUserId.length - 4)
          : 'User';
      name = 'VogueUser_$userIdSuffix';
    }

    _commentTextController.clear();
    FocusScope.of(context).unfocus();

    // Optimistic insert
    setState(() {
      _comments.add({
        'user_name': name,
        'user_avatar': avatar,
        'comment_text': text,
        'created_at': DateTime.now().toIso8601String(),
      });
    });
    widget.onCommentAdded?.call();

    bool success = false;
    if (widget.targetType == CommentTargetType.product) {
      success = await provider.addComment(
        productId: widget.targetId,
        userName: name,
        userAvatar: avatar,
        text: text,
      );
    } else {
      success = await provider.addPostComment(
        postId: widget.targetId,
        userName: name,
        userAvatar: avatar,
        text: text,
      );
    }

    if (!success) {
      _loadComments(); // reload to clean up optimistic entry if failed
    }
  }

  String _parseTime(String isoString) {
    try {
      final dt = DateTime.parse(isoString);
      final diff = DateTime.now().difference(dt);
      if (diff.inDays > 7) {
        return '${dt.day}/${dt.month}';
      } else if (diff.inDays > 0) {
        return '${diff.inDays}d';
      } else if (diff.inHours > 0) {
        return '${diff.inHours}h';
      } else if (diff.inMinutes > 0) {
        return '${diff.inMinutes}m';
      } else {
        return 'now';
      }
    } catch (_) {
      return 'now';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        height: MediaQuery.of(context).size.height * 0.62,
        decoration: const BoxDecoration(
          color: AppTheme.surfaceColor,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // Slide indicator
            const SizedBox(height: 12),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),

            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  const Text(
                    'Comments',
                    style: TextStyle(
                      color: AppTheme.textColorPrimary,
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 8),
                  if (!_loading && _comments.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(99),
                      ),
                      child: Text(
                        '${_comments.length}',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF475569),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Divider(color: Colors.grey[200], height: 1),

            // Comments list
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor))
                  : _comments.isEmpty
                      ? const Center(
                          child: Text(
                            'No comments yet. Start the conversation!',
                            style: TextStyle(color: Colors.grey, fontSize: 13),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(20),
                          itemCount: _comments.length,
                          itemBuilder: (context, index) {
                            final c = _comments[index];
                            final time = c['created_at'] != null
                                ? _parseTime(c['created_at'] as String)
                                : 'now';

                            return Padding(
                              padding: const EdgeInsets.only(bottom: 18),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  CircleAvatar(
                                    backgroundImage: NetworkImage(
                                      c['user_avatar'] ??
                                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
                                    ),
                                    radius: 16,
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              c['user_name'] ?? 'User',
                                              style: const TextStyle(
                                                color: AppTheme.textColorPrimary,
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            Text(
                                              time,
                                              style: const TextStyle(color: Colors.grey, fontSize: 10),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 3),
                                        Text(
                                          c['comment_text'] ?? '',
                                          style: const TextStyle(
                                            color: Colors.black87,
                                            fontSize: 13,
                                            height: 1.3,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
            ),

            Divider(color: Colors.grey[200], height: 1),

            // Bottom post text field
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              color: Colors.grey[50],
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: Colors.grey[300]!),
                      ),
                      child: TextField(
                        controller: _commentTextController,
                        style: const TextStyle(color: Colors.black87, fontSize: 13.5),
                        decoration: const InputDecoration(
                          hintText: 'Add a comment...',
                          hintStyle: TextStyle(color: Colors.grey, fontSize: 13),
                          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          border: InputBorder.none,
                        ),
                        onSubmitted: (_) => _postComment(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  CircleAvatar(
                    backgroundColor: AppTheme.primaryColor,
                    radius: 19,
                    child: IconButton(
                      icon: const Icon(Icons.send, color: Colors.white, size: 15),
                      onPressed: _postComment,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
