# FASHUN.CO - Production Deployment Script
Write-Host "🚀 FASHUN.CO - Production Deployment" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Confirmation
$confirm = Read-Host "Deploy to PRODUCTION? This will go LIVE! (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 0
}

# Pre-deployment checks
Write-Host "`n📋 Running pre-deployment checks..." -ForegroundColor Yellow

# Check if on main branch
$branch = git branch --show-current
if ($branch -ne "main") {
    Write-Host "⚠️  Not on main branch. Current: $branch" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Uncommitted changes detected" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

# Build and test frontend
Write-Host "`n🏗️  Building frontend..." -ForegroundColor Yellow
cd fashun-store
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend build successful" -ForegroundColor Green

# Run tests
Write-Host "`n🧪 Running tests..." -ForegroundColor Yellow
npm run test
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Tests failed" -ForegroundColor Yellow
    $continue = Read-Host "Continue deployment? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

# Deploy frontend to Vercel
Write-Host "`n🚀 Deploying frontend to Vercel..." -ForegroundColor Yellow
vercel --prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend deployment failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend deployed successfully" -ForegroundColor Green

# Deploy backend
Write-Host "`n🚀 Deploying backend..." -ForegroundColor Yellow
cd ../fashun-medusa-backend

# Build backend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "`n🔄 Running database migrations..." -ForegroundColor Yellow
medusa migrations run
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Migrations failed" -ForegroundColor Yellow
}

# Deploy to Railway/Heroku
Write-Host "`n🚀 Deploying to hosting..." -ForegroundColor Yellow
railway up
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend deployment failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend deployed successfully" -ForegroundColor Green

# Post-deployment verification
Write-Host "`n✅ Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check frontend
$frontendUrl = "https://fashun.co"
try {
    $response = Invoke-WebRequest -Uri $frontendUrl -Method Head -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is live: $frontendUrl" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Frontend check failed" -ForegroundColor Yellow
}

# Check backend
$backendUrl = "https://api.fashun.co/health"
try {
    $response = Invoke-WebRequest -Uri $backendUrl -Method Get -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is live: $backendUrl" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend check failed" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nLive URLs:" -ForegroundColor Yellow
Write-Host "  Website: https://fashun.co" -ForegroundColor Cyan
Write-Host "  Admin:   https://admin.fashun.co" -ForegroundColor Cyan
Write-Host "  API:     https://api.fashun.co" -ForegroundColor Cyan
Write-Host "`n📊 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Monitor error logs"
Write-Host "  2. Test critical user flows"
Write-Host "  3. Announce launch on social media"
Write-Host "  4. Monitor analytics dashboard"
Write-Host "`n🎊 Congratulations on your launch!" -ForegroundColor Green

cd ..
