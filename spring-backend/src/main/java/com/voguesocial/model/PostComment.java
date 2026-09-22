package com.voguesocial.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "post_comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostComment {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "post_id", nullable = false, length = 100)
    private String postId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_avatar", nullable = false, length = 500)
    private String userAvatar;

    @Column(name = "comment_text", nullable = false, columnDefinition = "TEXT")
    private String commentText;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
