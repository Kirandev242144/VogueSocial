package com.voguesocial.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "website_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebsiteSettings {

    @Id
    @Column(name = "vendor_id", length = 100)
    private String vendorId;

    @Column(name = "status")
    private String status = "draft"; // not_created, draft, live, unpublished

    @Column(name = "template")
    private String template = "minimal"; // minimal, luxury, streetwear, modern, boutique

    @Column(name = "store_handle")
    private String storeHandle;

    @Column(name = "custom_domain")
    private String customDomain;

    @Column(name = "domain_status")
    private String domainStatus = "not_connected";

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "tagline")
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "hero_image")
    private String heroImage;

    @Column(name = "accent_color")
    private String accentColor = "#02231c";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
