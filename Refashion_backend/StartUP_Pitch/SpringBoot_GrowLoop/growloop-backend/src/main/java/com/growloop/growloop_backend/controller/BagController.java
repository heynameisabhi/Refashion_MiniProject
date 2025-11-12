package com.growloop.growloop_backend.controller;

import com.growloop.growloop_backend.authentication.Dto.ApiResponse;
import com.growloop.growloop_backend.authentication.Dto.BagCreateRequest;
import com.growloop.growloop_backend.authentication.Dto.BagResponseDTO;
import com.growloop.growloop_backend.enumHelpers.BagPurpose;
import com.growloop.growloop_backend.service.BagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/bags")
@CrossOrigin(origins = "*")
public class BagController {

    @Autowired
    private BagService bagService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<BagResponseDTO>> createBag(
            @Valid @RequestBody BagCreateRequest request,
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            BagResponseDTO bag = bagService.createBag(firebaseUid, request);
            return ResponseEntity.ok(
                    ApiResponse.success(bag, "Bag created successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to create bag: " + e.getMessage())
            );
        }
    }

    // Get user's bags
    @GetMapping("/my-bags")
    public ResponseEntity<ApiResponse<List<BagResponseDTO>>> getUserBags(
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            List<BagResponseDTO> bags = bagService.getUserBags(firebaseUid);
            return ResponseEntity.ok(
                    ApiResponse.success(bags, "Bags retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to get bags: " + e.getMessage())
            );
        }
    }

    // Get bag by ID
    @GetMapping("/{bagId}")
    public ResponseEntity<ApiResponse<BagResponseDTO>> getBagById(
            @PathVariable Long bagId,
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            BagResponseDTO bag = bagService.getBagById(bagId, firebaseUid);
            return ResponseEntity.ok(
                    ApiResponse.success(bag, "Bag retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get bag by shareable token (public endpoint)
    @GetMapping("/share/{shareToken}")
    public ResponseEntity<ApiResponse<BagResponseDTO>> getBagByShareToken(
            @PathVariable String shareToken) {

        try {
            BagResponseDTO bag = bagService.getBagByShareToken(shareToken);
            return ResponseEntity.ok(
                    ApiResponse.success(bag, "Bag found successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Schedule pickup
    @PostMapping("/{bagId}/schedule-pickup")
    public ResponseEntity<ApiResponse<BagResponseDTO>> schedulePickup(
            @PathVariable Long bagId,
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            BagResponseDTO bag = bagService.schedulePickup(bagId, firebaseUid);
            return ResponseEntity.ok(
                    ApiResponse.success(bag, "Pickup scheduled successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to schedule pickup: " + e.getMessage())
            );
        }
    }

    @GetMapping("/my-bags/{purpose}")
    public ResponseEntity<ApiResponse<List<BagResponseDTO>>> getUserBagsByPurpose(
            @PathVariable String purpose,
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            BagPurpose bagPurpose = BagPurpose.valueOf(purpose.toUpperCase());
            List<BagResponseDTO> bags = bagService.getUserBagsByPurpose(firebaseUid, bagPurpose);
            return ResponseEntity.ok(
                    ApiResponse.success(bags, "Bags retrieved successfully")
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Invalid bag purpose: " + purpose)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to get bags: " + e.getMessage())
            );
        }
    }
}

