package com.growloop.growloop_backend.entity;


import com.growloop.growloop_backend.enumHelpers.BagPurpose;
import com.growloop.growloop_backend.enumHelpers.BagStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bags")
public class Bag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bag_id")
    private long bagId;

    @Column(name = "bag_name")
    private String bagName;

    @Column(name = "sharable_link")
    private String sharableLink;



    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BagStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    @Column(name = "total_items")
    @Builder.Default
    private Integer totalItems = 0;

    @Column(name = "points_awarded", nullable = false)
    @Builder.Default
    private Integer pointsAwarded = 0;

    // Delivery charge for bags with < 5 items
    @Column(name = "delivery_charge", nullable = false)
    @Builder.Default
    private Double deliveryCharge = 50.0; // Default affordable charge

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "bag", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Item> items = new ArrayList<>();

    // Core business logic for pickup eligibility
    public boolean isEligibleForFreePickup() {
        return totalItems >= 5 && (status == BagStatus.OPEN || status == BagStatus.AWAITING_PICKUP);
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", nullable = false)
    @Builder.Default
    private BagPurpose purpose = BagPurpose.RESALE;

    public boolean canSchedulePickup() {
        return status == BagStatus.OPEN && totalItems > 0;
    }

    public double getPickupCost() {
        return isEligibleForFreePickup() ? 0.0 : deliveryCharge;
    }

    public String getPickupEligibilityMessage() {
        if (totalItems == 0) {
            return "Add items to schedule pickup";
        } else if (isEligibleForFreePickup()) {
            return "Eligible for FREE pickup!";
        } else {
            int itemsNeeded = 5 - totalItems;
            return String.format("Add %d more item%s for FREE pickup or pay ₹%.0f delivery charge",
                    itemsNeeded, itemsNeeded > 1 ? "s" : "", deliveryCharge);
        }
    }

    // Item management
    public void addItem() {
        this.totalItems++;
    }

    public void removeItem() {
        if (this.totalItems > 0) {
            this.totalItems--;
        }
    }

    // Status management
    public void schedulePickup() {
        if (canSchedulePickup()) {
            this.status = BagStatus.AWAITING_PICKUP;
        }
    }

    public void markAsCollected() {
        this.status = BagStatus.COLLECTED;
    }

    public void markAsClosed() {
        this.status = BagStatus.CLOSED;
    }

    public void updatePointsAwarded(Integer points) {
        this.pointsAwarded = points != null ? points : 0;
    }

    // Helper methods for UI/API
    public boolean canAddItems() {
        return status == BagStatus.OPEN;
    }

    public boolean isResaleBag() {
        return BagPurpose.RESALE.equals(this.purpose);
    }

    public boolean isDonationBag() {
        return BagPurpose.DONATION.equals(this.purpose);
    }

    public boolean isPendingPickup() {
        return status == BagStatus.AWAITING_PICKUP;
    }

    @PrePersist
    public void generateShareableLink() {
        if (this.sharableLink == null || this.sharableLink.isEmpty()) {
            this.sharableLink = generateUniqueToken();
        }
    }

    private String generateUniqueToken() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }

    // Method to get full shareable URL
    public String getShareableUrl() {
        return "https://growloop.app/share/" + this.sharableLink;
    }


}
