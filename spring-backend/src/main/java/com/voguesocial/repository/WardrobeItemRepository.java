package com.voguesocial.repository;

import com.voguesocial.model.WardrobeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WardrobeItemRepository extends JpaRepository<WardrobeItem, String> {
    List<WardrobeItem> findByUserIdOrderByCreatedAtDesc(String userId);
    List<WardrobeItem> findByUserIdAndCategoryOrderByCreatedAtDesc(String userId, String category);
    long countByUserId(String userId);
}
