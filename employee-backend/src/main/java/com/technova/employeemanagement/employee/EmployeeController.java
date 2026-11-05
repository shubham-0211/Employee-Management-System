
package com.technova.employeemanagement.employee;

import com.technova.employeemanagement.employee.dto.EmployeeProfileUpdateRequest;
import com.technova.employeemanagement.employee.dto.EmployeeRequest;
import com.technova.employeemanagement.user.EmployeeAuthorizationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService service;
    private final EmployeeProfileService profileService;
    private final EmployeeAuthorizationService authorizationService;

    public EmployeeController(
            EmployeeService service,
            EmployeeProfileService profileService,
            EmployeeAuthorizationService authorizationService) {
        this.service = service;
        this.profileService = profileService;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    @PreAuthorize("@employeeAuthorizationService.hasAdminOrHrRole()")
    public List<Employee> getAllEmployees() {
        return service.findAll();
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("@employeeAuthorizationService.hasAdminOrHrRole()")
    public List<Employee> getEmployeesByDepartment(
            @PathVariable Long departmentId) {
        return service.findByDepartmentId(departmentId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@employeeAuthorizationService.hasAdminOrHrRole() or @employeeAuthorizationService.isEmployeeOwner(#p0)")
    public Employee getEmployee(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize("@employeeAuthorizationService.hasAdminOrHrRole()")
    public ResponseEntity<Employee> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {
        Employee created = service.create(request);
        return ResponseEntity
                .created(URI.create("/api/employees/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@employeeAuthorizationService.hasAdminOrHrRole()")
    public Employee updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@employeeAuthorizationService.isAdmin()")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYEE')")
    public Employee getOwnProfile() {
        Long employeeId = authorizationService.getCurrentEmployeeId();
        return service.findById(employeeId);
    }

    @PutMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYEE')")
    public Employee updateOwnProfile(
            @Valid @RequestBody EmployeeProfileUpdateRequest request) {
        Long employeeId = authorizationService.getCurrentEmployeeId();
        return profileService.updateOwnProfile(employeeId, request);
    }
}
