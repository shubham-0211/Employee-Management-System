package com.technova.employeemanagement.user;

import com.technova.employeemanagement.user.dto.ChangePasswordRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        User user = userRepository.findWithEmployeeByUsername(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new IllegalStateException("Authenticated user not found.")
                );

        String token = jwtService.generateToken(user);

        Long employeeId = user.getEmployee() != null
                ? user.getEmployee().getId()
                : null;

        return new LoginResponse(
                token,
                jwtService.getExpirationMs(),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                employeeId,
                user.isMustChangePassword()
        );
    }

    @Transactional
    public void changePassword(
            String username,
            ChangePasswordRequest request
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalStateException("Authenticated user not found.")
                );

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPasswordHash()
        )) {
            throw new BadCredentialsException(
                    "Current password is incorrect."
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPasswordHash()
        )) {
            throw new IllegalArgumentException(
                    "New password must be different from the current password."
            );
        }

        user.setPasswordHash(
                passwordEncoder.encode(request.getNewPassword())
        );

        user.setMustChangePassword(false);

        userRepository.save(user);
    }
}