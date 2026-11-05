package com.technova.employeemanagement.user;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class AuthExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(
            AuthenticationException exception
    ) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "error", "Unauthorized",
                        "message", "Invalid username or password."
                ));
    }

    @ExceptionHandler(LoginRateLimitException.class)
    public ResponseEntity<Map<String, String>> handleRateLimitException(
            LoginRateLimitException exception
    ) {

        HttpHeaders headers = new HttpHeaders();

        headers.set(
                HttpHeaders.RETRY_AFTER,
                String.valueOf(exception.getRetryAfterSeconds())
        );

        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .headers(headers)
                .body(Map.of(
                        "error", "Too Many Requests",
                        "message",
                        "Too many failed login attempts. Please try again later."
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(
            MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Invalid request.");

        return ResponseEntity.badRequest()
                .body(Map.of(
                        "error", "Bad Request",
                        "message", message
                ));
    }
}