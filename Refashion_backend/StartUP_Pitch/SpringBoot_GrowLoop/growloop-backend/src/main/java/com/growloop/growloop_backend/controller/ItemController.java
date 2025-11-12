package com.growloop.growloop_backend.controller;

import com.growloop.growloop_backend.authentication.Dto.ApiResponse;
import com.growloop.growloop_backend.authentication.Dto.ItemCreateRequest;
import com.growloop.growloop_backend.authentication.Dto.ItemResponseDTO;
import com.growloop.growloop_backend.authentication.Dto.ItemUpdateRequest;
import com.growloop.growloop_backend.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemService itemService;

    // Add item to bag (for resale/donation)
    @PostMapping("/bags/{bagId}")
    public ResponseEntity<ApiResponse<ItemResponseDTO>> addItemToBag(
            @PathVariable Long bagId,
            @Valid @RequestBody ItemCreateRequest request,
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            ItemResponseDTO item = itemService.addItemToBag(bagId, firebaseUid, request);
            return ResponseEntity.ok(
                    ApiResponse.success(item, "Item added to bag successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to add item: " + e.getMessage())
            );
        }
    }

    // Add item for direct recycling (no bag)
    @PostMapping("/recycle")
    public ResponseEntity<ApiResponse<ItemResponseDTO>> addItemForRecycling(
            @Valid @RequestBody ItemCreateRequest request,
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            ItemResponseDTO item = itemService.addItemForRecycling(firebaseUid, request);
            return ResponseEntity.ok(
                    ApiResponse.success(item, "Item added for recycling successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to add item: " + e.getMessage())
            );
        }
    }

    // Get items in a bag
    @GetMapping("/bags/{bagId}")
    public ResponseEntity<ApiResponse<List<ItemResponseDTO>>> getBagItems(
            @PathVariable Long bagId) {

        try {
            List<ItemResponseDTO> items = itemService.getBagItems(bagId);
            return ResponseEntity.ok(
                    ApiResponse.success(items, "Items retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to get items: " + e.getMessage())
            );
        }
    }

    // Get user's items (across all bags)
    @GetMapping("/my-items")
    public ResponseEntity<ApiResponse<List<ItemResponseDTO>>> getUserItems(
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            List<ItemResponseDTO> items = itemService.getUserItems(firebaseUid);
            return ResponseEntity.ok(
                    ApiResponse.success(items, "Items retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to get items: " + e.getMessage())
            );
        }
    }

    // Get user's recycling items
    @GetMapping("/my-recycling")
    public ResponseEntity<ApiResponse<List<ItemResponseDTO>>> getUserRecyclingItems(
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            List<ItemResponseDTO> items = itemService.getUserRecyclingItems(firebaseUid);
            return ResponseEntity.ok(
                    ApiResponse.success(items, "Recycling items retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to get items: " + e.getMessage())
            );
        }
    }

    // Update item (for QC team - internal use)
    @PutMapping("/{itemId}/qc")
    public ResponseEntity<ApiResponse<ItemResponseDTO>> updateItem(
            @PathVariable Long itemId,
            @Valid @RequestBody ItemUpdateRequest request,
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            ItemResponseDTO item = itemService.updateItem(itemId, request);
            return ResponseEntity.ok(
                    ApiResponse.success(item, "Item updated successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to update item: " + e.getMessage())
            );
        }
    }

    // Get items ready for marketplace (public endpoint)
    @GetMapping("/marketplace")
    public ResponseEntity<ApiResponse<List<ItemResponseDTO>>> getItemsReadyForListing() {

        try {
            List<ItemResponseDTO> items = itemService.getItemsReadyForListing();
            return ResponseEntity.ok(
                    ApiResponse.success(items, "Marketplace items retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to get marketplace items: " + e.getMessage())
            );
        }
    }
}