const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  try {
    // First try to connect to MySQL server
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4'
    });

    // Check if database exists
    const dbName = process.env.DB_NAME || 'safety_simulator';
    const [databases] = await connection.query(`SHOW DATABASES LIKE '${dbName}'`);

    if (databases.length === 0) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    }

    // Connect to the specific database
    await connection.changeUser({ database: dbName });

    // Check if tables exist
    const [tables] = await connection.execute('SHOW TABLES');

    await connection.end();

  } catch (error) {
    // Handle error silently or log to file if needed
  }
}

checkDatabase();
