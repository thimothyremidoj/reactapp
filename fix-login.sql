-- Fix login issue by manually creating users
USE todoapp;

-- Clear existing users
DELETE FROM users;

-- Insert admin user with correct BCrypt hash for 'admin123'
INSERT INTO users (username, email, password, role, created_at) VALUES 
('admin', 'admin@todoapp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', NOW());

-- Insert user with correct BCrypt hash for 'user123'
INSERT INTO users (username, email, password, role, created_at) VALUES 
('user', 'user@todoapp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER', NOW());

-- Verify users
SELECT id, username, email, role FROM users;