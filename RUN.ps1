# RUN.ps1 - Quick Run Script
# This script starts both backend and frontend

Write-Host "🚀 Starting AI Article Generator..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "❌ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Run SETUP.ps1 first and add your OpenAI API key" -ForegroundColor Yellow
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "❌ ERROR: Dependencies not installed!" -ForegroundColor Red
    Write-Host "Run SETUP.ps1 first to install dependencies" -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting backend server..." -ForegroundColor Yellow
Write-Host "Backend will run on http://localhost:3000" -ForegroundColor Gray
Write-Host ""

# Start backend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"

# Wait a moment for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Open frontend in default browser
Write-Host "Opening frontend in browser..." -ForegroundColor Yellow
Start-Process "$PSScriptRoot\frontend\index.html"

Write-Host ""
Write-Host "✅ Application started!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: Opened in your default browser" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in the backend terminal to stop the server" -ForegroundColor Gray
