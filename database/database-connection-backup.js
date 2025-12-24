// Database Connection Utility for Interactive Safety Simulator (JavaScript Version)
// This file provides connection management and utility functions

const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'safety_simulator',
    charset: 'utf8mb4',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Connection pool
let pool;

class DatabaseConnection {
    constructor() {
        this.initializePool();
    }

    initializePool() {
        pool = mysql.createPool(dbConfig);
        console.log('Database connection pool initialized');
    }

    async getConnection() {
        try {
            return await pool.getConnection();
        } catch (error) {
            console.error('Failed to get database connection:', error);
            throw new Error('Database connection failed');
        }
    }

    async executeQuery(query, params = []) {
        const connection = await this.getConnection();
        try {
            // Check if this is a query with LIMIT parameter
            if (query.includes('LIMIT ?') && params.length > 0) {
                // Replace the placeholder with the actual value
                query = query.replace('LIMIT ?', `LIMIT ${params[0]}`);
                // Use query instead of execute for this specific case
                const [rows] = await connection.query(query);
                return rows;
            } else {
                // Use execute for all other queries
                const [rows] = await connection.execute(query, params);
                return rows;
            }
        } catch (error) {
            console.error('Query execution failed:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async executeTransaction(queries) {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();

            const results = [];
            for (const { query, params } of queries) {
                const [rows] = await connection.execute(query, params);
                results.push(rows);
            }

            await connection.commit();
            return results;
        } catch (error) {
            await connection.rollback();
            console.error('Transaction failed:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async closePool() {
        if (pool) {
            await pool.end();
            console.log('Database connection pool closed');
        }
    }
}

// User Operations
class UserOperations {
    static async createUser(userData) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const queries = [
            {
                query: `INSERT INTO Users (username, email, password_hash, full_name) 
                        VALUES (?, ?, ?, ?)`,
                params: [userData.username, userData.email, hashedPassword, userData.fullName]
            },
            {
                query: `INSERT INTO User_Score_Summary (user_id) VALUES (LAST_INSERT_ID())`,
                params: []
            }
        ];

        const results = await new DatabaseConnection().executeTransaction(queries);
        return { userId: results[0].insertId };
    }

    static async authenticateUser(username, password) {
        const bcrypt = require('bcryptjs');
        const db = new DatabaseConnection();

        const user = await db.executeQuery(
            'SELECT * FROM Users WHERE username = ? AND is_active = TRUE',
            [username]
        );

        if (user.length === 0) {
            throw new Error('User not found or inactive');
        }

        const userRecord = user[0];
        const isValidPassword = await bcrypt.compare(password, userRecord.password_hash);

        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        // Update last login
        await db.executeQuery(
            'UPDATE Users SET last_login = NOW() WHERE user_id = ?',
            [userRecord.user_id]
        );

        // Remove password hash from returned data
        delete userRecord.password_hash;
        return userRecord;
    }

    static async getUserWithScore(userId) {
        return await new DatabaseConnection().executeQuery(`
            SELECT u.*, s.* 
            FROM Users u 
            LEFT JOIN User_Score_Summary s ON u.user_id = s.user_id 
            WHERE u.user_id = ?
        `, [userId]);
    }

    static async getUserByUsername(username) {
        const result = await new DatabaseConnection().executeQuery(
            'SELECT * FROM Users WHERE username = ?',
            [username]
        );
        return result.length > 0 ? result[0] : null;
    }
}

// Scenario Operations
class ScenarioOperations {
    static async getRandomScenario(moduleType) {
        const db = new DatabaseConnection();

        let query = '';
        switch (moduleType) {
            case 'accident':
                query = 'SELECT * FROM Accident_Scenarios WHERE is_active = TRUE ORDER BY RAND() LIMIT 1';
                break;
            case 'emergency':
                query = 'SELECT * FROM Emergency_Scenarios WHERE is_active = TRUE ORDER BY RAND() LIMIT 1';
                break;
            case 'cybercrime':
                query = 'SELECT * FROM Cybercrime_Messages WHERE is_active = TRUE ORDER BY RAND() LIMIT 1';
                break;
            default:
                throw new Error('Invalid module type');
        }

        const result = await db.executeQuery(query);
        return result.length > 0 ? result[0] : null;
    }

    static async getScenarioById(moduleType, scenarioId) {
        const db = new DatabaseConnection();

        let query = '';
        switch (moduleType) {
            case 'accident':
                query = 'SELECT * FROM Accident_Scenarios WHERE scenario_id = ? AND is_active = TRUE';
                break;
            case 'emergency':
                query = 'SELECT * FROM Emergency_Scenarios WHERE scenario_id = ? AND is_active = TRUE';
                break;
            case 'cybercrime':
                query = 'SELECT * FROM Cybercrime_Messages WHERE message_id = ? AND is_active = TRUE';
                break;
            default:
                throw new Error('Invalid module type');
        }

        const result = await db.executeQuery(query, [scenarioId]);
        return result.length > 0 ? result[0] : null;
    }
}

// Session Operations
class SessionOperations {
    static async startSession(userId, moduleType, scenarioId = null) {
        const result = await new DatabaseConnection().executeQuery(`
            INSERT INTO User_Sessions (user_id, module_type, scenario_id) 
            VALUES (?, ?, ?)
        `, [userId, moduleType, scenarioId]);

        return { sessionId: result.insertId };
    }

    static async recordResponse(sessionId, scenarioId, moduleType, userAnswer, isCorrect, responseTime) {
        await new DatabaseConnection().executeQuery(`
            INSERT INTO User_Responses (session_id, scenario_id, module_type, user_answer, is_correct, response_time) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [sessionId, scenarioId, moduleType, userAnswer, isCorrect, responseTime]);
    }

    static async completeSession(sessionId, score, correctAnswers, totalQuestions) {
        await new DatabaseConnection().executeQuery(`
            UPDATE User_Sessions 
            SET 
                end_time = NOW(),
                score = ?,
                correct_answers = ?,
                total_questions = ?,
                time_taken = TIMESTAMPDIFF(SECOND, start_time, NOW()),
                completed = TRUE
            WHERE session_id = ?
        `, [score, correctAnswers, totalQuestions, sessionId]);
    }
}

// Score Operations
class ScoreOperations {
    static async updateUserScore(userId, moduleType, newScore) {
        const db = new DatabaseConnection();

        // Update specific module scores
        const updateQuery = `
            UPDATE User_Score_Summary 
            SET 
                ${moduleType}_best_score = CASE 
                    WHEN ? > ${moduleType}_best_score THEN ? 
                    ELSE ${moduleType}_best_score 
                END,
                ${moduleType}_total_attempts = ${moduleType}_total_attempts + 1,
                ${moduleType}_average_score = (
                    (${moduleType}_average_score * ${moduleType}_total_attempts) + ? 
                ) / (${moduleType}_total_attempts + 1),
                total_sessions = total_sessions + 1,
                last_activity = NOW()
            WHERE user_id = ?
        `;

        await db.executeQuery(updateQuery, [newScore, newScore, newScore, userId]);

        // Update overall best score
        await db.executeQuery(`
            UPDATE User_Score_Summary 
            SET overall_best_score = GREATEST(
                accident_best_score, 
                emergency_best_score, 
                cybercrime_best_score
            ),
            last_activity = NOW()
            WHERE user_id = ?
        `, [userId]);
    }

    static async getLeaderboard(limit = 10) {
        return await new DatabaseConnection().executeQuery(`
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
            LIMIT ?
        `, [limit]);
    }
}

// Analytics Operations
class AnalyticsOperations {
    static async getUserEngagementStats(days = 30) {
        return await new DatabaseConnection().executeQuery(`
            SELECT 
                DATE(last_activity) as date,
                COUNT(*) as active_users
            FROM User_Score_Summary 
            WHERE last_activity >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(last_activity)
            ORDER BY date DESC
        `, [days]);
    }

    static async getModulePopularity() {
        return await new DatabaseConnection().executeQuery(`
            SELECT 
                module_type,
                COUNT(*) as session_count,
                AVG(score) as avg_score,
                AVG(time_taken) as avg_time
            FROM User_Sessions 
            WHERE completed = TRUE
            GROUP BY module_type
            ORDER BY session_count DESC
        `);
    }
}

// Health Check
async function checkDatabaseHealth() {
    try {
        await new DatabaseConnection().executeQuery('SELECT 1');
        return {
            status: 'healthy',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            timestamp: new Date().toISOString()
        };
    }
}

// Export all classes and functions
module.exports = {
    DatabaseConnection,
    UserOperations,
    ScenarioOperations,
    SessionOperations,
    ScoreOperations,
    AnalyticsOperations,
    checkDatabaseHealth,
    dbConfig
};

// Example usage
if (require.main === module) {
    (async () => {
        try {
            console.log('Testing database connection...');

            const health = await checkDatabaseHealth();
            console.log('Database health:', health);

            console.log('Testing scenario operations...');
            const randomScenario = await ScenarioOperations.getRandomScenario('accident');
            console.log('Random scenario:', randomScenario);

            console.log('Testing user operations...');
            const leaderboard = await ScoreOperations.getLeaderboard(5);
            console.log('Leaderboard:', leaderboard);

            console.log('Database utilities test completed successfully!');

        } catch (error) {
            console.error('Database utilities test failed:', error);
        } finally {
            process.exit(0);
        }
    })();
}