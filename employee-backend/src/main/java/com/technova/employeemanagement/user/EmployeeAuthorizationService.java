
package com.technova.employeemanagement.user;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("employeeAuthorizationService")
public class EmployeeAuthorizationService {

    private final UserRepository userRepository;

    public EmployeeAuthorizationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean hasAdminOrHrRole() {
        return hasRole(UserRole.ADMIN) || hasRole(UserRole.HR);
    }

    public boolean isAdmin() {
        return hasRole(UserRole.ADMIN);
    }

    @Transactional(readOnly = true)
    public Long getCurrentEmployeeId() {

        User user = getCurrentUser();

        if (user.getRole() != UserRole.EMPLOYEE
                || user.getEmployee() == null) {
            throw new IllegalStateException(
                    "The authenticated user is not linked to an employee record."
            );
        }

        return user.getEmployee().getId();
    }

    @Transactional(readOnly = true)
    public boolean isEmployeeOwner(Long employeeId) {

        if (employeeId == null) {
            return false;
        }

        try {
            return employeeId.equals(getCurrentEmployeeId());
        } catch (IllegalStateException exception) {
            return false;
        }
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null
                || authentication.getName().isBlank()) {
            throw new IllegalStateException("No authenticated user found.");
        }

        return userRepository
                .findWithEmployeeByUsername(authentication.getName())
                .filter(user -> user.getStatus() == UserStatus.ACTIVE)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Active authenticated user not found."
                        )
                );
    }

    private boolean hasRole(UserRole role) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication != null
                && authentication.isAuthenticated()
                && authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_" + role.name())
                );
    }
}
