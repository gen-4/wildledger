CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    role VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    register_date TIMESTAMP NOT NULL,
    last_login TIMESTAMP,
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP
);

CREATE TABLE users_roles (
    users_id BIGINT NOT NULL REFERENCES users(id),
    roles_id BIGINT NOT NULL REFERENCES roles(id),
    PRIMARY KEY (users_id, roles_id)
);

INSERT INTO roles (role) VALUES ('USER'), ('ADMIN');
