package com.voguesocial.repository;

import com.voguesocial.model.WardrobeTripPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WardrobeTripPlanRepository extends JpaRepository<WardrobeTripPlan, String> {
    List<WardrobeTripPlan> findByUserIdOrderByCreatedAtDesc(String userId);
}
