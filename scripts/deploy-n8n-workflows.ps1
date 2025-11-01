# N8N Workflow Deployment Script
# PowerShell version for Windows

$N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzYjhmYjhkMC0zYjkzLTQyNGYtODE5Ny1iNGU5ZTRhOGY0ZWQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxOTM4MTU4fQ.muGUhlCS_tS5HPMT6ETtIsgGJxP5Ty9R2YzkKQMaGG4"
$N8N_BASE_URL = "https://varungor365.app.n8n.cloud/api/v1"

Write-Host "🚀 Starting n8n Workflow Deployment" -ForegroundColor Cyan
Write-Host ("=" * 60)

# Headers for API requests
$headers = @{
    "X-N8N-API-KEY" = $N8N_API_KEY
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Get existing workflows
Write-Host "`n📋 Fetching existing workflows..." -ForegroundColor Yellow
try {
    $existingWorkflows = Invoke-RestMethod -Uri "$N8N_BASE_URL/workflows" -Method Get -Headers $headers
    Write-Host "✅ Found $($existingWorkflows.data.Count) existing workflows" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to fetch workflows: $_" -ForegroundColor Red
    exit 1
}

# Workflow files to deploy
$workflowFiles = @(
    "01-order-confirmation-automation.json",
    "02-abandoned-cart-recovery.json",
    "03-shopify-order-processing.json"
)

$deployedCount = 0
$deployedWorkflows = @()

# Deploy each workflow
foreach ($filename in $workflowFiles) {
    $filePath = Join-Path $PSScriptRoot "..\n8n-workflows\$filename"
    
    if (-not (Test-Path $filePath)) {
        Write-Host "⚠️  Skipping $filename - file not found" -ForegroundColor Yellow
        continue
    }

    try {
        Write-Host "`n📦 Processing: $filename" -ForegroundColor Cyan
        
        # Read workflow file
        $workflowData = Get-Content $filePath -Raw | ConvertFrom-Json
        $workflowName = $workflowData.name
        
        # Check if workflow exists
        $existing = $existingWorkflows.data | Where-Object { $_.name -eq $workflowName }
        
        if ($existing) {
            Write-Host "🔄 Updating existing workflow: $workflowName" -ForegroundColor Yellow
            
            # Prepare update data
            $updateData = @{
                name = $workflowData.name
                nodes = $workflowData.nodes
                connections = $workflowData.connections
                active = $false
                settings = if ($workflowData.settings) { $workflowData.settings } else { @{} }
            } | ConvertTo-Json -Depth 10
            
            # Update workflow
            $response = Invoke-RestMethod -Uri "$N8N_BASE_URL/workflows/$($existing.id)" -Method Patch -Headers $headers -Body $updateData
            Write-Host "✅ Updated: $workflowName (ID: $($existing.id))" -ForegroundColor Green
            
            $deployedWorkflows += @{
                name = $workflowName
                id = $existing.id
                filename = $filename
            }
            $deployedCount++
            
        } else {
            Write-Host "➕ Creating new workflow: $workflowName" -ForegroundColor Yellow
            
            # Prepare create data
            $createData = @{
                name = $workflowData.name
                nodes = $workflowData.nodes
                connections = $workflowData.connections
                active = $false
                settings = if ($workflowData.settings) { $workflowData.settings } else { @{} }
            } | ConvertTo-Json -Depth 10
            
            # Create workflow
            $response = Invoke-RestMethod -Uri "$N8N_BASE_URL/workflows" -Method Post -Headers $headers -Body $createData
            Write-Host "✅ Created: $workflowName (ID: $($response.id))" -ForegroundColor Green
            
            $deployedWorkflows += @{
                name = $workflowName
                id = $response.id
                filename = $filename
            }
            $deployedCount++
        }
        
        # Small delay between requests
        Start-Sleep -Milliseconds 1000
        
    } catch {
        Write-Host "❌ Error deploying $filename : $_" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n$("=" * 60)" -ForegroundColor Cyan
Write-Host "📊 Deployment Summary" -ForegroundColor Cyan
Write-Host "`n✅ Successfully deployed: $deployedCount/$($workflowFiles.Count) workflows" -ForegroundColor Green

if ($deployedWorkflows.Count -gt 0) {
    Write-Host "`n📋 Deployed Workflows:" -ForegroundColor Cyan
    $i = 1
    foreach ($workflow in $deployedWorkflows) {
        Write-Host "   $i. $($workflow.name) (ID: $($workflow.id))" -ForegroundColor White
        $i++
    }
    
    Write-Host "`n⚠️  IMPORTANT: Workflows are deployed but NOT activated yet." -ForegroundColor Yellow
    Write-Host "   Configure credentials first, then activate manually in n8n UI.`n" -ForegroundColor Yellow
    
    Write-Host "📝 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Go to https://varungor365.app.n8n.cloud" -ForegroundColor White
    Write-Host "   2. Configure credentials for:" -ForegroundColor White
    Write-Host "      - Shopify API" -ForegroundColor Gray
    Write-Host "      - Supabase (HTTP Request with API key)" -ForegroundColor Gray
    Write-Host "      - Twilio (WhatsApp)" -ForegroundColor Gray
    Write-Host "      - SendGrid/Gmail (Email)" -ForegroundColor Gray
    Write-Host "      - Telegram Bot" -ForegroundColor Gray
    Write-Host "      - OpenAI (for AI features)" -ForegroundColor Gray
    Write-Host "   3. Update environment variables in each workflow" -ForegroundColor White
    Write-Host "   4. Test each workflow with sample data" -ForegroundColor White
    Write-Host "   5. Activate workflows one by one" -ForegroundColor White
    
    Write-Host "`n🔗 Direct Links:" -ForegroundColor Cyan
    foreach ($workflow in $deployedWorkflows) {
        Write-Host "   • $($workflow.name):" -ForegroundColor White
        Write-Host "     https://varungor365.app.n8n.cloud/workflow/$($workflow.id)" -ForegroundColor Gray
    }
}

Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Cyan
