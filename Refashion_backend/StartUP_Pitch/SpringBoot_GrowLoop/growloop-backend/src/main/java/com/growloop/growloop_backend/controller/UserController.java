package com.growloop.growloop_backend.controller;

import com.growloop.growloop_backend.authentication.Dto.ApiResponse;
import com.growloop.growloop_backend.authentication.Dto.UserRegistrationRequest;
import com.growloop.growloop_backend.authentication.Dto.UserResponseDTO;
import com.growloop.growloop_backend.authentication.Dto.UserUpdateRequest;
import com.growloop.growloop_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> registerUser(
            @Valid @RequestBody UserRegistrationRequest request,
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            UserResponseDTO user = userService.registerUser(firebaseUid, request);
            return ResponseEntity.ok(
                    ApiResponse.success(user, "User registered successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.error("Registration failed: " + e.getMessage())
            );
        }
    }

    // Get user profile
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserProfile(
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            UserResponseDTO user = userService.getUserProfile(firebaseUid);
            return ResponseEntity.ok(
                    ApiResponse.success(user, "Profile retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error("User not found: " + e.getMessage())
            );
        }
    }

    // Update user profile
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateUserProfile(
            @Valid @RequestBody UserUpdateRequest request,
            @RequestHeader("Firebase-UID") String firebaseUid) {

        try {
            UserResponseDTO user = userService.updateUserProfile(firebaseUid, request);
            return ResponseEntity.ok(
                    ApiResponse.success(user, "Profile updated successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.error("Update failed: " + e.getMessage())
            );
        }
    }

    // Check if user exists
    @GetMapping("/exists")
    public ResponseEntity<ApiResponse<Boolean>> checkUserExists(
            @RequestHeader("Firebase-UID") String firebaseUid) {

        boolean exists = userService.userExists(firebaseUid);
        return ResponseEntity.ok(
                ApiResponse.success(exists, exists ? "User exists" : "User not found")
        );
    }
}

