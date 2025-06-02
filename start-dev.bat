@echo off
echo 🚀 Starting Order System Development...

REM TODO: Set your Supabase environment variables here
REM Get keys from: https://supabase.com/dashboard/project/zezcsjltcbajkuqyxupt/settings/api
set SUPABASE_URL=https://zezcsjltcbajkuqyxupt.supabase.co
set SUPABASE_ANON_KEY=PASTE_YOUR_ANON_KEY_HERE

echo 🔧 Environment Setup:
echo 🌐 Supabase URL: %SUPABASE_URL%
echo 🔑 Anon Key: [CONFIGURED]

echo.
echo 🌐 Starting development server...
cd frontend
npm run dev

pause 