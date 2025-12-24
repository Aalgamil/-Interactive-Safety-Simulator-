# Interactive Safety Simulator Startup Script
# This script starts both the frontend and backend servers

Write-Host "Interactive Safety Simulator Startup Script" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Check if MySQL is running
try {
    $mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
    if ($mysqlService -and $mysqlService.Status -ne "Running") {
        Write-Host "Starting MySQL service..." -ForegroundColor Yellow
        Start-Service -Name $mysqlService.Name
        Write-Host "MySQL service started successfully." -ForegroundColor Green
    } elseif ($mysqlService) {
        Write-Host "MySQL service is already running." -ForegroundColor Green
    } else {
        Write-Host "Warning: Could not detect MySQL service. Please ensure MySQL is running." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Warning: Could not check MySQL service status. Please ensure MySQL is running." -ForegroundColor Yellow
}

# Change to the project directory
Set-Location "c:\Users\bdalr\Downloads\Interactive Safety Simulator"

# Check if node_modules exists, if not run npm install
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Kill any existing processes on ports 3000 and 3001 to avoid conflicts
Write-Host "Checking for existing processes on ports 3000 and 3001..." -ForegroundColor Yellow
try {
    $processes3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    $processes3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

    if ($processes3000) {
        Write-Host "Stopping processes on port 3000..." -ForegroundColor Yellow
        $processes3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    }

    if ($processes3001) {
        Write-Host "Stopping processes on port 3001..." -ForegroundColor Yellow
        $processes3001 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    }
} catch {
    Write-Host "Could not check for existing processes. Continuing anyway..." -ForegroundColor Yellow
}

# Start both servers
Write-Host "Starting both frontend and backend servers..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API will be available at: http://localhost:3001" -ForegroundColor Cyan

npm start

# Script will wait here until both servers are stopped
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
