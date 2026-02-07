package com.shopping.controller;

import com.shopping.dto.request.ProductRequest;
import com.shopping.dto.response.ApiResponse;
import com.shopping.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin")
public class AdminProductController {
    
    @Autowired
    private ProductService productService;

    @PostMapping("/add-product")
    public ResponseEntity<ApiResponse<String>> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") String price,
            @RequestParam("category") String category,
            @RequestParam("brand") String brand,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        ProductRequest request = new ProductRequest();
        request.setName(name);
        request.setDescription(description);
        request.setPrice(new BigDecimal(price));
        request.setCategory(category);
        request.setBrand(brand);
        
        String message = productService.addProduct(request, image);
        return ResponseEntity.ok(ApiResponse.success(message));
    }

    @PutMapping("/edit-product")
    public ResponseEntity<ApiResponse<String>> editProduct(
            @RequestParam("id") Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") String price,
            @RequestParam("category") String category,
            @RequestParam("brand") String brand,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        ProductRequest request = new ProductRequest();
        request.setName(name);
        request.setDescription(description);
        request.setPrice(new BigDecimal(price));
        request.setCategory(category);
        request.setBrand(brand);
        
        String message = productService.updateProduct(id, request, image);
        return ResponseEntity.ok(ApiResponse.success(message));
    }

    @DeleteMapping("/delete-product/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        String message = productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(message));
    }
}
