-- =====================================================
-- Employee Management System
-- Migration: v1.5.0
-- Purpose: Add employee termination and exit details
-- =====================================================

-- Add employee termination date.
ALTER TABLE employees
ADD COLUMN termination_date DATE NULL
AFTER hire_date;

-- Add employee exit reason.
ALTER TABLE employees
ADD COLUMN exit_reason VARCHAR(500) NULL
AFTER termination_date;

-- Add an index for employee lifecycle filtering.
CREATE INDEX idx_employees_employment_status
ON employees(employment_status);