-- Database trigger to automatically process new orders
-- This trigger will call the process-order edge function when a new order is created

-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION trigger_process_order()
RETURNS TRIGGER AS $$
DECLARE
  request_id uuid;
BEGIN
  -- Only process orders with 'pending' status
  IF NEW.status = 'pending' THEN
    -- Make an HTTP request to the process-order edge function
    -- Note: This uses the pg_net extension which needs to be enabled in Supabase
    SELECT net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/process-order',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object('orderId', NEW.id::text)
    ) INTO request_id;
    
    -- Log the request (optional)
    RAISE NOTICE 'Triggered order processing for order %, request_id: %', NEW.id, request_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS process_order_trigger ON orders;
CREATE TRIGGER process_order_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_process_order();

-- Alternative approach using a simpler notification system
-- This can be used if the HTTP approach doesn't work

CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Send a notification that can be listened to by external services
  PERFORM pg_notify('new_order', json_build_object(
    'order_id', NEW.id,
    'status', NEW.status,
    'created_at', NEW.created_at
  )::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create notification trigger as backup
DROP TRIGGER IF EXISTS notify_order_trigger ON orders;
CREATE TRIGGER notify_order_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_order(); 