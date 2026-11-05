
package com.technova.employeemanagement.employee;

import com.technova.employeemanagement.employee.dto.EmployeeProfileUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
public class EmployeeProfileService {

    private final EmployeeRepository employeeRepository;

    public EmployeeProfileService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public Employee updateOwnProfile(
            Long employeeId,
            EmployeeProfileUpdateRequest request) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Employee not found: " + employeeId
                ));

        String email = request.getEmail().trim();

        if (employeeRepository.existsByEmailAndIdNot(email, employeeId)) {
            throw new DuplicateEmployeeException("Email already exists");
        }

        employee.setFirstName(request.getFirstName().trim());
        employee.setLastName(request.getLastName().trim());
        employee.setEmail(email);
        employee.setPhone(request.getPhone());

        return employeeRepository.save(employee);
    }
}
