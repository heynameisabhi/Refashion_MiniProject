package com.growloop.growloop_backend.authentication.Dto;

import com.growloop.growloop_backend.entity.Item;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// ItemResponseDTO.java
@Data
public class ItemResponseDTO {
    private Long itemId;
    private Long bagId;
    private String bagName;
    private Long contributorId;
    private String contributorName;
    private String itemType;
    private String conditionDescription;
    private String gender;
    private String ageGroup;
    private String grade;
    private String gradeDisplayName;
    private String status;
    private String statusDisplayName;
    private BigDecimal loyaltyPoint;
    private LocalDateTime addedAt;
    private Boolean isGradeA;
    private Boolean isReadyForListing;

    public static ItemResponseDTO fromItem(Item item) {
        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setItemId(item.getItemId());
        dto.setBagId(item.getBag() != null ? item.getBag().getBagId() : null);
        dto.setBagName(item.getBag() != null ? item.getBag().getBagName() : null);
        dto.setContributorId(item.getContributor().getUserId());
        dto.setContributorName(item.getContributor().getUserName());
        dto.setItemType(item.getItemType());
        dto.setConditionDescription(item.getConditionDescription());
        dto.setGender(item.getGender());
        dto.setAgeGroup(item.getAgeGroup());
        dto.setGrade(item.getGrade().name());
        dto.setGradeDisplayName(item.getGrade().getDisplayName());
        dto.setStatus(item.getStatus().name());
        dto.setStatusDisplayName(item.getStatus().getDisplayName());
        dto.setLoyaltyPoint(item.getLoyaltyPoint());
        dto.setAddedAt(item.getAddedAt());
        dto.setIsGradeA(item.isGradeA());
        dto.setIsReadyForListing(item.isReadyForListing());
        return dto;
    }
}