USE todoapp;

-- Get user IDs
SELECT id, username FROM users;

-- Create sample tasks for admin user (assuming ID 1)
INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at, archived, user_id) VALUES
('Complete project documentation', 'Write comprehensive documentation for the todo app', 'PENDING', 'HIGH', '2024-11-01 10:00:00', NOW(), NOW(), false, 1),
('Review code changes', 'Review and approve pending pull requests', 'IN_PROGRESS', 'MEDIUM', '2024-10-25 15:30:00', NOW(), NOW(), false, 1),
('Setup deployment pipeline', 'Configure CI/CD pipeline for production deployment', 'PENDING', 'HIGH', '2024-10-30 09:00:00', NOW(), NOW(), false, 1),
('Update user interface', 'Improve the dashboard UI with better styling', 'COMPLETED', 'LOW', '2024-10-20 12:00:00', NOW(), NOW(), false, 1);

-- Create sample tasks for regular user (assuming ID 2)
INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at, archived, user_id) VALUES
('Learn React hooks', 'Study and practice React hooks implementation', 'PENDING', 'MEDIUM', '2024-10-28 14:00:00', NOW(), NOW(), false, 2),
('Grocery shopping', 'Buy groceries for the week', 'PENDING', 'LOW', '2024-10-24 18:00:00', NOW(), NOW(), false, 2);

-- Verify tasks created
SELECT id, title, status, priority, user_id FROM tasks;