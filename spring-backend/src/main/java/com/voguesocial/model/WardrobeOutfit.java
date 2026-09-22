package com.voguesocial.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "wardrobe_outfits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WardrobeOutfit {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "user_id", length = 100, nullable = false)
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(name = "product_ids", columnDefinition = "TEXT")
    private String productIds; // JSON array or comma-separated item IDs

    @Column(name = "canvas_layout", columnDefinition = "TEXT")
    private String canvasLayout; // JSON representation of slots

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
