package com.technova.employeemanagement.user;

import com.technova.employeemanagement.user.dto.UserCreateRequest;
import com.technova.employeemanagement.user.dto.UserPasswordResetRequest;
import com.technova.employeemanagement.user.dto.UserResponse;
import com.technova.employeemanagement.user.dto.UserStatusUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(
            UserService userService,
            UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(
            @Valid @RequestBody UserCreateRequest request) {

        return userService.createUser(request);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getEmployee() != null
                                ? user.getEmployee().getId()
                                : null,
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.getStatus()
                ))
                .toList();
    }

    @PutMapping("/{id}/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(
            @PathVariable Long id,
            @Valid @RequestBody UserPasswordResetRequest request) {

        userService.resetPassword(id, request);
    }

    @PatchMapping("/{id}/status")
    public UserResponse updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateRequest request,
            Authentication authentication) {

        return userService.updateUserStatus(
                id,
                request.getStatus(),
                authentication.getName()
        );
    }
}