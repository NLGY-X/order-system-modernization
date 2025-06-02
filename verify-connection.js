const { createClient } = require('@supabase/supabase-js');
const config = require('./supabase-config');

async function verifyConnection() {
  console.log('🔍 VERIFYING DATABASE CONNECTION');
  console.log('===============================');
  
  // Check if keys are configured
  if (config.anonKey === 'PASTE_YOUR_ANON_KEY_HERE') {
    console.log('❌ ANON KEY NOT CONFIGURED!');
    console.log('📝 Update supabase-config.js first');
    return;
  }
  
  if (config.serviceRoleKey === 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE') {
    console.log('❌ SERVICE_ROLE KEY NOT CONFIGURED!');
    console.log('📝 Update supabase-config.js first');
    return;
  }
  
  console.log(`🌐 Connecting to: ${config.supabaseUrl}`);
  
  // Test with anon key (frontend connection)
  console.log('🔑 Testing anon key (frontend)...');
  const anonClient = createClient(config.supabaseUrl, config.anonKey);
  const { data: products, error: anonError } = await anonClient
    .from('products')
    .select('*')
    .limit(3);
  
  if (anonError) {
    console.log('❌ Anon key test failed:', anonError.message);
  } else {
    console.log(`✅ Anon key works - Found ${products.length} products`);
    if (products.length > 0) {
      console.log(`   Sample: "${products[0].name}"`);
    }
  }
  
  // Test with service role key (backend connection)
  console.log('🔑 Testing service_role key (backend)...');
  const serviceClient = createClient(config.supabaseUrl, config.serviceRoleKey);
  const { data: countries, error: serviceError } = await serviceClient
    .from('ppp_classifications')
    .select('*')
    .limit(3);
  
  if (serviceError) {
    console.log('❌ Service role test failed:', serviceError.message);
  } else {
    console.log(`✅ Service role works - Found ${countries.length} countries`);
    if (countries.length > 0) {
      console.log(`   Sample: "${countries[0].country_name}" (${countries[0].ppp_tier})`);
    }
  }
  
  console.log('');
  if (!anonError && !serviceError) {
    console.log('🎉 ALL CONNECTIONS SUCCESSFUL!');
    console.log('🚀 Your app is ready for real data');
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Restart your dev server: cd frontend && npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Yellow warning banner should be gone');
  } else {
    console.log('⚠️  Some connections failed - check your API keys');
  }
}

verifyConnection().catch(console.error); 