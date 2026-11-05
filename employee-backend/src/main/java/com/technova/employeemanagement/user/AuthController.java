package com.technova.employeemanagement.user;

import com.technova.employeemanagement.user.dto.ChangePasswordRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final LoginRateLimiter loginRateLimiter;

    public AuthController(
            AuthService authService,
            LoginRateLimiter loginRateLimiter
    ) {
        this.authService = authService;
        this.loginRateLimiter = loginRateLimiter;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {

        String clientIp = httpRequest.getRemoteAddr();

        String normalizedUsername =
                request.getUsername().trim().toLowerCase(Locale.ROOT);

        String identifier =
                clientIp.length() + ":" + clientIp
                        + normalizedUsername.length() + ":"
                        + normalizedUsername;

        LoginResponse response = loginRateLimiter.execute(
                identifier,
                () -> authService.login(request)
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {

        authService.changePassword(
                authentication.getName(),
                request
        );

        return ResponseEntity.noContent().build();
    }
}