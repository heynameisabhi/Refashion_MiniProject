package com.growloop.growloop_backend.service;

import com.growloop.growloop_backend.authentication.Dto.UserRegistrationRequest;
import com.growloop.growloop_backend.authentication.Dto.UserResponseDTO;
import com.growloop.growloop_backend.authentication.Dto.UserUpdateRequest;
import com.growloop.growloop_backend.entity.User;
import com.growloop.growloop_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserResponseDTO registerUser(String firebaseUid, UserRegistrationRequest request) {

        // Check if user already exists with this Firebase UID
        Optional<User> existingUser = userRepository.findByFirebaseUid(firebaseUid);
        if (existingUser.isPresent()) {
            return UserResponseDTO.fromUser(existingUser.get());
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered with different account");
        }

        // Create new user
        User newUser = new User();
        newUser.setFirebaseUid(firebaseUid);
        newUser.setUserName(request.getUserName());
        newUser.setEmail(request.getEmail());
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setAddressText(request.getAddressText());
        newUser.setLatitude(request.getLatitude());
        newUser.setLongitude(request.getLongitude());

        // Save user to database
        User savedUser = userRepository.save(newUser);
        return UserResponseDTO.fromUser(savedUser);
    }

    public UserResponseDTO getUserProfile(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid).orElseThrow(() -> new RuntimeException("User Not Found"));
        return UserResponseDTO.fromUser(user);
    }

    // Update user profile
    public UserResponseDTO updateUserProfile(String firebaseUid, UserUpdateRequest request) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update only non-null fields
        if (request.getUserName() != null) {
            user.setUserName(request.getUserName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddressText() != null) {
            user.setAddressText(request.getAddressText());
        }
        if (request.getLatitude() != null) {
            user.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            user.setLongitude(request.getLongitude());
        }

        User updatedUser = userRepository.save(user);
        return UserResponseDTO.fromUser(updatedUser);
    }

    // Check if user exists
    public boolean userExists(String firebaseUid) {
        return userRepository.existsByFirebaseUid(firebaseUid);
    }


}
