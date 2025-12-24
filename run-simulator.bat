@echo off
echo Interactive Safety Simulator Launcher
echo =====================================
echo.
echo This launcher will start both the frontend and backend servers.
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0start-app.ps1"
pause
