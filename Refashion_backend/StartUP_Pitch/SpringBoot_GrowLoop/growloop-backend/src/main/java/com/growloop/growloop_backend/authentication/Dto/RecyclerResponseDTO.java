package com.growloop.growloop_backend.authentication.Dto;

import com.growloop.growloop_backend.entity.Recycler;
import lombok.Data;

import java.util.Arrays;
import java.util.List;

@Data
public class RecyclerResponseDTO {
    private Long recyclerId;
    private String name;
    private String address;
    private String phoneNumber;
    private String email;
    private Double latitude;
    private Double longitude;
    private Double rating;
    private List<String> acceptedItems;
    private String openHours;
    private Boolean isVerified;
    private String description;
    private Double distance; // Distance from user in km

    public static RecyclerResponseDTO fromRecycler(Recycler recycler) {
        RecyclerResponseDTO dto = new RecyclerResponseDTO();
        dto.setRecyclerId(recycler.getRecyclerId());
        dto.setName(recycler.getName());
        dto.setAddress(recycler.getAddress());
        dto.setPhoneNumber(recycler.getPhoneNumber());
        dto.setEmail(recycler.getEmail());
        dto.setLatitude(recycler.getLatitude());
        dto.setLongitude(recycler.getLongitude());
        dto.setRating(recycler.getRating());
        dto.setOpenHours(recycler.getOpenHours());
        dto.setIsVerified(recycler.getIsVerified());
        dto.setDescription(recycler.getDescription());
        
        // Parse comma-separated accepted items
        if (recycler.getAcceptedItems() != null && !recycler.getAcceptedItems().isEmpty()) {
            dto.setAcceptedItems(Arrays.asList(recycler.getAcceptedItems().split(",")));
        }
        
        return dto;
    }
}
