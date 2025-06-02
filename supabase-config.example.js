// EXAMPLE SUPABASE CONFIGURATION - SAFE TO COMMIT
// Copy this to supabase-config.js and add your real keys

module.exports = {
  supabaseUrl: 'https://zezcsjltcbajkuqyxupt.supabase.co',
  
  // ANON KEY: Safe to expose publicly (has limited permissions)
  // Get from: https://supabase.com/dashboard/project/zezcsjltcbajkuqyxupt/settings/api
  anonKey: 'PASTE_YOUR_ANON_KEY_HERE',
  
  // SERVICE_ROLE KEY: ⚠️ KEEP SECRET! Never commit this!
  // Only used in backend scripts, never in frontend
  serviceRoleKey: 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE'
};

// SECURITY NOTES:
// ✅ anon key = public (safe in frontend, GitHub, etc.)
// ❌ service_role key = secret (never expose publicly)
// 🔒 This file (supabase-config.js) is in .gitignore - won't be committed

// HOW TO GET KEYS:
// 1. Go to: https://supabase.com/dashboard/project/zezcsjltcbajkuqyxupt/settings/api
// 2. Copy the 'anon' key and paste above
// 3. Copy the 'service_role' key and paste above
// 4. Save this file as 'supabase-config.js' (without .example)
// 5. Run: node test-everything.js 