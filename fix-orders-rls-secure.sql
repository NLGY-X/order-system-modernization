-- Secure RLS policies for orders table
-- This allows anonymous users to INSERT new orders but protects existing data

-- First, remove any existing policies that might conflict
DROP POLICY IF EXISTS "Allow anonymous insert to orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- Policy 1: Allow anonymous users to INSERT new orders (for the order form)
CREATE POLICY "Enable insert for anonymous users" 
ON orders FOR INSERT 
TO anon 
WITH CHECK (true);

-- Policy 2: Allow authenticated users to view their own orders only
-- (assuming you'll add user authentication later)
CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT 
TO authenticated 
USING (auth.uid()::text = user_id);

-- Policy 3: Allow authenticated users to update their own orders only
CREATE POLICY "Users can update own orders" 
ON orders FOR UPDATE 
TO authenticated 
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Policy 4: Prevent anonymous users from viewing any orders
-- (orders are private - only the person who created them should see them)
CREATE POLICY "Prevent anonymous select" 
ON orders FOR SELECT 
TO anon 
USING (false);

-- Policy 5: Prevent anonymous users from updating/deleting orders
CREATE POLICY "Prevent anonymous update" 
ON orders FOR UPDATE 
TO anon 
USING (false);

CREATE POLICY "Prevent anonymous delete" 
ON orders FOR DELETE 
TO anon 
USING (false); 