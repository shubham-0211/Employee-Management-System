package com.technova.employeemanagement.department;

import com.technova.employeemanagement.department.dto.DepartmentRequest;
import com.technova.employeemanagement.department.dto.DepartmentResponse;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService service;

    public DepartmentController(DepartmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<DepartmentResponse> getAllDepartments() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public DepartmentResponse getDepartment(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<DepartmentResponse> createDepartment(
            @Valid @RequestBody DepartmentRequest request) {

        DepartmentResponse created = service.create(request);

        return ResponseEntity
                .created(URI.create("/api/departments/" + created.id()))
                .body(created);
    }

    @PutMapping("/{id}")
    public DepartmentResponse updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {

        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}