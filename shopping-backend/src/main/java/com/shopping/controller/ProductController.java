package com.shopping.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.dto.response.ProductResponse;
import com.shopping.service.ProductService;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    
    @Autowired
    private ProductService productService;

    @GetMapping("/fetchAllProducts")
    public ResponseEntity<List<ProductResponse>> fetchAllProducts() {
        List<ProductResponse> products = productService.fetchAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/fetchByCategory/{category}")
    public ResponseEntity<List<ProductResponse>> fetchByCategory(@PathVariable String category) {
        List<ProductResponse> products = productService.fetchByCategory(category);
        return ResponseEntity.ok(products);
    }
}
