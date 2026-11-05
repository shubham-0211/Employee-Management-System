-- =====================================================
-- Employee Management System
-- Migration: v1.7.0
-- Purpose: Add forced password change support
-- =====================================================

ALTER TABLE users
ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE
AFTER status;

-- Validate the migration.
SELECT
    id,
    username,
    status,
    must_change_password
FROM users
ORDER BY id;
