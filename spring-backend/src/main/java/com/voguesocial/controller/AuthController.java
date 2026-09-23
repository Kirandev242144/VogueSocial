package com.voguesocial.controller;

import com.voguesocial.model.Profile;
import com.voguesocial.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private com.voguesocial.repository.WebsiteSettingsRepository websiteSettingsRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> req) {
        String email = (String) req.get("email");
        String password = (String) req.get("password");
        String name = (String) req.get("name");
        if (name == null) {
            name = (String) req.get("fullName");
        }
        String storeName = (String) req.get("storeName");
        String storeHandle = (String) req.get("storeHandle");
        String rawRole = (String) req.get("role");
        String role = "user";
        if (rawRole != null && !rawRole.trim().isEmpty()) {
            role = rawRole.trim().toLowerCase();
        } else if ((storeName != null && !storeName.trim().isEmpty()) || (storeHandle != null && !storeHandle.trim().isEmpty())) {
            role = "merchant";
        }

        if (email == null || !email.contains("@")) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Please provide a valid email address.");
            return ResponseEntity.badRequest().body(err);
        }
        if (password == null || password.length() < 6) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Password must be at least 6 characters long.");
            return ResponseEntity.badRequest().body(err);
        }

        String cleanEmail = email.trim().toLowerCase();

        // Check if email already registered
        Optional<Profile> existing = profileRepository.findByEmailIgnoreCase(cleanEmail);
        if (existing.isPresent()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "An account with this email already exists. Please sign in.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
        }

        Profile profile = new Profile();
        profile.setId("usr_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        profile.setEmail(cleanEmail);
        profile.setPassword(password);
        profile.setFullName(name != null ? name.trim() : "Shopper");
        profile.setRole(role);

        if ("merchant".equalsIgnoreCase(role)) {
            String cleanStoreName = (storeName != null && !storeName.trim().isEmpty())
                    ? storeName.trim()
                    : (name != null ? name.trim() + " Atelier" : "Vogue Boutique");
            profile.setStoreName(cleanStoreName);

            String candidateHandle = null;
            if (storeHandle != null && !storeHandle.trim().isEmpty()) {
                candidateHandle = storeHandle.trim().toLowerCase().replaceAll("[^a-z0-9-]", "");
            } else {
                candidateHandle = cleanStoreName.toLowerCase().replaceAll("[^a-z0-9]", "");
            }
            if (candidateHandle.isEmpty()) {
                candidateHandle = "store" + profile.getId().substring(4, 10);
            }

            // Check if store handle is already in use
            Optional<Profile> existingHandleProfile = profileRepository.findByStoreHandleIgnoreCase(candidateHandle);
            Optional<com.voguesocial.model.WebsiteSettings> existingHandleSettings = websiteSettingsRepository.findByStoreHandleIgnoreCase(candidateHandle);
            if (existingHandleProfile.isPresent() || existingHandleSettings.isPresent()) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("error", "The store handle '@" + candidateHandle + "' is already registered by another boutique. Please choose a different handle.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
            }

            profile.setStoreHandle(candidateHandle);
        }

        profile.setCreatedAt(LocalDateTime.now());
        profile.setTryonCreditsTotal(2000);
        profile.setTryonCreditsUsed(0);

        Profile saved = profileRepository.save(profile);

        // Automatically provision WebsiteSettings in MySQL for new merchant
        if ("merchant".equalsIgnoreCase(saved.getRole())) {
            com.voguesocial.model.WebsiteSettings ws = new com.voguesocial.model.WebsiteSettings();
            ws.setVendorId(saved.getId());
            ws.setStoreHandle(saved.getStoreHandle());
            ws.setStoreName(saved.getStoreName());
            ws.setStatus("live");
            ws.setTemplate("minimal");
            ws.setAccentColor("#02231c");
            ws.setCustomDomain("shop." + saved.getStoreHandle() + ".com");
            ws.setDomainStatus("ssl_active");
            ws.setTagline("Modern Tailoring & AI Virtual Fitting Studio");
            ws.setDescription("Welcome to " + saved.getStoreName() + ". Explore our architectural tailoring, seasonal capsule collections, and zero-latency in-browser virtual try-on.");
            ws.setHeroImage("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80");
            ws.setCreatedAt(LocalDateTime.now());
            websiteSettingsRepository.save(ws);
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", saved.getId());
        userData.put("email", saved.getEmail());
        userData.put("name", saved.getFullName());
        userData.put("role", saved.getRole());
        userData.put("storeName", saved.getStoreName());
        userData.put("storeHandle", saved.getStoreHandle());
        userData.put("tryonCreditsTotal", saved.getTryonCreditsTotal());
        userData.put("tryonCreditsUsed", saved.getTryonCreditsUsed());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, Object> req) {
        String email = (String) req.get("email");
        String password = (String) req.get("password");

        if (email == null || password == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Please provide email and password.");
            return ResponseEntity.badRequest().body(err);
        }

        String cleanEmail = email.trim().toLowerCase();
        Optional<Profile> profileOpt = profileRepository.findByEmailIgnoreCase(cleanEmail);

        if (profileOpt.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "No account found with this email. Please check your credentials or sign up.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        Profile profile = profileOpt.get();
        if (profile.getPassword() != null && !profile.getPassword().equals(password)) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Incorrect password. Please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", profile.getId());
        userData.put("email", profile.getEmail());
        userData.put("name", profile.getFullName());
        userData.put("role", profile.getRole());
        userData.put("storeName", profile.getStoreName());
        userData.put("storeHandle", profile.getStoreHandle());
        userData.put("tryonCreditsTotal", profile.getTryonCreditsTotal());
        userData.put("tryonCreditsUsed", profile.getTryonCreditsUsed());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestParam(required = false) String email) {
        if (email == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Email is required");
            return ResponseEntity.badRequest().body(err);
        }
        Optional<Profile> profileOpt = profileRepository.findByEmailIgnoreCase(email.trim().toLowerCase());
        if (profileOpt.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
        Profile profile = profileOpt.get();
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", profile.getId());
        userData.put("email", profile.getEmail());
        userData.put("name", profile.getFullName());
        userData.put("role", profile.getRole());
        userData.put("storeName", profile.getStoreName());
        userData.put("storeHandle", profile.getStoreHandle());
        return ResponseEntity.ok(Map.of("success", true, "user", userData));
    }

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> req) {
        String id = (String) req.get("id");
        if (id == null) id = (String) req.get("vendorId");
        if (id == null) id = (String) req.get("userId");
        if (id == null) id = "ec9e5c47-4d4a-4998-b4b3-16d228f9615c";

        Optional<Profile> profileOpt = profileRepository.findById(id);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "error", "User not found"));
        }
        Profile p = profileOpt.get();
        if (req.containsKey("storeName")) p.setStoreName((String) req.get("storeName"));
        if (req.containsKey("fullName")) p.setFullName((String) req.get("fullName"));
        if (req.containsKey("storeHandle") && req.get("storeHandle") != null) {
            p.setStoreHandle(((String) req.get("storeHandle")).toLowerCase().replaceAll("[^a-z0-9]", ""));
        }
        if (req.containsKey("logoUrl")) p.setLogoUrl((String) req.get("logoUrl"));
        if (req.containsKey("description")) p.setDescription((String) req.get("description"));

        Profile saved = profileRepository.save(p);
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", saved.getId());
        userData.put("email", saved.getEmail());
        userData.put("name", saved.getFullName());
        userData.put("role", saved.getRole());
        userData.put("storeName", saved.getStoreName());
        userData.put("storeHandle", saved.getStoreHandle());
        userData.put("logoUrl", saved.getLogoUrl());
        return ResponseEntity.ok(Map.of("success", true, "user", userData));
    }

    @GetMapping("/check-handle")
    public ResponseEntity<?> checkHandleAvailability(@RequestParam(required = false) String handle) {
        if (handle == null || handle.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Handle is required"));
        }
        String clean = handle.trim().toLowerCase().replaceAll("[^a-z0-9-]", "");
        if (clean.length() < 3) {
            return ResponseEntity.ok(Map.of("success", true, "available", false, "reason", "Handle must be at least 3 characters"));
        }
        boolean takenByProfile = profileRepository.findByStoreHandleIgnoreCase(clean).isPresent();
        boolean takenBySettings = websiteSettingsRepository.findByStoreHandleIgnoreCase(clean).isPresent();
        boolean available = !takenByProfile && !takenBySettings;

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("handle", clean);
        res.put("available", available);
        return ResponseEntity.ok(res);
    }
}
