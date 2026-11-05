
package com.technova.employeemanagement.user.dto;

import com.technova.employeemanagement.user.UserRole;
import com.technova.employeemanagement.user.UserStatus;

public class UserResponse {

    private Long id;
    private Long employeeId;
    private String username;
    private String email;
    private UserRole role;
    private UserStatus status;

    public UserResponse() {
    }

    public UserResponse(
            Long id,
            Long employeeId,
            String username,
            String email,
            UserRole role,
            UserStatus status) {
        this.id = id;
        this.employeeId = employeeId;
        this.username = username;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }

    public UserStatus getStatus() {
        return status;
    }
}
