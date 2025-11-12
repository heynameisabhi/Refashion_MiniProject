package com.growloop.growloop_backend.authentication.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegistrationRequest {

    @NotBlank(message = "Name is Required")
    private String UserName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    // Optional fields for later updates
    private String phoneNumber;
    private String addressText;
    private Double latitude;
    private Double longitude;

}