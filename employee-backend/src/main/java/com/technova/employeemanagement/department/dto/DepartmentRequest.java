package com.technova.employeemanagement.department.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class DepartmentRequest {

    @NotBlank(message = "Department code is required")
    @Size(max = 20, message = "Department code cannot exceed 20 characters")
    @Pattern(
        regexp = "^[A-Za-z0-9_-]+$",
        message = "Department code can contain only letters, numbers, hyphens and underscores"
    )
    private String departmentCode;

    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name cannot exceed 100 characters")
    private String departmentName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotBlank(message = "Department status is required")
    @Pattern(
        regexp = "ACTIVE|INACTIVE",
        message = "Status must be ACTIVE or INACTIVE"
    )
    private String status = "ACTIVE";

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}