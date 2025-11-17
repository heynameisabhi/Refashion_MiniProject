package com.growloop.growloop_backend.controller;

import com.growloop.growloop_backend.authentication.Dto.ApiResponse;
import com.growloop.growloop_backend.authentication.Dto.RecyclerResponseDTO;
import com.growloop.growloop_backend.entity.Recycler;
import com.growloop.growloop_backend.repository.RecyclerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recyclers")
@CrossOrigin(origins = "*")
public class RecyclerController {

    @Autowired
    private RecyclerRepository recyclerRepository;

    // Get all recyclers
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<RecyclerResponseDTO>>> getAllRecyclers() {
        try {
            List<Recycler> recyclers = recyclerRepository.findAll();
            List<RecyclerResponseDTO> response = recyclers.stream()
                    .map(RecyclerResponseDTO::fromRecycler)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(
                    ApiResponse.success(response, "Recyclers retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to retrieve recyclers: " + e.getMessage())
            );
        }
    }

    // Get nearby recyclers
    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<RecyclerResponseDTO>>> getNearbyRecyclers(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10") Double radiusKm) {
        
        try {
            List<Recycler> recyclers = recyclerRepository.findNearbyRecyclers(
                    latitude, longitude, radiusKm
            );
            
            List<RecyclerResponseDTO> response = recyclers.stream()
                    .map(recycler -> {
                        RecyclerResponseDTO dto = RecyclerResponseDTO.fromRecycler(recycler);
                        // Calculate distance
                        double distance = calculateDistance(
                                latitude, longitude,
                                recycler.getLatitude(), recycler.getLongitude()
                        );
                        dto.setDistance(Math.round(distance * 100.0) / 100.0);
                        return dto;
                    })
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(
                    ApiResponse.success(response, "Nearby recyclers retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to retrieve nearby recyclers: " + e.getMessage())
            );
        }
    }

    // Get verified recyclers only
    @GetMapping("/verified")
    public ResponseEntity<ApiResponse<List<RecyclerResponseDTO>>> getVerifiedRecyclers() {
        try {
            List<Recycler> recyclers = recyclerRepository.findByIsVerifiedTrue();
            List<RecyclerResponseDTO> response = recyclers.stream()
                    .map(RecyclerResponseDTO::fromRecycler)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(
                    ApiResponse.success(response, "Verified recyclers retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to retrieve verified recyclers: " + e.getMessage())
            );
        }
    }

    // Helper method to calculate distance using Haversine formula
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
}
