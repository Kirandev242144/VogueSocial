package com.voguesocial.controller;

import com.voguesocial.model.Product;
import com.voguesocial.model.Profile;
import com.voguesocial.repository.ProductRepository;
import com.voguesocial.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<?> getPublicProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer limit) {

        List<Product> products = productRepository.findByStatusOrderByCreatedAtDesc("live");
        if (products.isEmpty()) {
            products = productRepository.findAllByOrderByCreatedAtDesc();
        }

        // Optional category filter
        if (category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category.trim())) {
            String catClean = category.trim().toLowerCase();
            products = products.stream()
                    .filter(p -> p.getCategory() != null && p.getCategory().toLowerCase().contains(catClean))
                    .collect(Collectors.toList());
        }

        // Optional search filter
        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            products = products.stream()
                    .filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(q)) ||
                                 (p.getDescription() != null && p.getDescription().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        // Optional limit
        if (limit != null && limit > 0 && products.size() > limit) {
            products = products.subList(0, limit);
        }

        // Attach vendor details from profiles table
        Map<String, Profile> profileCache = new HashMap<>();
        List<Map<String, Object>> productDtos = products.stream().map(p -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", p.getId());
            dto.put("name", p.getName());
            dto.put("category", p.getCategory());
            dto.put("subcategory", p.getSubcategory());
            dto.put("targetAudience", p.getTargetAudience());
            dto.put("sku", p.getSku());
            dto.put("description", p.getDescription());
            dto.put("price", p.getPrice());
            dto.put("salePrice", p.getSalePrice());
            dto.put("currency", p.getCurrency());
            dto.put("imageUrl", p.getImageUrl());
            dto.put("backImageUrl", p.getBackImageUrl());
            dto.put("stock", p.getStock());
            dto.put("status", p.getStatus());
            dto.put("vendorId", p.getVendorId());
            dto.put("createdAt", p.getCreatedAt());
            dto.put("adminNotes", p.getAdminNotes());

            if (p.getVendorId() != null) {
                Profile vendor = profileCache.computeIfAbsent(p.getVendorId(), id -> profileRepository.findById(id).orElse(null));
                if (vendor != null) {
                    String sName = (vendor.getStoreName() != null && !vendor.getStoreName().trim().isEmpty())
                            ? vendor.getStoreName()
                            : (vendor.getFullName() != null ? vendor.getFullName() : "Studio Label Paris");
                    dto.put("vendorName", sName);
                    dto.put("storeName", sName);
                    dto.put("storeHandle", vendor.getStoreHandle());
                    dto.put("vendorLogo", vendor.getLogoUrl());
                }
            }
            return dto;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", productDtos.size());
        response.put("products", productDtos);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        Optional<Product> prodOpt = productRepository.findById(id);
        if (prodOpt.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Product not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }

        Product product = prodOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("product", product);

        // Optionally attach vendor profile info if exists
        if (product.getVendorId() != null) {
            Optional<Profile> vendorOpt = profileRepository.findById(product.getVendorId());
            vendorOpt.ifPresent(v -> {
                Map<String, Object> vendorInfo = new HashMap<>();
                vendorInfo.put("storeName", v.getStoreName() != null ? v.getStoreName() : (v.getFullName() != null ? v.getFullName() : "Vogue Boutique"));
                vendorInfo.put("storeHandle", v.getStoreHandle());
                vendorInfo.put("logoUrl", v.getLogoUrl());
                response.put("vendor", vendorInfo);
            });
        }

        return ResponseEntity.ok(response);
    }
}
