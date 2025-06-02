import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function parseQuantityRange(columnHeader) {
  // Parse headers like "Global (Tier 1-100)" or "PPP1 (Tier 101-400)"
  const match = columnHeader.match(/\(Tier (\d+)-(\d+)\)/);
  if (match) {
    return {
      min: parseInt(match[1]),
      max: parseInt(match[2])
    };
  }
  return null;
}

function parsePPPTier(columnHeader) {
  // Extract PPP tier from headers like "Global (Tier 1-100)" or "PPP1 (Tier 101-400)"
  if (columnHeader.includes('Global')) {
    return 'Global';
  }
  const pppMatch = columnHeader.match(/PPP(\d+)/);
  if (pppMatch) {
    return `PPP${pppMatch[1]}`;
  }
  return null;
}

async function getOrCreateProduct(productName) {
  // Check if product already exists
  const { data: existingProduct, error: checkError } = await supabase
    .from('products')
    .select('id')
    .eq('name', productName)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error(`Error checking for existing product ${productName}: ${checkError.message}`);
  }
  
  if (existingProduct) {
    return existingProduct.id;
  }
  
  // Create new product
  const { data: newProduct, error: insertError } = await supabase
    .from('products')
    .insert({ name: productName })
    .select('id')
    .single();
  
  if (insertError) {
    throw new Error(`Error creating product ${productName}: ${insertError.message}`);
  }
  
  console.log(`Created product: ${productName}`);
  return newProduct.id;
}

async function migratePricingData() {
  console.log('Starting Product Pricing migration...');
  
  const csvFilePath = path.join(process.cwd(), 'data', 'Product Pricing.csv');
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found at: ${csvFilePath}`);
    console.log('Please ensure the "Product Pricing.csv" file is placed in the data/ directory');
    process.exit(1);
  }

  const rows = [];
  let headers = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('headers', (headerList) => {
        headers = headerList;
        console.log('CSV Headers:', headers);
      })
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', async () => {
        console.log(`Parsed ${rows.length} rows from CSV`);
        
        try {
          let productsCreated = 0;
          let pricesInserted = 0;
          let pricesSkipped = 0;
          
          for (const row of rows) {
            // Get the product name (assuming it's in a column like "Certification Package" or "Product")
            const productName = row['Certification Package'] || row.Product || row.Name;
            
            if (!productName) {
              console.log('Skipping row with no product name:', row);
              continue;
            }
            
            console.log(`Processing product: ${productName}`);
            
            // Get or create the product
            const existingProductCheck = await supabase
              .from('products')
              .select('id')
              .eq('name', productName)
              .single();
            
            const productId = await getOrCreateProduct(productName);
            if (existingProductCheck.error && existingProductCheck.error.code === 'PGRST116') {
              productsCreated++;
            }
            
            // Process each pricing column
            for (const header of headers) {
              if (header === 'Certification Package' || header === 'Product' || header === 'Name') {
                continue; // Skip the product name column
              }
              
              const price = parseFloat(row[header]);
              if (isNaN(price) || price <= 0) {
                continue; // Skip invalid prices
              }
              
              const quantityRange = parseQuantityRange(header);
              const pppTier = parsePPPTier(header);
              
              if (!quantityRange || !pppTier) {
                console.log(`Could not parse header: ${header}`);
                continue;
              }
              
              // Check if this price point already exists
              const { data: existingPrice, error: checkError } = await supabase
                .from('product_prices')
                .select('id')
                .eq('product_id', productId)
                .eq('ppp_tier', pppTier)
                .eq('quantity_tier_min', quantityRange.min)
                .eq('quantity_tier_max', quantityRange.max)
                .single();
              
              if (checkError && checkError.code !== 'PGRST116') {
                console.error(`Error checking for existing price:`, checkError);
                continue;
              }
              
              if (existingPrice) {
                console.log(`Price already exists for ${productName} - ${pppTier} (${quantityRange.min}-${quantityRange.max})`);
                pricesSkipped++;
                continue;
              }
              
              // Insert new price
              const { error: insertError } = await supabase
                .from('product_prices')
                .insert({
                  product_id: productId,
                  ppp_tier: pppTier,
                  quantity_tier_min: quantityRange.min,
                  quantity_tier_max: quantityRange.max,
                  unit_price: price
                });
              
              if (insertError) {
                console.error(`Error inserting price for ${productName}:`, insertError);
              } else {
                console.log(`Inserted price: ${productName} - ${pppTier} (${quantityRange.min}-${quantityRange.max}) = $${price}`);
                pricesInserted++;
              }
            }
          }
          
          console.log(`\nMigration completed!`);
          console.log(`- Products created: ${productsCreated}`);
          console.log(`- Prices inserted: ${pricesInserted}`);
          console.log(`- Prices skipped: ${pricesSkipped} (already existed)`);
          
          resolve();
        } catch (error) {
          console.error('Error during migration:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

// Run the migration
migratePricingData()
  .then(() => {
    console.log('Product Pricing migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 