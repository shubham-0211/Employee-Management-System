package com.technova.employeemanagement.department.dto;

import com.technova.employeemanagement.department.Department;
import java.time.LocalDateTime;

public record DepartmentResponse(
        Long id,
        String departmentCode,
        String departmentName,
        String description,
        String status,
        Long assignedEmployeeCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static DepartmentResponse fromEntity(Department department) {
        return fromEntity(department, 0L);
    }

    public static DepartmentResponse fromEntity(
            Department department,
            Long assignedEmployeeCount
    ) {
        return new DepartmentResponse(
                department.getId(),
                department.getDepartmentCode(),
                department.getDepartmentName(),
                department.getDescription(),
                department.getStatus(),
                assignedEmployeeCount,
                department.getCreatedAt(),
                department.getUpdatedAt()
        );
    }
}