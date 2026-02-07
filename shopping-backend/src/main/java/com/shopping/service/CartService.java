package com.shopping.service;

import com.shopping.dto.request.CartSyncRequest;
import com.shopping.dto.response.CartItemResponse;
import com.shopping.model.Cart;
import com.shopping.repository.CartRepository;
import com.shopping.repository.ProductRepository;
import com.shopping.util.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public String syncCart(Long userId, CartSyncRequest request) {
        Cart cart = cartRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException(Constants.ERR_CART_NOT_FOUND));
        
        cart.setProductList(request.getCartItemsIds());
        cartRepository.save(cart);
        
        log.info("Cart synced successfully for user ID: {}", userId);
        return Constants.MSG_CART_SYNC_SUCCESS;
    }

    public String fetchCartItems(Long userId) {
        Cart cart = cartRepository.findById(userId).orElse(null);
        
        if (cart == null || cart.getProductList() == null || cart.getProductList().isEmpty()) {
            return "";
        }
        
        return cart.getProductList();
    }

    public List<CartItemResponse> fetchFinalCartItems(Long userId) {
        Cart cart = cartRepository.findById(userId).orElse(null);
        
        if (cart == null || cart.getProductList() == null || cart.getProductList().isEmpty()) {
            return new ArrayList<>();
        }
        
        String[] productIds = cart.getProductList().split(",");
        Map<Long, Integer> productQuantities = new HashMap<>();
        
        for (String idStr : productIds) {
            try {
                Long productId = Long.parseLong(idStr.trim());
                productQuantities.put(productId, productQuantities.getOrDefault(productId, 0) + 1);
            } catch (NumberFormatException e) {
                log.warn("Invalid product ID in cart: {}", idStr);
            }
        }
        
        List<CartItemResponse> cartItems = new ArrayList<>();
        for (Map.Entry<Long, Integer> entry : productQuantities.entrySet()) {
            Long productId = entry.getKey();
            Integer quantity = entry.getValue();
            
            productRepository.findById(productId).ifPresent(product -> {
                CartItemResponse cartItem = new CartItemResponse(
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    product.getImage(),
                    product.getBrand(),
                    product.getCategory(),
                    quantity
                );
                cartItems.add(cartItem);
            });
        }
        
        log.info("Fetched {} cart items for user ID: {}", cartItems.size(), userId);
        return cartItems;
    }

    @Transactional
    public String clearCart(Long userId) {
        Cart cart = cartRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException(Constants.ERR_CART_NOT_FOUND));
        
        cart.setProductList("");
        cartRepository.save(cart);
        
        log.info("Cart cleared successfully for user ID: {}", userId);
        return Constants.MSG_CART_CLEAR_SUCCESS;
    }
}
