package com.technova.employeemanagement.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.junit.jupiter.api.Assertions.*;

class LoginRateLimiterTest {

    private LoginRateLimiter rateLimiter;

    @BeforeEach
    void setUp() {
        rateLimiter = new LoginRateLimiter();
    }

    @Test
    void shouldBlockAfterFiveFailedAttempts() {

        String identifier = "127.0.0.1:admin";

        for (int i = 1; i <= 5; i++) {

            assertThrows(
                    BadCredentialsException.class,
                    () -> rateLimiter.execute(
                            identifier,
                            () -> {
                                throw new BadCredentialsException(
                                        "Invalid credentials"
                                );
                            }
                    )
            );
        }

        LoginRateLimitException exception = assertThrows(
                LoginRateLimitException.class,
                () -> rateLimiter.execute(
                        identifier,
                        () -> "success"
                )
        );

        assertTrue(exception.getRetryAfterSeconds() > 0);
    }

    @Test
    void shouldResetAttemptsAfterSuccessfulLogin() {

        String identifier = "127.0.0.1:admin";

        for (int i = 1; i <= 4; i++) {

            assertThrows(
                    BadCredentialsException.class,
                    () -> rateLimiter.execute(
                            identifier,
                            () -> {
                                throw new BadCredentialsException(
                                        "Invalid credentials"
                                );
                            }
                    )
            );
        }

        String result = rateLimiter.execute(
                identifier,
                () -> "authenticated"
        );

        assertEquals("authenticated", result);

        for (int i = 1; i <= 5; i++) {

            assertThrows(
                    BadCredentialsException.class,
                    () -> rateLimiter.execute(
                            identifier,
                            () -> {
                                throw new BadCredentialsException(
                                        "Invalid credentials"
                                );
                            }
                    )
            );
        }

        assertThrows(
                LoginRateLimitException.class,
                () -> rateLimiter.execute(
                        identifier,
                        () -> "success"
                )
        );
    }

    @Test
    void shouldTrackDifferentIdentifiersIndependently() {

        String firstIdentifier = "127.0.0.1:admin";
        String secondIdentifier = "127.0.0.1:employee";

        for (int i = 1; i <= 5; i++) {

            assertThrows(
                    BadCredentialsException.class,
                    () -> rateLimiter.execute(
                            firstIdentifier,
                            () -> {
                                throw new BadCredentialsException(
                                        "Invalid credentials"
                                );
                            }
                    )
            );
        }

        String result = rateLimiter.execute(
                secondIdentifier,
                () -> "authenticated"
        );

        assertEquals("authenticated", result);

        assertThrows(
                LoginRateLimitException.class,
                () -> rateLimiter.execute(
                        firstIdentifier,
                        () -> "success"
                )
        );
    }

    @Test
    void shouldBlockConcurrentRequestsAfterFiveFailures()
            throws Exception {

        String identifier = "127.0.0.1:concurrent-user";

        int numberOfRequests = 10;

        ExecutorService executor =
                Executors.newFixedThreadPool(numberOfRequests);

        CountDownLatch startSignal = new CountDownLatch(1);

        List<Future<Integer>> futures = new ArrayList<>();

        try {

            for (int i = 0; i < numberOfRequests; i++) {

                futures.add(executor.submit(() -> {

                    startSignal.await();

                    try {

                        rateLimiter.execute(
                                identifier,
                                () -> {
                                    throw new BadCredentialsException(
                                            "Invalid credentials"
                                    );
                                }
                        );

                        return 200;

                    } catch (BadCredentialsException exception) {
                        return 401;

                    } catch (LoginRateLimitException exception) {
                        return 429;
                    }
                }));
            }

            startSignal.countDown();

            int unauthorizedCount = 0;
            int rateLimitedCount = 0;

            for (Future<Integer> future : futures) {

                int status = future.get();

                if (status == 401) {
                    unauthorizedCount++;
                } else if (status == 429) {
                    rateLimitedCount++;
                }
            }

            assertEquals(5, unauthorizedCount);
            assertEquals(5, rateLimitedCount);

        } finally {

            executor.shutdownNow();
        }
    }
}