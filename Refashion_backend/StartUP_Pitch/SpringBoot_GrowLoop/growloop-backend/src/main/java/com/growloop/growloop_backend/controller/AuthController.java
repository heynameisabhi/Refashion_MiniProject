package com.growloop.growloop_backend.controller;

import com.growloop.growloop_backend.authentication.Dto.ApiResponse;
import com.growloop.growloop_backend.authentication.Dto.UserRegistrationRequest;
import com.growloop.growloop_backend.authentication.Dto.UserResponseDTO;
import com.growloop.growloop_backend.entity.User;
import com.growloop.growloop_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Simple login endpoint (no Firebase)
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(
                    ApiResponse.error("Email and password are required")
                );
            }

            // Find user by email
            User user = userRepository.findByEmailId(email).orElse(null);

            if (user == null) {
                // Auto-create user if doesn't exist (for demo purposes)
                user = new User();
                user.setEmailId(email);
                user.setUserName(email.split("@")[0]);
                user.setFirebaseUid("local-" + UUID.randomUUID().toString());
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());
                user.setLoyaltyPointBalance(0);
                user.setIsVerified(false);
                user.setIsPremium(false);
                user = userRepository.save(user);
            }

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", "token-" + user.getUserId());
            response.put("user", convertToDTO(user));

            return ResponseEntity.ok(
                ApiResponse.success(response, "Login successful")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.error("Login failed: " + e.getMessage())
            );
        }
    }

    // Simple signup endpoint
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signup(@RequestBody UserRegistrationRequest request) {
        try {
            // Check if user already exists
            if (userRepository.findByEmailId(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(
                    ApiResponse.error("User with this email already exists")
                );
            }

            // Create new user
            User user = new User();
            user.setEmailId(request.getEmail());
            user.setUserName(request.getName());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setAddressText(request.getAddress());
            user.setFirebaseUid("local-" + UUID.randomUUID().toString());
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setLoyaltyPointBalance(0);
            user.setIsVerified(false);
            user.setIsPremium(false);

            user = userRepository.save(user);

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", "token-" + user.getUserId());
            response.put("user", convertToDTO(user));

            return ResponseEntity.ok(
                ApiResponse.success(response, "Signup successful")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.error("Signup failed: " + e.getMessage())
            );
        }
    }

    // Get user profile by token
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getProfile(@RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from token (format: "token-{userId}")
            String userId = token.replace("Bearer ", "").replace("token-", "");
            Long id = Long.parseLong(userId);

            User user = userRepository.findById(id).orElseThrow(
                () -> new RuntimeException("User not found")
            );

            return ResponseEntity.ok(
                ApiResponse.success(convertToDTO(user), "Profile retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.error("User not found: " + e.getMessage())
            );
        }
    }

    // Helper method to convert User entity to DTO
    private UserResponseDTO convertToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setName(user.getUserName());
        dto.setEmail(user.getEmailId());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddressText());
        dto.setLoyaltyPoints(user.getLoyaltyPointBalance());
        dto.setIsVerified(user.getIsVerified());
        dto.setIsPremium(user.getIsPremium());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
