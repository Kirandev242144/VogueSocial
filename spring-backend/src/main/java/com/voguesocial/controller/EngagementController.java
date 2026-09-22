package com.voguesocial.controller;

import com.voguesocial.model.PostComment;
import com.voguesocial.model.PostLike;
import com.voguesocial.repository.PostCommentRepository;
import com.voguesocial.repository.PostLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class EngagementController {

    @Autowired
    private PostCommentRepository commentRepo;

    @Autowired
    private PostLikeRepository likeRepo;

    // 1. Get comments for a post
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<PostComment>> getComments(@PathVariable String postId) {
        List<PostComment> comments = commentRepo.findByPostIdOrderByCreatedAtDesc(postId);
        return ResponseEntity.ok(comments);
    }

    // 2. Add comment
    @PostMapping("/{postId}/comments")
    public ResponseEntity<PostComment> addComment(@PathVariable String postId, @RequestBody Map<String, String> payload) {
        String text = payload.get("text") != null ? payload.get("text") : payload.get("commentText");
        String userName = payload.get("userName") != null ? payload.get("userName") : "Sarah Lin";
        String userAvatar = payload.get("userAvatar") != null ? payload.get("userAvatar") : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80";

        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        PostComment comment = new PostComment();
        comment.setId("cmt_" + UUID.randomUUID().toString());
        comment.setPostId(postId);
        comment.setUserName(userName.trim());
        comment.setUserAvatar(userAvatar);
        comment.setCommentText(text.trim());
        comment.setCreatedAt(LocalDateTime.now());

        PostComment saved = commentRepo.save(comment);
        return ResponseEntity.ok(saved);
    }

    // 3. Get likes for a post
    @GetMapping("/{postId}/likes")
    public ResponseEntity<Map<String, Object>> getLikes(
            @PathVariable String postId,
            @RequestParam(required = false, defaultValue = "usr_sarah_01") String userId) {
        long count = likeRepo.countByPostId(postId);
        boolean isLiked = likeRepo.existsByPostIdAndUserId(postId, userId);

        Map<String, Object> resp = new HashMap<>();
        resp.put("postId", postId);
        resp.put("likeCount", count);
        resp.put("isLiked", isLiked);
        return ResponseEntity.ok(resp);
    }

    // 4. Toggle like
    @PostMapping("/{postId}/likes")
    @Transactional
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable String postId,
            @RequestBody(required = false) Map<String, String> payload) {
        String userId = (payload != null && payload.get("userId") != null) ? payload.get("userId") : "usr_sarah_01";

        Optional<PostLike> existing = likeRepo.findByPostIdAndUserId(postId, userId);
        boolean isLiked;
        if (existing.isPresent()) {
            likeRepo.deleteByPostIdAndUserId(postId, userId);
            isLiked = false;
        } else {
            PostLike like = new PostLike();
            like.setId("lik_" + UUID.randomUUID().toString());
            like.setPostId(postId);
            like.setUserId(userId);
            like.setCreatedAt(LocalDateTime.now());
            likeRepo.save(like);
            isLiked = true;
        }

        long count = likeRepo.countByPostId(postId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("postId", postId);
        resp.put("likeCount", count);
        resp.put("isLiked", isLiked);
        return ResponseEntity.ok(resp);
    }

    // 5. Bulk stats for feed
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Map<String, Object>>> getAllStats(
            @RequestParam(required = false, defaultValue = "usr_sarah_01") String userId) {
        Map<String, Map<String, Object>> result = new HashMap<>();
        List<PostComment> allComments = commentRepo.findAll();
        List<PostLike> allLikes = likeRepo.findAll();

        Map<String, Long> commentCounts = new HashMap<>();
        for (PostComment c : allComments) {
            commentCounts.put(c.getPostId(), commentCounts.getOrDefault(c.getPostId(), 0L) + 1);
        }

        Map<String, Long> likeCounts = new HashMap<>();
        Set<String> userLikedPosts = new HashSet<>();
        for (PostLike l : allLikes) {
            likeCounts.put(l.getPostId(), likeCounts.getOrDefault(l.getPostId(), 0L) + 1);
            if (userId.equals(l.getUserId())) {
                userLikedPosts.add(l.getPostId());
            }
        }

        Set<String> allPostIds = new HashSet<>();
        allPostIds.addAll(commentCounts.keySet());
        allPostIds.addAll(likeCounts.keySet());

        for (String pid : allPostIds) {
            Map<String, Object> item = new HashMap<>();
            item.put("likeCount", likeCounts.getOrDefault(pid, 0L));
            item.put("commentCount", commentCounts.getOrDefault(pid, 0L));
            item.put("isLiked", userLikedPosts.contains(pid));
            result.put(pid, item);
        }

        return ResponseEntity.ok(result);
    }
}
