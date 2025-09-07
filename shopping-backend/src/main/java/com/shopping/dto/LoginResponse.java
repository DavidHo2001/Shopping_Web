package com.shopping.dto;

/**
 * DTO for login response data
 * Represents the JSON data sent back to frontend after successful login
 */
public class LoginResponse {
    private String email;
    private Long userId;
    private String username;
    private String message;
    private Integer role;

    // Default constructor
    public LoginResponse() {}

    // Constructor with parameters
    public LoginResponse(String email, Long userId, String username, Integer role, String message) {
        this.email = email;
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }
}