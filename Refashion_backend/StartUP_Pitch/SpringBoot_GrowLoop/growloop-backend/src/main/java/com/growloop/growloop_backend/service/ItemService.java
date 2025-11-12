package com.growloop.growloop_backend.service;

import com.growloop.growloop_backend.authentication.Dto.ItemCreateRequest;
import com.growloop.growloop_backend.authentication.Dto.ItemResponseDTO;
import com.growloop.growloop_backend.authentication.Dto.ItemUpdateRequest;
import com.growloop.growloop_backend.entity.*;
import com.growloop.growloop_backend.enumHelpers.items.ItemGrade;
import com.growloop.growloop_backend.enumHelpers.items.ItemStatus;
import com.growloop.growloop_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private BagRepository bagRepository;

    @Autowired
    private UserRepository userRepository;

    // Add item to bag
    public ItemResponseDTO addItemToBag(Long bagId, String contributorFirebaseUid, ItemCreateRequest request) {
        // Find bag
        Bag bag = bagRepository.findById(bagId)
                .orElseThrow(() -> new RuntimeException("Bag not found"));

        // Find contributor
        User contributor = userRepository.findByFirebaseUid(contributorFirebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if bag accepts items
        if (!bag.canAddItems()) {
            throw new RuntimeException("This bag is no longer accepting items");
        }

        // Create item
        Item item = Item.builder()
                .bag(bag)
                .contributor(contributor)
                .itemType(request.getItemType())
                .conditionDescription(request.getConditionDescription())
                .gender(request.getGender())
                .ageGroup(request.getAgeGroup())
                .grade(ItemGrade.PENDING)
                .status(ItemStatus.PENDING_QC)
                .loyaltyPoint(BigDecimal.ZERO)
                .build();

        Item savedItem = itemRepository.save(item);

        // Update bag's total items count
        bag.addItem();
        bagRepository.save(bag);

        return ItemResponseDTO.fromItem(savedItem);
    }

    // Add item for direct recycling (no bag)
    public ItemResponseDTO addItemForRecycling(String contributorFirebaseUid, ItemCreateRequest request) {
        // Find contributor
        User contributor = userRepository.findByFirebaseUid(contributorFirebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create item for recycling (no bag association)
        Item item = Item.builder()
                .bag(null) // No bag for direct recycling
                .contributor(contributor)
                .itemType(request.getItemType())
                .conditionDescription(request.getConditionDescription())
                .gender(request.getGender())
                .ageGroup(request.getAgeGroup())
                .grade(ItemGrade.B) // Recycling items are always Grade B
                .status(ItemStatus.PENDING_QC)
                .loyaltyPoint(BigDecimal.valueOf(10)) // Fixed points for recycling
                .build();

        Item savedItem = itemRepository.save(item);
        return ItemResponseDTO.fromItem(savedItem);
    }

    // Get items in a bag
    public List<ItemResponseDTO> getBagItems(Long bagId) {
        Bag bag = bagRepository.findById(bagId)
                .orElseThrow(() -> new RuntimeException("Bag not found"));

        List<Item> items = itemRepository.findByBagOrderByAddedAtDesc(bag);
        return items.stream()
                .map(ItemResponseDTO::fromItem)
                .collect(Collectors.toList());
    }

    // Get user's items (across all bags)
    public List<ItemResponseDTO> getUserItems(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Item> items = itemRepository.findAllByContributor(user);
        return items.stream()
                .map(ItemResponseDTO::fromItem)
                .collect(Collectors.toList());
    }

    // Get user's recycling items (items without bags)
    public List<ItemResponseDTO> getUserRecyclingItems(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Item> items = itemRepository.findAllByContributor(user);
        return items.stream()
                .filter(item -> item.getBag() == null) // Recycling items have no bag
                .map(ItemResponseDTO::fromItem)
                .collect(Collectors.toList());
    }

    // Update item (for QC team)
    public ItemResponseDTO updateItem(Long itemId, ItemUpdateRequest request) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Update grade and status
        if (request.getGrade() != null) {
            item.setGrade(request.getGrade());
        }

        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }

        if (request.getLoyaltyPoint() != null) {
            item.setLoyaltyPoint(request.getLoyaltyPoint());
        }

        Item updatedItem = itemRepository.save(item);

        // Update bag's total points if item belongs to a bag
        if (item.getBag() != null) {
            updateBagPoints(item.getBag());
        }

        return ItemResponseDTO.fromItem(updatedItem);
    }

    // Helper method to update bag's total points
    private void updateBagPoints(Bag bag) {
        BigDecimal totalPoints = itemRepository.calculateTotalPointsForBag(bag);
        bag.updatePointsAwarded(totalPoints.intValue());
        bagRepository.save(bag);
    }

    // Get items ready for marketplace
    public List<ItemResponseDTO> getItemsReadyForListing() {
        List<Item> items = itemRepository.findItemsReadyForListing();
        return items.stream()
                .map(ItemResponseDTO::fromItem)
                .collect(Collectors.toList());
    }

    // Get items pending QC
    public List<ItemResponseDTO> getItemsPendingQC() {
        List<Item> items = itemRepository.findItemsPendingQC();
        return items.stream()
                .map(ItemResponseDTO::fromItem)
                .collect(Collectors.toList());
    }
}

