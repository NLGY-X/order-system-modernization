-- Order System Database Setup Script
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PPP Classifications table
CREATE TABLE IF NOT EXISTS ppp_classifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_name TEXT NOT NULL UNIQUE,
    ppp_tier TEXT NOT NULL CHECK (ppp_tier IN ('Tier 1', 'Tier 2', 'Tier 3', 'Global')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Prices table
CREATE TABLE IF NOT EXISTS product_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ppp_tier TEXT NOT NULL CHECK (ppp_tier IN ('Tier 1', 'Tier 2', 'Tier 3', 'Global')),
    min_quantity INTEGER NOT NULL DEFAULT 1,
    max_quantity INTEGER,
    price_usd DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, ppp_tier, min_quantity)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    product_name TEXT NOT NULL,
    country_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_usd DECIMAL(10,2),
    total_price_usd DECIMAL(10,2),
    stripe_checkout_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'error')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. CREATE INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_ppp_classifications_country ON ppp_classifications(country_name);
CREATE INDEX IF NOT EXISTS idx_product_prices_product_tier ON product_prices(product_id, ppp_tier);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- =============================================
-- 3. CREATE TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ppp_classifications_updated_at ON ppp_classifications;
CREATE TRIGGER update_ppp_classifications_updated_at BEFORE UPDATE ON ppp_classifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_prices_updated_at ON product_prices;
CREATE TRIGGER update_product_prices_updated_at BEFORE UPDATE ON product_prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppp_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. CREATE RLS POLICIES
-- =============================================

-- Products: Allow read access to all
DROP POLICY IF EXISTS "Allow read access to products" ON products;
CREATE POLICY "Allow read access to products" ON products FOR SELECT USING (true);

-- PPP Classifications: Allow read access to all
DROP POLICY IF EXISTS "Allow read access to ppp_classifications" ON ppp_classifications;
CREATE POLICY "Allow read access to ppp_classifications" ON ppp_classifications FOR SELECT USING (true);

-- Product Prices: Allow read access to all
DROP POLICY IF EXISTS "Allow read access to product_prices" ON product_prices;
CREATE POLICY "Allow read access to product_prices" ON product_prices FOR SELECT USING (true);

-- Orders: Allow insert for all, read/update for service role
DROP POLICY IF EXISTS "Allow insert orders" ON orders;
CREATE POLICY "Allow insert orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access to orders" ON orders;
CREATE POLICY "Allow service role full access to orders" ON orders FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- 6. INSERT SAMPLE DATA
-- =============================================

-- Insert Products
INSERT INTO products (name, description) VALUES
('Certified Kubernetes Administrator (CKA)', 'Kubernetes administration certification'),
('Certified Kubernetes Application Developer (CKAD)', 'Kubernetes application development certification'),
('Certified Kubernetes Security Specialist (CKS)', 'Kubernetes security specialist certification'),
('AWS Solutions Architect Associate', 'AWS cloud architecture certification'),
('AWS Developer Associate', 'AWS development certification'),
('Google Cloud Professional Cloud Architect', 'Google Cloud architecture certification'),
('Microsoft Azure Solutions Architect Expert', 'Azure cloud architecture certification'),
('Docker Certified Associate', 'Docker containerization certification')
ON CONFLICT (name) DO NOTHING;

-- Insert PPP Classifications (40 countries)
INSERT INTO ppp_classifications (country_name, ppp_tier) VALUES
('United States', 'Global'),
('Canada', 'Global'),
('United Kingdom', 'Global'),
('Germany', 'Global'),
('France', 'Global'),
('Australia', 'Global'),
('Japan', 'Global'),
('Switzerland', 'Global'),
('Netherlands', 'Global'),
('Sweden', 'Global'),
('Norway', 'Global'),
('Denmark', 'Global'),
('Singapore', 'Global'),
('South Korea', 'Tier 1'),
('Spain', 'Tier 1'),
('Italy', 'Tier 1'),
('Israel', 'Tier 1'),
('New Zealand', 'Tier 1'),
('Belgium', 'Tier 1'),
('Austria', 'Tier 1'),
('Finland', 'Tier 1'),
('Ireland', 'Tier 1'),
('Czech Republic', 'Tier 2'),
('Poland', 'Tier 2'),
('Portugal', 'Tier 2'),
('Greece', 'Tier 2'),
('Slovenia', 'Tier 2'),
('Estonia', 'Tier 2'),
('Slovakia', 'Tier 2'),
('Lithuania', 'Tier 2'),
('Latvia', 'Tier 2'),
('Hungary', 'Tier 2'),
('Croatia', 'Tier 2'),
('Chile', 'Tier 2'),
('Uruguay', 'Tier 2'),
('Brazil', 'Tier 3'),
('Mexico', 'Tier 3'),
('Argentina', 'Tier 3'),
('Colombia', 'Tier 3'),
('Peru', 'Tier 3')
ON CONFLICT (country_name) DO NOTHING;

-- Insert Product Prices
INSERT INTO product_prices (product_id, ppp_tier, min_quantity, max_quantity, price_usd)
SELECT 
    p.id,
    tier.ppp_tier,
    qty.min_quantity,
    qty.max_quantity,
    CASE 
        WHEN tier.ppp_tier = 'Global' THEN qty.base_price
        WHEN tier.ppp_tier = 'Tier 1' THEN qty.base_price * 0.8
        WHEN tier.ppp_tier = 'Tier 2' THEN qty.base_price * 0.6
        WHEN tier.ppp_tier = 'Tier 3' THEN qty.base_price * 0.4
    END as price_usd
FROM products p
CROSS JOIN (
    VALUES 
        ('Global'), ('Tier 1'), ('Tier 2'), ('Tier 3')
) AS tier(ppp_tier)
CROSS JOIN (
    VALUES 
        (1, 4, 299.00),
        (5, 9, 279.00),
        (10, 19, 259.00),
        (20, NULL, 239.00)
) AS qty(min_quantity, max_quantity, base_price)
ON CONFLICT (product_id, ppp_tier, min_quantity) DO NOTHING;

-- =============================================
-- 7. CREATE ORDER PROCESSING TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION process_new_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process if status is 'pending'
    IF NEW.status = 'pending' THEN
        -- Call the process-order edge function
        PERFORM
            net.http_post(
                url := current_setting('app.settings.supabase_url') || '/functions/v1/process-order',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_role_key')
                ),
                body := jsonb_build_object('orderId', NEW.id::text)
            );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new orders
DROP TRIGGER IF EXISTS trigger_process_new_order ON orders;
CREATE TRIGGER trigger_process_new_order
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION process_new_order();

-- =============================================
-- SETUP COMPLETE
-- =============================================

-- Verify the setup
SELECT 'Products' as table_name, count(*) as record_count FROM products
UNION ALL
SELECT 'PPP Classifications', count(*) FROM ppp_classifications
UNION ALL
SELECT 'Product Prices', count(*) FROM product_prices
UNION ALL
SELECT 'Orders', count(*) FROM orders;

-- Show sample data
SELECT 'Sample Products:' as info;
SELECT name, description FROM products LIMIT 5;

SELECT 'Sample Countries by Tier:' as info;
SELECT ppp_tier, count(*) as country_count FROM ppp_classifications GROUP BY ppp_tier ORDER BY ppp_tier;

SELECT 'Sample Pricing (CKA):' as info;
SELECT 
    pp.ppp_tier,
    pp.min_quantity,
    pp.max_quantity,
    pp.price_usd
FROM product_prices pp
JOIN products p ON pp.product_id = p.id
WHERE p.name = 'Certified Kubernetes Administrator (CKA)'
ORDER BY pp.ppp_tier, pp.min_quantity; 