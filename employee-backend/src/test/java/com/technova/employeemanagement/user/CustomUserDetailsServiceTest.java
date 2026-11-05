package com.technova.employeemanagement.user;

import com.technova.employeemanagement.employee.Employee;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private Employee employee;

    private CustomUserDetailsService userDetailsService;

    @BeforeEach
    void setUp() {
        userDetailsService = new CustomUserDetailsService(userRepository);
    }

    @Test
    void shouldEnableActiveUserWithActiveEmployee() {
        User user = createUser(UserStatus.ACTIVE, employee);

        when(employee.getEmploymentStatus()).thenReturn("ACTIVE");
        when(userRepository.findByUsername("test.employee"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername("test.employee");

        assertTrue(userDetails.isEnabled());
        assertEquals("test.employee", userDetails.getUsername());
    }

    @Test
    void shouldDisableInactiveUserAccount() {
        User user = createUser(UserStatus.INACTIVE, employee);

        when(employee.getEmploymentStatus()).thenReturn("ACTIVE");
        when(userRepository.findByUsername("test.employee"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername("test.employee");

        assertFalse(userDetails.isEnabled());
    }

    @Test
    void shouldDisableUserLinkedToInactiveEmployee() {
        User user = createUser(UserStatus.ACTIVE, employee);

        when(employee.getEmploymentStatus()).thenReturn("INACTIVE");
        when(userRepository.findByUsername("test.employee"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername("test.employee");

        assertFalse(userDetails.isEnabled());
    }

    @Test
    void shouldDisableUserLinkedToTerminatedEmployee() {
        User user = createUser(UserStatus.ACTIVE, employee);

        when(employee.getEmploymentStatus()).thenReturn("TERMINATED");
        when(userRepository.findByUsername("test.employee"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername("test.employee");

        assertFalse(userDetails.isEnabled());
    }

    @Test
    void shouldEnableActiveAdminWithoutLinkedEmployee() {
        User user = createUser(UserStatus.ACTIVE, null);
        user.setRole(UserRole.ADMIN);

        when(userRepository.findByUsername("sysadmin"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername("sysadmin");

        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    void shouldPreserveForcedPasswordChangeFlag() {
        User user = createUser(UserStatus.ACTIVE, null);
        user.setMustChangePassword(true);

        when(userRepository.findByUsername("new.employee"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername("new.employee");

        assertInstanceOf(
                CustomUserDetailsService.CustomUserDetails.class,
                userDetails
        );

        CustomUserDetailsService.CustomUserDetails customUserDetails =
                (CustomUserDetailsService.CustomUserDetails) userDetails;

        assertTrue(customUserDetails.isMustChangePassword());
    }

    @Test
    void shouldFindUserByEmailWhenUsernameDoesNotMatch() {
        User user = createUser(UserStatus.ACTIVE, null);

        when(userRepository.findByUsername("test@example.com"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername("test@example.com");

        assertTrue(userDetails.isEnabled());
        assertEquals("test.employee", userDetails.getUsername());
    }

    @Test
    void shouldRejectUnknownUsername() {
        when(userRepository.findByUsername("unknown"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("unknown"))
                .thenReturn(Optional.empty());

        assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("unknown")
        );
    }

    private User createUser(UserStatus status, Employee linkedEmployee) {
        User user = new User();
        user.setUsername("test.employee");
        user.setEmail("test@example.com");
        user.setPasswordHash("encoded-password");
        user.setRole(UserRole.EMPLOYEE);
        user.setStatus(status);
        user.setEmployee(linkedEmployee);
        user.setMustChangePassword(false);
        return user;
    }
}