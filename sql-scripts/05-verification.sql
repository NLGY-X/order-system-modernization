-- Script 5: Verify database setup
-- Copy and paste this into Supabase SQL Editor

-- Check data counts
SELECT 'Products' as table_name, count(*) as record_count FROM products
UNION ALL
SELECT 'PPP Classifications', count(*) FROM ppp_classifications
UNION ALL
SELECT 'Product Prices', count(*) FROM product_prices
UNION ALL
SELECT 'Orders', count(*) FROM orders;

-- Check triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table = 'orders';

-- Test sample pricing query
SELECT p.name, pp.ppp_tier, pp.min_quantity, pp.price_usd
FROM products p
JOIN product_prices pp ON p.id = pp.product_id
WHERE p.name LIKE '%CKA%'
AND pp.ppp_tier = 'Global'
ORDER BY pp.min_quantity
LIMIT 5; 