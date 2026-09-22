package com.voguesocial.controller;

import com.voguesocial.model.Product;
import com.voguesocial.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
public class AdminProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<?> getAllProductsForAdmin() {
        List<Product> products = productRepository.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("products", products);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> updateProductStatus(@RequestBody Map<String, Object> body) {
        String productId = body.get("productId").toString();
        String action = body.get("action").toString(); // approve, reject, request_changes
        String adminNotes = body.containsKey("adminNotes") ? body.get("adminNotes").toString() : "";

        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Product not found");
            return ResponseEntity.badRequest().body(err);
        }

        Product product = productOpt.get();
        if ("approve".equalsIgnoreCase(action)) {
            product.setStatus("live");
        } else if ("reject".equalsIgnoreCase(action)) {
            product.setStatus("rejected");
        } else if ("request_changes".equalsIgnoreCase(action)) {
            product.setStatus("changes_requested");
        }
        product.setAdminNotes(adminNotes);

        Product updated = productRepository.save(product);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("product", updated);

        return ResponseEntity.ok(response);
    }
}
