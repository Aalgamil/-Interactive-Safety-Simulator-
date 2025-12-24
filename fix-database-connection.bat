@echo off
echo Fixing database connection file...
cd /d "c:\Users\bdalr\Downloads\Interactive Safety Simulator"

echo.
echo Backing up original file...
copy "database\database-connection.js" "database\database-connection-backup.js"

echo.
echo Replacing with fixed version...
copy "database\database-connection-fixed.js" "database\database-connection.js"

echo.
echo Deleting temporary file...
del "database\database-connection-fixed.js"

echo.
echo Database connection file has been fixed!
pause
