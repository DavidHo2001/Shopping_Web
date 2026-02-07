package com.shopping.service;

import com.shopping.dto.request.RegistrationRequest;
import com.shopping.dto.response.RegistrationResponse;
import com.shopping.model.Cart;
import com.shopping.model.UserProfile;
import com.shopping.model.UserRegistration;
import com.shopping.repository.CartRepository;
import com.shopping.repository.UserProfileRepository;
import com.shopping.repository.UserRegistrationRepository;
import com.shopping.util.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class UserRegistrationService {
    
    @Autowired
    private UserRegistrationRepository userRegistrationRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private EmailVerificationService emailVerificationService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public void sendVerificationCode(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (userRegistrationRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(Constants.ERR_EMAIL_EXISTS);
        }
        
        emailVerificationService.sendVerificationCode(email);
    }

    @Transactional
    public RegistrationResponse registerUser(RegistrationRequest request) {
        if (userRegistrationRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(Constants.ERR_EMAIL_EXISTS);
        }
        
        boolean isCodeValid = emailVerificationService.verifyCode(
            request.getEmail(), 
            request.getVerificationCode()
        );
        
        if (!isCodeValid) {
            throw new IllegalArgumentException(Constants.ERR_INVALID_VERIFICATION_CODE);
        }
        
        UserRegistration userRegistration = new UserRegistration();
        userRegistration.setUsername(request.getUsername());
        userRegistration.setFirstName(request.getFirstName());
        userRegistration.setLastName(request.getLastName());
        userRegistration.setEmail(request.getEmail());
        userRegistration.setPhone(request.getPhone());
        userRegistration.setPassword(passwordEncoder.encode(request.getPassword()));
        userRegistration.setVerificationStatus(true);
        userRegistration.setRole(1);
        
        UserRegistration savedUser = userRegistrationRepository.save(userRegistration);
        
        UserProfile userProfile = new UserProfile();
        userProfile.setEmail(savedUser.getEmail());
        userProfileRepository.save(userProfile);
        
        Cart cart = new Cart();
        cart.setUserId(savedUser.getId());
        cart.setProductList("");
        cartRepository.save(cart);
        
        log.info("User registered successfully: {} - {}", savedUser.getUsername(), savedUser.getEmail());
        
        return new RegistrationResponse(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            savedUser.getEmail(),
            savedUser.getPhone() != null ? savedUser.getPhone() : "",
            savedUser.isVerificationStatus(),
            savedUser.getRole(),
            Constants.MSG_REGISTRATION_SUCCESS
        );
    }
}
