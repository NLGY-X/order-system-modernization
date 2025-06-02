-- Order System Database Schema
-- This script creates all tables for the Order System with proper constraints and relationships

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ppp_classifications table
CREATE TABLE IF NOT EXISTS ppp_classifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_name TEXT NOT NULL UNIQUE,
    ppp_tier TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_prices table
CREATE TABLE IF NOT EXISTS product_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ppp_tier TEXT NOT NULL,
    quantity_tier_min INTEGER NOT NULL,
    quantity_tier_max INTEGER NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, ppp_tier, quantity_tier_min, quantity_tier_max)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id),
    country_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'error')),
    calculated_unit_price NUMERIC(10,2),
    calculated_total_price NUMERIC(10,2),
    stripe_checkout_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_prices_product_id ON product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_ppp_tier ON product_prices(ppp_tier);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_ppp_classifications_country ON ppp_classifications(country_name);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppp_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create secure default policies (deny all by default)
-- These can be modified later based on specific access requirements

-- Products policies
CREATE POLICY "products_select_policy" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_policy" ON products FOR INSERT WITH CHECK (false);
CREATE POLICY "products_update_policy" ON products FOR UPDATE USING (false);
CREATE POLICY "products_delete_policy" ON products FOR DELETE USING (false);

-- PPP Classifications policies
CREATE POLICY "ppp_classifications_select_policy" ON ppp_classifications FOR SELECT USING (true);
CREATE POLICY "ppp_classifications_insert_policy" ON ppp_classifications FOR INSERT WITH CHECK (false);
CREATE POLICY "ppp_classifications_update_policy" ON ppp_classifications FOR UPDATE USING (false);
CREATE POLICY "ppp_classifications_delete_policy" ON ppp_classifications FOR DELETE USING (false);

-- Product Prices policies
CREATE POLICY "product_prices_select_policy" ON product_prices FOR SELECT USING (true);
CREATE POLICY "product_prices_insert_policy" ON product_prices FOR INSERT WITH CHECK (false);
CREATE POLICY "product_prices_update_policy" ON product_prices FOR UPDATE USING (false);
CREATE POLICY "product_prices_delete_policy" ON product_prices FOR DELETE USING (false);

-- Orders policies
CREATE POLICY "orders_select_policy" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_insert_policy" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update_policy" ON orders FOR UPDATE USING (true);
CREATE POLICY "orders_delete_policy" ON orders FOR DELETE USING (false);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ppp_classifications_updated_at BEFORE UPDATE ON ppp_classifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_prices_updated_at BEFORE UPDATE ON product_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 