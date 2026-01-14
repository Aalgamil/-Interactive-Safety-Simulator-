@echo off
echo Starting Interactive Safety Simulator Backend Server...
cd /d "c:\Users\bdalr\Downloads\Interactive Safety Simulator"

echo.
echo Checking if all required packages are installed...
npm install

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Failed to install required packages. Please check the error messages above.
  pause
  exit /b 1
)

echo.
echo Starting backend server on port 3001...
node server.js

echo.
echo Backend server stopped.
pause
