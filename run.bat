@echo off
echo Installing dependencies...
call npm install
echo.
echo Starting the application...
call npm run dev
pause
