# FASHUN.CO Platform - Automated Dependency Installation Script
# This script installs all necessary dependencies for the FASHUN platform

param(
    [switch]$Force,
    [switch]$SkipNodeCheck,
    [switch]$Verbose,
    [switch]$Help
)

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Blue = "Blue"
$Cyan = "Cyan"

function Write-ColorOutput($ForegroundColor, $Message) {
    Write-Host $Message -ForegroundColor $ForegroundColor
}

function Show-Help {
    Write-ColorOutput $Blue @"
FASHUN.CO Platform - Dependency Installation Script
==================================================

This script installs all necessary dependencies for:
- Strapi Backend (fashun-backend/)
- Next.js Frontend (fashun-store/)  
- AI Mockup Service (ai-mockup-service/)

Usage: .\install-dependencies.ps1 [OPTIONS]

Options:
  -Force          Force reinstall all dependencies (deletes node_modules)
  -SkipNodeCheck  Skip Node.js version verification
  -Verbose        Show detailed installation logs
  -Help           Show this help message

Examples:
  .\install-dependencies.ps1                # Standard installation
  .\install-dependencies.ps1 -Force         # Force reinstall everything
  .\install-dependencies.ps1 -Verbose       # Show detailed logs

Prerequisites:
  - Node.js 18.x to 20.x (https://nodejs.org)
  - npm 8.x or higher
  - Python 3.8+ (for native dependencies)
  - Git (for version control)

"@
}

function Test-Prerequisites {
    Write-ColorOutput $Blue "🔍 Checking prerequisites..."
    
    $allGood = $true
    
    # Check Node.js
    if (!$SkipNodeCheck) {
        try {
            $nodeVersion = node --version 2>$null
            if ($nodeVersion -match "^v(1[8-9]|20)\.\d+\.\d+") {
                Write-ColorOutput $Green "✅ Node.js version: $nodeVersion"
            } else {
                Write-ColorOutput $Red "❌ Node.js version $nodeVersion is not supported. Please install Node.js 18.x to 20.x"
                Write-ColorOutput $Yellow "   Download from: https://nodejs.org/en/download/"
                $allGood = $false
            }
        } catch {
            Write-ColorOutput $Red "❌ Node.js not found. Please install Node.js 18.x to 20.x"
            Write-ColorOutput $Yellow "   Download from: https://nodejs.org/en/download/"
            $allGood = $false
        }
    }
    
    # Check npm
    try {
        $npmVersion = npm --version 2>$null
        Write-ColorOutput $Green "✅ npm version: $npmVersion"
    } catch {
        Write-ColorOutput $Red "❌ npm not found"
        $allGood = $false
    }
    
    # Check Python (optional but recommended)
    try {
        $pythonVersion = python --version 2>$null
        Write-ColorOutput $Green "✅ Python version: $pythonVersion"
    } catch {
        Write-ColorOutput $Yellow "⚠️  Python not found. Some native dependencies may fail to install."
        Write-ColorOutput $Yellow "   Consider installing Python 3.8+ from: https://www.python.org/downloads/"
    }
    
    # Check Git
    try {
        $gitVersion = git --version 2>$null
        Write-ColorOutput $Green "✅ Git version: $gitVersion"
    } catch {
        Write-ColorOutput $Yellow "⚠️  Git not found. Consider installing from: https://git-scm.com/"
    }
    
    if (!$allGood) {
        Write-ColorOutput $Red "❌ Prerequisites check failed. Please install missing requirements."
        exit 1
    }
    
    Write-ColorOutput $Green "✅ All prerequisites satisfied!"
}

function Install-ServiceDependencies {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [string]$DisplayName,
        [string]$Icon
    )
    
    if (!(Test-Path $ServicePath)) {
        Write-ColorOutput $Red "❌ Service directory not found: $ServicePath"
        return $false
    }
    
    Write-ColorOutput $Blue "📦 Installing $DisplayName dependencies..."
    
    Push-Location $ServicePath
    
    try {
        # Force reinstall if requested
        if ($Force -and (Test-Path "node_modules")) {
            Write-ColorOutput $Yellow "🗑️  Removing existing node_modules for $DisplayName..."
            Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
            Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
        }
        
        # Install dependencies
        Write-ColorOutput $Cyan "$Icon Installing $DisplayName packages..."
        
        if ($Verbose) {
            npm install --verbose
        } else {
            npm install --silent
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput $Green "✅ $DisplayName dependencies installed successfully"
            
            # Count installed packages
            if (Test-Path "node_modules") {
                $packageCount = (Get-ChildItem "node_modules" -Directory).Count
                Write-ColorOutput $Cyan "   📊 Installed $packageCount packages"
            }
            
            return $true
        } else {
            Write-ColorOutput $Red "❌ Failed to install $DisplayName dependencies"
            return $false
        }
    }
    catch {
        Write-ColorOutput $Red "❌ Error installing $DisplayName dependencies: $($_.Exception.Message)"
        return $false
    }
    finally {
        Pop-Location
    }
}

function Test-InstallationHealth {
    Write-ColorOutput $Blue "🏥 Running installation health check..."
    
    $services = @(
        @{Name = "Backend"; Path = "fashun-backend"; Command = "npm run build --if-present"},
        @{Name = "Frontend"; Path = "fashun-store"; Command = "npm run type-check --if-present"},
        @{Name = "AI Service"; Path = "ai-mockup-service"; Command = "npm test --if-present"}
    )
    
    $allHealthy = $true
    
    foreach ($service in $services) {
        if (Test-Path $service.Path) {
            Write-ColorOutput $Cyan "🔍 Testing $($service.Name)..."
            Push-Location $service.Path
            
            try {
                # Check if node_modules exists
                if (Test-Path "node_modules") {
                    Write-ColorOutput $Green "  ✅ Dependencies installed"
                } else {
                    Write-ColorOutput $Red "  ❌ Dependencies missing"
                    $allHealthy = $false
                }
                
                # Check package.json
                if (Test-Path "package.json") {
                    $packageJson = Get-Content "package.json" | ConvertFrom-Json
                    Write-ColorOutput $Cyan "  📋 Package: $($packageJson.name) v$($packageJson.version)"
                } else {
                    Write-ColorOutput $Red "  ❌ package.json missing"
                    $allHealthy = $false
                }
            }
            catch {
                Write-ColorOutput $Red "  ❌ Health check failed: $($_.Exception.Message)"
                $allHealthy = $false
            }
            finally {
                Pop-Location
            }
        } else {
            Write-ColorOutput $Yellow "  ⚠️  Service directory not found: $($service.Path)"
        }
    }
    
    return $allHealthy
}

function Show-Summary {
    param([bool]$Success, [array]$Results)
    
    Write-ColorOutput $Blue @"

🎉 FASHUN.CO Platform - Installation Summary
============================================
"@
    
    if ($Success) {
        Write-ColorOutput $Green @"
✅ SUCCESS: All dependencies installed successfully!

Services Ready:
"@
        
        foreach ($result in $Results) {
            if ($result.Success) {
                Write-ColorOutput $Green "✅ $($result.Name): Ready"
            } else {
                Write-ColorOutput $Red "❌ $($result.Name): Failed"
            }
        }
        
        Write-ColorOutput $Blue @"

🚀 Next Steps:
==============
1. Start the platform:
   .\start-platform.ps1

2. Access your services:
   🎯 Strapi Backend    : http://localhost:1337
   🌐 Next.js Frontend  : http://localhost:3000  
   🤖 AI Service        : http://localhost:3001

3. Run tests:
   .\test-platform.ps1

4. Check service health:
   .\check-services.ps1

📚 Documentation:
=================
- Setup Guide        : README.md
- API Documentation  : /docs/api
- Deployment Guide   : DEPLOYMENT_GUIDE.md
- Troubleshooting    : FASHUN_TROUBLESHOOTING_GUIDE.txt

"@
    } else {
        Write-ColorOutput $Red @"
❌ INSTALLATION FAILED

Some dependencies could not be installed. Please check:

🔧 Troubleshooting Steps:
========================
1. Ensure Node.js 18.x-20.x is installed
2. Check your internet connection
3. Clear npm cache: npm cache clean --force
4. Try running with -Force flag
5. Check specific error messages above

🆘 Get Help:
============
- Check troubleshooting guide: DEPENDENCY_INSTALLATION_GUIDE.md
- Verify prerequisites are met
- Try manual installation for failed services

"@
    }
}

# Main execution
if ($Help) {
    Show-Help
    exit 0
}

Write-ColorOutput $Green @"
🚀 FASHUN.CO Platform - Dependency Installation
===============================================
Installing all dependencies for the complete platform...

"@

Test-Prerequisites

$results = @()
$overallSuccess = $true

# Install dependencies for each service
$services = @(
    @{Name = "Strapi Backend"; Path = "fashun-backend"; DisplayName = "Backend API"; Icon = "🎯"},
    @{Name = "Next.js Frontend"; Path = "fashun-store"; DisplayName = "Frontend App"; Icon = "🌐"},
    @{Name = "AI Mockup Service"; Path = "ai-mockup-service"; DisplayName = "AI Service"; Icon = "🤖"}
)

foreach ($service in $services) {
    $success = Install-ServiceDependencies -ServiceName $service.Name -ServicePath $service.Path -DisplayName $service.DisplayName -Icon $service.Icon
    $results += @{Name = $service.DisplayName; Success = $success}
    
    if (!$success) {
        $overallSuccess = $false
    }
}

# Run health check
Write-ColorOutput $Blue "`n🏥 Running final health check..."
$healthCheck = Test-InstallationHealth

if (!$healthCheck) {
    $overallSuccess = $false
}

# Show summary
Show-Summary -Success $overallSuccess -Results $results

if ($overallSuccess) {
    Write-ColorOutput $Green "🎉 All dependencies installed successfully! Platform is ready to launch."
    exit 0
} else {
    Write-ColorOutput $Red "❌ Some installations failed. Please check the errors above."
    exit 1
}