package com.growloop.growloop_backend.enumHelpers.items;


public enum ItemStatus {
    PENDING_QC("Pending Quality Check"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    LISTED("Listed for Sale"),
    SOLD("Sold"),
    RECYCLED("Sent for Recycling");

    private final String displayName;

    ItemStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}