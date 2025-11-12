package com.growloop.growloop_backend.authentication.Dto;

import com.growloop.growloop_backend.enumHelpers.BagPurpose;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BagCreateRequest {
    @NotBlank(message = "Bag name is required")
    @Size(min = 2, max = 100, message = "Bag name must be between 2 and 100 characters")
    private String bagName;

    @NotNull(message = "Bag purpose is required")
    private BagPurpose purpose;
}