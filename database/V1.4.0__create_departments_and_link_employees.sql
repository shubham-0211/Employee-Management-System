-- ============================================================
-- Employee Management System
-- Version: 1.4.0
-- Migration: Create Departments and Link Existing Employees
-- ============================================================

-- Step 1: Create departments table

CREATE TABLE departments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    department_code VARCHAR(20) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_departments_code (department_code),
    UNIQUE KEY uk_departments_name (department_name)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- Step 2: Insert existing departments

INSERT INTO departments (
    department_code,
    department_name,
    description,
    status
)
VALUES
    ('DEPT001', 'IT', 'Information Technology Department', 'ACTIVE'),
    ('DEPT002', 'Engineering', 'Engineering Department', 'ACTIVE');


-- Step 3: Add department_id to existing employees

ALTER TABLE employees
ADD COLUMN department_id BIGINT NULL;


-- Step 4: Map existing employees to departments

UPDATE employees e
JOIN departments d
    ON TRIM(e.department) = d.department_name
SET e.department_id = d.id;


-- Step 5: Display migration validation results

SELECT
    d.department_code,
    d.department_name,
    COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e
    ON e.department_id = d.id
GROUP BY
    d.id,
    d.department_code,
    d.department_name
ORDER BY d.id;


-- Step 6: Check for employees without a department mapping

SELECT
    id,
    employee_code,
    department
FROM employees
WHERE department IS NOT NULL
  AND TRIM(department) <> ''
  AND department_id IS NULL;