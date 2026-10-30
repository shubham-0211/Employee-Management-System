package com.technova.employeemanagement.department;

import com.technova.employeemanagement.department.dto.DepartmentRequest;
import com.technova.employeemanagement.department.dto.DepartmentResponse;
import com.technova.employeemanagement.employee.EmployeeRepository;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public DepartmentService(
            DepartmentRepository departmentRepository,
            EmployeeRepository employeeRepository) {

        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> findAll() {

        Map<Long, Long> employeeCounts = getEmployeeCounts();

        return departmentRepository
                .findAll(Sort.by(Sort.Direction.ASC, "departmentName"))
                .stream()
                .map(department -> DepartmentResponse.fromEntity(
                        department,
                        employeeCounts.getOrDefault(department.getId(), 0L)
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public DepartmentResponse findById(Long id) {

        Department department = getDepartment(id);

        Long employeeCount = getEmployeeCounts()
                .getOrDefault(department.getId(), 0L);

        return DepartmentResponse.fromEntity(department, employeeCount);
    }

    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {

        String departmentCode = request.getDepartmentCode().trim();
        String departmentName = request.getDepartmentName().trim();

        if (departmentRepository.existsByDepartmentCode(departmentCode)) {
            throw new IllegalArgumentException(
                    "Department code already exists."
            );
        }

        if (departmentRepository.existsByDepartmentName(departmentName)) {
            throw new IllegalArgumentException(
                    "Department name already exists."
            );
        }

        Department department = new Department();

        applyRequest(department, request);

        Department savedDepartment = departmentRepository.save(department);

        return DepartmentResponse.fromEntity(savedDepartment, 0L);
    }

    @Transactional
    public DepartmentResponse update(Long id, DepartmentRequest request) {

        Department department = getDepartment(id);

        String departmentCode = request.getDepartmentCode().trim();
        String departmentName = request.getDepartmentName().trim();

        if (departmentRepository.existsByDepartmentCodeAndIdNot(
                departmentCode, id)) {

            throw new IllegalArgumentException(
                    "Department code already exists."
            );
        }

        if (departmentRepository.existsByDepartmentNameAndIdNot(
                departmentName, id)) {

            throw new IllegalArgumentException(
                    "Department name already exists."
            );
        }

        applyRequest(department, request);

        Department updatedDepartment = departmentRepository.save(department);

        Long employeeCount = getEmployeeCounts()
                .getOrDefault(updatedDepartment.getId(), 0L);

        return DepartmentResponse.fromEntity(
                updatedDepartment,
                employeeCount
        );
    }

    @Transactional
    public void delete(Long id) {

        Department department = getDepartment(id);

        boolean hasEmployees =
                employeeRepository.existsByDepartmentEntity_Id(id);

        if (hasEmployees) {
            throw new IllegalStateException(
                    "Cannot delete this department because employees are assigned to it."
            );
        }

        departmentRepository.delete(department);
    }

    private Map<Long, Long> getEmployeeCounts() {

        return departmentRepository.countEmployeesByDepartment()
                .stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));
    }

    private Department getDepartment(Long id) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Department not found: " + id
                        )
                );
    }

    private void applyRequest(
            Department department,
            DepartmentRequest request) {

        department.setDepartmentCode(
                request.getDepartmentCode().trim()
        );

        department.setDepartmentName(
                request.getDepartmentName().trim()
        );

        department.setDescription(
                request.getDescription() != null
                        ? request.getDescription().trim()
                        : null
        );

        department.setStatus(
                request.getStatus().trim().toUpperCase()
        );
    }
}