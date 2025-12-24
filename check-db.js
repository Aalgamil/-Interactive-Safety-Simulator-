const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  try {
    console.log('Checking database connection...');

    // First try to connect to MySQL server
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✓ Connected to MySQL server');

    // Check if database exists
    const dbName = process.env.DB_NAME || 'safety_simulator';
    const [databases] = await connection.query(`SHOW DATABASES LIKE '${dbName}'`);

    if (databases.length === 0) {
      console.log('✗ Database does not exist. Creating it...');
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log('✓ Database created');
    } else {
      console.log('✓ Database exists');
    }

    // Connect to the specific database
    await connection.changeUser({ database: dbName });

    // Check if tables exist
    const [tables] = await connection.execute('SHOW TABLES');

    if (tables.length === 0) {
      console.log('✗ No tables found. You need to run the create_tables.sql script');
      console.log('Run: mysql -u root < database/create_tables.sql');
    } else {
      console.log('✓ Tables found:', tables.map(t => Object.values(t)[0]).join(', '));
    }

    await connection.end();
    console.log('Database check completed');

  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Please ensure MySQL is running and accessible with the credentials in .env');
  }
}

checkDatabase();
