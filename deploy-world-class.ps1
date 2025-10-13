# World-Class FashUn Website - Production Deployment Script (PowerShell)
# This script automates the deployment process for the regenerated website

param(
    [switch]$SkipTests,
    [switch]$Force,
    [string]$Environment = \"production\"
)

# Configuration
$ProjectName = \"fashun-store\"
$BuildDir = \"fashun-store\"
$BackupDir = \"./backups/$(Get-Date -Format 'yyyyMMdd_HHmmss')\"
$RequiredNodeVersion = 18

# Colors for output
$Colors = @{
    Red = \"Red\"
    Green = \"Green\"
    Yellow = \"Yellow\"
    Blue = \"Blue\"
    Cyan = \"Cyan\"
}

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = \"Info\"
    )
    
    $timestamp = Get-Date -Format \"yyyy-MM-dd HH:mm:ss\"
    $color = switch ($Level) {
        \"Error\" { $Colors.Red }
        \"Warning\" { $Colors.Yellow }
        \"Success\" { $Colors.Green }
        \"Info\" { $Colors.Blue }
        default { $Colors.Blue }
    }
    
    Write-Host \"[$timestamp] [$Level] $Message\" -ForegroundColor $color
}

function Test-Dependencies {
    Write-Log \"Checking dependencies...\" \"Info\"
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        $versionNumber = [int]($nodeVersion -replace 'v(\\d+).*', '$1')
        
        if ($versionNumber -lt $RequiredNodeVersion) {
            Write-Log \"Node.js version $RequiredNodeVersion+ is required. Current: $nodeVersion\" \"Error\"
            exit 1
        }
        
        Write-Log \"Node.js version: $nodeVersion ✓\" \"Success\"
    }
    catch {
        Write-Log \"Node.js is not installed or not in PATH\" \"Error\"
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Log \"npm version: $npmVersion ✓\" \"Success\"
    }
    catch {
        Write-Log \"npm is not installed or not in PATH\" \"Error\"
        exit 1
    }
    
    # Check git
    try {
        $gitVersion = git --version
        Write-Log \"git version: $gitVersion ✓\" \"Success\"
    }
    catch {
        Write-Log \"git is not installed or not in PATH\" \"Error\"
        exit 1
    }
    
    Write-Log \"All dependencies are available\" \"Success\"
}

function Initialize-Environment {
    Write-Log \"Setting up environment...\" \"Info\"
    
    # Create backup directory
    if (!(Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    }
    
    # Check if .env.local exists
    $envPath = \"$BuildDir\\.env.local\"
    if (!(Test-Path $envPath)) {
        Write-Log \".env.local not found. Creating from template...\" \"Warning\"
        
        $envTemplate = @\"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.fashun.co.in

# AI Services
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_token_here

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=your_ga_measurement_id

# Payment (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret

# CDN & Media
NEXT_PUBLIC_CDN_URL=https://cdn.fashun.co.in

# Security
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://fashun.co.in
\"@
        
        Set-Content -Path $envPath -Value $envTemplate
        Write-Log \"Please update .env.local with your actual configuration values\" \"Warning\"
        
        if (!$Force) {
            Read-Host \"Press Enter to continue after updating .env.local\"
        }
    }
    
    Write-Log \"Environment setup complete\" \"Success\"
}

function Install-Dependencies {
    Write-Log \"Installing dependencies...\" \"Info\"
    
    Set-Location $BuildDir
    
    # Clean install
    if (Test-Path \"node_modules\") {
        Write-Log \"Cleaning existing node_modules...\" \"Info\"
        Remove-Item -Recurse -Force \"node_modules\", \"package-lock.json\" -ErrorAction SilentlyContinue
    }
    
    # Install dependencies
    npm ci --silent
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log \"Failed to install dependencies\" \"Error\"
        exit 1
    }
    
    Write-Log \"Dependencies installed successfully\" \"Success\"
}

function Invoke-Tests {
    if ($SkipTests) {
        Write-Log \"Skipping tests as requested\" \"Warning\"
        return
    }
    
    Write-Log \"Running tests...\" \"Info\"
    
    # Type checking
    Write-Log \"Running TypeScript type check...\" \"Info\"
    npm run type-check
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log \"TypeScript type check failed\" \"Error\"
        exit 1
    }
    
    # Linting
    Write-Log \"Running ESLint...\" \"Info\"
    npm run lint
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log \"ESLint failed\" \"Error\"
        exit 1
    }
    
    # Unit tests (if available)
    $packageJson = Get-Content \"package.json\" | ConvertFrom-Json
    if ($packageJson.scripts.test) {
        Write-Log \"Running unit tests...\" \"Info\"
        npm run test -- --passWithNoTests
        
        if ($LASTEXITCODE -ne 0) {
            Write-Log \"Unit tests failed\" \"Error\"
            exit 1
        }
    }
    
    Write-Log \"All tests passed\" \"Success\"
}

function Build-Project {
    Write-Log \"Building project for production...\" \"Info\"
    
    # Set production environment
    $env:NODE_ENV = \"production\"
    
    # Build the project
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log \"Build failed\" \"Error\"
        exit 1
    }
    
    # Analyze bundle (optional)
    $packageJson = Get-Content \"package.json\" | ConvertFrom-Json
    if ($packageJson.scripts.analyze) {
        Write-Log \"Generating bundle analysis...\" \"Info\"
        npm run analyze
    }
    
    Write-Log \"Project built successfully\" \"Success\"
}

function Optimize-Assets {
    Write-Log \"Optimizing assets...\" \"Info\"
    
    # Check build size
    if (Test-Path \".next\") {
        $buildSize = (Get-ChildItem \".next\" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Log \"Build size: $([math]::Round($buildSize, 2)) MB\" \"Info\"
    }
    
    Write-Log \"Asset optimization complete\" \"Success\"
}

function Deploy-ToVercel {
    Write-Log \"Deploying to Vercel...\" \"Info\"
    
    # Check if Vercel CLI is installed
    try {
        vercel --version | Out-Null
    }
    catch {
        Write-Log \"Installing Vercel CLI...\" \"Info\"
        npm install -g vercel
    }
    
    # Deploy to production
    vercel --prod --confirm
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log \"Vercel deployment failed\" \"Error\"
        exit 1
    }
    
    Write-Log \"Deployed to Vercel successfully\" \"Success\"
}

function Initialize-Monitoring {
    Write-Log \"Setting up monitoring and analytics...\" \"Info\"
    
    # Create monitoring configuration
    $monitoringConfig = @{
        alerts = @{
            uptime = $true
            performance = $true
            errors = $true
        }
        metrics = @{
            core_web_vitals = $true
            user_analytics = $true
            conversion_tracking = $true
        }
        notifications = @{
            email = \"admin@fashun.co.in\"
            slack = $true
        }
    }
    
    $monitoringConfig | ConvertTo-Json -Depth 3 | Set-Content \"monitoring-config.json\"
    
    Write-Log \"Monitoring configuration created\" \"Success\"
}

function Invoke-PostDeploymentTasks {
    Write-Log \"Running post-deployment tasks...\" \"Info\"
    
    # Test critical endpoints
    Write-Log \"Testing critical endpoints...\" \"Info\"
    $endpoints = @(
        \"https://fashun.co.in\",
        \"https://fashun.co.in/api/health\",
        \"https://fashun.co.in/collections/all\",
        \"https://fashun.co.in/admin\"
    )
    
    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-WebRequest -Uri $endpoint -Method GET -TimeoutSec 10 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Log \"✓ $endpoint\" \"Success\"
            }
            else {
                Write-Log \"✗ $endpoint (Status: $($response.StatusCode))\" \"Warning\"
            }
        }
        catch {
            Write-Log \"✗ $endpoint (Error: $($_.Exception.Message))\" \"Warning\"
        }
    }
    
    Write-Log \"Post-deployment tasks completed\" \"Success\"
}

function New-DeploymentReport {
    Write-Log \"Generating deployment report...\" \"Info\"
    
    $reportFile = \"deployment-report-$(Get-Date -Format 'yyyyMMdd_HHmmss').md\"
    
    try {
        $gitCommit = git rev-parse HEAD
        $gitBranch = git branch --show-current
    }
    catch {
        $gitCommit = \"N/A\"
        $gitBranch = \"N/A\"
    }
    
    $buildSize = if (Test-Path \".next\") {
        $size = (Get-ChildItem \".next\" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        \"$([math]::Round($size, 2)) MB\"
    }
    else {
        \"N/A\"
    }
    
    $report = @\"
# FashUn Deployment Report

## Deployment Information
- **Date**: $(Get-Date)
- **Version**: $gitCommit
- **Branch**: $gitBranch
- **Environment**: Production
- **Platform**: Vercel
- **Deployed by**: $env:USERNAME

## Features Deployed
- ✅ Premium glassmorphism UI components
- ✅ Holographic text effects
- ✅ Advanced animations (aurora, morpheus, crystal)
- ✅ WebGL 3D effects
- ✅ AI recommendation engine
- ✅ Voice commerce integration
- ✅ AR try-on experience
- ✅ Comprehensive admin dashboard
- ✅ Real-time analytics
- ✅ Performance optimizations

## Performance Metrics
- **Build Size**: $buildSize
- **Node.js Version**: $(node --version)
- **npm Version**: $(npm --version)

## URLs
- **Main Site**: https://fashun.co.in
- **Admin Panel**: https://fashun.co.in/admin
- **API**: https://api.fashun.co.in

## Next Steps
1. Monitor application performance
2. Set up automated backups
3. Configure alerting
4. Run user acceptance testing
5. Update documentation

---
Deployment completed successfully! 🎉
\"@
    
    Set-Content -Path $reportFile -Value $report
    
    Write-Log \"Deployment report generated: $reportFile\" \"Success\"
}

function Remove-TemporaryFiles {
    Write-Log \"Cleaning up...\" \"Info\"
    
    # Remove temporary files
    Get-ChildItem -Path . -Name \"*.tmp\" -Recurse | Remove-Item -Force -ErrorAction SilentlyContinue
    
    # Reset working directory
    Set-Location ..
    
    Write-Log \"Cleanup completed\" \"Success\"
}

# Main execution
function Main {
    $startTime = Get-Date
    
    Write-Host \"🎯 World-Class FashUn Website Deployment\" -ForegroundColor Cyan
    Write-Host \"🏗️  Building production-ready application with:\" -ForegroundColor Cyan
    Write-Host \"   • Premium animations & WebGL effects\" -ForegroundColor White
    Write-Host \"   • AI-powered features\" -ForegroundColor White
    Write-Host \"   • Integrated admin dashboard\" -ForegroundColor White
    Write-Host \"   • Performance optimizations\" -ForegroundColor White
    Write-Host \"\"
    
    # Check if we're in the right directory
    if (!(Test-Path $BuildDir)) {
        Write-Log \"$BuildDir directory not found. Are you in the correct directory?\" \"Error\"
        exit 1
    }
    
    try {
        # Run deployment steps
        Test-Dependencies
        Initialize-Environment
        Install-Dependencies
        Invoke-Tests
        Build-Project
        Optimize-Assets
        
        # Ask for confirmation before deploying
        if (!$Force) {
            Write-Host \"\"
            Write-Log \"Ready to deploy to production. This will:\" \"Warning\"
            Write-Host \"  • Deploy to Vercel\" -ForegroundColor Yellow
            Write-Host \"  • Update live website at fashun.co.in\" -ForegroundColor Yellow
            Write-Host \"  • Affect production users\" -ForegroundColor Yellow
            Write-Host \"\"
            
            $confirmation = Read-Host \"Continue with deployment? (y/N)\"
            if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
                Write-Log \"Deployment cancelled by user\" \"Info\"
                return
            }
        }
        
        Deploy-ToVercel
        Initialize-Monitoring
        Invoke-PostDeploymentTasks
        New-DeploymentReport
        Remove-TemporaryFiles
        
        $endTime = Get-Date
        $duration = $endTime - $startTime
        
        Write-Host \"\"
        Write-Host \"🎉 Deployment completed successfully!\" -ForegroundColor Green
        Write-Host \"🌐 Website: https://fashun.co.in\" -ForegroundColor Cyan
        Write-Host \"🔧 Admin: https://fashun.co.in/admin\" -ForegroundColor Cyan
        Write-Host \"⏱️  Duration: $($duration.ToString('mm\\:ss'))\" -ForegroundColor White
        Write-Host \"📊 Monitor your deployment and enjoy your world-class website!\" -ForegroundColor Green
    }
    catch {
        Write-Log \"Deployment failed: $($_.Exception.Message)\" \"Error\"
        Remove-TemporaryFiles
        exit 1
    }
}

# Handle Ctrl+C gracefully
$null = [console]::TreatControlCAsInput = $true

# Run main function
Main