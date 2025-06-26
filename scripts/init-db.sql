-- Initialize the filehunt database with new table structure
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create file_status enum
DO $$ BEGIN
    CREATE TYPE file_status AS ENUM (
        'active',
        'deleted',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create version_status enum
DO $$ BEGIN
    CREATE TYPE version_status AS ENUM (
        'uploading',
        'processing', 
        'ready',
        'failed',
        'deleted'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create file_metadata table (main file identity)
CREATE TABLE IF NOT EXISTS file_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    tags JSONB,
    status file_status NOT NULL DEFAULT 'active',
    current_version_id UUID,
    total_versions INTEGER NOT NULL DEFAULT 0,
    total_size BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create file_versions table (Git-like versioning)
CREATE TABLE IF NOT EXISTS file_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES file_metadata(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_bucket VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash VARCHAR(255) NOT NULL,
    commit_hash VARCHAR(255),
    commit_message TEXT,
    created_by UUID NOT NULL,
    parent_version_id UUID REFERENCES file_versions(id),
    status version_status NOT NULL DEFAULT 'uploading',
    processing_metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key constraint for current_version_id
ALTER TABLE file_metadata 
ADD CONSTRAINT fk_current_version 
FOREIGN KEY (current_version_id) REFERENCES file_versions(id);

-- Create indexes for file_metadata
CREATE INDEX IF NOT EXISTS idx_file_metadata_user_id ON file_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_file_metadata_status ON file_metadata(status);
CREATE INDEX IF NOT EXISTS idx_file_metadata_created_at ON file_metadata(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_file_metadata_user_status ON file_metadata(user_id, status);
CREATE INDEX IF NOT EXISTS idx_file_metadata_content_type ON file_metadata(content_type);
CREATE INDEX IF NOT EXISTS idx_file_metadata_filename ON file_metadata(filename);
CREATE INDEX IF NOT EXISTS idx_file_metadata_tags ON file_metadata USING GIN(tags);

-- Create indexes for file_versions
CREATE INDEX IF NOT EXISTS idx_file_versions_file_id ON file_versions(file_id);
CREATE INDEX IF NOT EXISTS idx_file_versions_status ON file_versions(status);
CREATE INDEX IF NOT EXISTS idx_file_versions_created_at ON file_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_file_versions_file_version ON file_versions(file_id, version_number);
CREATE INDEX IF NOT EXISTS idx_file_versions_s3_key ON file_versions(s3_key);
CREATE INDEX IF NOT EXISTS idx_file_versions_file_hash ON file_versions(file_hash);
CREATE INDEX IF NOT EXISTS idx_file_versions_commit_hash ON file_versions(commit_hash);
CREATE INDEX IF NOT EXISTS idx_file_versions_created_by ON file_versions(created_by);
CREATE INDEX IF NOT EXISTS idx_file_versions_parent ON file_versions(parent_version_id);

-- Create unique constraint for file_id + version_number
CREATE UNIQUE INDEX IF NOT EXISTS uk_file_versions_file_version 
ON file_versions(file_id, version_number);

-- Create trigger function for updated_at in file_metadata
CREATE OR REPLACE FUNCTION update_file_metadata_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at in file_metadata
DROP TRIGGER IF EXISTS update_file_metadata_updated_at ON file_metadata;
CREATE TRIGGER update_file_metadata_updated_at 
    BEFORE UPDATE ON file_metadata 
    FOR EACH ROW 
    EXECUTE FUNCTION update_file_metadata_updated_at();

-- Create trigger function to update file_metadata stats when versions change
CREATE OR REPLACE FUNCTION update_file_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_versions and total_size
    UPDATE file_metadata 
    SET 
        total_versions = (
            SELECT COUNT(*) 
            FROM file_versions 
            WHERE file_id = COALESCE(NEW.file_id, OLD.file_id) 
            AND status != 'deleted'
        ),
        total_size = (
            SELECT COALESCE(SUM(file_size), 0) 
            FROM file_versions 
            WHERE file_id = COALESCE(NEW.file_id, OLD.file_id) 
            AND status != 'deleted'
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.file_id, OLD.file_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers for file stats updates
DROP TRIGGER IF EXISTS update_file_stats_on_insert ON file_versions;
CREATE TRIGGER update_file_stats_on_insert
    AFTER INSERT ON file_versions
    FOR EACH ROW
    EXECUTE FUNCTION update_file_stats();

DROP TRIGGER IF EXISTS update_file_stats_on_update ON file_versions;
CREATE TRIGGER update_file_stats_on_update
    AFTER UPDATE ON file_versions
    FOR EACH ROW
    EXECUTE FUNCTION update_file_stats();

DROP TRIGGER IF EXISTS update_file_stats_on_delete ON file_versions;
CREATE TRIGGER update_file_stats_on_delete
    AFTER DELETE ON file_versions
    FOR EACH ROW
    EXECUTE FUNCTION update_file_stats();

-- Create function to set current_version_id to latest ready version
CREATE OR REPLACE FUNCTION update_current_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if the new version is ready
    IF NEW.status = 'ready' THEN
        UPDATE file_metadata 
        SET current_version_id = NEW.id
        WHERE id = NEW.file_id 
        AND (
            current_version_id IS NULL 
            OR NEW.version_number > (
                SELECT version_number 
                FROM file_versions 
                WHERE id = file_metadata.current_version_id
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update current_version_id
DROP TRIGGER IF EXISTS update_current_version_on_ready ON file_versions;
CREATE TRIGGER update_current_version_on_ready
    AFTER UPDATE ON file_versions
    FOR EACH ROW
    WHEN (NEW.status = 'ready' AND OLD.status != 'ready')
    EXECUTE FUNCTION update_current_version();

-- Insert sample data for development (optional)
-- This can be removed in production
INSERT INTO file_metadata (id, user_id, filename, original_filename, content_type, status) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'sample.txt', 'sample.txt', 'text/plain', 'active')
ON CONFLICT (id) DO NOTHING;