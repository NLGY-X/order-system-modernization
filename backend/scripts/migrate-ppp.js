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

async function migratePPPClassifications() {
  console.log('Starting PPP Classifications migration...');
  
  const csvFilePath = path.join(process.cwd(), 'data', 'PPP Classification.csv');
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found at: ${csvFilePath}`);
    console.log('Please ensure the "PPP Classification.csv" file is placed in the data/ directory');
    process.exit(1);
  }

  const countries = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Assuming CSV has columns: country_name, ppp_tier
        const countryName = row.country_name || row['Country Name'] || row.Country;
        const pppTier = row.ppp_tier || row['PPP Tier'] || row.Tier;
        
        if (countryName && pppTier) {
          countries.push({
            country_name: countryName.trim(),
            ppp_tier: pppTier.trim()
          });
        }
      })
      .on('end', async () => {
        console.log(`Parsed ${countries.length} countries from CSV`);
        
        try {
          let insertedCount = 0;
          let skippedCount = 0;
          
          for (const country of countries) {
            // Check if country already exists
            const { data: existingCountry, error: checkError } = await supabase
              .from('ppp_classifications')
              .select('id')
              .eq('country_name', country.country_name)
              .single();
            
            if (checkError && checkError.code !== 'PGRST116') {
              console.error(`Error checking for existing country ${country.country_name}:`, checkError);
              continue;
            }
            
            if (existingCountry) {
              console.log(`Country already exists: ${country.country_name}`);
              skippedCount++;
              continue;
            }
            
            // Insert new country
            const { error: insertError } = await supabase
              .from('ppp_classifications')
              .insert(country);
            
            if (insertError) {
              console.error(`Error inserting country ${country.country_name}:`, insertError);
            } else {
              console.log(`Inserted: ${country.country_name} (${country.ppp_tier})`);
              insertedCount++;
            }
          }
          
          console.log(`\nMigration completed!`);
          console.log(`- Inserted: ${insertedCount} countries`);
          console.log(`- Skipped: ${skippedCount} countries (already existed)`);
          
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
migratePPPClassifications()
  .then(() => {
    console.log('PPP Classifications migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 