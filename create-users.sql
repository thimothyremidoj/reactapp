-- Create default users for Advanced To-Do App
-- Run this in MySQL after starting the application

USE todoapp;

-- Delete existing users if they exist
DELETE FROM users WHERE username IN ('admin', 'user');

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, role, created_at) VALUES 
('admin', 'admin@todoapp.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd99jbyrdF.RoFGi', 'ADMIN', NOW());

-- Insert regular user (password: user123)  
INSERT INTO users (username, email, password, role, created_at) VALUES 
('user', 'user@todoapp.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd99jbyrdF.RoFGi', 'USER', NOW());

-- Verify users created
SELECT id, username, email, role, created_at FROM users;