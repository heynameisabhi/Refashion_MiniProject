package com.growloop.growloop_backend.repository;

import com.growloop.growloop_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by Firebase UID (most important for authentication)
    Optional<User> findByFirebaseUid(String firebaseUid);

    // Find user by email
    Optional<User> findByEmail(String email);

    // Check if Firebase UID already exists
    boolean existsByFirebaseUid(String firebaseUid);

    // Check if email already exists
    boolean existsByEmail(String email);


}
