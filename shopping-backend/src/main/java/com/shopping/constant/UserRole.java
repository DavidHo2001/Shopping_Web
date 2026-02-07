package com.shopping.constant;

public enum UserRole {
    CUSTOMER(1),
    ADMIN(2),
    SUPER_ADMIN(3);

    private final int value;

    UserRole(int value) {
        this.value = value;
    }

    // Getter for role ID
    public int getValue() {
        return value;
    }

    public String getName() {
        return this.name();
    }

    // Static method to get UserRole by id (value)
    public static UserRole fromValue(int value) {
        for (UserRole role : UserRole.values()) {
            if (role.getValue() == value) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid UserRole value: " + value);
    }

    // get role name by role id directly
    public static String getNameByValue(int value) {
        return fromValue(value).getName();
    }
}
