package com.technova.employeemanagement.user;

public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private Long expiresIn;
    private Long userId;
    private String username;
    private String email;
    private String role;
    private Long employeeId;
    private boolean mustChangePassword;

    public LoginResponse() {
    }

    public LoginResponse(
            String accessToken,
            Long expiresIn,
            Long userId,
            String username,
            String email,
            String role,
            Long employeeId,
            boolean mustChangePassword
    ) {
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.role = role;
        this.employeeId = employeeId;
        this.mustChangePassword = mustChangePassword;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public boolean isMustChangePassword() {
        return mustChangePassword;
    }
}