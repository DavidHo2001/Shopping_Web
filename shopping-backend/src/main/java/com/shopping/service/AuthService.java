package com.shopping.service;

import com.shopping.dto.LoginRequest;
import com.shopping.dto.LoginResponse;
import com.shopping.dto.response.UserResponse;
import com.shopping.model.UserRegistration;
import com.shopping.repository.UserRegistrationRepository;
import com.shopping.util.Constants;
import com.shopping.util.SecurityUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class AuthService {
    
    @Autowired
    private UserRegistrationRepository userRegistrationRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    @Value("${jwt.expiration}")
    private int jwtExpiration;

    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        UserRegistration user = userRegistrationRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new IllegalStateException(Constants.ERR_INVALID_EMAIL_PASSWORD));
        if (user.getIsBlocked()) {
            throw new IllegalStateException(Constants.ERR_USER_BLOCKED);
        }
        if (!user.isVerificationStatus()) {
            throw new IllegalStateException(Constants.ERR_EMAIL_NOT_VERIFIED);
        }
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalStateException(Constants.ERR_INVALID_EMAIL_PASSWORD);
        }
        
        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole());
        
        int cookieMaxAge = loginRequest.keepLoggedIn ? (jwtExpiration / 1000) : -1;
        Cookie cookie = new Cookie(Constants.AUTH_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath(Constants.COOKIE_PATH);
        cookie.setMaxAge(cookieMaxAge);
        response.addCookie(cookie);
        log.info("User logged in successfully: {}", user.getEmail());
        
        return new LoginResponse(
            user.getEmail(),
            user.getId(),
            user.getUsername(),
            user.getRole(),
            Constants.MSG_LOGIN_SUCCESS
        );
    }

    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie(Constants.AUTH_COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath(Constants.COOKIE_PATH);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        log.info("User logged out");
    }

    public Map<String, Object> validateToken(String token) {
        String email = jwtService.extractEmail(token);
        
        if (!jwtService.validateToken(token, email)) {
            throw new IllegalStateException("Token is invalid or expired");
        }
        
        return Map.of("message", "Token is valid", "email", email);
    }

    public UserResponse getCurrentUser() {
        if (!SecurityUtils.isAuthenticated()) {
            return null;
        }
        
        Map<String, Object> userDetails = SecurityUtils.getCurrentUserDetails();
        if (userDetails == null) {
            return null;
        }
        
        String email = (String) userDetails.get("email");
        UserRegistration user = userRegistrationRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException(Constants.ERR_USER_NOT_FOUND));
        
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getPhone(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole()
        );
    }
}
