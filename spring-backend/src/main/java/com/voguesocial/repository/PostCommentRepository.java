package com.voguesocial.repository;

import com.voguesocial.model.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, String> {
    List<PostComment> findByPostIdOrderByCreatedAtDesc(String postId);
    long countByPostId(String postId);
}
