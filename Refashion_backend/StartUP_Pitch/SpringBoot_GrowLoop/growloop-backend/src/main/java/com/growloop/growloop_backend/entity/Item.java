package com.growloop.growloop_backend.entity;

import com.growloop.growloop_backend.enumHelpers.items.ItemGrade;
import com.growloop.growloop_backend.enumHelpers.items.ItemStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    // Many items belong to one bag
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bag_id", nullable = false)
    private Bag bag;

    // User who contributed this item (supports community bag sharing)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contributor_id", nullable = false)
    private User contributor;

    @NotBlank(message = "Item type is required")
    @Column(name = "item_type", length = 100, nullable = false)
    private String itemType; // "T-shirt", "Jeans", "Kids Jacket", etc.

    @Column(name = "condition_description", columnDefinition = "TEXT")
    private String conditionDescription; // "Minor stain on sleeve", "Like new"

    @Column(name = "gender", length = 20)
    private String gender; // "Boys", "Girls", "Unisex"

    @Column(name = "age_group", length = 20)
    private String ageGroup; // "0-2 years", "3-5 years", "6-8 years"

    @Enumerated(EnumType.STRING)
    @Column(name = "grade")
    @Builder.Default
    private ItemGrade grade = ItemGrade.PENDING; // AI will assign A or B

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ItemStatus status = ItemStatus.PENDING_QC;

    @DecimalMin(value = "0.0", message = "Loyalty points cannot be negative")
    @Column(name = "loyalty_point", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal loyaltyPoint = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "added_at", updatable = false)
    private LocalDateTime addedAt;

    // Business logic methods
    public boolean isGradeA() {
        return ItemGrade.A.equals(this.grade);
    }

    public boolean isReadyForListing() {
        return ItemGrade.A.equals(this.grade) &&
                ItemStatus.APPROVED.equals(this.status);
    }

    public void assignGradeAndPoints(ItemGrade grade, BigDecimal points) {
        this.grade = grade;
        this.loyaltyPoint = points != null ? points : BigDecimal.ZERO;
    }
}
