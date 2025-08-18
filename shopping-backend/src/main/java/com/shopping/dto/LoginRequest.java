package com.shopping.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO for login request data
 * Represents the JSON data sent from frontend during login
 */
public class LoginRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;

    public boolean keepLoggedIn;
    // Default constructor (required for JSON deserialization)
    public LoginRequest() {}

    // Constructor with parameters
    public LoginRequest(String email, String password, boolean keepLoggedIn) {
        this.email = email;
        this.password = password;
        this.keepLoggedIn = keepLoggedIn;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}