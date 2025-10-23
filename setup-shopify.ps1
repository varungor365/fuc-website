# FASHUN.CO - Shopify CLI Setup Script
# This script helps you authenticate with Shopify CLI and start theme development

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     FASHUN.CO - Shopify Theme Development Setup        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Shopify CLI
Write-Host "Step 1: Checking Shopify CLI installation..." -ForegroundColor Yellow
$shopifyVersion = shopify version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Shopify CLI is installed: $shopifyVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Shopify CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "   Visit: https://shopify.dev/docs/themes/tools/cli/install" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Step 2: Authenticate with Shopify" -ForegroundColor Yellow
Write-Host "You'll be prompted to log in to your Shopify account." -ForegroundColor Cyan
Write-Host ""

# Step 2: Login
$storeInput = Read-Host "Enter your Shopify store URL (e.g., mystore.myshopify.com)"
if ([string]::IsNullOrWhiteSpace($storeInput)) {
    Write-Host "❌ Store URL is required." -ForegroundColor Red
    exit 1
}

# Ensure proper format
if (!$storeInput.Contains(".myshopify.com")) {
    if ($storeInput.Contains(".")) {
        Write-Host "⚠️  Adding .myshopify.com suffix..." -ForegroundColor Yellow
        $storeInput = $storeInput.Replace(".myshopify.com", "").Trim() + ".myshopify.com"
    } else {
        $storeInput = $storeInput.Trim() + ".myshopify.com"
    }
}

Write-Host "Using store: $storeInput" -ForegroundColor Cyan
Write-Host ""

# Step 3: Login with store
shopify auth login --store=$storeInput

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Authentication failed. Please try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Authentication successful!" -ForegroundColor Green
Write-Host ""
Write-Host "Step 3: Starting theme development server..." -ForegroundColor Yellow
Write-Host ""

# Step 4: Start theme development
cd "g:\fuc website\fashun-shopify-theme"
shopify theme dev

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           Theme Dev Server is Running!                 ║" -ForegroundColor Cyan
Write-Host "║                                                        ║" -ForegroundColor Cyan
Write-Host "║  Press Ctrl+C to stop the server                       ║" -ForegroundColor Cyan
Write-Host "║  Your theme is available at:                           ║" -ForegroundColor Cyan
Write-Host "║  https://yourstore-preview.myshopify.com               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
