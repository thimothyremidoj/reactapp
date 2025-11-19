USE todoapp;

-- Update admin password (use environment variable or secure method)
-- UPDATE users SET password = '<ENCRYPTED_PASSWORD>' WHERE username = 'admin';

SELECT username, email, role FROM users WHERE username = 'admin';