
-- =====================================================
-- Employee Management System
-- Database Schema: v1.5.0
-- =====================================================

-- =====================================================
-- Departments Table
-- =====================================================

CREATE TABLE IF NOT EXISTS departments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    department_code VARCHAR(20) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_departments_department_code (department_code)
);

-- =====================================================
-- Employees Table
-- =====================================================

CREATE TABLE IF NOT EXISTS employees (
    id BIGINT NOT NULL AUTO_INCREMENT,
    employee_code VARCHAR(20) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(30),
    department_id BIGINT,
    job_title VARCHAR(100),
    salary DECIMAL(12,2),
    hire_date DATE,
    termination_date DATE NULL,
    exit_reason VARCHAR(500) NULL,
    employment_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_employees_employee_code (employee_code),
    UNIQUE KEY uk_employees_email (email),

    KEY idx_employees_department_id (department_id),
    KEY idx_employees_employment_status (employment_status),

    CONSTRAINT fk_employees_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- =====================================================
-- Initial Department Records
-- =====================================================

INSERT INTO departments (
    department_code,
    department_name,
    description,
    status
)
VALUES
    ('DEPT001', 'IT', 'Information Technology', 'ACTIVE'),
    ('DEPT002', 'Engineering', 'Engineering Department', 'ACTIVE')
ON DUPLICATE KEY UPDATE
    department_name = VALUES(department_name);
