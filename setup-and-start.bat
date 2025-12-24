@echo off
echo Interactive Safety Simulator Setup and Start
echo ===========================================

echo.
echo Step 1: Checking database connection...
node check-db.js

echo.
echo Step 2: Setting up database tables (if needed)...
node setup-database.js

echo.
echo Step 3: Starting backend and frontend services...
node start-services.js

echo.
echo All services started. Press Ctrl+C to stop.
pause
