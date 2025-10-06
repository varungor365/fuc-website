# FASHUN Platform Startup Script
Write-Host "🚀 Starting FASHUN Platform..." -ForegroundColor Cyan

# Start Strapi Backend
Write-Host "`n📦 Starting Strapi Backend (Port 1337)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\fuc-website-main\fashun-backend'; npm run develop"

# Wait a bit for backend to initialize
Start-Sleep -Seconds 5

# Start AI Mockup Service
Write-Host "`n🎨 Starting AI Mockup Service (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\fuc-website-main\ai-mockup-service'; npm start"

# Wait a bit for AI service to initialize
Start-Sleep -Seconds 3

# Start Next.js Frontend
Write-Host "`n🌐 Starting Next.js Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\fuc-website-main\fashun-store'; npm run dev"

Write-Host "`n✅ All services starting..." -ForegroundColor Green
Write-Host "`nAccess Points:" -ForegroundColor Cyan
Write-Host "  Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "  Admin Panel: http://localhost:3000/admin" -ForegroundColor White
Write-Host "  Strapi CMS:  http://localhost:1337/admin" -ForegroundColor White
Write-Host "  AI Service:  http://localhost:3001/health" -ForegroundColor White
Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
