@echo off
echo Fixing Interactive Safety Simulator Issues...
cd /d "c:\Users\bdalr\Downloads\Interactive Safety Simulator"

echo.
echo Step 1: Checking if MySQL server is running...
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkMySQL() {
  try {
    console.log('Connecting to MySQL server...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✓ MySQL server is running and accessible');

    // Check if database exists
    const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [process.env.DB_NAME || 'safety_simulator']);

    if (databases.length === 0) {
      console.log('Database does not exist. Creating it...');
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'safety_simulator'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log('✓ Database created successfully');
    } else {
      console.log('✓ Database already exists');
    }

    await connection.end();
    console.log('Database check completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('MySQL server is not running. Please start MySQL server first.');
      console.error('You can download MySQL from: https://dev.mysql.com/downloads/mysql/');
    }
    process.exit(1);
  }
}

checkMySQL();
"

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo MySQL connection failed. Please install and start MySQL server first.
  echo You can download MySQL from: https://dev.mysql.com/downloads/mysql/
  pause
  exit /b 1
)

echo.
echo Step 2: Setting up database tables...
node setup-database.js

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Database setup failed. Please check the error messages above.
  pause
  exit /b 1
)

echo.
echo Step 3: Adding sample users...
node database/add-sample-users.js

echo.
echo Step 4: Testing database connection with sample queries...
node test-db-connection.js

echo.
echo Database setup completed successfully!
echo.
echo To fix the JSON parsing errors, you need to start both the backend and frontend servers.
echo.
echo Option 1: Start both servers at once by running: start-app.bat
echo Option 2: Start them separately:
echo   - First run: start-backend.bat
echo   - Then run: start-app.bat
echo.
pause
