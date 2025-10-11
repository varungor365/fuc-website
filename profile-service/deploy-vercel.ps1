# Profile Service - Vercel Deployment Script
# This script helps deploy the profile service to Vercel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Profile Service - Vercel Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the profile-service directory." -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "Step 1: Installing dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "Step 2: Testing build locally..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Environment Variables Required" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before deploying, ensure these are set in Vercel:" -ForegroundColor Yellow
Write-Host "  - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor White
Write-Host "  - NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor White
Write-Host "  - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor White
Write-Host "  - NEXT_PUBLIC_SITE_URL" -ForegroundColor White
Write-Host "  - NEXT_PUBLIC_STORE_URL" -ForegroundColor White
Write-Host ""

$deploy = Read-Host "Do you want to deploy to Vercel now? (y/n)"

if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host ""
    Write-Host "Deploying to Vercel..." -ForegroundColor Green
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Deployment Successful!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Verify environment variables in Vercel dashboard" -ForegroundColor White
        Write-Host "2. Test the deployed application" -ForegroundColor White
        Write-Host "3. Check /settings and /users pages" -ForegroundColor White
        Write-Host "4. Monitor logs for any errors" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "Deployment failed. Check the error messages above." -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "Deployment cancelled. Run 'vercel --prod' when ready." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "For more information, see VERCEL_DEPLOYMENT_FIX.md" -ForegroundColor Cyan
