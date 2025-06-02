@echo off
echo 🚀 Starting Order System Development Server...

REM Set environment variables
set SUPABASE_URL=https://zezcsjltcbajkuqyxupt.supabase.co
set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplemNzamx0Y2Jhamt1cXl4dXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDg2NjAsImV4cCI6MjA2MzkyNDY2MH0.EUlrFj5VF_fpNHD4QjLXD4YQqZLMdT4xTqKHlzp-vEQ

echo ✅ Environment variables set
echo 🌐 Supabase URL: %SUPABASE_URL%
echo 🔑 Anon Key: Set

REM Navigate to frontend and start development server
echo 📁 Navigating to frontend directory...
cd frontend

echo 🔧 Starting Nuxt development server...
npm run dev

pause 