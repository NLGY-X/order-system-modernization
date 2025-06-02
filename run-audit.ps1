#!/usr/bin/env pwsh

# Order System Audit Runner
# Proper PowerShell script for Windows

Write-Host "🔍 ORDER SYSTEM COMPREHENSIVE AUDIT" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if Node.js is available
Write-Host "`n📋 Checking Prerequisites..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if the development server is running
Write-Host "`n📋 Checking Development Server..." -ForegroundColor Yellow

$serverRunning = Get-NetTCPConnection -LocalPort 3003 -ErrorAction SilentlyContinue
if (-not $serverRunning) {
    Write-Host "⚠️  Development server not running on port 3003" -ForegroundColor Yellow
    Write-Host "Starting development server..." -ForegroundColor Yellow
    
    # Start the dev server in a new PowerShell window
    Start-Process powershell -ArgumentList "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal
    
    Write-Host "Waiting for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check again
    $serverRunning = Get-NetTCPConnection -LocalPort 3003 -ErrorAction SilentlyContinue
    if (-not $serverRunning) {
        Write-Host "❌ Failed to start development server. Please start manually:" -ForegroundColor Red
        Write-Host "   cd frontend; npm run dev" -ForegroundColor White
        exit 1
    }
}

Write-Host "✅ Development server is running on port 3003" -ForegroundColor Green

# Check if Playwright is installed
Write-Host "`n📋 Checking Test Dependencies..." -ForegroundColor Yellow

$playwrightPath = Join-Path $PSScriptRoot "node_modules\.bin\playwright.cmd"
if (-not (Test-Path $playwrightPath)) {
    Write-Host "⚠️  Playwright not found. Installing..." -ForegroundColor Yellow
    try {
        npm install playwright
        npx playwright install
        Write-Host "✅ Playwright installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Playwright" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Playwright is available" -ForegroundColor Green
}

# Run the audit script
Write-Host "`n🚀 Running Comprehensive Audit..." -ForegroundColor Yellow

try {
    node frontend-audit.js
} catch {
    Write-Host "❌ Audit script failed to run" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Audit Complete!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Review the audit results above" -ForegroundColor White
Write-Host "2. Address any failed tests" -ForegroundColor White
Write-Host "3. Run manual tests from AUDIT_MANUAL_CHECKLIST.md" -ForegroundColor White
Write-Host "4. Test database connectivity: node test-everything.js" -ForegroundColor White

# Keep window open if run directly
if ($Host.Name -eq "ConsoleHost") {
    Write-Host "`nPress any key to continue..." -ForegroundColor DarkGray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} 