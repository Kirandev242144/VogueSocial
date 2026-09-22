package com.voguesocial.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "wardrobe_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WardrobeSchedule {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "user_id", length = 100, nullable = false)
    private String userId;

    @Column(name = "date_str", length = 20, nullable = false)
    private String dateStr; // e.g. YYYY-MM-DD

    @Column(name = "outfit_id", length = 100)
    private String outfitId;

    @Column(name = "outfit_name")
    private String outfitName;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
