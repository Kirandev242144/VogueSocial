package com.voguesocial.repository;

import com.voguesocial.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByVendorId(String vendorId);
    List<Product> findByVendorIdOrderByCreatedAtDesc(String vendorId);
    List<Product> findByVendorIdAndStatus(String vendorId, String status);
    List<Product> findByStatus(String status);
    List<Product> findByStatusOrderByCreatedAtDesc(String status);
    List<Product> findAllByOrderByCreatedAtDesc();
}

