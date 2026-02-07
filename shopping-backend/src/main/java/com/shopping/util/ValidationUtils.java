package com.shopping.util;

public class ValidationUtils {
    
    public static void validatePasswordMatch(String password, String confirmPassword) {
        if (password == null || confirmPassword == null) {
            throw new IllegalArgumentException("Password fields cannot be null");
        }
        if (!password.equals(confirmPassword)) {
            throw new IllegalArgumentException(Constants.ERR_PASSWORD_MISMATCH);
        }
    }
    
    public static void validatePasswordStrength(String password, int minLength) {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (password.length() < minLength) {
            throw new IllegalArgumentException("Password must be at least " + minLength + " characters");
        }
    }
    
    public static void validateNotEmpty(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " is required");
        }
    }
    
    public static String removeS3Prefix(String imageUrl) {
        if (imageUrl != null && imageUrl.startsWith(Constants.S3_IMAGE_PREFIX)) {
            return imageUrl.substring(Constants.S3_IMAGE_PREFIX.length());
        }
        return imageUrl;
    }
    
    private ValidationUtils() {
    }
}
