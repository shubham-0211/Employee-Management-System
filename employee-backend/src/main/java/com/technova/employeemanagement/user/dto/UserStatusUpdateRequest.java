package com.technova.employeemanagement.user.dto;

import com.technova.employeemanagement.user.UserStatus;
import jakarta.validation.constraints.NotNull;

public class UserStatusUpdateRequest {

    @NotNull(message = "Account status is required.")
    private UserStatus status;

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}