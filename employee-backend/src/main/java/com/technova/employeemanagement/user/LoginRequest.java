package com.technova.employeemanagement.user;

import com.technova.employeemanagement.user.validation.MaxUtf8Bytes;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank(message = "Username is required.")
    @Size(max = 50, message = "Username cannot exceed 50 characters.")
    private String username;

    @NotBlank(message = "Password is required.")
    @MaxUtf8Bytes(72)
    private String password;

    public LoginRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}