Write-Host "🚀 FASHUN.CO - Quick Start Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "✓ Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "  Node.js $nodeVersion installed ✓" -ForegroundColor Green
} else {
    Write-Host "  ✗ Node.js not found! Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "✓ Checking npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "  npm $npmVersion installed ✓" -ForegroundColor Green
} else {
    Write-Host "  ✗ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing Dependencies..." -ForegroundColor Cyan
Write-Host ""

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location fashun-store
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location ..\fashun-backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

# Install AI service dependencies
Write-Host "Installing AI service dependencies..." -ForegroundColor Yellow
Set-Location ..\ai-mockup-service
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ AI service installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ AI service dependencies installed" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Run: .\start-platform.ps1" -ForegroundColor White
Write-Host "  2. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Read START_HERE.md for detailed instructions" -ForegroundColor Yellow
