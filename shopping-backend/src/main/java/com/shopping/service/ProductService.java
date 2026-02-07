package com.shopping.service;

import com.shopping.dto.request.ProductRequest;
import com.shopping.dto.response.ProductResponse;
import com.shopping.model.Product;
import com.shopping.repository.ProductRepository;
import com.shopping.util.Constants;
import com.shopping.util.ValidationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private S3UploadService s3UploadService;

    public List<ProductResponse> fetchAllProducts() {
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            log.warn("No products found in database");
        }
        return products.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public List<ProductResponse> fetchByCategory(String category) {
        List<String> categories = new ArrayList<>();
        categories.add(category);
        
        if (Constants.CATEGORY_MEN.equals(category) || Constants.CATEGORY_WOMEN.equals(category)) {
            categories.add(Constants.CATEGORY_NEUTRAL);
        }
        
        List<Product> products = productRepository.findByCategoryInOrderById(categories);
        return products.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public String addProduct(ProductRequest request, MultipartFile image) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        
        if (image != null && !image.isEmpty()) {
            String imageUrl;
            try {
                imageUrl = s3UploadService.uploadProductImage(image, request.getName());
            } catch (IOException e) {
                log.error("Failed to upload product image: {}", e.getMessage());
                throw new IllegalArgumentException("Failed to upload product image");
            }
            product.setImage(ValidationUtils.removeS3Prefix(imageUrl));
        }
        
        productRepository.save(product);
        log.info("Product added successfully: {}", product.getName());
        
        return Constants.MSG_PRODUCT_UPLOAD_SUCCESS;
    }

    @Transactional
    public String updateProduct(Long id, ProductRequest request, MultipartFile image) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(Constants.ERR_PRODUCT_NOT_FOUND));
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        
        if (image != null && !image.isEmpty()) {
            String imageUrl;
            try {
                imageUrl = s3UploadService.uploadProductImage(image, request.getName());
            } catch (IOException e) {
                throw new IllegalArgumentException("Failed to upload product image");
            }
            product.setImage(ValidationUtils.removeS3Prefix(imageUrl));
        }
        
        productRepository.save(product);
        log.info("Product updated successfully: {}", product.getName());
        
        return Constants.MSG_PRODUCT_UPDATE_SUCCESS;
    }

    @Transactional
    public String deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException(Constants.ERR_PRODUCT_NOT_FOUND);
        }
        
        productRepository.deleteById(id);
        log.info("Product deleted successfully: ID {}", id);
        
        return Constants.MSG_PRODUCT_DELETE_SUCCESS;
    }

    private ProductResponse convertToResponse(Product product) {
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getCategory(),
            product.getBrand(),
            product.getImage()
        );
    }
}
