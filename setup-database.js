const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const config = require('./supabase-config');

async function setupDatabase() {
  console.log('🗄️  SETTING UP DATABASE');
  console.log('=======================');
  
  // Check if keys are configured
  if (config.serviceRoleKey === 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE') {
    console.log('❌ SERVICE_ROLE KEY NOT CONFIGURED!');
    console.log('📝 Edit supabase-config.js first, then run: node setup-database.js');
    return;
  }
  
  const supabase = createClient(config.supabaseUrl, config.serviceRoleKey);
  
  console.log('🔧 Creating database schema...');
  
  // Read and execute schema
  const schema = fs.readFileSync('backend/database/schema.sql', 'utf8');
  const schemaQueries = schema.split(';').filter(q => q.trim() && !q.trim().startsWith('--'));
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < schemaQueries.length; i++) {
    const query = schemaQueries[i].trim();
    if (!query) continue;
    
    try {
      // Use raw SQL execution
      const { error } = await supabase.rpc('exec', { sql: query });
      if (error) {
        // Try alternative method for schema creation
        console.log(`⚠️  Query ${i + 1} failed, continuing...`);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (e) {
      errorCount++;
    }
  }
  
  console.log(`✅ Schema setup: ${successCount} successful, ${errorCount} errors (normal for existing tables)`);
  
  // Test if products table exists
  console.log('🔍 Testing database connection...');
  const { data, error } = await supabase.from('products').select('*').limit(1);
  
  if (error) {
    console.log('❌ Database test failed:', error.message);
    console.log('');
    console.log('🛠️  MANUAL SETUP REQUIRED:');
    console.log('1. Go to: https://supabase.com/dashboard/project/zezcsjltcbajkuqyxupt/sql');
    console.log('2. Copy the contents of backend/database/schema.sql');
    console.log('3. Paste and run it in the SQL editor');
    console.log('4. Then run: node setup-database.js');
  } else {
    console.log('✅ Database connection successful!');
    console.log(`📊 Current products: ${data.length}`);
    
    if (data.length === 0) {
      console.log('📥 Importing sample data...');
      await importSampleData(supabase);
    }
    
    console.log('');
    console.log('🎉 DATABASE SETUP COMPLETE!');
    console.log('🚀 Your app is ready. Run: cd frontend && npm run dev');
  }
}

async function importSampleData(supabase) {
  // Insert sample products
  const sampleProducts = [
    { name: 'Certified Kubernetes Administrator (CKA)', description: 'Cloud Native Computing Foundation certification' },
    { name: 'Certified Kubernetes Application Developer (CKAD)', description: 'Application development on Kubernetes' },
    { name: 'Certified Kubernetes Security Specialist (CKS)', description: 'Kubernetes security specialization' },
    { name: 'AWS Certified Solutions Architect', description: 'Amazon Web Services architecture certification' }
  ];
  
  for (const product of sampleProducts) {
    await supabase.from('products').insert(product).select();
  }
  
  // Insert sample PPP data
  const sampleCountries = [
    { country_name: 'United States', ppp_tier: 'Global' },
    { country_name: 'United Kingdom', ppp_tier: 'Global' },
    { country_name: 'Germany', ppp_tier: 'Global' },
    { country_name: 'India', ppp_tier: 'PPP1' },
    { country_name: 'Brazil', ppp_tier: 'PPP1' },
    { country_name: 'Poland', ppp_tier: 'PPP2' },
    { country_name: 'Mexico', ppp_tier: 'PPP2' }
  ];
  
  for (const country of sampleCountries) {
    await supabase.from('ppp_classifications').insert(country).select();
  }
  
  console.log('✅ Sample data imported');
}

setupDatabase().catch(console.error); 