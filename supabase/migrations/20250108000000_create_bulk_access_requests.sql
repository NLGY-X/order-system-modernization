-- Create bulk access requests table
CREATE TABLE IF NOT EXISTS bulk_access_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    country VARCHAR(100) NOT NULL,
    expected_volume VARCHAR(50) NOT NULL,
    certifications_interest TEXT[],
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'contacted')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bulk_access_requests_email ON bulk_access_requests(email);
CREATE INDEX IF NOT EXISTS idx_bulk_access_requests_status ON bulk_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_bulk_access_requests_created_at ON bulk_access_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_bulk_access_requests_organization_type ON bulk_access_requests(organization_type);

-- Create trigger to update updated_at column (matches existing pattern)
CREATE OR REPLACE FUNCTION update_bulk_access_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bulk_access_requests_updated_at 
    BEFORE UPDATE ON bulk_access_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_bulk_access_requests_updated_at();

-- Enable RLS (following existing pattern)
ALTER TABLE bulk_access_requests ENABLE ROW LEVEL SECURITY;

-- Create policies following the same pattern as existing tables

-- Allow anonymous users to insert (signup submissions) - matches fix-rls-policies.sql pattern
CREATE POLICY "Allow anonymous signup submissions" ON bulk_access_requests
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Allow authenticated users to insert as well
CREATE POLICY "Allow authenticated signup submissions" ON bulk_access_requests
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Allow admin users to read all requests (matches existing admin pattern using admin_users table)
CREATE POLICY "Allow admin read access" ON bulk_access_requests
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.auth_id = auth.uid() 
            AND admin_users.status = 'active'
        )
    );

-- Allow admin users to update requests (matches existing admin pattern)
CREATE POLICY "Allow admin update access" ON bulk_access_requests
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.auth_id = auth.uid() 
            AND admin_users.status = 'active'
        )
    );

-- Add foreign key constraint for reviewed_by after ensuring compatibility
-- Note: This links to admin_users.auth_id rather than auth.users.id to match existing pattern
ALTER TABLE bulk_access_requests 
ADD CONSTRAINT fk_bulk_access_requests_reviewed_by 
FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);

-- Add helpful comments
COMMENT ON TABLE bulk_access_requests IS 'Stores applications for the certificates.dev partner program from training providers';
COMMENT ON COLUMN bulk_access_requests.status IS 'Partner application status: pending, approved, rejected, contacted';
COMMENT ON COLUMN bulk_access_requests.expected_volume IS 'Expected monthly certificate volume for partnership';
COMMENT ON COLUMN bulk_access_requests.certifications_interest IS 'Array of certification types the partner is interested in offering';
COMMENT ON COLUMN bulk_access_requests.reviewed_by IS 'Auth user ID of admin who reviewed this partner application';
COMMENT ON COLUMN bulk_access_requests.admin_notes IS 'Internal notes from partner application review process'; 