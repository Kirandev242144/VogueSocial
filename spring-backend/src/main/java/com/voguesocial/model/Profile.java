package com.voguesocial.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "store_handle", unique = true)
    private String storeHandle;

    @Column(name = "role")
    private String role = "merchant"; // merchant, customer, admin

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "tryon_credits_total")
    private Integer tryonCreditsTotal = 2000;

    @Column(name = "tryon_credits_used")
    private Integer tryonCreditsUsed = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
