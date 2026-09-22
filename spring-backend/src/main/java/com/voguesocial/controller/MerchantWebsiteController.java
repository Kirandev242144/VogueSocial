package com.voguesocial.controller;

import com.voguesocial.model.Profile;
import com.voguesocial.model.WebsiteSettings;
import com.voguesocial.repository.ProfileRepository;
import com.voguesocial.repository.WebsiteSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/merchant/website")
@CrossOrigin(origins = "*")
public class MerchantWebsiteController {

    @Autowired
    private WebsiteSettingsRepository websiteSettingsRepository;

    @Autowired
    private ProfileRepository profileRepository;

    private static final String DEFAULT_VENDOR_ID = "ec9e5c47-4d4a-4998-b4b3-16d228f9615c";

    @GetMapping
    public ResponseEntity<?> getWebsiteSettings(
            @RequestParam(required = false) String vendorId,
            @RequestParam(required = false) String handle) {
        
        WebsiteSettings settings = null;

        // 1. Check by handle if provided
        if (handle != null && !handle.trim().isEmpty()) {
            Optional<WebsiteSettings> byHandle = websiteSettingsRepository.findByStoreHandleIgnoreCase(handle.trim().toLowerCase());
            if (byHandle.isPresent()) {
                settings = byHandle.get();
            }
        }

        // 2. Check by vendorId
        String targetVendorId = (vendorId != null && !vendorId.isEmpty()) ? vendorId : DEFAULT_VENDOR_ID;
        if (settings == null) {
            settings = websiteSettingsRepository.findById(targetVendorId)
                    .orElseGet(() -> {
                        WebsiteSettings defaults = new WebsiteSettings();
                        defaults.setVendorId(targetVendorId);
                        defaults.setStoreHandle("studiolabel");
                        defaults.setStoreName("Studio Label Paris");
                        defaults.setTagline("Modern Tailoring & AI Virtual Fitting Studio");
                        defaults.setStatus("live");
                        defaults.setTemplate("modern");
                        defaults.setAccentColor("#2563eb");
                        defaults.setCustomDomain("shop.studiolabelparis.com");
                        defaults.setDomainStatus("ssl_active");
                        defaults.setDescription("Founded in Paris, Studio Label harmonizes architectural silhouettes with everyday luxury. Every garment in our collection is precision-crafted from European textiles and optimized for zero-latency in-browser virtual try-on.");
                        defaults.setHeroImage("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80");
                        defaults.setCreatedAt(LocalDateTime.now());
                        return defaults;
                    });
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("website", settings);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> updateWebsiteSettings(@RequestBody Map<String, Object> body) {
        String vendorId = body.containsKey("vendorId") && body.get("vendorId") != null 
                ? body.get("vendorId").toString() : DEFAULT_VENDOR_ID;
        String action = body.containsKey("action") && body.get("action") != null 
                ? body.get("action").toString() : "save";

        WebsiteSettings settings = websiteSettingsRepository.findById(vendorId)
                .orElseGet(() -> {
                    WebsiteSettings s = new WebsiteSettings();
                    s.setVendorId(vendorId);
                    s.setCreatedAt(LocalDateTime.now());
                    return s;
                });

        // Apply action or direct property updates
        if ("publish".equalsIgnoreCase(action)) {
            settings.setStatus("live");
        } else if ("unpublish".equalsIgnoreCase(action)) {
            settings.setStatus("unpublished");
        } else if ("update_template".equalsIgnoreCase(action)) {
            if (body.containsKey("template") && body.get("template") != null) {
                settings.setTemplate(body.get("template").toString());
            }
        } else if ("update_subdomain".equalsIgnoreCase(action)) {
            if (body.containsKey("store_handle") && body.get("store_handle") != null) {
                settings.setStoreHandle(body.get("store_handle").toString().trim().toLowerCase());
            } else if (body.containsKey("subdomain") && body.get("subdomain") != null) {
                settings.setStoreHandle(body.get("subdomain").toString().trim().toLowerCase());
            }
        }

        // Support direct attribute overrides from JSON payload
        if (body.containsKey("store_name") && body.get("store_name") != null) {
            settings.setStoreName(body.get("store_name").toString());
        } else if (body.containsKey("storeName") && body.get("storeName") != null) {
            settings.setStoreName(body.get("storeName").toString());
        }

        if (body.containsKey("store_handle") && body.get("store_handle") != null) {
            settings.setStoreHandle(body.get("store_handle").toString().trim().toLowerCase());
        } else if (body.containsKey("storeHandle") && body.get("storeHandle") != null) {
            settings.setStoreHandle(body.get("storeHandle").toString().trim().toLowerCase());
        } else if (body.containsKey("subdomain") && body.get("subdomain") != null) {
            settings.setStoreHandle(body.get("subdomain").toString().trim().toLowerCase());
        }

        if (body.containsKey("custom_domain") && body.get("custom_domain") != null) {
            settings.setCustomDomain(body.get("custom_domain").toString().trim());
        } else if (body.containsKey("customDomain") && body.get("customDomain") != null) {
            settings.setCustomDomain(body.get("customDomain").toString().trim());
        }

        if (body.containsKey("domain_status") && body.get("domain_status") != null) {
            settings.setDomainStatus(body.get("domain_status").toString());
        } else if (body.containsKey("domainStatus") && body.get("domainStatus") != null) {
            settings.setDomainStatus(body.get("domainStatus").toString());
        }

        if (body.containsKey("template") && body.get("template") != null) {
            settings.setTemplate(body.get("template").toString());
        }

        if (body.containsKey("accent_color") && body.get("accent_color") != null) {
            settings.setAccentColor(body.get("accent_color").toString());
        } else if (body.containsKey("accentColor") && body.get("accentColor") != null) {
            settings.setAccentColor(body.get("accentColor").toString());
        }

        if (body.containsKey("hero_image") && body.get("hero_image") != null) {
            settings.setHeroImage(body.get("hero_image").toString());
        } else if (body.containsKey("heroImage") && body.get("heroImage") != null) {
            settings.setHeroImage(body.get("heroImage").toString());
        }

        if (body.containsKey("tagline") && body.get("tagline") != null) {
            settings.setTagline(body.get("tagline").toString());
        }

        if (body.containsKey("description") && body.get("description") != null) {
            settings.setDescription(body.get("description").toString());
        }

        if (body.containsKey("logo_url") && body.get("logo_url") != null) {
            settings.setLogoUrl(body.get("logo_url").toString());
        } else if (body.containsKey("logoUrl") && body.get("logoUrl") != null) {
            settings.setLogoUrl(body.get("logoUrl").toString());
        }

        if (body.containsKey("status") && body.get("status") != null) {
            settings.setStatus(body.get("status").toString());
        }

        WebsiteSettings saved = websiteSettingsRepository.save(settings);

        // Also synchronize with Profile entity if it exists
        profileRepository.findById(vendorId).ifPresent(profile -> {
            if (saved.getStoreName() != null) profile.setStoreName(saved.getStoreName());
            if (saved.getStoreHandle() != null) profile.setStoreHandle(saved.getStoreHandle());
            if (saved.getDescription() != null) profile.setDescription(saved.getDescription());
            if (saved.getLogoUrl() != null) profile.setLogoUrl(saved.getLogoUrl());
            profileRepository.save(profile);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("website", saved);

        return ResponseEntity.ok(response);
    }
}
