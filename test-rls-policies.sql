-- Diagnostic script to check RLS policies on orders table

-- Check if RLS is enabled on the orders table
SELECT tablename, rowsecurity 
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE tablename = 'orders' AND schemaname = 'public';

-- List all current policies on the orders table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'orders' AND schemaname = 'public';

-- Test if we can insert a simple order (this should work with our policies)
-- Note: This is just a test, you can remove it after running
SELECT 'Testing if anonymous insert would work...' as test_info; 