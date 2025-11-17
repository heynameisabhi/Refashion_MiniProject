package com.growloop.growloop_backend.repository;

import com.growloop.growloop_backend.entity.Recycler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecyclerRepository extends JpaRepository<Recycler, Long> {

    // Find all verified recyclers
    List<Recycler> findByIsVerifiedTrue();

    // Find recyclers within a radius (using Haversine formula)
    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(latitude)))) AS distance " +
            "FROM recyclers " +
            "HAVING distance < :radiusKm " +
            "ORDER BY distance", nativeQuery = true)
    List<Recycler> findNearbyRecyclers(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("radiusKm") Double radiusKm
    );

    // Find all recyclers ordered by rating
    List<Recycler> findAllByOrderByRatingDesc();
}
