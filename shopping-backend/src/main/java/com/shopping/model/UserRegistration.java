package com.shopping.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Transient;

@Entity
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

    @Transient
    private String confirmPassword; // Not persisted
    
    @Transient
    private String verificationCode; // Not persisted

    //Getters and Setters
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}
    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}
    public String getFirstName() {return firstName;}
    public void setFirstName(String firstName) {this.firstName = firstName;}
    public String getLastName() {return lastName;}
    public void setLastName(String lastName) {this.lastName = lastName;}
    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}    
    public String getPhone() {return phone;}
    public void setPhone(String phone) {this.phone = phone;}
    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}
    public boolean isVerificationStatus() {return verificationStatus;}
    public void setVerificationStatus(boolean verificationStatus) {this.verificationStatus = verificationStatus;}
    public String getConfirmPassword() {return confirmPassword;}
    public void setConfirmPassword(String confirmPassword) {this.confirmPassword = confirmPassword;}
    public String getVerificationCode() {return verificationCode;}
    public void setVerificationCode(String verificationCode) {this.verificationCode = verificationCode;}
}