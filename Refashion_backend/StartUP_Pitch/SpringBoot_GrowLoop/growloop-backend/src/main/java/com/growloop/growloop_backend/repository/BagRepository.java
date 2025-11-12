package com.growloop.growloop_backend.repository;

import com.growloop.growloop_backend.entity.Bag;
import com.growloop.growloop_backend.entity.User;
import com.growloop.growloop_backend.enumHelpers.BagPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BagRepository extends JpaRepository<Bag, Long> {

    // Find bags by user
    List<Bag> findByUserOrderByCreatedAtDesc(User user);

    // Find bag by shareable token (for community sharing)
    Optional<Bag> findBySharableLink(String sharableLink);

    // Find bags eligible for free pickup
    @Query("SELECT b FROM Bag b WHERE b.totalItems >= 5 AND b.status = 'OPEN'")
    List<Bag> findBagsEligibleForFreePickup();

    // Find user's active bags
    @Query("SELECT b FROM Bag b WHERE b.user = :user AND b.status IN ('OPEN', 'AWAITING_PICKUP')")
    List<Bag> findActiveByUser(@Param("user") User user);

    // Count total bags by user
    Long countByUser(User user);

    // Check if shareable link already exists (for uniqueness)
    boolean existsBySharableLink(String sharableLink);

    List<Bag> findByPurpose(BagPurpose purpose);

    List<Bag> findByUserAndPurposeOrderByCreatedAtDesc(User user, BagPurpose purpose);
}

