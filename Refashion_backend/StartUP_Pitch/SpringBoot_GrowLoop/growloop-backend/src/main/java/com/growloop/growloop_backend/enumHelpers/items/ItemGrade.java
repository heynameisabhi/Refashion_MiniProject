package com.growloop.growloop_backend.enumHelpers.items;

// Grade assigned by AI and QC team
public enum ItemGrade {
    PENDING("Pending Review"),
    A("Grade A - Resellable"),
    B("Grade B - Recyclable");

    private final String displayName;

    ItemGrade(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}


