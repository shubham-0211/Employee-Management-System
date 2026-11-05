package com.technova.employeemanagement.user;

import com.technova.employeemanagement.employee.Employee;
import com.technova.employeemanagement.employee.EmployeeRepository;
import com.technova.employeemanagement.user.dto.UserCreateRequest;
import com.technova.employeemanagement.user.dto.UserPasswordResetRequest;
import com.technova.employeemanagement.user.dto.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private Employee employee;

    @BeforeEach
    void setUp() {
        employee = mock(Employee.class);
    }

    @Test
    void shouldCreateUserWithForcedPasswordChange() {

        when(employee.getId()).thenReturn(1L);
        when(employee.getEmploymentStatus()).thenReturn("ACTIVE");

        UserCreateRequest request = new UserCreateRequest();
        request.setUsername("test.employee");
        request.setEmail("test.employee@example.com");
        request.setPassword("TemporaryPass123");
        request.setRole(UserRole.EMPLOYEE);
        request.setEmployeeId(1L);

        when(userRepository.existsByUsername("test.employee"))
                .thenReturn(false);
        when(userRepository.existsByEmail("test.employee@example.com"))
                .thenReturn(false);
        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));
        when(userRepository.existsByEmployee_Id(1L))
                .thenReturn(false);
        when(passwordEncoder.encode("TemporaryPass123"))
                .thenReturn("encoded-password");
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.createUser(request);

        ArgumentCaptor<User> userCaptor =
                ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();

        assertSame(employee, savedUser.getEmployee());
        assertEquals("test.employee", savedUser.getUsername());
        assertEquals("test.employee@example.com", savedUser.getEmail());
        assertEquals("encoded-password", savedUser.getPasswordHash());
        assertEquals(UserRole.EMPLOYEE, savedUser.getRole());
        assertEquals(UserStatus.ACTIVE, savedUser.getStatus());
        assertTrue(savedUser.isMustChangePassword());
        assertNotNull(response);
    }

    @Test
    void shouldRejectDuplicateUsername() {

        UserCreateRequest request = new UserCreateRequest();
        request.setUsername("existing.user");
        request.setEmail("new.user@example.com");
        request.setPassword("TemporaryPass123");
        request.setRole(UserRole.EMPLOYEE);
        request.setEmployeeId(1L);

        when(userRepository.existsByUsername("existing.user"))
                .thenReturn(true);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.createUser(request)
        );

        assertEquals("Username already exists.", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
        verifyNoInteractions(employeeRepository, passwordEncoder);
    }

    @Test
    void shouldRejectCreatingAccountForInactiveEmployee() {

        when(employee.getEmploymentStatus()).thenReturn("TERMINATED");

        UserCreateRequest request = new UserCreateRequest();
        request.setUsername("terminated.employee");
        request.setEmail("terminated@example.com");
        request.setPassword("TemporaryPass123");
        request.setRole(UserRole.EMPLOYEE);
        request.setEmployeeId(1L);

        when(userRepository.existsByUsername("terminated.employee"))
                .thenReturn(false);
        when(userRepository.existsByEmail("terminated@example.com"))
                .thenReturn(false);
        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.createUser(request)
        );

        assertEquals(
                "Login accounts can only be created for active employees.",
                exception.getMessage()
        );

        verify(userRepository, never()).save(any(User.class));
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void shouldRejectCreatingAdditionalAdminAccount() {

        UserCreateRequest request = new UserCreateRequest();
        request.setUsername("another.admin");
        request.setEmail("admin2@example.com");
        request.setPassword("TemporaryPass123");
        request.setRole(UserRole.ADMIN);
        request.setEmployeeId(1L);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.createUser(request)
        );

        assertEquals(
                "Creating additional ADMIN accounts is not allowed.",
                exception.getMessage()
        );

        verifyNoInteractions(
                userRepository,
                employeeRepository,
                passwordEncoder
        );
    }

    @Test
    void shouldResetPasswordAndRequirePasswordChange() {

        User user = new User();
        user.setUsername("test.employee");
        user.setPasswordHash("old-password-hash");
        user.setRole(UserRole.EMPLOYEE);
        user.setStatus(UserStatus.ACTIVE);
        user.setMustChangePassword(false);

        UserPasswordResetRequest request =
                new UserPasswordResetRequest();
        request.setPassword("NewTemporaryPass123");

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.encode("NewTemporaryPass123"))
                .thenReturn("new-encoded-password");

        userService.resetPassword(1L, request);

        assertEquals("new-encoded-password", user.getPasswordHash());
        assertTrue(user.isMustChangePassword());

        verify(userRepository).save(user);
        verify(passwordEncoder).encode("NewTemporaryPass123");
    }

    @Test
    void shouldRejectPasswordResetForMissingUser() {

        UserPasswordResetRequest request =
                new UserPasswordResetRequest();
        request.setPassword("NewTemporaryPass123");

        when(userRepository.findById(99L))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.resetPassword(99L, request)
        );

        assertEquals("User not found: 99", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void shouldDeactivateEmployeeAccount() {

        User user = new User();
        user.setUsername("test.employee");
        user.setEmail("test@example.com");
        user.setRole(UserRole.EMPLOYEE);
        user.setStatus(UserStatus.ACTIVE);

        when(userRepository.findById(2L))
                .thenReturn(Optional.of(user));
        when(userRepository.save(user))
                .thenReturn(user);

        UserResponse response = userService.updateUserStatus(
                2L,
                UserStatus.INACTIVE,
                "sysadmin"
        );

        assertEquals(UserStatus.INACTIVE, user.getStatus());
        assertEquals(UserStatus.INACTIVE, response.getStatus());

        verify(userRepository).save(user);
    }

    @Test
    void shouldActivateInactiveEmployeeAccount() {

        User user = new User();
        user.setUsername("test.employee");
        user.setEmail("test@example.com");
        user.setRole(UserRole.EMPLOYEE);
        user.setStatus(UserStatus.INACTIVE);
        user.setMustChangePassword(true);

        when(userRepository.findById(2L))
                .thenReturn(Optional.of(user));
        when(userRepository.save(user))
                .thenReturn(user);

        UserResponse response = userService.updateUserStatus(
                2L,
                UserStatus.ACTIVE,
                "sysadmin"
        );

        assertEquals(UserStatus.ACTIVE, user.getStatus());
        assertTrue(user.isMustChangePassword());
        assertEquals(UserStatus.ACTIVE, response.getStatus());

        verify(userRepository).save(user);
    }

    @Test
    void shouldRejectSelfDeactivation() {

        User user = new User();
        user.setUsername("sysadmin");
        user.setRole(UserRole.ADMIN);
        user.setStatus(UserStatus.ACTIVE);

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.updateUserStatus(
                        1L,
                        UserStatus.INACTIVE,
                        "sysadmin"
                )
        );

        assertEquals(
                "You cannot deactivate your own account.",
                exception.getMessage()
        );

        verify(userRepository, never()).save(any(User.class));
        verify(userRepository, never())
                .countByRoleAndStatus(any(), any());
    }

    @Test
    void shouldPreventDeactivatingLastActiveAdmin() {

        User admin = new User();
        admin.setUsername("another.admin");
        admin.setRole(UserRole.ADMIN);
        admin.setStatus(UserStatus.ACTIVE);

        when(userRepository.findById(2L))
                .thenReturn(Optional.of(admin));
        when(userRepository.countByRoleAndStatus(
                UserRole.ADMIN,
                UserStatus.ACTIVE
        )).thenReturn(1L);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.updateUserStatus(
                        2L,
                        UserStatus.INACTIVE,
                        "sysadmin"
                )
        );

        assertEquals(
                "The last active ADMIN account cannot be deactivated.",
                exception.getMessage()
        );

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldAllowDeactivatingAdminWhenAnotherActiveAdminExists() {

        User admin = new User();
        admin.setUsername("another.admin");
        admin.setRole(UserRole.ADMIN);
        admin.setStatus(UserStatus.ACTIVE);

        when(userRepository.findById(2L))
                .thenReturn(Optional.of(admin));
        when(userRepository.countByRoleAndStatus(
                UserRole.ADMIN,
                UserStatus.ACTIVE
        )).thenReturn(2L);
        when(userRepository.save(admin))
                .thenReturn(admin);

        UserResponse response = userService.updateUserStatus(
                2L,
                UserStatus.INACTIVE,
                "sysadmin"
        );

        assertEquals(UserStatus.INACTIVE, admin.getStatus());
        assertEquals(UserStatus.INACTIVE, response.getStatus());

        verify(userRepository).save(admin);
    }

    @Test
    void shouldRejectStatusUpdateForMissingUser() {

        when(userRepository.findById(99L))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.updateUserStatus(
                        99L,
                        UserStatus.INACTIVE,
                        "sysadmin"
                )
        );

        assertEquals("User not found: 99", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldRejectNullAccountStatus() {

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.updateUserStatus(
                        2L,
                        null,
                        "sysadmin"
                )
        );

        assertEquals("Account status is required.", exception.getMessage());

        verifyNoInteractions(userRepository);
    }
}