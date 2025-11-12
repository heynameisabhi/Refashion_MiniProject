package com.growloop.growloop_backend.repository;

import com.growloop.growloop_backend.entity.*;
import com.growloop.growloop_backend.enumHelpers.items.ItemGrade;
import com.growloop.growloop_backend.enumHelpers.items.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    // Find items by bag
    List<Item> findByBagOrderByAddedAtDesc(Bag bag);

    // Find items by contributor
    List<Item> findByContributorOrderByAddedAtDesc(User contributor);

    // Find items by grade
    List<Item> findByGrade(ItemGrade grade);

    // Find items by status
    List<Item> findByStatus(ItemStatus status);

    // Find items ready for marketplace (Grade A + Approved)
    @Query("SELECT i FROM Item i WHERE i.grade = 'A' AND i.status = 'APPROVED'")
    List<Item> findItemsReadyForListing();

    // Count items by bag
    Long countByBag(Bag bag);

    // Calculate total points for a bag
    @Query("SELECT COALESCE(SUM(i.loyaltyPoint), 0) FROM Item i WHERE i.bag = :bag")
    BigDecimal calculateTotalPointsForBag(@Param("bag") Bag bag);

    // Find user's items across all bags
    @Query("SELECT i FROM Item i WHERE i.contributor = :user ORDER BY i.addedAt DESC")
    List<Item> findAllByContributor(@Param("user") User user);

    // Find items by bag and contributor (for community tracking)
    List<Item> findByBagAndContributor(Bag bag, User contributor);

    // Find items pending QC
    @Query("SELECT i FROM Item i WHERE i.status = 'PENDING_QC' ORDER BY i.addedAt ASC")
    List<Item> findItemsPendingQC();
}
