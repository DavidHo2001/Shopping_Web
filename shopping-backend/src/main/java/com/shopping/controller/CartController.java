package com.shopping.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.dto.request.CartSyncRequest;
import com.shopping.dto.response.ApiResponse;
import com.shopping.dto.response.CartItemResponse;
import com.shopping.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    
    @Autowired
    private CartService cartService;

    @PostMapping("/syncCart/{userId}")
    public ResponseEntity<ApiResponse<String>> syncCart(
            @PathVariable Long userId,
            @RequestBody CartSyncRequest request) {
        String message = cartService.syncCart(userId, request);
        return ResponseEntity.ok(ApiResponse.success(message));
    }

    @GetMapping("/fetchCartItems/{userId}")
    public ResponseEntity<String> fetchCartItems(@PathVariable Long userId) {
        String cartItems = cartService.fetchCartItems(userId);
        return ResponseEntity.ok(cartItems);
    }

    @GetMapping("/fetchFinalCartItems/{userId}")
    public ResponseEntity<List<CartItemResponse>> fetchFinalCartItems(@PathVariable Long userId) {
        List<CartItemResponse> cartItems = cartService.fetchFinalCartItems(userId);
        return ResponseEntity.ok(cartItems);
    }

    @DeleteMapping("/clearCart/{userId}")
    public ResponseEntity<ApiResponse<String>> clearCart(@PathVariable Long userId) {
        String message = cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success(message));
    }
}
