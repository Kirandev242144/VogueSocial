package com.voguesocial.repository;

import com.voguesocial.model.WardrobeOutfit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WardrobeOutfitRepository extends JpaRepository<WardrobeOutfit, String> {
    List<WardrobeOutfit> findByUserIdOrderByCreatedAtDesc(String userId);
}
