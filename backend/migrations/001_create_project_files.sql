 -- Migration: Create project_files table in SBOX
CREATE TABLE IF NOT EXISTS project_files (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR,
    filename VARCHAR,
    content BYTEA
);
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
