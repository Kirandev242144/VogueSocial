package com.voguesocial.controller;

import com.voguesocial.model.Product;
import com.voguesocial.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/merchant/products")
@CrossOrigin(origins = "*")
public class MerchantProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<?> getMerchantProducts(@RequestParam(required = false) String vendorId) {
        String targetVendorId = (vendorId != null && !vendorId.isEmpty()) ? vendorId : "ec9e5c47-4d4a-4998-b4b3-16d228f9615c"; // Tom default
        List<Product> products = productRepository.findByVendorIdOrderByCreatedAtDesc(targetVendorId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", products.size());
        response.put("products", products);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        if (product.getId() == null || product.getId().trim().isEmpty()) {
            product.setId("prod_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        }
        if (product.getVendorId() == null || product.getVendorId().trim().isEmpty()) {
            product.setVendorId("ec9e5c47-4d4a-4998-b4b3-16d228f9615c");
        }

        // Live status by default so merchant products instantly appear across Home and Shop
        if (product.getStatus() == null || product.getStatus().trim().isEmpty() || "pending_approval".equalsIgnoreCase(product.getStatus())) {
            product.setStatus("live");
        }

        if (product.getCreatedAt() == null) {
            product.setCreatedAt(LocalDateTime.now());
        }

        if (product.getStock() == null || product.getStock() <= 0) {
            product.setStock(25);
        }

        Product saved = productRepository.save(product);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("product", saved);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteProduct(@RequestParam String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Product deleted successfully");
            return ResponseEntity.ok(res);
        }
        Map<String, Object> err = new HashMap<>();
        err.put("success", false);
        err.put("error", "Product not found");
        return ResponseEntity.badRequest().body(err);
    }
}

