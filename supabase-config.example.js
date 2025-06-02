// CENTRAL SUPABASE CONFIGURATION - EXAMPLE
// Copy this file to 'supabase-config.js' and add your actual keys

module.exports = {
  supabaseUrl: 'https://zezcsjltcbajkuqyxupt.supabase.co',
  
  // PASTE YOUR ANON KEY HERE (replace the placeholder)
  anonKey: 'PASTE_YOUR_ANON_KEY_HERE',
  
  // PASTE YOUR SERVICE_ROLE KEY HERE (replace the placeholder)  
  serviceRoleKey: 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE'
};

// HOW TO GET KEYS:
// 1. Go to: https://supabase.com/dashboard/project/zezcsjltcbajkuqyxupt/settings/api
// 2. Copy the 'anon' key and paste above
// 3. Copy the 'service_role' key and paste above
// 4. Save this file as 'supabase-config.js' (without .example)
// 5. Run: node test-everything.js 