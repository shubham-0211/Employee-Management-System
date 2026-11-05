package com.technova.employeemanagement.user.dto;

import com.technova.employeemanagement.user.validation.MaxUtf8Bytes;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserPasswordResetRequest {

    @NotBlank
    @Size(min = 12, message = "Password must contain at least 12 characters.")
    @MaxUtf8Bytes(72)
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}