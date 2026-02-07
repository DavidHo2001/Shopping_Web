package com.shopping.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateProfileRequest {

    private String email;

    private String username;

    private String firstName;

    private String lastName;

    private String phone;

    private LocalDate birth_date;

    private String sex;

    private String address;

    private String city;

    private String zip;

    private String country;

    private String oldPassword;

    private String password;

    private String confirmPassword;
}
