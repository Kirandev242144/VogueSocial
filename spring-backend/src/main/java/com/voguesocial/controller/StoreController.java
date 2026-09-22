package com.voguesocial.controller;

import com.voguesocial.model.Product;
import com.voguesocial.model.Profile;
import com.voguesocial.model.WebsiteSettings;
import com.voguesocial.repository.ProductRepository;
import com.voguesocial.repository.ProfileRepository;
import com.voguesocial.repository.WebsiteSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/store")
@CrossOrigin(origins = "*")
public class StoreController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WebsiteSettingsRepository websiteSettingsRepository;

    @GetMapping("/{handle}")
    public ResponseEntity<?> getStoreData(@PathVariable String handle) {
        String cleanHandle = handle.toLowerCase().trim();

        // 1. Find profile by store_handle
        Optional<Profile> profileOpt = profileRepository.findByStoreHandleIgnoreCase(cleanHandle);

        // 2. Fallback: match by email prefix (e.g. tom@gmail.com -> handle tom)
        if (profileOpt.isEmpty()) {
            profileOpt = profileRepository.findByEmailIgnoreCase(cleanHandle + "@gmail.com");
        }

        if (profileOpt.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Store not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }

        Profile profile = profileOpt.get();
        String vendorId = profile.getId();

        // Fetch settings or defaults
        WebsiteSettings settings = websiteSettingsRepository.findById(vendorId)
                .orElseGet(() -> {
                    WebsiteSettings defaults = new WebsiteSettings();
                    defaults.setVendorId(vendorId);
                    defaults.setStoreHandle(profile.getStoreHandle() != null ? profile.getStoreHandle() : cleanHandle);
                    defaults.setStoreName(profile.getStoreName() != null ? profile.getStoreName() : handle);
                    defaults.setTagline("Discover our latest collection.");
                    defaults.setStatus("live");
                    defaults.setTemplate("minimal");
                    defaults.setAccentColor("#02231c");
                    return defaults;
                });

        if ("unpublished".equalsIgnoreCase(settings.getStatus())) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Store is not published");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
        }

        // Fetch products for vendor
        List<Product> products = productRepository.findByVendorIdAndStatus(vendorId, "live");
        if (products.isEmpty()) {
            products = productRepository.findByVendorId(vendorId);
        }

        Map<String, Object> storeInfo = new HashMap<>();
        storeInfo.put("store_name", profile.getStoreName() != null ? profile.getStoreName() : handle);
        storeInfo.put("store_handle", profile.getStoreHandle() != null ? profile.getStoreHandle() : cleanHandle);
        storeInfo.put("description", settings.getDescription() != null ? settings.getDescription() : profile.getDescription());
        storeInfo.put("logo_url", settings.getLogoUrl() != null ? settings.getLogoUrl() : profile.getLogoUrl());
        storeInfo.put("email", profile.getEmail());
        storeInfo.put("template", settings.getTemplate());
        storeInfo.put("accent_color", settings.getAccentColor());
        storeInfo.put("hero_image", settings.getHeroImage());
        storeInfo.put("tagline", settings.getTagline());
        storeInfo.put("status", settings.getStatus());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("store", storeInfo);
        response.put("products", products);

        return ResponseEntity.ok(response);
    }
}
