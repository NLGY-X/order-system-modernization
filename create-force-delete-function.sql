-- Create a function to force delete products (bypasses RLS)
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION delete_product_force(product_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This makes it run with elevated privileges
AS $$
BEGIN
  -- Delete product_prices first (foreign key constraint)
  DELETE FROM product_prices WHERE product_prices.product_id = delete_product_force.product_id;
  
  -- Delete the product
  DELETE FROM products WHERE id = delete_product_force.product_id;
  
  -- Return true if successful
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Return false if failed
    RETURN FALSE;
END;
$$; 