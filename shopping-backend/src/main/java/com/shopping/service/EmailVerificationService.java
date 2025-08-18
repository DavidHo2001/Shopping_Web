package com.shopping.service;

import com.shopping.model.EmailVerification;
import com.shopping.repository.EmailVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
public class EmailVerificationService {
    
    @Autowired
    private EmailVerificationRepository emailVerificationRepository;
    
    @Autowired
    private JavaMailSender mailSender;
    
    /**
     * Generates a 4-digit verification code
     */
    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%04d", random.nextInt(10000));
    }
    
    /**
     * Sends verification code to the specified email
     */
    @Transactional
    public void sendVerificationCode(String email) {
        // Delete any existing verification codes for this email
        emailVerificationRepository.deleteByEmail(email);
        
        // Generate new verification code
        String verificationCode = generateVerificationCode();
        
        // Save verification code to database
        EmailVerification emailVerification = new EmailVerification(email, verificationCode);
        emailVerificationRepository.save(emailVerification);
        
        // Send email
        sendEmail(email, verificationCode);
    }
    
    /**
     * Verifies the email and code combination
     */
    @Transactional
    public boolean verifyCode(String email, String code) {
        Optional<EmailVerification> verification = emailVerificationRepository.findByEmailAndVerificationCode(email, code);
        
        if (verification.isPresent()) {
            EmailVerification emailVerification = verification.get();
            
            // Check if code is expired
            if (emailVerification.isExpired()) {
                // Delete expired verification
                emailVerificationRepository.deleteByEmail(email);
                return false;
            }
            
            // Code is valid, delete it to prevent reuse
            emailVerificationRepository.deleteByEmail(email);
            return true;
        }
        
        // Code doesn't match, delete all codes for this email (brute force protection)
        emailVerificationRepository.deleteByEmail(email);
        return false;
    }
    
    /**
     * Sends the verification email
     */
    private void sendEmail(String toEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Email Verification Code - Glasy");
        message.setText("Your verification code is: " + verificationCode + "\n\n" +
                       "This code will expire in 10 minutes.\n" +
                       "If you didn't request this code, please ignore this email.\n\n" +
                       "Best regards,\n" +
                       "Glasy Team");
        
        mailSender.send(message);
    }
} 