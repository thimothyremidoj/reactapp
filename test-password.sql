USE todoapp;

-- Test password updates (use environment variables or secure methods)
-- UPDATE users SET password = '<ENCRYPTED_ADMIN_PASSWORD>' WHERE username = 'admin';
-- UPDATE users SET password = '<ENCRYPTED_USER_PASSWORD>' WHERE username = 'user';

SELECT username, role FROM users;