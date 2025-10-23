Write-Host "Setting up Virtual Try-On Service..." -ForegroundColor Cyan

# Navigate to service directory
Set-Location "g:\fuc website\virtual-tryon-service"

# Check Python
python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Python not found! Please install Python 3.9+" -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "Setup complete! Run .\start.ps1 to start the service." -ForegroundColor Green