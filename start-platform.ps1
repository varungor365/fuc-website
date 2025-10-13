# FASHUN.CO Platform Startup Script
# This script starts all components of the FASHUN platform (ASCII-safe)

param(
    [switch]$SkipFrontend,
    [switch]$SkipBackend,
    [switch]$SkipAI,
    [switch]$Production,
    [switch]$Test,
    [switch]$Help
)

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Blue = "Blue"

function Write-ColorOutput($ForegroundColor, $Message) {
    Write-Host $Message -ForegroundColor $ForegroundColor
}

function Show-Help {
    Write-ColorOutput $Blue @"
FASHUN.CO Platform Startup Script
=================================

Usage: .\start-platform.ps1 [OPTIONS]

Options:
  -SkipFrontend    Skip starting the Next.js frontend
  -SkipBackend     Skip starting the Strapi backend
  -SkipAI          Skip starting the AI mockup service
  -Production      Run in production mode
  -Test            Run tests after starting services
  -Help            Show this help message

Examples:
  .\start-platform.ps1                    # Start all services in development
  .\start-platform.ps1 -SkipAI            # Start without AI service
  .\start-platform.ps1 -Production        # Start all in production mode
  .\start-platform.ps1 -Test              # Start and run tests

"@
}

function Test-Prerequisites {
    Write-ColorOutput $Blue "[INFO] Checking prerequisites..."
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-ColorOutput $Green "[OK] Node.js version: $nodeVersion"
    } catch {
        Write-ColorOutput $Red "[ERROR] Node.js not found. Please install Node.js 18+"
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-ColorOutput $Green "[OK] npm version: $npmVersion"
    } catch {
        Write-ColorOutput $Red "[ERROR] npm not found"
        exit 1
    }
}

function Initialize-Environment {
    Write-ColorOutput $Blue "[INFO] Setting up environment..."
    
    # Check if .env files exist and create from examples if not
    $envFiles = @(
        @{Path = "fashun-backend\.env"; Example = "fashun-backend\.env.example"},
        @{Path = "fashun-store\.env.local"; Example = "fashun-store\.env.example"},
        @{Path = "ai-mockup-service\.env"; Example = "ai-mockup-service\.env.example"}
    )
    
    foreach ($env in $envFiles) {
        if (!(Test-Path $env.Path) -and (Test-Path $env.Example)) {
            Copy-Item $env.Example $env.Path
            Write-ColorOutput $Yellow "[WARN] Created $($env.Path) from example. Please configure it."
        }
    }
}

function Install-Dependencies {
    Write-ColorOutput $Blue "[INFO] Installing dependencies..."
    
    # Backend dependencies
    if (!(Test-Path "fashun-backend\node_modules") -or $Force) {
        Write-ColorOutput $Yellow "[INFO] Installing backend dependencies..."
        Set-Location "fashun-backend"
        npm install
        Set-Location ".."
    }
    
    # Frontend dependencies
    if (!(Test-Path "fashun-store\node_modules") -or $Force) {
        Write-ColorOutput $Yellow "[INFO] Installing frontend dependencies..."
        Set-Location "fashun-store"
        npm install
        Set-Location ".."
    }
    
    # AI service dependencies
    if (!(Test-Path "ai-mockup-service\node_modules") -or $Force) {
        Write-ColorOutput $Yellow "[INFO] Installing AI service dependencies..."
        Set-Location "ai-mockup-service"
        npm install
        Set-Location ".."
    }
    
    Write-ColorOutput $Green "[OK] All dependencies installed"
}

function Start-Backend {
    if ($SkipBackend) {
        Write-ColorOutput $Yellow "[SKIP] Skipping backend (Strapi)"
        return
    }
    
    Write-ColorOutput $Blue "[INFO] Starting Strapi backend..."
    
    Start-Process powershell -ArgumentList @(
        "-NoExit", 
        "-Command", 
        "cd '$PWD\fashun-backend'; Write-Host 'Strapi Backend Starting...' -ForegroundColor Green; npm run dev"
    ) -WindowStyle Normal
    
    Write-ColorOutput $Green "[OK] Backend started at http://localhost:1337"
}

function Start-AI-Service {
    if ($SkipAI) {
        Write-ColorOutput $Yellow "[SKIP] Skipping AI service"
        return
    }
    
    Write-ColorOutput $Blue "[INFO] Starting AI Mockup Service..."
    
    Start-Process powershell -ArgumentList @(
        "-NoExit", 
        "-Command", 
        "cd '$PWD\ai-mockup-service'; Write-Host 'AI Service Starting...' -ForegroundColor Green; npm run dev"
    ) -WindowStyle Normal
    
    Write-ColorOutput $Green "[OK] AI service started at http://localhost:3001"
}

function Start-Frontend {
    if ($SkipFrontend) {
        Write-ColorOutput $Yellow "[SKIP] Skipping frontend (Next.js)"
        return
    }
    
    Write-ColorOutput $Blue "[INFO] Starting Next.js frontend..."
    
    if ($Production) {
        Start-Process powershell -ArgumentList @(
            "-NoExit",
            "-Command",
            "cd '$PWD\fashun-store'; Write-Host 'Next.js Frontend Starting...' -ForegroundColor Green; npm run build; npm start"
        ) -WindowStyle Normal
    } else {
        Start-Process powershell -ArgumentList @(
            "-NoExit",
            "-Command",
            "cd '$PWD\fashun-store'; Write-Host 'Next.js Frontend Starting...' -ForegroundColor Green; npm run dev"
        ) -WindowStyle Normal
    }
    
    Write-ColorOutput $Green "[OK] Frontend started at http://localhost:3000"
}

function Test-Services {
    Write-ColorOutput $Blue "[INFO] Testing services..."
    Start-Sleep 10  # Wait for services to start
    
    $services = @(
        @{Name = "Backend"; URL = "http://localhost:1337/api/products"; Skip = $SkipBackend},
        @{Name = "AI Service"; URL = "http://localhost:3001/health"; Skip = $SkipAI},
        @{Name = "Frontend"; URL = "http://localhost:3000"; Skip = $SkipFrontend}
    )
    
    foreach ($service in $services) {
        if ($service.Skip) { continue }
        
        try {
            $response = Invoke-WebRequest -Uri $service.URL -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-ColorOutput $Green "[OK] $($service.Name) is healthy"
            } else {
                Write-ColorOutput $Yellow "[WARN] $($service.Name) returned status $($response.StatusCode)"
            }
        } catch {
            Write-ColorOutput $Red "[ERROR] $($service.Name) health check failed"
        }
    }
}

function Show-Dashboard {
    Write-ColorOutput $Blue @"

FASHUN.CO Platform Status
=========================

Services Running:
"@
    
    if (!$SkipBackend) {
        Write-ColorOutput $Green "Strapi Backend    : http://localhost:1337"
        Write-ColorOutput $Green "  Admin Panel     : http://localhost:1337/admin"
    }
    
    if (!$SkipAI) {
        Write-ColorOutput $Green "AI Mockup Service : http://localhost:3001"
        Write-ColorOutput $Green "  Health Check    : http://localhost:3001/health"
    }
    
    if (!$SkipFrontend) {
        Write-ColorOutput $Green "Next.js Frontend  : http://localhost:3000"
    }
    
    Write-ColorOutput $Blue @"

Next Steps:
===========
1. Configure your environment variables in .env files
2. Set up your Stripe keys for payments
3. Configure your AI service API keys
4. Access the admin panel to add products
5. Test the frontend functionality

Quick Commands:
===============
- Backend logs    : Check the Strapi window
- Frontend logs   : Check the Next.js window
- AI service logs : Check the AI service window
- Stop all        : Close all PowerShell windows

"@
}

function Run-Platform-Tests {
    Write-ColorOutput $Blue "[INFO] Running platform tests..."
    
    # Test backend
    if (!$SkipBackend) {
        Write-ColorOutput $Yellow "[TEST] Testing backend..."
        Set-Location "fashun-backend"
        # Add backend tests here when available
        Set-Location ".."
    }
    
    # Test frontend
    if (!$SkipFrontend) {
        Write-ColorOutput $Yellow "[TEST] Testing frontend..."
        Set-Location "fashun-store"
        # Add frontend tests here when available
        Set-Location ".."
    }
    
    # Test AI service
    if (!$SkipAI) {
        Write-ColorOutput $Yellow "[TEST] Testing AI service..."
        Set-Location "ai-mockup-service"
        # Add AI service tests here when available
        Set-Location ".."
    }
}

# Main execution
if ($Help) {
    Show-Help
    exit 0
}

Write-ColorOutput $Green @"
FASHUN.CO Platform Startup
==========================
"@

Test-Prerequisites
Initialize-Environment
Install-Dependencies

# Start services in order
Start-Backend
Start-Sleep 3
Start-AI-Service
Start-Sleep 3
Start-Frontend

# Wait for all services to be ready
Start-Sleep 10

if ($Test) {
    Test-Services
    Run-Platform-Tests
} else {
    Test-Services
}

Show-Dashboard

Write-ColorOutput $Green "[READY] FASHUN.CO platform is ready!"
Write-ColorOutput $Yellow "[NOTE] Keep this window open to see the platform status."
Write-ColorOutput $Blue "Press Ctrl+C to stop monitoring (services will continue running)"

# Keep the script running to show status
try {
    while ($true) {
        Start-Sleep 30
        # Could add periodic health checks here
    }
} catch {
    Write-ColorOutput $Yellow "[INFO] Platform monitoring stopped. Services are still running."
}