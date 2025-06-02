# Development startup script with environment variables
Write-Host "🚀 Starting Order System Development..." -ForegroundColor Green

# TODO: Set your Supabase environment variables here
# Get keys from: https://supabase.com/dashboard/project/zezcsjltcbajkuqyxupt/settings/api
$env:SUPABASE_URL = "https://zezcsjltcbajkuqyxupt.supabase.co"
$env:SUPABASE_ANON_KEY = "PASTE_YOUR_ANON_KEY_HERE"

Write-Host "🔧 Environment Setup:" -ForegroundColor Yellow
Write-Host "Supabase URL: $env:SUPABASE_URL" -ForegroundColor Cyan
Write-Host "Anon Key: [CONFIGURED]" -ForegroundColor Cyan

Write-Host "`n🌐 Starting development server..." -ForegroundColor Green
cd frontend
npm run dev 