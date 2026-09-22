package com.voguesocial.controller;

import com.voguesocial.model.WebsiteSettings;
import com.voguesocial.repository.WebsiteSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/merchant/website")
@CrossOrigin(origins = "*")
public class MerchantWebsiteController {

    @Autowired
    private WebsiteSettingsRepository websiteSettingsRepository;

    @GetMapping
    public ResponseEntity<?> getWebsiteSettings(@RequestParam(required = false) String vendorId) {
        String targetVendorId = (vendorId != null && !vendorId.isEmpty()) ? vendorId : "ec9e5c47-4d4a-4998-b4b3-16d228f9615c"; // Tom default

        WebsiteSettings settings = websiteSettingsRepository.findById(targetVendorId)
                .orElseGet(() -> {
                    WebsiteSettings defaults = new WebsiteSettings();
                    defaults.setVendorId(targetVendorId);
                    defaults.setStoreHandle("tom");
                    defaults.setStoreName("New Flick");
                    defaults.setTagline("Discover your style.");
                    defaults.setStatus("live");
                    defaults.setTemplate("minimal");
                    defaults.setAccentColor("#02231c");
                    return defaults;
                });

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("website", settings);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> updateWebsiteSettings(@RequestBody Map<String, Object> body) {
        String vendorId = body.containsKey("vendorId") ? body.get("vendorId").toString() : "ec9e5c47-4d4a-4998-b4b3-16d228f9615c";
        String action = body.containsKey("action") ? body.get("action").toString() : "";

        WebsiteSettings settings = websiteSettingsRepository.findById(vendorId)
                .orElseGet(() -> {
                    WebsiteSettings s = new WebsiteSettings();
                    s.setVendorId(vendorId);
                    return s;
                });

        switch (action) {
            case "publish":
                settings.setStatus("live");
                break;
            case "unpublish":
                settings.setStatus("unpublished");
                break;
            case "update_template":
                if (body.containsKey("template")) settings.setTemplate(body.get("template").toString());
                break;
            case "update_subdomain":
                if (body.containsKey("store_handle")) settings.setStoreHandle(body.get("store_handle").toString());
                break;
            default:
                break;
        }

        WebsiteSettings saved = websiteSettingsRepository.save(settings);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("website", saved);

        return ResponseEntity.ok(response);
    }
}
