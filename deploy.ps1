# FASHUN.CO Deployment Script for Windows
# This PowerShell script ensures proper build configuration for Vercel deployment

Write-Host "🚀 Starting FASHUN.CO deployment process..." -ForegroundColor Green

# Check if we're in the root directory
if (Test-Path "fashun-store") {
    Write-Host "📍 Root directory detected, configuring for Vercel..." -ForegroundColor Blue
    
    # Install root dependencies for Vercel detection
    Write-Host "📦 Installing root dependencies..." -ForegroundColor Blue
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Root dependency installation failed!" -ForegroundColor Red
        exit 1
    }
}

# Navigate to fashun-store for actual build
Write-Host "📂 Navigating to fashun-store directory..." -ForegroundColor Blue
Set-Location "fashun-store"

Write-Host "📦 Installing Next.js dependencies..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dependency installation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🔨 Building Next.js application..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host "🌐 Ready for deployment to Vercel" -ForegroundColor Cyan
Write-Host "💡 Tip: Set Root Directory to 'fashun-store' in Vercel settings" -ForegroundColor Yellow