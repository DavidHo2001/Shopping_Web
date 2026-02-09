package com.shopping.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Transient;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_registration")
public class UserRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "verification_status", nullable = false)
    private boolean verificationStatus = false;

    @Column(nullable = false)
    private Integer role = 1; // Default role: 1=Customer, 2=Admin, 3=SuperAdmin

    @Column(name = "is_blocked", nullable = false)
    private Boolean isBlocked = false;

    @Transient
    private String confirmPassword; // Not persisted
    
    @Transient
    private String verificationCode; // Not persisted
}