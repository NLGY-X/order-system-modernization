-- Add 24 New Certification Products with Full Pricing Matrix
-- Run this in Supabase SQL Editor

-- First, insert all the products
INSERT INTO products (name, description) VALUES
-- Vue Certifications
('Vue Mid: Voucher Only', 'Certification package: Vue Mid: Voucher Only'),
('Vue Mid: Voucher + Preparation', 'Certification package: Vue Mid: Voucher + Preparation'),
('Vue Mid: Voucher + Preparation + Bootcamp', 'Certification package: Vue Mid: Voucher + Preparation + Bootcamp'),
('Vue Mid + Senior: Voucher Only', 'Certification package: Vue Mid + Senior: Voucher Only'),
('Vue Mid + Senior: Voucher + Preparation', 'Certification package: Vue Mid + Senior: Voucher + Preparation'),
('Vue Mid + Senior: Voucher + Preparation + Bootcamp', 'Certification package: Vue Mid + Senior: Voucher + Preparation + Bootcamp'),

-- Nuxt Certifications
('Nuxt Mid: Voucher Only', 'Certification package: Nuxt Mid: Voucher Only'),
('Nuxt Mid: Voucher + Preparation', 'Certification package: Nuxt Mid: Voucher + Preparation'),
('Nuxt Mid: Voucher + Preparation + Bootcamp', 'Certification package: Nuxt Mid: Voucher + Preparation + Bootcamp'),
('Nuxt Mid + Senior: Voucher Only', 'Certification package: Nuxt Mid + Senior: Voucher Only'),
('Nuxt Mid + Senior: Voucher + Preparation', 'Certification package: Nuxt Mid + Senior: Voucher + Preparation'),
('Nuxt Mid + Senior: Voucher + Preparation + Bootcamp', 'Certification package: Nuxt Mid + Senior: Voucher + Preparation + Bootcamp'),

-- Angular Certifications
('Angular Junior: Voucher Only', 'Certification package: Angular Junior: Voucher Only'),
('Angular Junior: Voucher + Preparation', 'Certification package: Angular Junior: Voucher + Preparation'),
('Angular Mid: Voucher Only', 'Certification package: Angular Mid: Voucher Only'),
('Angular Mid: Voucher + Preparation', 'Certification package: Angular Mid: Voucher + Preparation'),
('Angular Mid: Voucher + Preparation + Bootcamp', 'Certification package: Angular Mid: Voucher + Preparation + Bootcamp'),
('Angular Mid + Senior: Voucher Only', 'Certification package: Angular Mid + Senior: Voucher Only'),
('Angular Mid + Senior: Voucher + Preparation', 'Certification package: Angular Mid + Senior: Voucher + Preparation'),
('Angular Mid + Senior: Voucher + Preparation + Bootcamp', 'Certification package: Angular Mid + Senior: Voucher + Preparation + Bootcamp'),

-- JavaScript Certifications
('JavaScript Junior: Voucher Only', 'Certification package: JavaScript Junior: Voucher Only'),
('JavaScript Junior: Voucher + Preparation', 'Certification package: JavaScript Junior: Voucher + Preparation'),
('JavaScript Mid: Voucher Only', 'Certification package: JavaScript Mid: Voucher Only'),
('JavaScript Mid: Voucher + Preparation', 'Certification package: JavaScript Mid: Voucher + Preparation'),
('JavaScript Mid: Voucher + Preparation + Bootcamp', 'Certification package: JavaScript Mid: Voucher + Preparation + Bootcamp'),
('JavaScript Mid + Senior: Voucher Only', 'Certification package: JavaScript Mid + Senior: Voucher Only'),
('JavaScript Mid + Senior: Voucher + Preparation', 'Certification package: JavaScript Mid + Senior: Voucher + Preparation'),
('JavaScript Mid + Senior: Voucher + Preparation + Bootcamp', 'Certification package: JavaScript Mid + Senior: Voucher + Preparation + Bootcamp');

-- Now insert all the pricing data (384 entries total)
-- This creates the full pricing matrix for each product with quantity and PPP tiers

INSERT INTO product_prices (product_id, min_quantity, max_quantity, ppp_tier, price_usd)
SELECT 
    p.id as product_id,
    qty.min_quantity,
    qty.max_quantity,
    ppp.ppp_tier,
    ROUND((base.base_price * qty.volume_discount * ppp.ppp_discount)::NUMERIC, 2) as price_usd
FROM 
    -- Product base prices
    (VALUES 
        ('Vue Mid: Voucher Only', 220.00),
        ('Vue Mid: Voucher + Preparation', 499.00),
        ('Vue Mid: Voucher + Preparation + Bootcamp', 999.00),
        ('Vue Mid + Senior: Voucher Only', 499.00),
        ('Vue Mid + Senior: Voucher + Preparation', 1057.00),
        ('Vue Mid + Senior: Voucher + Preparation + Bootcamp', 2257.00),
        ('Nuxt Mid: Voucher Only', 220.00),
        ('Nuxt Mid: Voucher + Preparation', 499.00),
        ('Nuxt Mid: Voucher + Preparation + Bootcamp', 999.00),
        ('Nuxt Mid + Senior: Voucher Only', 499.00),
        ('Nuxt Mid + Senior: Voucher + Preparation', 1057.00),
        ('Nuxt Mid + Senior: Voucher + Preparation + Bootcamp', 2257.00),
        ('Angular Junior: Voucher Only', 69.00),
        ('Angular Junior: Voucher + Preparation', 99.00),
        ('Angular Mid: Voucher Only', 179.00),
        ('Angular Mid: Voucher + Preparation', 378.00),
        ('Angular Mid: Voucher + Preparation + Bootcamp', 999.00),
        ('Angular Mid + Senior: Voucher Only', 398.00),
        ('Angular Mid + Senior: Voucher + Preparation', 796.00),
        ('Angular Mid + Senior: Voucher + Preparation + Bootcamp', 2166.00),
        ('JavaScript Junior: Voucher Only', 69.00),
        ('JavaScript Junior: Voucher + Preparation', 99.00),
        ('JavaScript Mid: Voucher Only', 179.00),
        ('JavaScript Mid: Voucher + Preparation', 378.00),
        ('JavaScript Mid: Voucher + Preparation + Bootcamp', 999.00),
        ('JavaScript Mid + Senior: Voucher Only', 398.00),
        ('JavaScript Mid + Senior: Voucher + Preparation', 796.00),
        ('JavaScript Mid + Senior: Voucher + Preparation + Bootcamp', 2166.00)
    ) AS base(product_name, base_price)
CROSS JOIN
    -- Quantity tiers with volume discounts
    (VALUES 
        (1, 100, 1.0),      -- No volume discount
        (101, 400, 0.95),   -- 5% volume discount  
        (401, 800, 0.90),   -- 10% volume discount
        (801, NULL, 0.85)   -- 15% volume discount
    ) AS qty(min_quantity, max_quantity, volume_discount)
CROSS JOIN
    -- PPP tiers with regional discounts
    (VALUES 
        ('Global', 1.0),    -- No PPP discount
        ('Tier 1', 0.8),    -- 20% PPP discount
        ('Tier 2', 0.65),   -- 35% PPP discount
        ('Tier 3', 0.5)     -- 50% PPP discount
    ) AS ppp(ppp_tier, ppp_discount)
JOIN products p ON p.name = base.product_name;

-- Verify the results
SELECT 
    'Products Added' as result_type,
    COUNT(*) as count
FROM products 
WHERE name LIKE '%Vue%' OR name LIKE '%Nuxt%' OR name LIKE '%Angular%' OR name LIKE '%JavaScript%'

UNION ALL

SELECT 
    'Pricing Entries Added' as result_type,
    COUNT(*) as count
FROM product_prices pp
JOIN products p ON pp.product_id = p.id
WHERE p.name LIKE '%Vue%' OR p.name LIKE '%Nuxt%' OR p.name LIKE '%Angular%' OR p.name LIKE '%JavaScript%';

-- Show sample pricing for Vue Mid: Voucher Only
SELECT 
    p.name as product_name,
    CASE 
        WHEN pp.max_quantity IS NULL THEN CONCAT(pp.min_quantity, '+')
        ELSE CONCAT(pp.min_quantity, '-', pp.max_quantity)
    END as quantity_tier,
    pp.ppp_tier,
    CONCAT('$', pp.price_usd) as price
FROM products p
JOIN product_prices pp ON p.id = pp.product_id
WHERE p.name = 'Vue Mid: Voucher Only'
ORDER BY pp.min_quantity, pp.ppp_tier; 