package com.shopping.controller;

import com.shopping.model.Product;
import com.shopping.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/fetchAllProducts")
    public ResponseEntity<Object> fetchAllProducts() {
        List<Product> products = productRepository.findAll();
        if (!products.isEmpty()){
            return ResponseEntity.ok(products);
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "No product data"));
        }
    }

    @GetMapping("/fetchByCategory/{category}")
    public ResponseEntity<Object> fetchByCategory(@PathVariable String category) {
        List<Product> products = productRepository.findByCategory(category);
        if (!products.isEmpty()){
            return ResponseEntity.ok(products);
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "No product found"));
        }
    }
}
