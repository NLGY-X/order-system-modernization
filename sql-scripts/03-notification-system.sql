-- Script 3: Add notification system
-- Copy and paste this into Supabase SQL Editor

CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('new_order', json_build_object(
    'order_id', NEW.id,
    'status', NEW.status,
    'created_at', NEW.created_at
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_order_trigger ON orders;
CREATE TRIGGER notify_order_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_order(); 