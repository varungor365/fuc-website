# FASHUN.CO Deployment Script for Windows
# This PowerShell script ensures proper build configuration for Vercel deployment

Write-Host "🚀 Starting FASHUN.CO deployment process..." -ForegroundColor Green

# Ensure we're in the fashun-store directory for Next.js build
Set-Location "fashun-store"

Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
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