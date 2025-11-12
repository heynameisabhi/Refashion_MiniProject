package com.growloop.growloop_backend.enumHelpers;

public enum BagStatus {

    OPEN("Open - Adding Items"),
    AWAITING_PICKUP("Awaiting Pickup"),
    COLLECTED("Items Collected"),
    CLOSED("Bag Closed");

    private final String displayName;

    BagStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;

    }
}

