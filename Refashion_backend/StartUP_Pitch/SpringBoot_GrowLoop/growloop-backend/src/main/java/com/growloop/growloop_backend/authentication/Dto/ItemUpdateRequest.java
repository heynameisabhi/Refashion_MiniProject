package com.growloop.growloop_backend.authentication.Dto;
import com.growloop.growloop_backend.enumHelpers.items.ItemGrade;
import com.growloop.growloop_backend.enumHelpers.items.ItemStatus;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemUpdateRequest {
    private ItemGrade grade;
    private ItemStatus status;
    private BigDecimal loyaltyPoint;
    private String qcNotes;
}