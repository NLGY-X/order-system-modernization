-- Simple and secure RLS policies for orders table
-- This allows anonymous users to INSERT new orders but protects existing data

-- Remove ALL existing policies that might conflict (from all our previous attempts)
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

-- Policy 1: Allow anonymous users to INSERT new orders (for the order form)
CREATE POLICY "Enable insert for anonymous users" 
ON orders FOR INSERT 
TO anon 
WITH CHECK (true);

-- Policy 2: Prevent anonymous users from reading any orders
-- (orders are private business data)
CREATE POLICY "Prevent anonymous select" 
ON orders FOR SELECT 
TO anon 
USING (false);

-- Policy 3: Allow authenticated users (admins) to read all orders
CREATE POLICY "Allow authenticated read all orders" 
ON orders FOR SELECT 
TO authenticated 
USING (true);

-- Policy 4: Allow authenticated users (admins) to update orders
CREATE POLICY "Allow authenticated update orders" 
ON orders FOR UPDATE 
TO authenticated 
USING (true);

-- Policy 5: Prevent anonymous users from updating orders
CREATE POLICY "Prevent anonymous update" 
ON orders FOR UPDATE 
TO anon 
USING (false);

-- Policy 6: Prevent anonymous users from deleting orders
CREATE POLICY "Prevent anonymous delete" 
ON orders FOR DELETE 
TO anon 
USING (false); 