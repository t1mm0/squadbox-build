-- PostgreSQL Database Initialization Script for Squadbox
-- Database: gdiba2_squadbox
-- User: gdiba-2tb-hostingcom

-- Create database if it doesn't exist (this will be done by Docker)
-- CREATE DATABASE gdiba2_squadbox;

-- Connect to the database
\c gdiba2_squadbox;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    subscription_type VARCHAR(50) DEFAULT 'beta',
    subscription_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    file_count INTEGER DEFAULT 0,
    zip_size BIGINT DEFAULT 0,
    has_zip BOOLEAN DEFAULT false,
    download_url VARCHAR(500),
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_time TIMESTAMP,
    build_log TEXT,
    error_log TEXT,
    requirements TEXT,
    generated_files JSONB,
    metadata JSONB
);

-- Create project_files table
CREATE TABLE IF NOT EXISTS project_files (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    content_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tech_stack TEXT[],
    file_count INTEGER DEFAULT 0,
    estimated_build_time INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_type, subscription_status);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_creation_time ON projects(creation_time);
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_files_updated_at BEFORE UPDATE ON project_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates
INSERT INTO templates (id, name, description, category, tech_stack, file_count, estimated_build_time) VALUES
('blog_template', 'Blog Template', 'A modern blog website with clean design', 'Content & Blog', ARRAY['HTML', 'CSS', 'JavaScript'], 15, 300),
('ecommerce_template', 'E-commerce Template', 'Complete online store with shopping cart', 'E-commerce', ARRAY['HTML', 'CSS', 'JavaScript', 'PHP'], 25, 600),
('saas_template', 'SaaS Platform', 'Software as a Service application template', 'Business & SaaS', ARRAY['React', 'Node.js', 'PostgreSQL'], 40, 900),
('portfolio_template', 'Portfolio Template', 'Professional portfolio website', 'Business & SaaS', ARRAY['HTML', 'CSS', 'JavaScript'], 12, 240),
('landing_page_template', 'Landing Page', 'High-converting landing page', 'Marketing', ARRAY['HTML', 'CSS', 'JavaScript'], 8, 180),
('ai_chatbot_template', 'AI Chatbot', 'Intelligent chatbot with AI integration', 'AI-Powered', ARRAY['Python', 'FastAPI', 'OpenAI'], 20, 450),
('dashboard_template', 'Analytics Dashboard', 'Data visualization dashboard', 'Business & SaaS', ARRAY['React', 'D3.js', 'Node.js'], 35, 750),
('mobile_app_template', 'Mobile App PWA', 'Progressive Web App for mobile', 'Mobile & PWA', ARRAY['React', 'PWA', 'Service Workers'], 30, 600),
('ai_content_template', 'AI Content Generator', 'AI-powered content creation tool', 'AI-Powered', ARRAY['Python', 'OpenAI', 'FastAPI'], 25, 500),
('cms_template', 'Blog CMS', 'Content Management System for blogs', 'Content & Blog', ARRAY['PHP', 'MySQL', 'Bootstrap'], 45, 900),
('ecommerce_advanced_template', 'Advanced E-commerce', 'Full-featured online store', 'E-commerce', ARRAY['React', 'Node.js', 'Stripe', 'PostgreSQL'], 60, 1200)
ON CONFLICT (id) DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, subscription_type, subscription_status) VALUES
('admin@squadbox.co.uk', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QzK.2O', 'Admin', 'User', 'admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- Create views for common queries
CREATE OR REPLACE VIEW user_project_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.subscription_type,
    COUNT(p.id) as total_projects,
    COUNT(CASE WHEN p.status = 'complete' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN p.status = 'generating' THEN 1 END) as building_projects,
    COUNT(CASE WHEN p.status = 'failed' THEN 1 END) as failed_projects,
    COALESCE(SUM(p.zip_size), 0) as total_storage_used
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
GROUP BY u.id, u.email, u.subscription_type;

CREATE OR REPLACE VIEW project_details AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.status,
    p.progress,
    p.file_count,
    p.zip_size,
    p.has_zip,
    p.download_url,
    p.creation_time,
    p.completion_time,
    u.email as user_email,
    u.subscription_type,
    t.name as template_name,
    t.category as template_category
FROM projects p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN templates t ON p.template_id = t.id;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE gdiba2_squadbox TO gdiba-2tb-hostingcom;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gdiba-2tb-hostingcom;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gdiba-2tb-hostingcom;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO gdiba-2tb-hostingcom;

-- Set timezone
SET timezone = 'UTC';

-- Log initialization completion
INSERT INTO templates (id, name, description, category) VALUES 
('_init_log', 'Database Initialization', 'PostgreSQL database initialized successfully', 'System')
ON CONFLICT (id) DO NOTHING;
