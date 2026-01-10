# Start all services for LoanLife Edge (PowerShell)
# Run this script to start backend API, blockchain node, and blockchain API bridge

Write-Host "🚀 Starting LoanLife Edge Services..." -ForegroundColor Green

# Start blockchain node
Write-Host "📦 Starting blockchain node..." -ForegroundColor Yellow
$blockchainNode = Start-Process -FilePath "npx" -ArgumentList "hardhat", "node" -WorkingDirectory "services\blockchain" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 5

# Start blockchain API bridge
Write-Host "🌐 Starting blockchain API bridge..." -ForegroundColor Yellow
Set-Location services\blockchain\api
if (-not (Test-Path "node_modules")) {
    npm install
}
$blockchainAPI = Start-Process -FilePath "npm" -ArgumentList "start" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 3

# Start backend API
Write-Host "🔧 Starting backend API..." -ForegroundColor Yellow
Set-Location ..\..\api
$env:SEED_DATA = "true"
$env:BLOCKCHAIN_ENABLED = "true"
$env:BLOCKCHAIN_API_URL = "http://localhost:3001"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Cleanup
Stop-Process -Id $blockchainNode.Id -ErrorAction SilentlyContinue
Stop-Process -Id $blockchainAPI.Id -ErrorAction SilentlyContinue

