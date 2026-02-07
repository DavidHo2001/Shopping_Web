package com.shopping.service;

import com.shopping.dto.request.UpdateProfileRequest;
import com.shopping.dto.response.ProfileResponse;
import com.shopping.model.UserProfile;
import com.shopping.model.UserRegistration;
import com.shopping.repository.UserProfileRepository;
import com.shopping.repository.UserRegistrationRepository;
import com.shopping.util.Constants;
import com.shopping.util.SecurityUtils;
import com.shopping.util.ValidationUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
@Service
@Slf4j
public class ProfileService {
    
    @Autowired
    private UserRegistrationRepository userRegistrationRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public ProfileResponse fetchProfile() {
        String email = SecurityUtils.getCurrentUserEmail();
        if (email == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        
        UserProfile profile = userProfileRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException(Constants.ERR_PROFILE_NOT_FOUND));
        
        LocalDate birth_date = profile.getBirth_date() == null ? null : profile.getBirth_date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        return new ProfileResponse(
            profile.getEmail(),
            birth_date,
            profile.getSex(),
            profile.getAddress(),
            profile.getCity(),
            profile.getZip(),
            profile.getCountry()
        );
    }

    @Transactional
    public String updateProfile(UpdateProfileRequest request, HttpServletResponse response) {
        String currentEmail = SecurityUtils.getCurrentUserEmail();
        if (currentEmail == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        
        if (!currentEmail.equals(request.getEmail())) {
            throw new IllegalArgumentException(Constants.ERR_UNAUTHORIZED_PROFILE_UPDATE);
        }
        
        UserRegistration user = userRegistrationRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException(Constants.ERR_USER_NOT_FOUND));
        
        UserProfile profile = userProfileRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException(Constants.ERR_PROFILE_NOT_FOUND));
        
        if (isPasswordChangeRequested(request)) {
            validatePasswordChange(request, user);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        if (request.getUsername() != null) user.setUsername(request.getUsername());
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getZip() != null) profile.setZip(request.getZip());
        if (request.getCountry() != null) profile.setCountry(request.getCountry());
        if (request.getBirth_date() != null) {
            Date birthDateAsDate = Date.from(request.getBirth_date().atStartOfDay(ZoneId.systemDefault()).toInstant());
            profile.setBirth_date(birthDateAsDate);
        }
        if (request.getSex() != null) profile.setSex(request.getSex());
        
        userProfileRepository.save(profile);
        userRegistrationRepository.save(user);
        
        Cookie cookie = new Cookie(Constants.AUTH_COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath(Constants.COOKIE_PATH);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        log.info("Profile updated successfully for user: {}", user.getEmail());
        
        return Constants.MSG_PROFILE_UPDATE_SUCCESS;
    }

    private boolean isPasswordChangeRequested(UpdateProfileRequest request) {
        return request.getOldPassword() != null && !request.getOldPassword().isEmpty() &&
               request.getPassword() != null && !request.getPassword().isEmpty() &&
               request.getConfirmPassword() != null && !request.getConfirmPassword().isEmpty();
    }

    private void validatePasswordChange(UpdateProfileRequest request, UserRegistration user) {
        ValidationUtils.validatePasswordMatch(request.getPassword(), request.getConfirmPassword());
        
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException(Constants.ERR_INCORRECT_OLD_PASSWORD);
        }
        
        ValidationUtils.validatePasswordStrength(request.getPassword(), Constants.PASSWORD_MIN_LENGTH_PROFILE);
    }
}
