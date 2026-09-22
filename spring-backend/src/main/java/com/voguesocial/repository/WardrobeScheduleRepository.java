package com.voguesocial.repository;

import com.voguesocial.model.WardrobeSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface WardrobeScheduleRepository extends JpaRepository<WardrobeSchedule, String> {
    List<WardrobeSchedule> findByUserId(String userId);
    Optional<WardrobeSchedule> findByUserIdAndDateStr(String userId, String dateStr);
    
    @Transactional
    void deleteByUserIdAndDateStr(String userId, String dateStr);
}
