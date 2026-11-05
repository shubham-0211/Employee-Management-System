package com.technova.employeemanagement.user.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = MaxUtf8BytesValidator.class)
@Target({
        ElementType.FIELD,
        ElementType.PARAMETER,
        ElementType.ANNOTATION_TYPE
})
@Retention(RetentionPolicy.RUNTIME)
public @interface MaxUtf8Bytes {

    String message() default "Password cannot exceed 72 UTF-8 bytes.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    int value() default 72;
}