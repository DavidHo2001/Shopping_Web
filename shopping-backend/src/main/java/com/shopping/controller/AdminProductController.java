package com.shopping.controller;

//import com.shopping.model.AdminProduct;
//import com.shopping.repository.AdminProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;
import com.shopping.model.Product;
import com.shopping.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.shopping.service.S3UploadService;
import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminProductController {
    @Autowired
    private S3UploadService s3UploadService;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/add-product")
    public ResponseEntity<String> addProduct(@RequestParam("name") String name, @RequestParam("description") String description, @RequestParam("price") String price, @RequestParam("category") String category, @RequestParam("brand") String brand, @RequestParam("image") MultipartFile image) {
        
        try {
            // Name, Price, Category are required
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product name is required");
            }
            
            if (price == null || price.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product price is required");
            }
            
            if (category == null || category.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product category is required");
            }

            // Create Product entity directly from request parameters
            Product product = new Product();
            product.setName(name);
            product.setCategory(category);
            product.setBrand(brand);
            product.setDescription(description);
            product.setPrice(new BigDecimal(price));
            product.setImage(null);

            // Handle image upload
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = s3UploadService.uploadProductImage(image, name);
                String prefix = "https://shopping-web-bucket.s3.ap-southeast-2.amazonaws.com";
                if (imageUrl.startsWith(prefix)) {
                    imageUrl = imageUrl.substring(prefix.length());
                }
                product.setImage(imageUrl);
            }
            //Insert new product
            Product saved = productRepository.save(product);
            return ResponseEntity.ok("Product uploaded successfully");
            
        } catch (Exception e) {
            System.err.println("Error processing product upload: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing product upload: " + e.getMessage());
        }
    }

    @PutMapping("/edit-product")
    public ResponseEntity<String> editProduct(
        @RequestParam("id") Long id,
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("price") String price,
        @RequestParam("category") String category,
        @RequestParam("brand") String brand,
        @RequestParam(value = "image", required = false) MultipartFile image // optional
    ) {
        try {
            // Validate required fields
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product name is required");
            }
            
            if (price == null || price.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product price is required");
            }
            
            if (category == null || category.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product category is required");
            }

            Optional<Product> productOptional = productRepository.findById(id);
            if (productOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Product not found");
            }
            
            Product product = productOptional.get();
            
            // Update product fields directly from request parameters
            product.setName(name);
            product.setDescription(description);
            product.setPrice(new BigDecimal(price));
            product.setCategory(category);
            product.setBrand(brand);
            
            // Handle image upload if provided
            if (image != null && !image.isEmpty()) {
                String imageUrl = s3UploadService.uploadProductImage(image, name);
                String prefix = "https://shopping-web-bucket.s3.ap-southeast-2.amazonaws.com";
                if (imageUrl.startsWith(prefix)) {
                    imageUrl = imageUrl.substring(prefix.length());
                }
                product.setImage(imageUrl);
            }
            
            productRepository.save(product);
            return ResponseEntity.ok("Product updated successfully");
            
        } catch (Exception e) {
            System.err.println("Error updating product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating product: " + e.getMessage());
        }
        
    }

    @DeleteMapping("/delete-product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        try {
        if (!productRepository.existsById(id)) {return ResponseEntity.notFound().build();}
        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception e) {
            System.err.println("Error deleting product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting product: " + e.getMessage());
        }
    }
}