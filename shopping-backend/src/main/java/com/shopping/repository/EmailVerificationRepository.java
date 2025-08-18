package com.shopping.repository;

import com.shopping.model.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    
    Optional<EmailVerification> findByEmailAndVerificationCode(String email, String verificationCode);
    
    void deleteByEmail(String email);
    
    boolean existsByEmail(String email);
} 