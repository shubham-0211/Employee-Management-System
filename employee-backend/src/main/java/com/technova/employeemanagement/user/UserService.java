package com.technova.employeemanagement.user;

import com.technova.employeemanagement.employee.Employee;
import com.technova.employeemanagement.employee.EmployeeRepository;
import com.technova.employeemanagement.user.dto.UserCreateRequest;
import com.technova.employeemanagement.user.dto.UserPasswordResetRequest;
import com.technova.employeemanagement.user.dto.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {

        String username = request.getUsername().trim();
        String email = request.getEmail().trim();

        if (request.getRole() == UserRole.ADMIN) {
            throw new IllegalArgumentException(
                    "Creating additional ADMIN accounts is not allowed."
            );
        }

        if (request.getRole() != UserRole.HR
                && request.getRole() != UserRole.EMPLOYEE) {
            throw new IllegalArgumentException(
                    "Only HR and EMPLOYEE accounts can be created."
            );
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException(
                    "Username already exists."
            );
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Email already exists."
            );
        }

        Employee employee = employeeRepository.findById(
                request.getEmployeeId()
        ).orElseThrow(() -> new IllegalArgumentException(
                "Employee not found: " + request.getEmployeeId()
        ));

        if (!"ACTIVE".equalsIgnoreCase(employee.getEmploymentStatus())) {
            throw new IllegalArgumentException(
                    "Login accounts can only be created for active employees."
            );
        }

        if (userRepository.existsByEmployee_Id(employee.getId())) {
            throw new IllegalArgumentException(
                    "This employee is already linked to a user account."
            );
        }

        User user = new User();
        user.setEmployee(employee);
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole(request.getRole());
        user.setStatus(UserStatus.ACTIVE);
        user.setMustChangePassword(true);

        User savedUser = userRepository.save(user);

        return toUserResponse(savedUser);
    }

    @Transactional
    public void resetPassword(
            Long userId,
            UserPasswordResetRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: " + userId
                ));

        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        user.setMustChangePassword(true);

        userRepository.save(user);
    }

    @Transactional
    public UserResponse updateUserStatus(
            Long userId,
            UserStatus newStatus,
            String actingUsername) {

        if (newStatus == null) {
            throw new IllegalArgumentException(
                    "Account status is required."
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: " + userId
                ));

        if (newStatus == UserStatus.INACTIVE
                && user.getUsername().equalsIgnoreCase(actingUsername)) {

            throw new IllegalArgumentException(
                    "You cannot deactivate your own account."
            );
        }

        if (newStatus == UserStatus.INACTIVE
                && user.getRole() == UserRole.ADMIN
                && user.getStatus() == UserStatus.ACTIVE) {

            long activeAdminCount = userRepository.countByRoleAndStatus(
                    UserRole.ADMIN,
                    UserStatus.ACTIVE
            );

            if (activeAdminCount <= 1) {
                throw new IllegalArgumentException(
                        "The last active ADMIN account cannot be deactivated."
                );
            }
        }

        user.setStatus(newStatus);

        User updatedUser = userRepository.save(user);

        return toUserResponse(updatedUser);
    }

    private UserResponse toUserResponse(User user) {

        Long employeeId = user.getEmployee() != null
                ? user.getEmployee().getId()
                : null;

        return new UserResponse(
                user.getId(),
                employeeId,
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
        );
    }
}