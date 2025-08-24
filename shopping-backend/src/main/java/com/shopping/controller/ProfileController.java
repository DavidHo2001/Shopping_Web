package com.shopping.controller;

import com.shopping.model.UserRegistration;
import com.shopping.dto.EditProfile;
import com.shopping.model.UserProfile;
import com.shopping.repository.UserRegistrationRepository;
import com.shopping.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//Security context is set by JwtAuthenticationFilter, extracted from JWT token
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    @Autowired
    private UserRegistrationRepository userRegistrationRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/fetchProfile")
    public ResponseEntity<Object> fetchProfile() {
        // Get email from security context (JWT token)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userString = authentication.getName();
        String email = userString.replaceAll(".*email=([^,}]+).*", "$1");
        Optional<UserProfile> profileOptional = userProfileRepository.findByEmail(email);
        System.out.println("Email: " + email);
        if (profileOptional.isPresent()){
            UserProfile profile = profileOptional.get();
            
            return ResponseEntity.ok(profile);
        }else {return ResponseEntity.badRequest().body(Map.of("message", "Profile not found. Email: " + email));}
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateProfile(@RequestBody EditProfile editProfile, HttpServletResponse response) {
            // Get email from security context (JWT token)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userString = authentication.getName();
            String email = userString.replaceAll(".*email=([^,}]+).*", "$1");
            // Verify the email in the request matches the authenticated user
        if (!email.equals(editProfile.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Cannot update profile for different user"));
        }
        Optional<UserProfile> profileOptional = userProfileRepository.findByEmail(email);
        UserProfile profile;
        if (profileOptional.isPresent()){
            profile = profileOptional.get();
        }else {return ResponseEntity.badRequest().body(Map.of("message", "Profile not found"));}
        Optional<UserRegistration> userOptional = userRegistrationRepository.findByEmail(editProfile.getEmail());
        UserRegistration user;
        if (userOptional.isPresent()){
            user = userOptional.get();
        }else {return ResponseEntity.badRequest().body(Map.of("message", "User not found"));}
        // Update the filled fields

        //Important!!! Password update check many things
        //Some checking is done in the frontend, this just prevent evil manual POST request
        //First handle the user_registration table
        if (editProfile.getOldPassword() != null && !editProfile.getOldPassword().isEmpty()
        && editProfile.getPassword() != null && !editProfile.getPassword().isEmpty() &&
        editProfile.getConfirmPassword() != null && !editProfile.getConfirmPassword().isEmpty()){
            //Check if new password and confirm password are the same
            if (editProfile.getPassword().equals(editProfile.getConfirmPassword())){
                //check if the old password is correct
                if (passwordEncoder.matches(editProfile.getOldPassword(), user.getPassword())) {
                    String newPassword = passwordEncoder.encode(editProfile.getPassword());
                    user.setPassword(newPassword);
                } else {return ResponseEntity.badRequest().body(Map.of("message", "Password is incorrect"));}
            } else {return ResponseEntity.badRequest().body(Map.of("message", "Password and confirm password do not match"));}
        }
        //Email is not editable
        if (editProfile.getUsername() != null) user.setUsername(editProfile.getUsername());
        if (editProfile.getFirstName() != null) user.setFirstName(editProfile.getFirstName());
        if (editProfile.getLastName() != null) user.setLastName(editProfile.getLastName());
        if (editProfile.getPhone() != null) user.setPhone(editProfile.getPhone());
        //Profile table update
        if (editProfile.getAddress() != null) profile.setAddress(editProfile.getAddress());
        if (editProfile.getCity() != null) profile.setCity(editProfile.getCity());
        if (editProfile.getZip() != null) profile.setZip(editProfile.getZip());
        if (editProfile.getCountry() != null) profile.setCountry(editProfile.getCountry());
        if (editProfile.getBirth_date() != null) profile.setBirth_date(editProfile.getBirth_date());
        if (editProfile.getSex() != null) profile.setSex(editProfile.getSex());
                
        userProfileRepository.save(profile);
        userRegistrationRepository.save(user);
        Cookie cookie = new Cookie("authToken", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expire immediately
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of(
            "message", "Profile updated successfully. Please login again"
        ));

    }
}