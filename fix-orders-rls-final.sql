-- Final comprehensive RLS fix for orders table
-- This explicitly handles all roles and permissions

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow anonymous insert to orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Prevent anonymous select" ON orders;
DROP POLICY IF EXISTS "Prevent anonymous update" ON orders;
DROP POLICY IF EXISTS "Prevent anonymous delete" ON orders;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON orders;
DROP POLICY IF EXISTS "Allow authenticated read all orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated update orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous read own orders" ON orders;
DROP POLICY IF EXISTS "Allow service role full access to orders" ON orders;

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous (anon) role to INSERT orders
CREATE POLICY "anon_insert_orders" 
ON orders FOR INSERT 
TO anon 
WITH CHECK (true);

-- Policy 2: Allow service_role full access (for webhooks and admin operations)
CREATE POLICY "service_role_all_orders" 
ON orders FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Policy 3: Allow authenticated users to read all orders (admin panel)
CREATE POLICY "authenticated_read_orders" 
ON orders FOR SELECT 
TO authenticated 
USING (true);

-- Policy 4: Allow authenticated users to update orders (admin panel)
CREATE POLICY "authenticated_update_orders" 
ON orders FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Policy 5: Prevent anonymous users from reading orders
CREATE POLICY "anon_no_select_orders" 
ON orders FOR SELECT 
TO anon 
USING (false);

-- Policy 6: Prevent anonymous users from updating orders
CREATE POLICY "anon_no_update_orders" 
ON orders FOR UPDATE 
TO anon 
USING (false);

-- Policy 7: Prevent anonymous users from deleting orders
CREATE POLICY "anon_no_delete_orders" 
ON orders FOR DELETE 
TO anon 
USING (false); 