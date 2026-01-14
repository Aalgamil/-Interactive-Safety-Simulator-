const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  try {
    // Connect to MySQL server
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4'
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'safety_simulator'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

    // Connect to the database
    await connection.changeUser({ database: process.env.DB_NAME || 'safety_simulator' });

    // Read and execute the SQL file
    const sqlFile = path.join(__dirname, 'database', 'create_tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split SQL file into individual statements
    const statements = sql.split(';').filter(statement => statement.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }

    await connection.end();

  } catch (error) {
  }
}

setupDatabase();
