package com.technova.employeemanagement.employee;

import com.technova.employeemanagement.employee.dto.EmployeeRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return service.findAll();
    }

    @GetMapping("/department/{departmentId}")
    public List<Employee> getEmployeesByDepartment(
            @PathVariable Long departmentId) {
        return service.findByDepartmentId(departmentId);
    }

    @GetMapping("/{id}")
    public Employee getEmployee(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {
        Employee created = service.create(request);
        return ResponseEntity
                .created(URI.create("/api/employees/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}