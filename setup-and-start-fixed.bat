@echo off
echo Setting up database and starting Interactive Safety Simulator...
cd /d "c:\Users\bdalr\Downloads\Interactive Safety Simulator"

echo.
echo Installing dependencies...
npm install

echo.
echo Setting up database...
node setup-database.js

echo.
echo Adding sample users...
node database/add-sample-users.js

echo.
echo Starting backend server...
start cmd /k "node server.js"

echo.
echo Starting frontend server...
start cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Database has been set up with sample users.
pause
