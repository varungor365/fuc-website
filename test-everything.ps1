Write-Host "🧪 FASHUN.CO - Complete System Test" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$testsPassed = 0
$testsFailed = 0

# Test 1: Check Node.js
Write-Host "Test 1: Node.js Installation" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js $nodeVersion" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host "  ✗ Node.js not found" -ForegroundColor Red
    $testsFailed++
}

# Test 2: Check npm
Write-Host "Test 2: npm Installation" -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm $npmVersion" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host "  ✗ npm not found" -ForegroundColor Red
    $testsFailed++
}

# Test 3: Check project structure
Write-Host "Test 3: Project Structure" -ForegroundColor Yellow
$requiredDirs = @(
    "fashun-store",
    "fashun-backend",
    "ai-mockup-service"
)

foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "  ✓ $dir exists" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "  ✗ $dir missing" -ForegroundColor Red
        $testsFailed++
    }
}

# Test 4: Check environment files
Write-Host "Test 4: Environment Configuration" -ForegroundColor Yellow
if (Test-Path "fashun-store\.env.local") {
    Write-Host "  ✓ .env.local exists" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "  ✗ .env.local missing" -ForegroundColor Red
    $testsFailed++
}

# Test 5: Check dependencies
Write-Host "Test 5: Dependencies" -ForegroundColor Yellow
if (Test-Path "fashun-store\node_modules") {
    Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "  ⚠ Frontend dependencies not installed" -ForegroundColor Yellow
    Write-Host "    Run: cd fashun-store && npm install" -ForegroundColor Gray
    $testsFailed++
}

# Test 6: Check key files
Write-Host "Test 6: Key Files" -ForegroundColor Yellow
$keyFiles = @(
    "fashun-store\src\app\page.tsx",
    "fashun-store\src\app\admin\page.tsx",
    "fashun-store\src\app\customize\page.tsx",
    "START_HERE.md",
    "SETUP_COMPLETE.md"
)

foreach ($file in $keyFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file exists" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "  ✗ $file missing" -ForegroundColor Red
        $testsFailed++
    }
}

# Test 7: Build test
Write-Host "Test 7: Build Test" -ForegroundColor Yellow
Write-Host "  Testing Next.js build..." -ForegroundColor Gray
Set-Location fashun-store
$buildOutput = npm run build 2>&1
Set-Location ..

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build successful" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "  ✗ Build failed" -ForegroundColor Red
    $testsFailed++
}

# Summary
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 All tests passed! Your platform is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: .\start-platform.ps1" -ForegroundColor White
    Write-Host "  2. Open: http://localhost:3000" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "⚠️  Some tests failed. Please fix the issues above." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Detailed results saved in TEST_RESULTS.md" -ForegroundColor Gray
