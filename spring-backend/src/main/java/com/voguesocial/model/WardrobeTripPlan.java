package com.voguesocial.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "wardrobe_trip_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WardrobeTripPlan {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "user_id", length = 100, nullable = false)
    private String userId;

    @Column(nullable = false)
    private String destination;

    @Column(name = "start_date", length = 20)
    private String startDate;

    @Column(name = "end_date", length = 20)
    private String endDate;

    @Column(name = "preset_image", length = 50)
    private String presetImage = "paris";

    @Column(name = "cover_image", columnDefinition = "LONGTEXT")
    private String coverImage;

    @Column(length = 100)
    private String dates;

    @Column(name = "packed_garment_ids", columnDefinition = "TEXT")
    private String packedGarmentIds; // JSON array of garment IDs

    @Column(name = "daily_outfits", columnDefinition = "TEXT")
    private String dailyOutfits; // JSON Map of date -> outfitId

    @Column(columnDefinition = "TEXT")
    private String checklist; // JSON Map of itemName -> boolean

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
