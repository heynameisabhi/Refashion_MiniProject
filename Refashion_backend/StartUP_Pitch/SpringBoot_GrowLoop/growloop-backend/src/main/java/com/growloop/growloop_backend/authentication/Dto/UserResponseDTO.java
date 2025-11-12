package com.growloop.growloop_backend.authentication.Dto;

import com.growloop.growloop_backend.entity.User;
import lombok.Data;

@Data
public class UserResponseDTO {
    private Long userId;
    private String firebaseUid;
    private String userName;
    private String email;
    private String phoneNumber;
    private String addressText;
    private Integer loyaltyPoint;
    private Boolean isPremium;
    private Boolean isVerified;
    private String createdAt;
    private String updatedAt;

    public static UserResponseDTO fromUser(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setFirebaseUid(user.getFirebaseUid());
        dto.setUserName(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddressText(user.getAddressText());
        dto.setLoyaltyPoint(user.getLoyaltyPoint());
        dto.setIsPremium(user.getIsPremium());
        dto.setIsVerified(user.getIsVerified());
        dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        dto.setUpdatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null);
        return dto;
    }
}