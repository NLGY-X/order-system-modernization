-- Fix RLS policies to allow anonymous read access for public data
-- This will allow the order form to load products and countries without authentication

-- Enable RLS on tables (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppp_classifications ENABLE ROW LEVEL SECURITY;

-- Drop existing anonymous read policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read access to products" ON products;
DROP POLICY IF EXISTS "Allow anonymous read access to ppp_classifications" ON ppp_classifications;

-- Create new policies to allow anonymous read access
CREATE POLICY "Allow anonymous read access to products" 
ON products FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow anonymous read access to ppp_classifications" 
ON ppp_classifications FOR SELECT 
TO anon 
USING (true);

-- Also allow authenticated users to read these tables
CREATE POLICY "Allow authenticated read access to products" 
ON products FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated read access to ppp_classifications" 
ON ppp_classifications FOR SELECT 
TO authenticated 
USING (true);

-- Keep admin operations restricted to admin users only
-- (These policies would need to be created/maintained based on your admin_users table) 