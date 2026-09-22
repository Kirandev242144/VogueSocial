package com.voguesocial.repository;

import com.voguesocial.model.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, String> {
    long countByPostId(String postId);
    boolean existsByPostIdAndUserId(String postId, String userId);
    Optional<PostLike> findByPostIdAndUserId(String postId, String userId);
    void deleteByPostIdAndUserId(String postId, String userId);
}
