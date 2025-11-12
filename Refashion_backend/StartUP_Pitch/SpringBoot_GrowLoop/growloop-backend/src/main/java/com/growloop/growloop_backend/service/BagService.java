package com.growloop.growloop_backend.service;
import com.growloop.growloop_backend.authentication.Dto.BagCreateRequest;
import com.growloop.growloop_backend.authentication.Dto.BagResponseDTO;
import com.growloop.growloop_backend.entity.*;
import com.growloop.growloop_backend.enumHelpers.BagPurpose;
import com.growloop.growloop_backend.enumHelpers.BagStatus;
import com.growloop.growloop_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BagService {

    @Autowired
    private BagRepository bagRepository;

    @Autowired
    private UserRepository userRepository;

    // Create new bag
    public BagResponseDTO createBag(String firebaseUid, BagCreateRequest request) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Bag bag = Bag.builder()
                .bagName(request.getBagName())
                .user(user)
                .status(BagStatus.OPEN)
                .totalItems(0)
                .pointsAwarded(0)
                .purpose(request.getPurpose())
                .deliveryCharge(50.0)
                .build();

        Bag savedBag = bagRepository.save(bag);
        return BagResponseDTO.fromBag(savedBag);
    }

    // Get user's bags
    public List<BagResponseDTO> getUserBags(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Bag> bags = bagRepository.findByUserOrderByCreatedAtDesc(user);
        return bags.stream()
                .map(BagResponseDTO::fromBag)
                .collect(Collectors.toList());
    }

    public List<BagResponseDTO> getUserBagsByPurpose(String firebaseUid, BagPurpose purpose) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Bag> bags = bagRepository.findByUserAndPurposeOrderByCreatedAtDesc(user, purpose);
        return bags.stream()
                .map(BagResponseDTO::fromBag)
                .collect(Collectors.toList());
    }

    // Get bag by ID
    public BagResponseDTO getBagById(Long bagId, String firebaseUid) {
        Bag bag = bagRepository.findById(bagId)
                .orElseThrow(() -> new RuntimeException("Bag not found"));

        // Verify ownership or access (you can add more logic here)
        return BagResponseDTO.fromBag(bag);
    }

    // Get bag by shareable token (for community access)
    public BagResponseDTO getBagByShareToken(String shareToken) {
        Bag bag = bagRepository.findBySharableLink(shareToken)
                .orElseThrow(() -> new RuntimeException("Invalid or expired share link"));

        // Only allow access to OPEN bags
        if (bag.getStatus() != BagStatus.OPEN) {
            throw new RuntimeException("This bag is no longer accepting items");
        }

        return BagResponseDTO.fromBag(bag);
    }

    // Schedule pickup
    public BagResponseDTO schedulePickup(Long bagId, String firebaseUid) {
        Bag bag = bagRepository.findById(bagId)
                .orElseThrow(() -> new RuntimeException("Bag not found"));

        // Verify ownership
        if (!bag.getUser().getFirebaseUid().equals(firebaseUid)) {
            throw new RuntimeException("Not authorized to schedule pickup for this bag");
        }

        if (!bag.canSchedulePickup()) {
            throw new RuntimeException("Bag cannot be scheduled for pickup");
        }

        bag.schedulePickup();
        Bag updatedBag = bagRepository.save(bag);
        return BagResponseDTO.fromBag(updatedBag);
    }

    // Update bag status (for internal use)
    public BagResponseDTO updateBagStatus(Long bagId, BagStatus newStatus) {
        Bag bag = bagRepository.findById(bagId)
                .orElseThrow(() -> new RuntimeException("Bag not found"));

        switch (newStatus) {
            case COLLECTED:
                bag.markAsCollected();
                break;
            case CLOSED:
                bag.markAsClosed();
                break;
            default:
                throw new RuntimeException("Invalid status transition");
        }

        Bag updatedBag = bagRepository.save(bag);
        return BagResponseDTO.fromBag(updatedBag);
    }
}
