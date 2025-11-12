package com.growloop.growloop_backend.enumHelpers;

public enum BagPurpose {
    RESALE("Resale"),
    DONATION("Donation");

    private final String displayName;
    BagPurpose(String displayName) {
        this.displayName = displayName;
    }
    public String getDisplayName() {
        return displayName;
    }
}
