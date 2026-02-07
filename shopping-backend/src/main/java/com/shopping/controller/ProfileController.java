package com.shopping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.dto.request.UpdateProfileRequest;
import com.shopping.dto.response.ApiResponse;
import com.shopping.dto.response.ProfileResponse;
import com.shopping.service.ProfileService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;

    @GetMapping("/fetchProfile")
    public ResponseEntity<ProfileResponse> fetchProfile() {
        ProfileResponse profile = profileService.fetchProfile();
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<String>> updateProfile(
            @RequestBody UpdateProfileRequest request,
            HttpServletResponse response) {
        String message = profileService.updateProfile(request, response);
        return ResponseEntity.ok(ApiResponse.success(message));
    }
}
