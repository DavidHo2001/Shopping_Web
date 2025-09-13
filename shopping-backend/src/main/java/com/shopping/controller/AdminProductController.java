package com.shopping.controller;

//import com.shopping.model.AdminProduct;
//import com.shopping.repository.AdminProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;
import com.shopping.dto.UploadProduct;
import com.shopping.model.Product;
import com.shopping.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.shopping.service.S3UploadService;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin")
public class AdminProductController {
    @Autowired
    private S3UploadService s3UploadService;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/product-test")
    public ResponseEntity<String> productTest() {
        return ResponseEntity.ok("Your role is admin");
    }

    @PostMapping("/add-product")
    public ResponseEntity<String> addProduct(@RequestParam("name") String name, @RequestParam("description") String description, @RequestParam("price") String price, @RequestParam("category") String category, @RequestParam("brand") String brand, @RequestParam("image") MultipartFile image) {
        
        try {
            // Create UploadProduct object (Cannot use @RequestBody because of MultipartFile)
            UploadProduct uploadProduct = new UploadProduct();
            uploadProduct.setName(name);
            uploadProduct.setDescription(description);
            uploadProduct.setPrice(price);
            uploadProduct.setCategory(category);
            uploadProduct.setBrand(brand);
            uploadProduct.setImage(image);
            System.out.println("UploadProduct: " + uploadProduct);
            System.out.println("Product Name: " + uploadProduct.getName());
            System.out.println("Category: " + uploadProduct.getCategory());
            System.out.println("Brand: " + uploadProduct.getBrand());
            System.out.println("Description: " + uploadProduct.getDescription());
            System.out.println("Price: " + uploadProduct.getPrice());
            System.out.println("Image: " + uploadProduct.getImage());
            
            // Validate required fields using DTO
            if (uploadProduct.getName() == null || uploadProduct.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product name is required");
            }
            
            if (uploadProduct.getPrice() == null || uploadProduct.getPrice().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product price is required");
            }
            
            if (uploadProduct.getCategory() == null || uploadProduct.getCategory().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product category is required");
            }

            // Note: Image handling would need to be separate endpoint for file upload
            // For now, we'll handle text data only
            
            Product product = new Product();
            product.setName(uploadProduct.getName());
            product.setCategory(uploadProduct.getCategory());
            product.setBrand(uploadProduct.getBrand());
            product.setDescription(uploadProduct.getDescription());
            product.setPrice(new BigDecimal(uploadProduct.getPrice()));
            product.setImage(null);

            String imageUrl = null;
            if (uploadProduct.getImage() != null) {
                
            imageUrl = s3UploadService.uploadProductImage(uploadProduct.getImage(), uploadProduct.getName());}
            String prefix = "https://shopping-web-bucket.s3.ap-southeast-2.amazonaws.com";
            if (imageUrl.startsWith(prefix)) {
                imageUrl = imageUrl.substring(prefix.length());
            }
            product.setImage(imageUrl);
            Product saved = productRepository.save(product);

            return ResponseEntity.ok("Product uploaded successfully");
            
        } catch (Exception e) {
            System.err.println("Error processing product upload: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing product upload: " + e.getMessage());
        }
    }
}
