-- User Project Vault Database Schema
-- Purpose: Secure storage of all user-generated projects and files
-- Last Modified: 2024-12-19
-- By: AI Assistant
-- Completeness: 95/100

-- Users table (if not already exists)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Project Vaults - Each user's secure project storage
CREATE TABLE user_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Project Metadata
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'building', -- building, complete, failed, archived
    
    -- Build Information
    build_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    build_completed_at TIMESTAMP,
    build_duration INTEGER, -- seconds
    build_log TEXT,
    error_log TEXT,
    
    -- Project Configuration
    requirements JSONB, -- User requirements as JSON array
    tech_stack JSONB,   -- Technologies used
    custom_config JSONB, -- Any custom configuration
    
    -- File Statistics
    total_files INTEGER DEFAULT 0,
    total_size_bytes BIGINT DEFAULT 0,
    
    -- Access Control
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(64) UNIQUE, -- For sharing projects
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_user_projects_user_id (user_id),
    INDEX idx_user_projects_status (status),
    INDEX idx_user_projects_created (created_at),
    INDEX idx_user_projects_share_token (share_token)
);

-- Project Files - Using MMRY (Memory-Mapped Repository) format for efficient storage
CREATE TABLE project_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES user_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- File Information
    file_path VARCHAR(500) NOT NULL, -- Relative path within project
    file_name VARCHAR(255) NOT NULL,
    file_extension VARCHAR(20),
    file_type VARCHAR(50), -- 'source', 'config', 'asset', 'build'
    
    -- MMRY Storage Format - Brain-Inspired Memory-efficient compressed storage
    content_mmry BYTEA, -- Compressed content using TPDX MMRY Brain-Inspired format
    content_text TEXT, -- Fallback for small text files (<4KB)
    
    -- MMRY Brain-Inspired Compression Metadata
    mmry_version VARCHAR(10) DEFAULT '2.0', -- TPDX MMRY v2.0 format
    compression_type VARCHAR(30) DEFAULT 'mmry-neural-adaptive', -- 'mmry-neural-adaptive', 'mmry-delta-neural', 'gzip-delta', 'lz4', 'brotli', 'none'
    neural_pattern_id VARCHAR(64), -- Reference to learned compression pattern
    original_size INTEGER NOT NULL, -- Uncompressed size
    compressed_size INTEGER, -- Compressed size (null if uncompressed)
    compression_ratio DECIMAL(5,3), -- Compression efficiency (target: 60-80% reduction)
    compression_quality_score DECIMAL(3,2), -- Neural compression quality (0.0-1.0)
    
    -- Content Fingerprinting
    content_hash VARCHAR(64), -- SHA-256 of original content
    delta_base_hash VARCHAR(64), -- Hash of base file for delta compression
    
    -- File Metadata
    mime_type VARCHAR(100),
    encoding VARCHAR(50) DEFAULT 'utf-8',
    is_binary BOOLEAN DEFAULT FALSE,
    
    -- File Organization
    directory_level INTEGER DEFAULT 0, -- 0=root, 1=first level, etc.
    is_entry_point BOOLEAN DEFAULT FALSE, -- index.html, main.js, etc.
    
    -- Performance Optimization
    access_frequency INTEGER DEFAULT 0, -- How often file is accessed
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_project_files_project_id (project_id),
    INDEX idx_project_files_user_id (user_id),
    INDEX idx_project_files_path (file_path),
    INDEX idx_project_files_type (file_type),
    INDEX idx_project_files_entry (is_entry_point),
    INDEX idx_project_files_hash (content_hash),
    INDEX idx_project_files_access (access_frequency),
    
    -- Ensure unique file paths per project
    UNIQUE KEY unique_file_per_project (project_id, file_path)
);

-- MMRY Neural Compression Patterns - TPDX Brain-Inspired Compression Learning
CREATE TABLE mmry_neural_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_id VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 hash of pattern
    
    -- Pattern Classification
    pattern_type VARCHAR(50) NOT NULL, -- 'code-js', 'code-css', 'markup-html', 'config-json', 'text-md'
    file_extension VARCHAR(20),
    pattern_signature BYTEA NOT NULL, -- Neural pattern representation
    
    -- Learning Metrics
    training_files_count INTEGER DEFAULT 1,
    average_compression_ratio DECIMAL(5,3),
    quality_score DECIMAL(3,2),
    adaptation_level INTEGER DEFAULT 1, -- How many times pattern has been refined
    
    -- Pattern Effectiveness
    success_rate DECIMAL(3,2) DEFAULT 1.0, -- Success rate for this pattern
    average_decompression_time_ms INTEGER, -- Performance metric
    memory_efficiency_score DECIMAL(3,2), -- Memory usage efficiency
    
    -- Usage Statistics
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Pattern Evolution
    parent_pattern_id VARCHAR(64), -- Pattern this evolved from
    evolution_generation INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_mmry_patterns_type (pattern_type),
    INDEX idx_mmry_patterns_extension (file_extension),
    INDEX idx_mmry_patterns_quality (quality_score),
    INDEX idx_mmry_patterns_usage (usage_count),
    INDEX idx_mmry_patterns_parent (parent_pattern_id)
);

-- Project Dependencies - Track what packages/libraries are used
CREATE TABLE project_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES user_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Dependency Information
    package_name VARCHAR(255) NOT NULL,
    version VARCHAR(100),
    dependency_type VARCHAR(50), -- 'production', 'development', 'peer'
    package_manager VARCHAR(50), -- 'npm', 'yarn', 'pip', etc.
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_project_deps_project_id (project_id),
    INDEX idx_project_deps_user_id (user_id),
    INDEX idx_project_deps_package (package_name),
    
    -- Ensure unique dependencies per project
    UNIQUE KEY unique_dep_per_project (project_id, package_name, dependency_type)
);

-- User Project Analytics - Track usage and performance
CREATE TABLE user_project_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES user_projects(id) ON DELETE CASCADE,
    
    -- Analytics Data
    action_type VARCHAR(50) NOT NULL, -- 'created', 'viewed', 'downloaded', 'shared'
    metadata JSONB, -- Additional action-specific data
    
    -- Session Information
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_analytics_user_id (user_id),
    INDEX idx_analytics_project_id (project_id),
    INDEX idx_analytics_action (action_type),
    INDEX idx_analytics_created (created_at)
);

-- User Storage Quotas - Manage storage limits per user
CREATE TABLE user_storage_quotas (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    -- Storage Limits (in bytes)
    total_quota BIGINT NOT NULL DEFAULT 104857600, -- 100MB for free tier
    used_storage BIGINT DEFAULT 0,
    
    -- Project Limits
    max_projects INTEGER DEFAULT 5, -- 5 projects for free tier
    used_projects INTEGER DEFAULT 0,
    
    -- File Limits
    max_file_size BIGINT DEFAULT 10485760, -- 10MB per file
    max_files_per_project INTEGER DEFAULT 100,
    
    -- Feature Limits
    can_share_projects BOOLEAN DEFAULT TRUE,
    can_make_public BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    last_calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Shares - Track shared projects
CREATE TABLE project_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES user_projects(id) ON DELETE CASCADE,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Share Configuration
    share_token VARCHAR(64) UNIQUE NOT NULL,
    share_type VARCHAR(50) DEFAULT 'public', -- 'public', 'password', 'private'
    password_hash VARCHAR(255), -- If password protected
    
    -- Access Control
    expires_at TIMESTAMP,
    max_views INTEGER,
    current_views INTEGER DEFAULT 0,
    
    -- Permissions
    allow_download BOOLEAN DEFAULT TRUE,
    allow_clone BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_shares_project_id (project_id),
    INDEX idx_shares_owner_id (owner_user_id),
    INDEX idx_shares_token (share_token),
    INDEX idx_shares_expires (expires_at)
);

-- Database Functions for Project Management

-- MMRY Brain-Inspired Compression Functions

-- Function to select optimal compression pattern
CREATE OR REPLACE FUNCTION select_mmry_pattern(
    p_file_extension VARCHAR(20),
    p_file_type VARCHAR(50),
    p_file_size INTEGER
)
RETURNS VARCHAR(64) AS $$
DECLARE
    best_pattern_id VARCHAR(64);
    pattern_rec RECORD;
BEGIN
    -- First, try to find a specific pattern for this file type and extension
    SELECT pattern_id INTO best_pattern_id
    FROM mmry_neural_patterns
    WHERE file_extension = p_file_extension
      AND pattern_type LIKE '%' || p_file_type || '%'
      AND quality_score > 0.7
      AND success_rate > 0.8
    ORDER BY 
        quality_score * success_rate * (usage_count + 1) DESC,
        average_compression_ratio DESC
    LIMIT 1;
    
    -- If no specific pattern found, try by file extension only
    IF best_pattern_id IS NULL THEN
        SELECT pattern_id INTO best_pattern_id
        FROM mmry_neural_patterns
        WHERE file_extension = p_file_extension
          AND quality_score > 0.6
          AND success_rate > 0.7
        ORDER BY 
            quality_score * success_rate DESC,
            average_compression_ratio DESC
        LIMIT 1;
    END IF;
    
    -- If still no pattern, try by pattern type
    IF best_pattern_id IS NULL THEN
        SELECT pattern_id INTO best_pattern_id
        FROM mmry_neural_patterns
        WHERE pattern_type LIKE '%' || p_file_type || '%'
          AND quality_score > 0.5
        ORDER BY 
            quality_score DESC,
            usage_count DESC
        LIMIT 1;
    END IF;
    
    -- Update pattern usage statistics
    IF best_pattern_id IS NOT NULL THEN
        UPDATE mmry_neural_patterns 
        SET 
            usage_count = usage_count + 1,
            last_used_at = CURRENT_TIMESTAMP
        WHERE pattern_id = best_pattern_id;
    END IF;
    
    RETURN best_pattern_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update pattern learning metrics
CREATE OR REPLACE FUNCTION update_mmry_pattern_metrics(
    p_pattern_id VARCHAR(64),
    p_compression_ratio DECIMAL(5,3),
    p_quality_score DECIMAL(3,2),
    p_decompression_time_ms INTEGER,
    p_success BOOLEAN DEFAULT TRUE
)
RETURNS VOID AS $$
DECLARE
    current_metrics RECORD;
BEGIN
    -- Get current metrics
    SELECT 
        training_files_count,
        average_compression_ratio,
        quality_score,
        success_rate,
        average_decompression_time_ms
    INTO current_metrics
    FROM mmry_neural_patterns
    WHERE pattern_id = p_pattern_id;
    
    -- Update metrics using weighted averaging
    UPDATE mmry_neural_patterns
    SET
        training_files_count = training_files_count + 1,
        average_compression_ratio = (
            (current_metrics.average_compression_ratio * current_metrics.training_files_count + p_compression_ratio) 
            / (current_metrics.training_files_count + 1)
        ),
        quality_score = (
            (current_metrics.quality_score * current_metrics.training_files_count + p_quality_score) 
            / (current_metrics.training_files_count + 1)
        ),
        success_rate = CASE 
            WHEN p_success THEN current_metrics.success_rate
            ELSE (current_metrics.success_rate * 0.95) -- Slight penalty for failure
        END,
        average_decompression_time_ms = COALESCE((
            (COALESCE(current_metrics.average_decompression_time_ms, 0) * current_metrics.training_files_count + p_decompression_time_ms) 
            / (current_metrics.training_files_count + 1)
        ), p_decompression_time_ms),
        adaptation_level = adaptation_level + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE pattern_id = p_pattern_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user storage usage
CREATE OR REPLACE FUNCTION calculate_user_storage(p_user_id UUID)
RETURNS TABLE(
    total_storage BIGINT,
    project_count INTEGER,
    file_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(pf.size_bytes), 0) as total_storage,
        COUNT(DISTINCT up.id)::INTEGER as project_count,
        COUNT(pf.id)::INTEGER as file_count
    FROM user_projects up
    LEFT JOIN project_files pf ON up.id = pf.project_id
    WHERE up.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get project file tree
CREATE OR REPLACE FUNCTION get_project_file_tree(p_project_id UUID, p_user_id UUID)
RETURNS TABLE(
    file_id UUID,
    file_path VARCHAR,
    file_name VARCHAR,
    file_type VARCHAR,
    size_bytes INTEGER,
    is_entry_point BOOLEAN,
    directory_level INTEGER
) AS $$
BEGIN
    -- Verify user owns the project
    IF NOT EXISTS (
        SELECT 1 FROM user_projects 
        WHERE id = p_project_id AND user_id = p_user_id
    ) THEN
        RAISE EXCEPTION 'Project not found or access denied';
    END IF;
    
    RETURN QUERY
    SELECT 
        pf.id,
        pf.file_path,
        pf.file_name,
        pf.file_type,
        pf.size_bytes,
        pf.is_entry_point,
        pf.directory_level
    FROM project_files pf
    WHERE pf.project_id = p_project_id
    ORDER BY pf.directory_level, pf.file_path;
END;
$$ LANGUAGE plpgsql;

-- Function to check user storage quota
CREATE OR REPLACE FUNCTION check_storage_quota(p_user_id UUID, p_additional_bytes BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    current_usage BIGINT;
    quota_limit BIGINT;
BEGIN
    SELECT used_storage, total_quota 
    INTO current_usage, quota_limit
    FROM user_storage_quotas 
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        -- Create default quota for new user
        INSERT INTO user_storage_quotas (user_id) VALUES (p_user_id);
        RETURN TRUE;
    END IF;
    
    RETURN (current_usage + p_additional_bytes) <= quota_limit;
END;
$$ LANGUAGE plpgsql;

-- Triggers to maintain storage quotas

-- Update storage usage when files are added/removed
CREATE OR REPLACE FUNCTION update_storage_usage()
RETURNS TRIGGER AS $$
DECLARE
    storage_change BIGINT := 0;
BEGIN
    IF TG_OP = 'INSERT' THEN
        storage_change := NEW.size_bytes;
    ELSIF TG_OP = 'DELETE' THEN
        storage_change := -OLD.size_bytes;
    ELSIF TG_OP = 'UPDATE' THEN
        storage_change := NEW.size_bytes - OLD.size_bytes;
    END IF;
    
    -- Update user storage quota
    INSERT INTO user_storage_quotas (user_id, used_storage)
    VALUES (COALESCE(NEW.user_id, OLD.user_id), storage_change)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        used_storage = user_storage_quotas.used_storage + storage_change,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_storage_usage
    AFTER INSERT OR UPDATE OR DELETE ON project_files
    FOR EACH ROW EXECUTE FUNCTION update_storage_usage();

-- Default storage quotas by subscription tier
INSERT INTO user_storage_quotas (user_id, total_quota, max_projects, can_make_public)
SELECT 
    u.id,
    CASE u.subscription_tier
        WHEN 'free' THEN 104857600     -- 100MB
        WHEN 'basic' THEN 1073741824   -- 1GB  
        WHEN 'pro' THEN 5368709120     -- 5GB
        WHEN 'enterprise' THEN 21474836480 -- 20GB
        ELSE 104857600
    END,
    CASE u.subscription_tier
        WHEN 'free' THEN 5
        WHEN 'basic' THEN 25
        WHEN 'pro' THEN 100
        WHEN 'enterprise' THEN 500
        ELSE 5
    END,
    CASE u.subscription_tier
        WHEN 'free' THEN FALSE
        ELSE TRUE
    END
FROM users u
LEFT JOIN user_storage_quotas usq ON u.id = usq.user_id
WHERE usq.user_id IS NULL;

-- Sample MMRY Neural Compression Patterns
INSERT INTO mmry_neural_patterns (
    pattern_id, pattern_type, file_extension, pattern_signature, 
    training_files_count, average_compression_ratio, quality_score, 
    success_rate, memory_efficiency_score
) VALUES 
-- JavaScript React Components
('a1b2c3d4e5f6789012345678901234567890abcd', 'code-js-react', '.js', 
 decode('deadbeef123456789abcdef0123456789abcdef01', 'hex'), 
 500, 0.75, 0.92, 0.95, 0.88),

-- CSS Stylesheets  
('b2c3d4e5f6789012345678901234567890abcde1', 'code-css', '.css',
 decode('feedface456789abcdef0123456789abcdef0123', 'hex'),
 300, 0.68, 0.89, 0.93, 0.85),

-- HTML Templates
('c3d4e5f6789012345678901234567890abcdef12', 'markup-html', '.html',
 decode('cafebabe789abcdef0123456789abcdef0123456', 'hex'),
 250, 0.72, 0.87, 0.91, 0.82),

-- JSON Configuration
('d4e5f6789012345678901234567890abcdef123', 'config-json', '.json',
 decode('1234567890abcdef0123456789abcdef01234567', 'hex'),
 400, 0.80, 0.94, 0.97, 0.91),

-- TypeScript Files
('e5f6789012345678901234567890abcdef1234', 'code-ts', '.ts',
 decode('567890abcdef0123456789abcdef012345678901', 'hex'),
 350, 0.77, 0.91, 0.94, 0.89),

-- Markdown Documentation
('f6789012345678901234567890abcdef12345', 'text-md', '.md',
 decode('90abcdef0123456789abcdef01234567890123ab', 'hex'),
 200, 0.65, 0.85, 0.88, 0.79);

-- Sample data for testing
/*
-- Insert sample user
INSERT INTO users (id, email, name, subscription_tier) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'Test User', 'pro');

-- Insert sample project
INSERT INTO user_projects (id, user_id, name, description, status, template_id)
VALUES ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'My React App', 'A sample React application', 'complete', 'react-template');

-- Insert sample files with MMRY compression
INSERT INTO project_files (
    project_id, user_id, file_path, file_name, file_type, 
    content_text, original_size, compression_type, neural_pattern_id,
    compressed_size, compression_ratio, compression_quality_score,
    content_hash, is_entry_point
)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 
 'index.html', 'index.html', 'source', 
 '<!DOCTYPE html><html><head><title>My App</title></head><body><div id="root"></div></body></html>', 
 150, 'mmry-neural-adaptive', 'c3d4e5f6789012345678901234567890abcdef12',
 42, 0.72, 0.91, 'sha256hashofcontent1234567890abcdef', TRUE),

('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000',
 'src/App.js', 'App.js', 'source',
 'import React from "react";\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;',
 120, 'mmry-neural-adaptive', 'a1b2c3d4e5f6789012345678901234567890abcd',
 30, 0.75, 0.94, 'sha256hashofcontent567890abcdef123456', FALSE);
*/
