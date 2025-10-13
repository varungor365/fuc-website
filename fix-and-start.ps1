# FASHUN Platform - Fix and Start Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FASHUN.CO - Platform Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
    return $connection
}

# Function to kill process on port
function Stop-ProcessOnPort {
    param($Port)
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Write-Host "  Stopping process on port $Port..." -ForegroundColor Yellow
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Check and clean ports
Write-Host "Step 1: Checking ports..." -ForegroundColor Yellow
$ports = @(1337, 3000, 3001)
foreach ($port in $ports) {
    if (Test-Port $port) {
        Write-Host "  Port $port is in use. Cleaning..." -ForegroundColor Red
        Stop-ProcessOnPort $port
    } else {
        Write-Host "  Port $port is available" -ForegroundColor Green
    }
}
Write-Host ""

# Build frontend if needed
Write-Host "Step 2: Checking frontend build..." -ForegroundColor Yellow
$nextDir = "d:\fuc-website-main\fashun-store\.next"
if (Test-Path $nextDir) {
    Write-Host "  Frontend already built" -ForegroundColor Green
} else {
    Write-Host "  Building frontend (this may take a few minutes)..." -ForegroundColor Yellow
    Set-Location "d:\fuc-website-main\fashun-store"
    npm run build
}
Write-Host ""

# Start services
Write-Host "Step 3: Starting services..." -ForegroundColor Yellow
Write-Host ""

# Start Strapi Backend
Write-Host "  Starting Strapi Backend (Port 1337)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\fuc-website-main\fashun-backend'; Write-Host '=== STRAPI BACKEND ===' -ForegroundColor Green; npm run develop"
Start-Sleep -Seconds 8

# Start AI Mockup Service
Write-Host "  Starting AI Mockup Service (Port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\fuc-website-main\ai-mockup-service'; Write-Host '=== AI MOCKUP SERVICE ===' -ForegroundColor Green; npm start"
Start-Sleep -Seconds 5

# Start Next.js Frontend
Write-Host "  Starting Next.js Frontend (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\fuc-website-main\fashun-store'; Write-Host '=== NEXT.JS FRONTEND ===' -ForegroundColor Green; npm run dev"
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  All Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "  Frontend:       http://localhost:3000" -ForegroundColor White
Write-Host "  Admin Panel:    http://localhost:3000/admin" -ForegroundColor White
Write-Host "  Strapi CMS:     http://localhost:1337/admin" -ForegroundColor White
Write-Host "  AI Service:     http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "Default Credentials:" -ForegroundColor Cyan
Write-Host "  Email:    admin@fashun.co" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Health checks
Write-Host ""
Write-Host "Performing health checks..." -ForegroundColor Yellow

# Check AI Service
try {
    $aiHealth = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  AI Service:     ONLINE" -ForegroundColor Green
} catch {
    Write-Host "  AI Service:     OFFLINE (may still be starting)" -ForegroundColor Yellow
}

# Check Frontend
try {
    $frontendHealth = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  Frontend:       ONLINE" -ForegroundColor Green
} catch {
    Write-Host "  Frontend:       OFFLINE (may still be starting)" -ForegroundColor Yellow
}

# Check Strapi
try {
    $strapiHealth = Invoke-WebRequest -Uri "http://localhost:1337" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  Strapi Backend: ONLINE" -ForegroundColor Green
} catch {
    Write-Host "  Strapi Backend: OFFLINE (may still be starting)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Platform is ready!" -ForegroundColor Green
Write-Host "  Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
