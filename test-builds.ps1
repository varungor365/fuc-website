# Test Builds for Both Services
Write-Host "Testing Main Store Build..." -ForegroundColor Green
Set-Location -Path "fashun-store"
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Main Store Build Successful" -ForegroundColor Green
} else {
    Write-Host "❌ Main Store Build Failed" -ForegroundColor Red
}

Write-Host "Testing Profile Service Build..." -ForegroundColor Green
Set-Location -Path "../profile-service"
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Profile Service Build Successful" -ForegroundColor Green
} else {
    Write-Host "❌ Profile Service Build Failed" -ForegroundColor Red
}

Set-Location -Path ".."