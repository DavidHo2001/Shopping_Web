package com.shopping.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.shopping.repository.UserRegistrationRepository;
import com.shopping.constant.UserRole;
import com.shopping.model.UserRegistration;
import com.shopping.dto.response.UserRoleResponse;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserRoleService {

    @Autowired
    private UserRegistrationRepository userRegistrationRepository;

    public Boolean updateUserRole(Long userId, Integer role, Boolean isBlocked) {
        UserRegistration userRegistration = userRegistrationRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Check if there are any changes
        if (userRegistration.getRole().equals(role) && userRegistration.getIsBlocked().equals(isBlocked)) {
            throw new IllegalArgumentException("No changes detected");
        }
        
        userRegistration.setRole(role);
        userRegistration.setIsBlocked(isBlocked);
        UserRegistration savedUserRegistration = userRegistrationRepository.saveAndFlush(userRegistration);
        
        if (savedUserRegistration.getRole().equals(role) && savedUserRegistration.getIsBlocked().equals(isBlocked)) {
            return true;
        }
        throw new IllegalArgumentException("User role/status update failed");
    }

    public List<UserRoleResponse> getUserRoleList() {
        List<UserRegistration> userRegistrations = userRegistrationRepository.findAll();
        return userRegistrations.stream()
            .map(userRegistration -> new UserRoleResponse(
                userRegistration.getId(), userRegistration.getUsername(), UserRole.fromValue(userRegistration.getRole()).getName(), 
                userRegistration.getRole(), userRegistration.getIsBlocked()))
            .collect(Collectors.toList());
    }
}
