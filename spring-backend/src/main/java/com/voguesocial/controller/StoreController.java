package com.voguesocial.controller;

import com.voguesocial.model.Product;
import com.voguesocial.model.Profile;
import com.voguesocial.model.WebsiteSettings;
import com.voguesocial.repository.ProductRepository;
import com.voguesocial.repository.ProfileRepository;
import com.voguesocial.repository.WebsiteSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    private static final String DEFAULT_VENDOR_ID = "ec9e5c47-4d4a-4998-b4b3-16d228f9615c";

    @GetMapping("/{handle}")
    public ResponseEntity<?> getStoreData(@PathVariable String handle) {
        String cleanHandle = (handle != null) ? handle.toLowerCase().trim() : "studiolabel";

        // 1. Find settings by store_handle in website_settings table
        Optional<WebsiteSettings> settingsOpt = websiteSettingsRepository.findByStoreHandleIgnoreCase(cleanHandle);

        // 2. Find profile by store_handle in profiles table
        Optional<Profile> profileOpt = profileRepository.findByStoreHandleIgnoreCase(cleanHandle);

        // 3. Fallback: match by email prefix
        if (profileOpt.isEmpty()) {
            profileOpt = profileRepository.findByEmailIgnoreCase(cleanHandle + "@gmail.com");
        }

        // 4. Fallback: if settings exist, lookup profile by vendorId
        if (profileOpt.isEmpty() && settingsOpt.isPresent()) {
            profileOpt = profileRepository.findById(settingsOpt.get().getVendorId());
        }

        // 5. Demo / Default Fallback: if studiolabel or profile not found, fallback to primary merchant
        if (profileOpt.isEmpty()) {
            profileOpt = profileRepository.findById(DEFAULT_VENDOR_ID);
            if (profileOpt.isEmpty()) {
                List<Profile> all = profileRepository.findAll();
                if (!all.isEmpty()) profileOpt = Optional.of(all.get(0));
            }
        }

        Profile profile = profileOpt.orElse(null);
        String vendorId = (profile != null) ? profile.getId() : DEFAULT_VENDOR_ID;

        // Resolve or generate website settings
        WebsiteSettings settings;
        if (settingsOpt.isPresent()) {
            settings = settingsOpt.get();
        } else {
            settings = websiteSettingsRepository.findById(vendorId)
                    .orElseGet(() -> {
                        WebsiteSettings defaults = new WebsiteSettings();
                        defaults.setVendorId(vendorId);
                        defaults.setStoreHandle(cleanHandle);
                        defaults.setStoreName(profile != null && profile.getStoreName() != null ? profile.getStoreName() : "Studio Label Paris");
                        defaults.setTagline("Modern Tailoring & AI Virtual Fitting Studio");
                        defaults.setStatus("live");
                        defaults.setTemplate("modern");
                        defaults.setAccentColor("#2563eb");
                        defaults.setCustomDomain("shop.studiolabelparis.com");
                        defaults.setDomainStatus("ssl_active");
                        defaults.setDescription("Founded in Paris, Studio Label harmonizes architectural silhouettes with everyday luxury. Precision-crafted from European textiles and optimized for zero-latency in-browser virtual try-on.");
                        defaults.setHeroImage("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80");
                        return defaults;
                    });
        }

        // Fetch products for vendor
        List<Product> rawProducts = new ArrayList<>();
        if (profile != null) {
            rawProducts = productRepository.findByVendorIdAndStatus(profile.getId(), "live");
            if (rawProducts.isEmpty()) {
                rawProducts = productRepository.findByVendorId(profile.getId());
            }
        }

        // If specific vendor has no products, fallback to live catalog products
        if (rawProducts.isEmpty()) {
            rawProducts = productRepository.findByStatus("live");
        }
        if (rawProducts.isEmpty()) {
            rawProducts = productRepository.findAll();
        }

        // Transform products into rich catalog items
        List<Map<String, Object>> formattedProducts = new ArrayList<>();
        for (Product p : rawProducts) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", p.getId());
            item.put("name", p.getName());
            item.put("category", (p.getCategory() != null && !p.getCategory().isEmpty()) ? p.getCategory() : "Apparel");
            item.put("price", p.getPrice());
            item.put("sale_price", p.getSalePrice());
            item.put("salePrice", p.getSalePrice());
            item.put("currency", p.getCurrency() != null ? p.getCurrency() : "USD");

            // Format image URLs
            String img = p.getImageUrl();
            if (img == null || img.isEmpty()) {
                img = "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80";
            }
            item.put("image_url", img);
            item.put("imageUrl", img);
            item.put("back_image_url", p.getBackImageUrl());
            item.put("backImageUrl", p.getBackImageUrl());
            item.put("description", p.getDescription() != null ? p.getDescription() : "Exquisite tailoring with contemporary silhouette.");
            item.put("stock_count", p.getStock() != null ? p.getStock() : 25);
            item.put("in_stock", true);
            item.put("badge", "Try-On Ready");
            item.put("rating", 4.9);
            item.put("reviews_count", 48);

            // Default fashion colors and sizes
            item.put("colors", Arrays.asList("Obsidian Black", "Camel", "Cream White"));
            item.put("sizes", Arrays.asList("XS", "S", "M", "L", "XL"));

            formattedProducts.add(item);
        }

        // Construct complete store info
        Map<String, Object> storeInfo = new HashMap<>();
        String effectiveName = (settings.getStoreName() != null && !settings.getStoreName().isEmpty())
                ? settings.getStoreName()
                : (profile != null && profile.getStoreName() != null ? profile.getStoreName() : "Studio Label Paris");

        String effectiveHandle = (settings.getStoreHandle() != null && !settings.getStoreHandle().isEmpty())
                ? settings.getStoreHandle()
                : cleanHandle;

        storeInfo.put("store_name", effectiveName);
        storeInfo.put("store_handle", effectiveHandle);
        storeInfo.put("subdomain", effectiveHandle);
        storeInfo.put("custom_domain", settings.getCustomDomain() != null ? settings.getCustomDomain() : "shop.studiolabelparis.com");
        storeInfo.put("domain_status", settings.getDomainStatus() != null ? settings.getDomainStatus() : "ssl_active");
        storeInfo.put("description", settings.getDescription() != null ? settings.getDescription() : (profile != null ? profile.getDescription() : ""));
        storeInfo.put("logo_url", settings.getLogoUrl() != null ? settings.getLogoUrl() : (profile != null ? profile.getLogoUrl() : ""));
        storeInfo.put("email", profile != null && profile.getEmail() != null ? profile.getEmail() : "concierge@studiolabelparis.com");
        storeInfo.put("template", settings.getTemplate() != null ? settings.getTemplate() : "modern");
        storeInfo.put("accent_color", settings.getAccentColor() != null ? settings.getAccentColor() : "#2563eb");
        storeInfo.put("hero_image", settings.getHeroImage() != null ? settings.getHeroImage() : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80");
        storeInfo.put("tagline", settings.getTagline() != null ? settings.getTagline() : "Modern Tailoring & AI Virtual Fitting Studio");
        storeInfo.put("status", settings.getStatus() != null ? settings.getStatus() : "live");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("store", storeInfo);
        response.put("products", formattedProducts);

        return ResponseEntity.ok(response);
    }
}
