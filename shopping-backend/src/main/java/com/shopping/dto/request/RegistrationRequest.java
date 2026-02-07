package com.shopping.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegistrationRequest {
    private String username;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String password;

    private String verificationCode;
}
