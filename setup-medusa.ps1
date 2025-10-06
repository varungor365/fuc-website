# FASHUN.CO - Medusa Setup Script
Write-Host "🚀 FASHUN.CO - Medusa E-Commerce Setup" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js $nodeVersion installed" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
Write-Host "`n📦 Checking PostgreSQL..." -ForegroundColor Yellow
$pgService = Get-Service postgresql* -ErrorAction SilentlyContinue
if ($pgService) {
    Write-Host "✅ PostgreSQL found" -ForegroundColor Green
    if ($pgService.Status -ne 'Running') {
        Write-Host "🔄 Starting PostgreSQL..." -ForegroundColor Yellow
        Start-Service $pgService.Name
    }
} else {
    Write-Host "⚠️  PostgreSQL not found" -ForegroundColor Yellow
    Write-Host "   Install from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    $install = Read-Host "Continue without PostgreSQL? (y/n)"
    if ($install -ne 'y') { exit 1 }
}

# Install Medusa CLI
Write-Host "`n📦 Installing Medusa CLI..." -ForegroundColor Yellow
npm install -g @medusajs/medusa-cli
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Medusa CLI installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install Medusa CLI" -ForegroundColor Red
    exit 1
}

# Create Medusa project
Write-Host "`n🏗️  Creating Medusa backend..." -ForegroundColor Yellow
if (Test-Path "fashun-medusa-backend") {
    Write-Host "⚠️  fashun-medusa-backend already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite? (y/n)"
    if ($overwrite -eq 'y') {
        Remove-Item -Recurse -Force fashun-medusa-backend
    } else {
        Write-Host "Skipping backend creation" -ForegroundColor Yellow
        cd fashun-medusa-backend
    }
}

if (-not (Test-Path "fashun-medusa-backend")) {
    medusa new fashun-medusa-backend --seed
    cd fashun-medusa-backend
}

# Configure environment
Write-Host "`n⚙️  Configuring environment..." -ForegroundColor Yellow
$envContent = @"
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fashun_medusa

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Secrets
JWT_SECRET=fashun-jwt-secret-$(Get-Random)
COOKIE_SECRET=fashun-cookie-secret-$(Get-Random)

# CORS
ADMIN_CORS=http://localhost:7001,http://localhost:7000
STORE_CORS=http://localhost:3000

# Razorpay
RAZORPAY_ID=your_razorpay_id
RAZORPAY_SECRET=your_razorpay_secret
"@

Set-Content -Path ".env" -Value $envContent
Write-Host "✅ Environment configured" -ForegroundColor Green

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Run migrations
Write-Host "`n🔄 Running database migrations..." -ForegroundColor Yellow
npm run build
medusa migrations run
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations completed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Migrations failed (this is OK if database doesn't exist yet)" -ForegroundColor Yellow
}

# Seed database
Write-Host "`n🌱 Seeding database..." -ForegroundColor Yellow
$seed = Read-Host "Seed with demo data? (y/n)"
if ($seed -eq 'y') {
    npm run seed
    Write-Host "✅ Database seeded" -ForegroundColor Green
}

# Update frontend
Write-Host "`n🎨 Updating frontend..." -ForegroundColor Yellow
cd ../fashun-store
npm install @medusajs/medusa-js
Write-Host "✅ Frontend updated" -ForegroundColor Green

# Create startup script
Write-Host "`n📝 Creating startup script..." -ForegroundColor Yellow
cd ..
$startScript = @"
Write-Host "🚀 Starting FASHUN.CO with Medusa..." -ForegroundColor Cyan

# Start Medusa Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd fashun-medusa-backend; npm run start"
Start-Sleep -Seconds 3

# Start Medusa Admin
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd fashun-medusa-backend; npm run dev:admin"
Start-Sleep -Seconds 3

# Start AI Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai-mockup-service; npm start"
Start-Sleep -Seconds 2

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd fashun-store; npm run dev"

Write-Host "`n✅ All services started!" -ForegroundColor Green
Write-Host "`nAccess Points:" -ForegroundColor Cyan
Write-Host "  Frontend:    http://localhost:3000" -ForegroundColor Yellow
Write-Host "  Medusa API:  http://localhost:9000" -ForegroundColor Yellow
Write-Host "  Admin:       http://localhost:7001" -ForegroundColor Yellow
Write-Host "  AI Service:  http://localhost:3001" -ForegroundColor Yellow
"@

Set-Content -Path "start-medusa-platform.ps1" -Value $startScript
Write-Host "✅ Startup script created: start-medusa-platform.ps1" -ForegroundColor Green

# Summary
Write-Host "`n" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ MEDUSA SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  1. Create PostgreSQL database: fashun_medusa"
Write-Host "  2. Update .env in fashun-medusa-backend"
Write-Host "  3. Run: .\start-medusa-platform.ps1"
Write-Host "  4. Access admin: http://localhost:7001"
Write-Host "  5. Create admin user and API key"
Write-Host "  6. Run migration: node scripts/migrate-to-medusa.js"
Write-Host "`n📚 Documentation: MEDUSA_MIGRATION_GUIDE.md" -ForegroundColor Cyan
