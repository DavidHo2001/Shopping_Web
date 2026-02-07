package com.shopping.controller;

import com.shopping.dto.LoginRequest;
import com.shopping.dto.LoginResponse;
import com.shopping.dto.response.UserResponse;
import com.shopping.service.AuthService;
import com.shopping.util.Constants;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LoginController {
    
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {
        LoginResponse loginResponse = authService.login(loginRequest, response);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        Map<String, Object> result = authService.validateToken(token);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(Constants.MSG_LOGOUT_SUCCESS);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me() {
        UserResponse user = authService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        
        return ResponseEntity.ok(Map.of(
            "userId", user.getUserId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "phone", user.getPhone() != null ? user.getPhone() : "",
            "firstName", user.getFirstName() != null ? user.getFirstName() : "",
            "lastName", user.getLastName() != null ? user.getLastName() : "",
            "role", user.getRole(),
            "authenticated", true
        ));
    }
}
