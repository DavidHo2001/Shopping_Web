package com.shopping.controller;

//DTO
import com.shopping.dto.LoginRequest;
import com.shopping.dto.LoginResponse;

import com.shopping.model.UserRegistration;
import com.shopping.repository.UserRegistrationRepository;
import com.shopping.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;

//Security context is set by JwtAuthenticationFilter, extracted from JWT token
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for handling user authentication
 * Provides endpoints for user login and token-based authentication
 */
@RestController
@RequestMapping("/api/auth") //All the endpoints in this controller start with /api/auth
public class LoginController {

    @Autowired
    private UserRegistrationRepository userRegistrationRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;

    @Value("${jwt.expiration}")
    private int jwtExpiration;

    /**
     * Handle user login requests
     * 
     * @param loginRequest Contains email and password from frontend
     * @return JWT token and user info if successful, error message if failed
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            // Step 1: Find user by email
            Optional<UserRegistration> userOptional = userRegistrationRepository.findByEmail(loginRequest.getEmail());
            
            if (userOptional.isEmpty()) {
                // User not found
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }
            
            UserRegistration user = userOptional.get();
            
            // Step 2: Check if user's email is verified
            if (!user.isVerificationStatus()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Please verify your email address before logging in"));
            }
            
            // Step 3: Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                // Password doesn't match
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }
            
            // Step 4: Generate JWT token
            String token = jwtService.generateToken(user.getEmail(), user.getId());
            System.out.println("login request: " + loginRequest.keepLoggedIn);
            // If users ticked KeepLoggedIn = use full expiration time, else session cookie
            int cookieMaxAge = loginRequest.keepLoggedIn ? (jwtExpiration / 1000) : -1; // Convert to seconds or session
            System.out.println("cookieMaxAge: " + cookieMaxAge);
            // Step 5: Create HTTP-only cookie with JWT token
            Cookie cookie = new Cookie("authToken", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // false for localhost testing, set true for production HTTPS
            cookie.setPath("/"); 
            cookie.setMaxAge(cookieMaxAge);
            response.addCookie(cookie); //Add cookie to HTTP response header
            
            // Step 6: Create response with user info (no token in body for security)
            LoginResponse loginResponse = new LoginResponse(
                user.getEmail(),
                user.getId(),
                user.getUsername(),
                "Login successful"
            );
            
            return ResponseEntity.ok(loginResponse); //response body is the loginResponse object
            
        } catch (Exception e) {
            // Handle any unexpected errors
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "auth occurred during login. Please try again."));
        }
    }
    
    /**
     * Optional: Endpoint to validate if a token is still valid
     * This can be used by your frontend to check if user is still logged in
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            
            //no token provided
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Token is required"));
            }
            
            // Extract email from token
            String email = jwtService.extractEmail(token);
            
            // Validate token
            if (jwtService.validateToken(token, email)) {
                return ResponseEntity.ok(Map.of("message", "Token is valid", "email", email));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Token is invalid or expired"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Token is invalid"));
        }
    }

    //Erase cookie when user logs out
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("authToken", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expire immediately
        response.addCookie(cookie);
        return ResponseEntity.ok("Logged out");
    }
    /**
     * Test endpoint to verify JWT authentication is working
     * Uses SecurityContext populated by JwtAuthenticationFilter
     * Returns user information if authenticated
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(){
        try {
            //Direct SecurityContext access(set by JwtAuthenticationFilter)
            //The security context has cookie(token)
            //When user receives the response, the cookie is automatically stored in the browser

            //I tried to log the getAuthentication(), it is as below when not logged in.
            //Authentication: AnonymousAuthenticationToken
            // [Principal=anonymousUser, Credentials=[PROTECTED], Authenticated=true,
            // Details=WebAuthenticationDetails [RemoteIpAddress=0:0:0:0:0:0:0:1, SessionId=null],
            // Granted Authorities=[ROLE_ANONYMOUS]]

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            // Check if user is authenticated
            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == "anonymousUser") {
                //return false if user is not authenticated(not to return 401 error)
                return ResponseEntity.ok(Map.of("authenticated", false));
            }
            
            // Get user info(dictionary) from principal (set by your JWT filter)
            Map<String, Object> user = (Map<String, Object>) authentication.getPrincipal();
            System.out.println("user: " + user);
            return ResponseEntity.ok(user);
            
        } catch (Exception e) {
            System.err.println("Authentication error: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Token validation failed: " + e.getMessage(), "authenticated", false));
        }
    }
}