@echo off
echo Checking if MySQL server is running and if the database exists...
cd /d "c:\Users\bdalr\Downloads\Interactive Safety Simulator"

echo.
echo Testing MySQL connection...
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
      await connection.execute(\`CREATE DATABASE \\`${process.env.DB_NAME || 'safety_simulator'}\\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci\`);
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
    }
  }
}

checkMySQL();
"

echo.
echo If database was created or already exists, setting up tables...
node setup-database.js

echo.
echo Adding sample users...
node database/add-sample-users.js

pause
