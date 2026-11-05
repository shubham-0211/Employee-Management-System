package com.technova.employeemanagement.user;

import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Supplier;

@Component
public class LoginRateLimiter {

    private static final int MAX_FAILED_ATTEMPTS = 5;

    private static final long WINDOW_MILLIS =
            Duration.ofMinutes(15).toMillis();

    private static final long BLOCK_DURATION_MILLIS =
            Duration.ofMinutes(15).toMillis();

    private static final int MAX_TRACKED_IDENTIFIERS = 10_000;

    private static final int LOCK_COUNT = 256;

    private final Object[] locks = new Object[LOCK_COUNT];

    private final Map<String, AttemptRecord> attempts =
            new LinkedHashMap<>();

    public LoginRateLimiter() {
        for (int i = 0; i < LOCK_COUNT; i++) {
            locks[i] = new Object();
        }
    }

    /**
     * Executes authentication while holding a lock for the identifier.
     *
     * Requests for the same identifier are serialized.
     * Requests for different identifiers can execute concurrently,
     * except when they share the same lock stripe.
     */
    public <T> T execute(
            String identifier,
            Supplier<T> authenticationAction
    ) {

        Object lock = locks[
                Math.floorMod(identifier.hashCode(), LOCK_COUNT)
        ];

        synchronized (lock) {

            if (isBlocked(identifier)) {

                long retryAfter =
                        getRemainingBlockSeconds(identifier);

                throw new LoginRateLimitException(retryAfter);
            }

            try {

                T result = authenticationAction.get();

                resetAttempts(identifier);

                return result;

            } catch (AuthenticationException exception) {

                recordFailedAttempt(identifier);

                throw exception;
            }
        }
    }

    private synchronized boolean isBlocked(String identifier) {

        long now = System.currentTimeMillis();

        AttemptRecord record = attempts.get(identifier);

        if (record == null) {
            return false;
        }

        if (record.blockedUntil > now) {
            return true;
        }

        if (record.blockedUntil > 0
                || now - record.firstAttemptAt >= WINDOW_MILLIS) {

            attempts.remove(identifier);
        }

        return false;
    }

    private synchronized long getRemainingBlockSeconds(
            String identifier
    ) {

        AttemptRecord record = attempts.get(identifier);

        if (record == null) {
            return 0;
        }

        long remainingMillis =
                record.blockedUntil - System.currentTimeMillis();

        if (remainingMillis <= 0) {
            return 0;
        }

        return (remainingMillis + 999) / 1000;
    }

    private synchronized void recordFailedAttempt(String identifier) {

        long now = System.currentTimeMillis();

        cleanupExpiredEntries(now);

        AttemptRecord record = attempts.get(identifier);

        if (record == null
                || now - record.firstAttemptAt >= WINDOW_MILLIS) {

            record = new AttemptRecord(now);
            attempts.put(identifier, record);
        }

        record.failedAttempts++;

        if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
            record.blockedUntil = now + BLOCK_DURATION_MILLIS;
        }

        enforceMaximumEntries();
    }

    private synchronized void resetAttempts(String identifier) {
        attempts.remove(identifier);
    }

    private void cleanupExpiredEntries(long now) {

        Iterator<Map.Entry<String, AttemptRecord>> iterator =
                attempts.entrySet().iterator();

        while (iterator.hasNext()) {

            AttemptRecord record = iterator.next().getValue();

            boolean windowExpired =
                    now - record.firstAttemptAt >= WINDOW_MILLIS;

            boolean blockExpired =
                    record.blockedUntil > 0
                            && record.blockedUntil <= now;

            if (windowExpired || blockExpired) {
                iterator.remove();
            }
        }
    }

    private void enforceMaximumEntries() {

        Iterator<String> iterator = attempts.keySet().iterator();

        while (attempts.size() > MAX_TRACKED_IDENTIFIERS
                && iterator.hasNext()) {

            iterator.next();
            iterator.remove();
        }
    }

    private static class AttemptRecord {

        private final long firstAttemptAt;

        private int failedAttempts;

        private long blockedUntil;

        private AttemptRecord(long firstAttemptAt) {
            this.firstAttemptAt = firstAttemptAt;
            this.failedAttempts = 0;
            this.blockedUntil = 0;
        }
    }
}