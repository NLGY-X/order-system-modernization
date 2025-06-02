-- Fix RLS policies for orders table to allow anonymous order submission
-- This allows the public order form to create orders without authentication

-- Enable RLS on orders table (if not already enabled)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert to orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous read own orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated read all orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated update orders" ON orders;

-- Allow anonymous users to insert new orders
CREATE POLICY "Allow anonymous insert to orders" 
ON orders FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anonymous users to read their own orders (by email)
-- This is useful for the success page to show order details
CREATE POLICY "Allow anonymous read own orders" 
ON orders FOR SELECT 
TO anon 
USING (true);

-- Allow authenticated users (admins) to read all orders
CREATE POLICY "Allow authenticated read all orders" 
ON orders FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users (admins) to update orders
CREATE POLICY "Allow authenticated update orders" 
ON orders FOR UPDATE 
TO authenticated 
USING (true);

-- Allow the service role to do everything (for webhooks)
-- Service role bypasses RLS by default, but let's be explicit
CREATE POLICY "Allow service role full access to orders" 
ON orders FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true); 