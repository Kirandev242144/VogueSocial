package com.voguesocial.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "post_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"post_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostLike {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "post_id", nullable = false, length = 100)
    private String postId;

    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
