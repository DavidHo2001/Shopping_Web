package com.shopping.util;

public class Constants {
    // Validation
    public static final int USERNAME_MIN_LENGTH = 3;
    public static final int USERNAME_MAX_LENGTH = 50;
    public static final int PASSWORD_MIN_LENGTH = 6;
    public static final int PASSWORD_MIN_LENGTH_PROFILE = 8;
    public static final int VERIFICATION_CODE_LENGTH = 4;
    
    // Image Upload
    public static final String S3_IMAGE_PREFIX = "https://shopping-web-bucket.s3.ap-southeast-2.amazonaws.com";
    
    // Product Categories
    public static final String CATEGORY_MEN = "Men";
    public static final String CATEGORY_WOMEN = "Women";
    public static final String CATEGORY_NEUTRAL = "Neutral";
    public static final String CATEGORY_ACCESSORIES = "Accessories";
    
    // Cookie
    public static final String AUTH_COOKIE_NAME = "authToken";
    public static final String COOKIE_PATH = "/";
    
    // Messages
    public static final String MSG_LOGIN_SUCCESS = "Login successful";
    public static final String MSG_LOGOUT_SUCCESS = "Logged out";
    public static final String MSG_REGISTRATION_SUCCESS = "User registered successfully";
    public static final String MSG_PROFILE_UPDATE_SUCCESS = "Profile updated successfully. Please login again";
    public static final String MSG_PRODUCT_UPLOAD_SUCCESS = "Product uploaded successfully";
    public static final String MSG_PRODUCT_UPDATE_SUCCESS = "Product updated successfully";
    public static final String MSG_PRODUCT_DELETE_SUCCESS = "Product deleted successfully";
    public static final String MSG_CART_SYNC_SUCCESS = "Cart synced successfully";
    public static final String MSG_CART_CLEAR_SUCCESS = "Cart cleared successfully";
    public static final String MSG_CODE_SENT_SUCCESS = "Verification code sent successfully";
    
    // Error Messages
    public static final String ERR_INVALID_EMAIL_PASSWORD = "Invalid email or password";
    public static final String ERR_EMAIL_NOT_VERIFIED = "Please verify your email address before logging in";
    public static final String ERR_EMAIL_EXISTS = "Email already exists";
    public static final String ERR_INVALID_VERIFICATION_CODE = "Invalid or expired verification code";
    public static final String ERR_PASSWORD_MISMATCH = "Password and confirm password do not match";
    public static final String ERR_INCORRECT_OLD_PASSWORD = "Old password is incorrect";
    public static final String ERR_UNAUTHORIZED_PROFILE_UPDATE = "Cannot update profile for different user";
    public static final String ERR_USER_NOT_FOUND = "User not found";
    public static final String ERR_PROFILE_NOT_FOUND = "Profile not found";
    public static final String ERR_PRODUCT_NOT_FOUND = "Product not found";
    public static final String ERR_CART_NOT_FOUND = "Cart not found";
    public static final String ERR_NO_PRODUCTS = "No product data";
    public static final String ERR_USER_BLOCKED = "User is blocked, please contact support";
    
    private Constants() {
    }
}
