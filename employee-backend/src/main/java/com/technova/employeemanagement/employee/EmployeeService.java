package com.technova.employeemanagement.employee;

import com.technova.employeemanagement.employee.dto.EmployeeRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Employee> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @Transactional(readOnly = true)
    public Employee findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException("Employee not found: " + id));
    }

    @Transactional
    public Employee create(EmployeeRequest request) {
        if (repository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new DuplicateEmployeeException("Employee code already exists");
        }

        if (repository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmployeeException("Email already exists");
        }

        Employee employee = new Employee();
        applyRequest(employee, request);
        return repository.save(employee);
    }

    @Transactional
    public Employee update(Long id, EmployeeRequest request) {
        Employee employee = findById(id);

        if (repository.existsByEmployeeCodeAndIdNot(
                request.getEmployeeCode(), id)) {
            throw new DuplicateEmployeeException("Employee code already exists");
        }

        if (repository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new DuplicateEmployeeException("Email already exists");
        }

        applyRequest(employee, request);
        return repository.save(employee);
    }

    @Transactional
    public void delete(Long id) {
        Employee employee = findById(id);
        repository.delete(employee);
    }

    private void applyRequest(Employee employee, EmployeeRequest request) {
        employee.setEmployeeCode(request.getEmployeeCode().trim());
        employee.setFirstName(request.getFirstName().trim());
        employee.setLastName(request.getLastName().trim());
        employee.setEmail(request.getEmail().trim());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setJobTitle(request.getJobTitle());
        employee.setSalary(request.getSalary());
        employee.setHireDate(request.getHireDate());
        employee.setEmploymentStatus(request.getEmploymentStatus());
    }
}