package com.technova.employeemanagement.user.validation;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MaxUtf8BytesValidatorTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    @Test
    void shouldAcceptPasswordWith72AsciiBytes() {
        TestPassword password = new TestPassword("A".repeat(72));

        assertTrue(validator.validate(password).isEmpty());
    }

    @Test
    void shouldRejectPasswordWith73AsciiBytes() {
        TestPassword password = new TestPassword("A".repeat(73));

        assertFalse(validator.validate(password).isEmpty());
    }

    @Test
    void shouldAcceptPasswordWith72UnicodeBytes() {
        TestPassword password = new TestPassword("😀".repeat(18));

        assertTrue(validator.validate(password).isEmpty());
    }

    @Test
    void shouldRejectPasswordExceeding72UnicodeBytes() {
        TestPassword password = new TestPassword("😀".repeat(19));

        assertFalse(validator.validate(password).isEmpty());
    }

    private static class TestPassword {

        @MaxUtf8Bytes(72)
        private final String password;

        private TestPassword(String password) {
            this.password = password;
        }
    }
}