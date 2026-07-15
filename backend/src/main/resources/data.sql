-- Roles
INSERT INTO roles (role) VALUES ('USER'), ('ADMIN')
ON CONFLICT (role) DO NOTHING;

-- Admin user (password: 123456, BCrypt hashed)
INSERT INTO users (username, password, register_date, is_banned, is_enabled, updated_at)
VALUES ('admin', '$2a$10$rHxX0jSF14JErSjrrFTB9exXPRkbzpq9.mg9nV2vHZVIjOqKQNvQe', CURRENT_TIMESTAMP, false, true, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- Assign ADMIN role to admin user
INSERT INTO users_roles (user_id, roles_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.role = 'ADMIN'
AND NOT EXISTS (
    SELECT 1 FROM users_roles ur WHERE ur.user_id = u.id AND ur.roles_id = r.id
);
