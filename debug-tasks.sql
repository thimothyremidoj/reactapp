USE todoapp;

-- Check all users and their IDs
SELECT id, username, email, role FROM users;

-- Check all tasks and their user assignments
SELECT id, title, user_id, status, priority, created_at, archived FROM tasks;

-- Check tasks by user
SELECT u.username, t.title, t.status, t.user_id 
FROM users u 
LEFT JOIN tasks t ON u.id = t.user_id;