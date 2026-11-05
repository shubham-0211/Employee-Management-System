package com.technova.employeemanagement.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminBootstrapRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.bootstrap-enabled:false}")
    private boolean bootstrapEnabled;

    @Value("${app.admin.username:}")
    private String adminUsername;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    public AdminBootstrapRunner(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!bootstrapEnabled) {
            return;
        }

        if (userRepository.existsByRole(UserRole.ADMIN)) {
            throw new IllegalStateException(
                    "Admin bootstrap is enabled, but an Admin account already exists. "
                    + "Disable app.admin.bootstrap-enabled.");
        }

        validateConfiguration();

        if (userRepository.existsByUsername(adminUsername)) {
            throw new IllegalStateException("Admin username is already in use.");
        }

        if (userRepository.existsByEmail(adminEmail)) {
            throw new IllegalStateException("Admin email is already in use.");
        }

        User admin = new User();
        admin.setUsername(adminUsername.trim());
        admin.setEmail(adminEmail.trim());
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole(UserRole.ADMIN);
        admin.setStatus(UserStatus.ACTIVE);
        admin.setEmployee(null);

        userRepository.save(admin);

        System.out.println("Initial Admin account created successfully.");
        System.out.println("Disable app.admin.bootstrap-enabled immediately.");
    }

    private void validateConfiguration() {
        if (adminUsername == null || adminUsername.isBlank()
                || adminUsername.length() > 50) {
            throw new IllegalStateException(
                    "A valid ADMIN_USERNAME is required (maximum 50 characters).");
        }

        if (adminEmail == null || adminEmail.isBlank()
                || adminEmail.length() > 254
                || !adminEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalStateException("A valid ADMIN_EMAIL is required.");
        }

        if (adminPassword == null || adminPassword.length() < 12
                || adminPassword.length() > 72) {
            throw new IllegalStateException(
                    "ADMIN_PASSWORD must contain between 12 and 72 characters.");
        }
    }
}