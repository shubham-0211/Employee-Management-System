package com.technova.employeemanagement.employee;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmployeeCode(String employeeCode);

    boolean existsByEmail(String email);

    boolean existsByEmployeeCodeAndIdNot(String employeeCode, Long id);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByDepartmentEntity_Id(Long departmentId);

    @EntityGraph(attributePaths = "departmentEntity")
    List<Employee> findByDepartmentEntity_IdOrderByFirstNameAscLastNameAsc(
            Long departmentId
    );

    @Override
    @EntityGraph(attributePaths = "departmentEntity")
    List<Employee> findAll();

    @Override
    @EntityGraph(attributePaths = "departmentEntity")
    List<Employee> findAll(org.springframework.data.domain.Sort sort);

    @Override
    @EntityGraph(attributePaths = "departmentEntity")
    Optional<Employee> findById(Long id);
}