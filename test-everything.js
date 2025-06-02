const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const config = require('./supabase-config');

async function testEverything() {
  console.log('🧪 TESTING COMPLETE SUPABASE SETUP');
  console.log('=====================================');
  
  // Check if keys are configured
  if (config.anonKey === 'PASTE_YOUR_ANON_KEY_HERE' || config.serviceRoleKey === 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE') {
    console.log('❌ KEYS NOT CONFIGURED!');
    console.log('');
    console.log('📝 Edit supabase-config.js and paste your keys:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/zezcsjltcbajkuqyxupt/settings/api');
    console.log('   2. Copy anon key → paste in supabase-config.js');
    console.log('   3. Copy service_role key → paste in supabase-config.js');
    console.log('   4. Save file and run: node test-everything.js');
    return;
  }
  
  console.log('✅ Configuration loaded');
  console.log(`📍 URL: ${config.supabaseUrl}`);
  console.log(`🔑 Anon key: ${config.anonKey.substring(0, 20)}...`);
  console.log(`🔐 Service key: ${config.serviceRoleKey.substring(0, 20)}...`);
  console.log('');
  
  // Test frontend (anon key)
  console.log('🔍 Testing Frontend Connection (anon key)...');
  const frontendClient = createClient(config.supabaseUrl, config.anonKey);
  const { data: frontendData, error: frontendError } = await frontendClient.from('products').select('*').limit(1);
  
  if (frontendError) {
    console.log('❌ Frontend connection failed:', frontendError.message);
  } else {
    console.log('✅ Frontend connection successful!');
    console.log(`📊 Products found: ${frontendData.length}`);
  }
  console.log('');
  
  // Test backend (service_role key)
  console.log('🔍 Testing Backend Connection (service_role key)...');
  const backendClient = createClient(config.supabaseUrl, config.serviceRoleKey);
  const { data: backendData, error: backendError } = await backendClient.from('products').select('*').limit(1);
  
  if (backendError) {
    console.log('❌ Backend connection failed:', backendError.message);
    console.log('⚠️  Database tables may not exist yet');
  } else {
    console.log('✅ Backend connection successful!');
    console.log(`📊 Products found: ${backendData.length}`);
  }
  console.log('');
  
  // Update frontend .env.local
  console.log('🔧 Updating frontend/.env.local...');
  const envContent = `# Auto-generated from supabase-config.js
SUPABASE_URL=${config.supabaseUrl}
SUPABASE_ANON_KEY=${config.anonKey}`;
  
  fs.writeFileSync('frontend/.env.local', envContent);
  console.log('✅ Frontend environment updated');
  console.log('');
  
  // Summary
  console.log('📋 SUMMARY:');
  if (!frontendError && !backendError) {
    console.log('🎉 EVERYTHING WORKING! Your app is ready to use.');
    console.log('   Frontend: ✅ Connected');
    console.log('   Backend:  ✅ Connected');
    console.log('   Database: ✅ Ready');
    console.log('');
    console.log('🚀 Start your app: cd frontend && npm run dev');
  } else if (!frontendError) {
    console.log('⚠️  Frontend works, but database needs setup.');
    console.log('   Run: node setup-database.js');
  } else {
    console.log('❌ Keys may be invalid. Get fresh keys from Supabase dashboard.');
  }
}

testEverything().catch(console.error); 