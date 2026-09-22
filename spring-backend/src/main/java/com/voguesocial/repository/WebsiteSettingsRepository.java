package com.voguesocial.repository;

import com.voguesocial.model.WebsiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebsiteSettingsRepository extends JpaRepository<WebsiteSettings, String> {
    Optional<WebsiteSettings> findByStoreHandleIgnoreCase(String storeHandle);
}
