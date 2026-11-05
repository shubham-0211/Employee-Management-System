package com.technova.employeemanagement.user;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT secret is not configured.");
        }

        if (expirationMs <= 0) {
            throw new IllegalArgumentException(
                    "JWT expiration must be greater than zero."
            );
        }

        try {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception exception) {
            throw new IllegalStateException(
                    "JWT secret must be a valid Base64-encoded key of at least 256 bits.",
                    exception
            );
        }

        this.expirationMs = expirationMs;
    }

    public String generateToken(User user) {

        Instant now = Instant.now();
        Instant expiration = now.plusMillis(expirationMs);

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(signingKey)
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        try {

            Claims claims = extractAllClaims(token);

            return claims.getSubject() != null
                    && claims.getSubject().equals(userDetails.getUsername())
                    && userDetails.isEnabled();

        } catch (Exception exception) {
            return false;
        }
    }

    public long getExpirationMs() {
        return expirationMs;
    }
}