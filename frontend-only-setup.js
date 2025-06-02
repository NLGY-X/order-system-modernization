// FRONTEND-ONLY SETUP (SECURE)
// This script only uses the PUBLIC anon key - safe to commit to Git

const { createClient } = require('@supabase/supabase-js');

// These values are safe to expose publicly
const SUPABASE_URL = 'https://zezcsjltcbajkuqyxupt.supabase.co';

async function setupFrontendOnly() {
  console.log('🔒 SECURE FRONTEND-ONLY SETUP');
  console.log('==============================');
  console.log('ℹ️  This script only needs your PUBLIC anon key');
  console.log('ℹ️  Anon keys are safe to expose (limited permissions)');
  console.log('');
  
  // Get anon key from user input (not stored in file)
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('📋 Paste your ANON key from Supabase dashboard: ', async (anonKey) => {
      rl.close();
      
      if (!anonKey || anonKey.trim() === '') {
        console.log('❌ No key provided. Exiting...');
        return;
      }
      
      console.log('🔑 Testing anon key connection...');
      
      // Test the connection
      const supabase = createClient(SUPABASE_URL, anonKey.trim());
      const { data, error } = await supabase.from('products').select('*').limit(1);
      
      if (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('');
        console.log('💡 Possible issues:');
        console.log('   1. Wrong key pasted');
        console.log('   2. Database tables not created yet');
        console.log('   3. Row Level Security blocking access');
        console.log('');
        console.log('🔧 Next steps:');
        console.log('   1. Verify key from: https://supabase.com/dashboard/project/zezcsjltcbajkuqyxupt/settings/api');
        console.log('   2. Check if database is set up');
      } else {
        console.log('✅ Frontend connection successful!');
        console.log(`📊 Found ${data.length} products in database`);
        
        // Create frontend .env.local file
        const fs = require('fs');
        const envContent = `SUPABASE_URL=${SUPABASE_URL}\nSUPABASE_ANON_KEY=${anonKey.trim()}`;
        
        try {
          fs.writeFileSync('frontend/.env.local', envContent);
          console.log('✅ Created frontend/.env.local (secure, not committed to Git)');
        } catch (err) {
          console.log('⚠️  Could not create .env.local file automatically');
          console.log('📝 Manually create frontend/.env.local with:');
          console.log(`   SUPABASE_URL=${SUPABASE_URL}`);
          console.log(`   SUPABASE_ANON_KEY=${anonKey.trim()}`);
        }
        
        console.log('');
        console.log('🎉 FRONTEND SETUP COMPLETE!');
        console.log('🚀 Start your app: cd frontend && npm run dev');
        console.log('');
        console.log('💡 For full backend features (admin panel), you\'ll need:');
        console.log('   1. Database setup with service_role key (separate step)');
        console.log('   2. But frontend will work with real data now!');
      }
      
      resolve();
    });
  });
}

setupFrontendOnly().catch(console.error); 