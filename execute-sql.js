const { Client } = require('pg');

const client = new Client({
  host: 'zezcsjltcbajkuqyxupt.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Ui4C.Hpf?8_4mbf',
  ssl: { rejectUnauthorized: false }
});

const sqlCommands = [
  // Script 1: Enable Extensions
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pg_net";`,
  
  // Script 2: Fix the problematic trigger
  `DROP TRIGGER IF EXISTS trigger_process_new_order ON orders;
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
     EXECUTE FUNCTION trigger_process_order();`,
  
  // Script 3: Notification System
  `CREATE OR REPLACE FUNCTION notify_new_order()
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
     EXECUTE FUNCTION notify_new_order();`,
  
  // Script 4: Test Order Creation
  `INSERT INTO orders (email, product_name, country_name, quantity, status)
   VALUES ('test@example.com', 'Certified Kubernetes Administrator (CKA)', 'United States', 2, 'pending')
   ON CONFLICT DO NOTHING;`,
  
  // Script 5: Verification
  `SELECT 'Products' as table_name, count(*) as record_count FROM products
   UNION ALL
   SELECT 'PPP Classifications', count(*) FROM ppp_classifications
   UNION ALL
   SELECT 'Product Prices', count(*) FROM product_prices
   UNION ALL
   SELECT 'Orders', count(*) FROM orders;`
];

async function executeSQLCommands() {
  
  try {
    await client.connect();
    console.log('✅ Connected to Supabase database');
    
    for (let i = 0; i < sqlCommands.length; i++) {
      console.log(`\n🔄 Executing SQL Script ${i + 1}...`);
      try {
        const result = await client.query(sqlCommands[i]);
        console.log(`✅ Script ${i + 1} completed successfully`);
        
        // Show results for verification script
        if (i === sqlCommands.length - 1 && result.rows) {
          console.log('\n📊 Database Verification Results:');
          result.rows.forEach(row => {
            console.log(`${row.table_name}: ${row.record_count} records`);
          });
        }
      } catch (error) {
        console.error(`❌ Error in Script ${i + 1}:`, error.message);
      }
    }
    
    console.log('\n🎉 All SQL scripts executed!');
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  } finally {
    await client.end();
  }
}

executeSQLCommands(); 