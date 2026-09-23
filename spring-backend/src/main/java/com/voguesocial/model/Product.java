package com.voguesocial.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @Column(length = 100)
    private String id;

    @JsonProperty("vendorId")
    @JsonAlias({"vendor_id", "vendorId"})
    @Column(name = "vendor_id", nullable = false)
    private String vendorId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "category")
    private String category;

    @Column(name = "subcategory")
    private String subcategory;

    @JsonProperty("targetAudience")
    @JsonAlias({"target_audience", "targetAudience"})
    @Column(name = "target_audience")
    private String targetAudience;

    @Column(name = "sku")
    private String sku;

    @JsonProperty("description")
    @JsonAlias({"desc", "description"})
    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @JsonProperty("salePrice")
    @JsonAlias({"sale_price", "salePrice"})
    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "currency", length = 10)
    private String currency = "USD";

    @JsonProperty("imageUrl")
    @JsonAlias({"image_url", "imageUrl", "image"})
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @JsonProperty("backImageUrl")
    @JsonAlias({"back_image_url", "backImageUrl"})
    @Column(name = "back_image_url", columnDefinition = "LONGTEXT")
    private String backImageUrl;

    @Column(name = "stock")
    private Integer stock = 25;

    @Column(name = "status")
    private String status = "live"; // live, draft, pending_approval, rejected

    @JsonProperty("adminNotes")
    @JsonAlias({"admin_notes", "adminNotes"})
    @Column(name = "admin_notes", columnDefinition = "LONGTEXT")
    private String adminNotes;

    @JsonProperty("createdAt")
    @JsonAlias({"created_at", "createdAt"})
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
