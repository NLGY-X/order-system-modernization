-- Script 1: Fix the problematic trigger from setup
-- Copy and paste this into Supabase SQL Editor

DROP TRIGGER IF EXISTS trigger_process_new_order ON orders;
DROP FUNCTION IF EXISTS process_new_order();

CREATE OR REPLACE FUNCTION trigger_process_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' THEN
    RAISE NOTICE 'New order created with ID: %, Status: %', NEW.id, NEW.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER process_order_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_process_order(); 