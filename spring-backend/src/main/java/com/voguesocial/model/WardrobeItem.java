package com.voguesocial.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "wardrobe_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WardrobeItem {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "user_id", length = 100, nullable = false)
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(length = 50)
    private String category; // tops, bottoms, outerwear, shoes, dresses, accessories

    @Column(length = 100)
    private String brand = "Custom";

    @Column(length = 50)
    private String season = "All";

    @Column(length = 50)
    private String occasion = "Casual";

    @Column(name = "color_hex", length = 30)
    private String colorHex = "#FFFFFF";

    @Column(length = 255)
    private String colors = "White";

    @Lob
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(name = "wear_count")
    private Integer wearCount = 0;

    private Double price = 0.0;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
