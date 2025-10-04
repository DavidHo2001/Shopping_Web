package com.shopping.controller;

import com.shopping.model.Cart;
import com.shopping.model.Product;
import com.shopping.repository.CartRepository;
import com.shopping.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/syncCart/{userId}")
    public ResponseEntity<?> syncCart(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            String cartItemsIds = request.get("cartItemsIds");
            
            Optional<Cart> existingCart = cartRepository.findById(userId);
            Cart cart;
            
            if (existingCart.isPresent()) {
                cart = existingCart.get();
                cart.setProductList(cartItemsIds);
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Cart not found"));
            }
            
            cartRepository.save(cart);
            return ResponseEntity.ok().body(Map.of("message", "Cart synced successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to sync cart: " + e.getMessage()));
        }
    }

    //Fetch Cart items for useUser Context
    @GetMapping("/fetchCartItems/{userId}")
    public ResponseEntity<?> fetchCartItems(@PathVariable Long userId) {
        try {
            Optional<Cart> cartOptional = cartRepository.findById(userId);
            if (cartOptional.isPresent()) {
                Cart cart = cartOptional.get();
                String productList = cart.getProductList();
                if (productList == null || productList.isEmpty()) {
                    return ResponseEntity.ok().body(new ArrayList<>());
                }
                return ResponseEntity.ok().body(productList);
            } else {
                return ResponseEntity.ok().body(new ArrayList<>());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch cart items: " + e.getMessage()));
        }
    }

    //Fetch cart items for Cart Page(Purchase)
    @GetMapping("/fetchFinalCartItems/{userId}")
    public ResponseEntity<?> fetchCartFinalItems(@PathVariable Long userId) {
        try {
            Optional<Cart> cartOptional = cartRepository.findById(userId);
            
            if (cartOptional.isEmpty()) {
                return ResponseEntity.ok().body(new HashMap<>());
            }
            
            Cart cart = cartOptional.get();
            String productList = cart.getProductList();
            
            if (productList == null || productList.isEmpty()) {
                return ResponseEntity.ok().body(new HashMap<>());
            }
            
            // Parse product IDs
            String[] productIds = productList.split(",");
            List<Map<String, Object>> cartItems = new ArrayList<>();
            
            // Count quantities for each product
            Map<Long, Integer> productQuantities = new HashMap<>();
            for (String idStr : productIds) {
                try {
                    Long productId = Long.parseLong(idStr.trim());
                    productQuantities.put(productId, productQuantities.getOrDefault(productId, 0) + 1);
                } catch (NumberFormatException e) {
                    // Skip invalid product IDs
                }
            }
            
            // Fetch product details and create cart items
            for (Map.Entry<Long, Integer> entry : productQuantities.entrySet()) {
                Long productId = entry.getKey();
                Integer quantity = entry.getValue();
                
                Optional<Product> productOptional = productRepository.findById(productId);
                if (productOptional.isPresent()) {
                    Product product = productOptional.get();
                    Map<String, Object> cartItem = new HashMap<>();
                    cartItem.put("id", product.getId());
                    cartItem.put("name", product.getName());
                    cartItem.put("price", product.getPrice());
                    cartItem.put("image", product.getImage());
                    cartItem.put("brand", product.getBrand());
                    cartItem.put("category", product.getCategory());
                    cartItem.put("quantity", quantity);
                    cartItems.add(cartItem);
                }
            }
            
            System.out.println(cartItems);
            return ResponseEntity.ok().body(cartItems);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch cart items: " + e.getMessage()));
        }
    }

    @DeleteMapping("/clearCart/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            Optional<Cart> cartOptional = cartRepository.findById(userId);
            
            if (cartOptional.isPresent()) {
                Cart cart = cartOptional.get();
                cart.setProductList("");
                cartRepository.save(cart);
            }
            
            return ResponseEntity.ok().body(Map.of("message", "Cart cleared successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to clear cart: " + e.getMessage()));
        }
    }
}
