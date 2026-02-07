package com.shopping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.dto.request.RegistrationRequest;
import com.shopping.dto.response.ApiResponse;
import com.shopping.dto.response.RegistrationResponse;
import com.shopping.service.UserRegistrationService;
import com.shopping.util.Constants;

import com.shopping.logging.LogEndpointRequest;

@RestController
@RequestMapping("/api/userRegistration")
public class UserRegistrationController {
    
    @Autowired
    private UserRegistrationService userRegistrationService;

    @LogEndpointRequest
    @PostMapping("/send-verification-code")
    public ResponseEntity<ApiResponse<String>> sendVerificationCode(@RequestBody String email) {
        userRegistrationService.sendVerificationCode(email);
        return ResponseEntity.ok(ApiResponse.success(Constants.MSG_CODE_SENT_SUCCESS));
    }

    @LogEndpointRequest
    @PostMapping
    public ResponseEntity<RegistrationResponse> registerUser(@RequestBody RegistrationRequest request) {
        RegistrationResponse response = userRegistrationService.registerUser(request);
        return ResponseEntity.ok(response);
    }
}
