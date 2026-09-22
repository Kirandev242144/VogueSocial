package com.voguesocial.repository;

import com.voguesocial.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {
    Optional<Profile> findByStoreHandleIgnoreCase(String storeHandle);
    Optional<Profile> findByEmailIgnoreCase(String email);
}
