package com.growloop.growloop_backend.authentication.Dto;

import com.growloop.growloop_backend.entity.Bag;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

// BagResponseDTO.kt
@Data
public class BagResponseDTO {
    private Long bagId;
    private String bagName;
    private String sharableLink;
    private String shareableUrl;
    private String status;
    private String statusDisplayName;
    private LocalDateTime createdAt;
    private Integer totalItems;
    private Integer pointsAwarded;
    private Double deliveryCharge;
    private Boolean canAcceptItems;
    private Boolean eligibleForFreePickup;
    private Double pickupCost;
    private String pickupMessage;
    private String creatorName;
    private Long creatorId;
    private String purpose;
    private String purposeDisplayName;

    public static BagResponseDTO fromBag(Bag bag) {
        BagResponseDTO dto = new BagResponseDTO();
        dto.setBagId(bag.getBagId());
        dto.setBagName(bag.getBagName());
        dto.setSharableLink(bag.getSharableLink());
        dto.setShareableUrl(bag.getShareableUrl());
        dto.setStatus(bag.getStatus().name());
        dto.setStatusDisplayName(bag.getStatus().getDisplayName());
        dto.setCreatedAt(bag.getCreatedAt());
        dto.setTotalItems(bag.getTotalItems());
        dto.setPointsAwarded(bag.getPointsAwarded());
        dto.setDeliveryCharge(bag.getDeliveryCharge());
        dto.setCanAcceptItems(bag.canAddItems());
        dto.setEligibleForFreePickup(bag.isEligibleForFreePickup());
        dto.setPickupCost(bag.getPickupCost());
        dto.setPickupMessage(bag.getPickupEligibilityMessage());
        dto.setCreatorName(bag.getUser().getUserName());
        dto.setCreatorId(bag.getUser().getUserId());
        dto.setPurpose(bag.getPurpose().name());
        dto.setPurposeDisplayName(bag.getPurpose().getDisplayName());
        return dto;
    }
}