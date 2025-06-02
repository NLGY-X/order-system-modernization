# Order System Development Startup Script
Write-Host "Starting Order System Development Server..." -ForegroundColor Green

# Kill any existing Node processes to avoid port conflicts
Write-Host "Stopping any existing development servers..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Set environment variables
$env:SUPABASE_URL = "https://zezcsjltcbajkuqyxupt.supabase.co"
$env:SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplemNzamx0Y2Jhamt1cXl4dXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDg2NjAsImV4cCI6MjA2MzkyNDY2MH0.EUlrFj5VF_fpNHD4QjLXD4YQqZLMdT4xTqKHlzp-vEQ"

Write-Host "Environment variables set" -ForegroundColor Green
Write-Host "Supabase URL: $env:SUPABASE_URL" -ForegroundColor Cyan
Write-Host "Anon Key: Set" -ForegroundColor Cyan

# Navigate to frontend and start development server
Write-Host "Navigating to frontend directory..." -ForegroundColor Yellow
Set-Location frontend

Write-Host "Starting Nuxt development server..." -ForegroundColor Yellow
Write-Host "The application will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "Admin panel: http://localhost:3000/admin/login" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the development server" -ForegroundColor Yellow

npm run dev 