-- =====================================================
-- Employee Management System
-- Migration: v1.6.0
-- Purpose: Add user authentication and RBAC
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,

    employee_id BIGINT NULL,

    username VARCHAR(50) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_users_username (username),
    UNIQUE KEY uk_users_email (email),
    UNIQUE KEY uk_users_employee_id (employee_id),

    KEY idx_users_role (role),
    KEY idx_users_status (status),

    CONSTRAINT fk_users_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_users_role
        CHECK (role IN ('ADMIN', 'HR', 'EMPLOYEE')),

    CONSTRAINT chk_users_status
        CHECK (status IN ('ACTIVE', 'INACTIVE'))
);