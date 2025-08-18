package com.shopping.controller;

import com.shopping.model.UserRegistration;
import com.shopping.repository.UserRegistrationRepository;
import com.shopping.service.EmailVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/userRegistration")
public class UserRegistrationController {
    @Autowired
    private UserRegistrationRepository userRegistrationRepository;
    
    @Autowired
    private EmailVerificationService emailVerificationService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/send-verification-code")
    public ResponseEntity<Map<String, String>> sendVerificationCode(@RequestBody Map<String, String> request) {
        try {
            //Check if email already exists
            boolean isEmailExists = userRegistrationRepository.existsByEmail(request.get("email"));
            if (isEmailExists) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
            }
            
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            
            emailVerificationService.sendVerificationCode(email);
            return ResponseEntity.ok(Map.of("message", "Verification code sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to send verification code"));
        }
    }

    //path: /api/userRegistration
    @PostMapping
    public ResponseEntity<Object> registerUser(@RequestBody UserRegistration userRegistration) {
        try {
            boolean isEmailExists = userRegistrationRepository.existsByEmail(userRegistration.getEmail());
            //Check if email already exists
            if (isEmailExists) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
            }
            // Verify email code first
            boolean isCodeValid = emailVerificationService.verifyCode(
                    userRegistration.getEmail(), 
                    userRegistration.getVerificationCode()
            );
            
            if (!isCodeValid) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired verification code"));
            }
            
            // Validate password before hashing
            if (userRegistration.getPassword() == null || userRegistration.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
            }
            
            // Set email as verified
            userRegistration.setVerificationStatus(true);
            
            // Hash the password before saving
            String hashedPassword = passwordEncoder.encode(userRegistration.getPassword());
            userRegistration.setPassword(hashedPassword);
            
            // Save user registration
            UserRegistration savedUser = userRegistrationRepository.save(userRegistration);
            
            // Create a dictionary to return the user registration data(key is string and value is object)
            Map<String, Object> response = Map.of(
                "id", savedUser.getId(),
                "username", savedUser.getUsername(),
                "firstName", savedUser.getFirstName(),
                "lastName", savedUser.getLastName(),
                "email", savedUser.getEmail(),
                "phone", savedUser.getPhone() != null ? savedUser.getPhone() : "",
                "verificationStatus", savedUser.isVerificationStatus(),
                "message", "User registered successfully"
            );
            
            System.out.println("User Registration: " + savedUser.getUsername() + " - " + savedUser.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Registration failed"));
        }
    }
}