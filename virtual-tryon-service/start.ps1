Write-Host "Starting Virtual Try-On Service..." -ForegroundColor Cyan

Set-Location "g:\fuc website\virtual-tryon-service"

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

Write-Host "Service starting on http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow

# Start service
python app.py