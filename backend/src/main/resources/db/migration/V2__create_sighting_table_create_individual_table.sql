CREATE TABLE individual (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT CONSTRAINT fk_individual_users REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(64),
    embedding BYTEA,
    species VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS  individual_reporter_idx ON individual(reporter_id);

CREATE TABLE sighting (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT CONSTRAINT fk_sighting_users REFERENCES users(id) ON DELETE SET NULL,
    individual_id BIGINT CONSTRAINT fk_sighting_individual REFERENCES individual(id) ON DELETE SET NULL,
    identification_confidence NUMERIC(3,2),
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    image_path VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(16) NOT NULL,
    sighting_date TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT chk_status_options CHECK (status IN 
        ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'FAILED', 'PROCESSING', 'PROCESSED')
    ),
    CONSTRAINT chk_latitude_is_valid CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT chk_longitude_is_valid  CHECK (longitude BETWEEN -180 AND 180),
    CONSTRAINT chk_confidence_is_valid CHECK (identification_confidence BETWEEN 0 AND 1)
);

CREATE INDEX IF NOT EXISTS  sighting_reporter_idx ON sighting(reporter_id);
CREATE INDEX IF NOT EXISTS  sighting_individual_idx ON sighting(individual_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_individual_updated_at
    BEFORE UPDATE ON individual
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_sighting_updated_at
    BEFORE UPDATE ON sighting
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE roles ADD CONSTRAINT chk_role_options 
    CHECK (role IN ('USER', 'ADMIN'));