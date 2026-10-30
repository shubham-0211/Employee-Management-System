package com.technova.employeemanagement.department;

import com.technova.employeemanagement.employee.Employee;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByDepartmentCode(String departmentCode);

    boolean existsByDepartmentName(String departmentName);

    boolean existsByDepartmentCodeAndIdNot(String departmentCode, Long id);

    boolean existsByDepartmentNameAndIdNot(String departmentName, Long id);

    @Query("""
            SELECT d.id, COUNT(e.id)
            FROM Department d
            LEFT JOIN Employee e ON e.departmentEntity = d
            GROUP BY d.id
            """)
    List<Object[]> countEmployeesByDepartment();
}