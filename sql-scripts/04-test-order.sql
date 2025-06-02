-- Script 4: Test order creation
-- Copy and paste this into Supabase SQL Editor

INSERT INTO orders (email, product_name, country_name, quantity, status)
VALUES ('test@example.com', 'Certified Kubernetes Administrator (CKA)', 'United States', 2, 'pending')
ON CONFLICT DO NOTHING;

-- Check if the order was created
SELECT id, email, product_name, country_name, quantity, status, created_at
FROM orders 
WHERE email = 'test@example.com'
ORDER BY created_at DESC
LIMIT 1; 