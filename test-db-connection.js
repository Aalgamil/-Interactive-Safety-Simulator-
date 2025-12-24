const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');

    // Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'safety_simulator'
    });

    console.log('✓ Connected to database successfully');

    // Test a simple query
    const [rows] = await connection.execute('SELECT COUNT(*) as userCount FROM Users');
    console.log(`✓ Found ${rows[0].userCount} users in the database`);

    // Test the leaderboard query
    const [leaderboard] = await connection.execute(`
      SELECT
        u.username,
        u.full_name,
        us.overall_best_score,
        us.total_sessions,
        us.accident_best_score,
        us.emergency_best_score,
        us.cybercrime_best_score,
        us.last_activity
      FROM user_score_summary us
      JOIN users u ON us.user_id = u.user_id
      WHERE u.is_active = TRUE
      ORDER BY us.overall_best_score DESC
      LIMIT 5
    `);

    console.log('✓ Leaderboard query executed successfully');
    console.log('Sample leaderboard data:', leaderboard);

    await connection.end();
    console.log('Database connection test completed successfully!');

  } catch (error) {
    console.error('Database connection test failed:', error.message);
    console.error('Full error:', error);
  }
}

testDatabaseConnection();
