package com.technova.employeemanagement.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByEmployee_Id(Long employeeId);

    boolean existsByRole(UserRole role);

    long countByRoleAndStatus(UserRole role, UserStatus status);

    @EntityGraph(attributePaths = "employee")
    Optional<User> findWithEmployeeByUsername(String username);

    @Override
    @EntityGraph(attributePaths = "employee")
    List<User> findAll();

    @Override
    @EntityGraph(attributePaths = "employee")
    Optional<User> findById(Long id);
}