# Start all services for development (PowerShell)
# Opens each service in a new window

Write-Host "🚀 Starting LoanLife Edge Development Services..." -ForegroundColor Green
Write-Host ""
Write-Host "This will open 4 terminal windows:" -ForegroundColor Yellow
Write-Host "  1. Blockchain Node (Hardhat)" -ForegroundColor Cyan
Write-Host "  2. Blockchain API Bridge" -ForegroundColor Cyan
Write-Host "  3. Backend API (FastAPI)" -ForegroundColor Cyan
Write-Host "  4. Frontend (Next.js)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop that service" -ForegroundColor Yellow
Write-Host ""

# Start blockchain node
Write-Host "📦 Starting blockchain node in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\..\services\blockchain'; Write-Host '🔗 Blockchain Node Running...' -ForegroundColor Green; npx hardhat node"

Start-Sleep -Seconds 3

# Start blockchain API bridge
Write-Host "🌐 Starting blockchain API bridge in new window..." -ForegroundColor Yellow
$blockchainAPIPath = Join-Path $PSScriptRoot "..\services\blockchain\api"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$blockchainAPIPath'; Write-Host '🌐 Blockchain API Bridge Running...' -ForegroundColor Green; npm start"

Start-Sleep -Seconds 3

# Start backend API
Write-Host "🔧 Starting backend API in new window..." -ForegroundColor Yellow
$apiPath = Join-Path $PSScriptRoot "..\services\api"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$apiPath'; `$env:SEED_DATA='true'; `$env:BLOCKCHAIN_ENABLED='true'; `$env:BLOCKCHAIN_API_URL='http://localhost:3001'; .\venv\Scripts\Activate.ps1; Write-Host '🔧 Backend API Running...' -ForegroundColor Green; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

Start-Sleep -Seconds 2

# Start frontend
Write-Host "⚛️  Starting frontend in new window..." -ForegroundColor Yellow
$rootPath = Split-Path -Parent $PSScriptRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath'; Write-Host '⚛️  Frontend Running...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Services should be available at:" -ForegroundColor Cyan
Write-Host "  • Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  • Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "  • API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "  • Blockchain API: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to close this window (services will keep running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
