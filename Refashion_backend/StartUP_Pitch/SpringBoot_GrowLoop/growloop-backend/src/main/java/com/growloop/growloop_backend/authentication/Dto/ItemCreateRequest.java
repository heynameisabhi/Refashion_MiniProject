package com.growloop.growloop_backend.authentication.Dto;
import com.growloop.growloop_backend.entity.Item;
import com.growloop.growloop_backend.enumHelpers.items.ItemGrade;
import com.growloop.growloop_backend.enumHelpers.items.ItemStatus;
import lombok.Data;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ItemCreateRequest {

    @NotBlank(message = "Item type is required")
    @Size(max = 100, message = "Item type must not exceed 100 characters")
    private String itemType;

    @Size(max = 500, message = "Condition description must not exceed 500 characters")
    private String conditionDescription;

    @Size(max = 20, message = "Gender must not exceed 20 characters")
    private String gender;

    @Size(max = 20, message = "Age group must not exceed 20 characters")
    private String ageGroup;

    // For direct recycling (bypasses bag system)
    private Boolean isDirectRecycle = false;
}