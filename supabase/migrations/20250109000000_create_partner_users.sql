-- Create partner users table (similar to admin_users)
CREATE TABLE IF NOT EXISTS partner_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'inactive')),
    role VARCHAR(50) DEFAULT 'partner' CHECK (role IN ('partner', 'partner_admin')),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Link to the original bulk access request
    bulk_request_id UUID REFERENCES bulk_access_requests(id),
    -- Partner-specific fields
    volume_tier VARCHAR(50) DEFAULT 'standard' CHECK (volume_tier IN ('standard', 'premium', 'enterprise')),
    notes TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_users_email ON partner_users(email);
CREATE INDEX IF NOT EXISTS idx_partner_users_auth_id ON partner_users(auth_id);
CREATE INDEX IF NOT EXISTS idx_partner_users_status ON partner_users(status);
CREATE INDEX IF NOT EXISTS idx_partner_users_organization ON partner_users(organization_name);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_partner_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partner_users_updated_at 
    BEFORE UPDATE ON partner_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_partner_users_updated_at();

-- Enable RLS
ALTER TABLE partner_users ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Allow partners to read their own record
CREATE POLICY "Partners can read own record" ON partner_users
    FOR SELECT 
    TO authenticated
    USING (auth_id = auth.uid());

-- Allow partners to update their own record (limited fields)
CREATE POLICY "Partners can update own record" ON partner_users
    FOR UPDATE 
    TO authenticated
    USING (auth_id = auth.uid())
    WITH CHECK (auth_id = auth.uid());

-- Allow admin users to read all partner records
CREATE POLICY "Admin read access to partners" ON partner_users
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.auth_id = auth.uid() 
            AND admin_users.status = 'active'
        )
    );

-- Allow admin users to update partner records
CREATE POLICY "Admin update access to partners" ON partner_users
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.auth_id = auth.uid() 
            AND admin_users.status = 'active'
        )
    );

-- Allow admin users to insert partner records
CREATE POLICY "Admin insert access to partners" ON partner_users
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.auth_id = auth.uid() 
            AND admin_users.status = 'active'
        )
    );

-- Add helpful comments
COMMENT ON TABLE partner_users IS 'Stores approved partners who can access the order system';
COMMENT ON COLUMN partner_users.status IS 'Partner account status: pending, active, suspended, inactive';
COMMENT ON COLUMN partner_users.volume_tier IS 'Partner volume tier affecting discounts: standard, premium, enterprise';
COMMENT ON COLUMN partner_users.bulk_request_id IS 'Links to the original bulk access request that led to partnership'; 