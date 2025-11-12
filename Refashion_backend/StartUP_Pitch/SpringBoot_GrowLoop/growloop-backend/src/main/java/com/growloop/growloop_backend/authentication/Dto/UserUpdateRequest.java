package com.growloop.growloop_backend.authentication.Dto;
import lombok.Data;

@Data
public class UserUpdateRequest {
    private String userName;
    private String phoneNumber;
    private String addressText;
    private Double latitude;
    private Double longitude;
}