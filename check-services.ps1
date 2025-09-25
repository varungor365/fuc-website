# FASHUN.CO Platform Services Status Check
Write-Host "🚀 FASHUN.CO Platform - Services Status Check" -ForegroundColor Cyan
Write-Host "=" * 50

# Function to test service connectivity
function Test-Service {
    param(
        [string]$Name,
        [string]$Url,
        [int]$Port
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ $Name" -ForegroundColor Green -NoNewline
        Write-Host " - Running on port $Port" -ForegroundColor White
        return $true
    }
    catch {
        Write-Host "❌ $Name" -ForegroundColor Red -NoNewline
        Write-Host " - Not responding on port $Port" -ForegroundColor White
        return $false
    }
}

# Check each service
Write-Host "`n🔍 Checking Services..." -ForegroundColor Yellow

$strapi = Test-Service -Name "Strapi Backend" -Url "http://localhost:1337/admin" -Port 1337
$frontend = Test-Service -Name "Next.js Frontend" -Url "http://localhost:3000" -Port 3000
$ai = Test-Service -Name "AI Mockup Service" -Url "http://localhost:3001/health" -Port 3001

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
$total = 3
$running = ($strapi -as [bool]) + ($frontend -as [bool]) + ($ai -as [bool])

Write-Host "Services Running: $running/$total" -ForegroundColor $(if($running -eq $total) { "Green" } else { "Yellow" })

if ($running -eq $total) {
    Write-Host "`n🎉 All services are operational!" -ForegroundColor Green
    Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   • Backend Admin: http://localhost:1337/admin" -ForegroundColor White
    Write-Host "   • AI Service: http://localhost:3001" -ForegroundColor White
} else {
    Write-Host "`n⚠️  Some services need attention. Check the logs above." -ForegroundColor Yellow
}

Write-Host ""