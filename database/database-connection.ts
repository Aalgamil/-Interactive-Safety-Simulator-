// Database Connection Utility for Interactive Safety Simulator
// This file provides connection management and utility functions

import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';

// Logging configuration
const isProduction = process.env.NODE_ENV === 'production';
const enableLogging = process.env.DB_ENABLE_LOGGING !== 'false';

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
let pool: Pool;

export class DatabaseConnection {
    private static instance: DatabaseConnection;

    private constructor() {
        this.initializePool();
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    private initializePool() {
        pool = mysql.createPool(dbConfig);
    }

    public async getConnection(): Promise<PoolConnection> {
        try {
            return await pool.getConnection();
        } catch (error) {
            if (!isProduction && enableLogging) {
                console.error('Failed to get database connection:', error);
            }
            throw new Error('Database connection failed');
        }
    }

    public async executeQuery(query: string, params: any[] = []): Promise<any> {
        const connection = await this.getConnection();
        try {
            const [rows, fields] = await connection.execute(query, params);
            return rows;
        } catch (error) {
            if (!isProduction && enableLogging) {
                console.error('Query execution failed:', error);
            }
            throw error;
        } finally {
            connection.release();
        }
    }

    public async executeTransaction(queries: Array<{ query: string, params: any[] }>): Promise<any> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();

            const results = [];
            for (const { query, params } of queries) {
                const [rows, fields] = await connection.execute(query, params);
                results.push(rows);
            }

            await connection.commit();
            return results;
        } catch (error) {
            await connection.rollback();
            if (!isProduction && enableLogging) {
                console.error('Transaction failed:', error);
            }
            throw error;
        } finally {
            connection.release();
        }
    }

    public async closePool(): Promise<void> {
        if (pool) {
            await pool.end();
        }
    }
}

// User Operations
export class UserOperations {
    static async createUser(userData: {
        username: string;
        email: string;
        password: string;
        fullName: string;
    }): Promise<{ userId: number }> {
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

        const results = await DatabaseConnection.getInstance().executeTransaction(queries);
        const insertResult = results[0] as any;
        return { userId: insertResult.insertId };
    }

    static async authenticateUser(username: string, password: string): Promise<any> {
        const db = DatabaseConnection.getInstance();

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

    static async getUserWithScore(userId: number): Promise<any> {
        return await DatabaseConnection.getInstance().executeQuery(`
            SELECT u.*, s.* 
            FROM Users u 
            LEFT JOIN User_Score_Summary s ON u.user_id = s.user_id 
            WHERE u.user_id = ?
        `, [userId]);
    }

    static async getUserByUsername(username: string): Promise<any> {
        const result = await DatabaseConnection.getInstance().executeQuery(
            'SELECT * FROM Users WHERE username = ?',
            [username]
        );
        return result.length > 0 ? result[0] : null;
    }
}

// Scenario Operations
export class ScenarioOperations {
    static async getRandomScenario(moduleType: 'accident' | 'emergency' | 'cybercrime'): Promise<any> {
        const db = DatabaseConnection.getInstance();

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
        }

        const result = await db.executeQuery(query);
        return result.length > 0 ? result[0] : null;
    }

    static async getScenarioById(moduleType: 'accident' | 'emergency' | 'cybercrime', scenarioId: number): Promise<any> {
        const db = DatabaseConnection.getInstance();

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
        }

        const result = await db.executeQuery(query, [scenarioId]);
        return result.length > 0 ? result[0] : null;
    }

    static async getScenariosByDifficulty(moduleType: 'accident' | 'emergency' | 'cybercrime', difficulty?: string): Promise<any[]> {
        const db = DatabaseConnection.getInstance();

        let query = '';
        let params: any[] = [];

        switch (moduleType) {
            case 'accident':
                query = 'SELECT * FROM Accident_Scenarios WHERE is_active = TRUE';
                if (difficulty) {
                    query += ' AND difficulty_level = ?';
                    params.push(difficulty);
                }
                break;
        }

        return await db.executeQuery(query, params);
    }
}

// Session Operations
export class SessionOperations {
    static async startSession(userId: number, moduleType: 'accident' | 'emergency' | 'cybercrime', scenarioId?: number): Promise<{ sessionId: number }> {
        const result = await DatabaseConnection.getInstance().executeQuery(`
            INSERT INTO User_Sessions (user_id, module_type, scenario_id) 
            VALUES (?, ?, ?)
        `, [userId, moduleType, scenarioId]);

        const insertResult = result as any;
        return { sessionId: insertResult.insertId };
    }

    static async recordResponse(sessionId: number, scenarioId: number, moduleType: string, userAnswer: string, isCorrect: boolean, responseTime: number): Promise<void> {
        await DatabaseConnection.getInstance().executeQuery(`
            INSERT INTO User_Responses (session_id, scenario_id, module_type, user_answer, is_correct, response_time) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [sessionId, scenarioId, moduleType, userAnswer, isCorrect, responseTime]);
    }

    static async completeSession(sessionId: number, score: number, correctAnswers: number, totalQuestions: number): Promise<void> {
        await DatabaseConnection.getInstance().executeQuery(`
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

    static async getUserSessions(userId: number, limit: number = 10): Promise<any[]> {
        return await DatabaseConnection.getInstance().executeQuery(`
            SELECT us.*, 
                   CASE 
                       WHEN us.module_type = 'accident' THEN as_title.title
                       WHEN us.module_type = 'emergency' THEN es_title.title
                       WHEN us.module_type = 'cybercrime' THEN cm_title.title
                   END as scenario_title
            FROM User_Sessions us
            LEFT JOIN Accident_Scenarios as_title ON us.scenario_id = as_title.scenario_id
            LEFT JOIN Emergency_Scenarios es_title ON us.scenario_id = es_title.scenario_id
            LEFT JOIN Cybercrime_Messages cm_title ON us.scenario_id = cm_title.scenario_id
            WHERE us.user_id = ?
            ORDER BY us.start_time DESC
            LIMIT ?
        `, [userId, limit]);
    }
}

// Score Operations
export class ScoreOperations {
    static async updateUserScore(userId: number, moduleType: 'accident' | 'emergency' | 'cybercrime', newScore: number): Promise<void> {
        const db = DatabaseConnection.getInstance();

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

    static async getLeaderboard(limit: number = 10): Promise<any[]> {
        return await DatabaseConnection.getInstance().executeQuery(`
            SELECT 
                u.username,
                u.full_name,
                us.overall_best_score,
                us.total_sessions,
                us.accident_best_score,
                us.emergency_best_score,
                us.cybercrime_best_score,
                us.last_activity
            FROM User_Score_Summary us
            JOIN Users u ON us.user_id = u.user_id
            WHERE u.is_active = TRUE
            ORDER BY us.overall_best_score DESC
            LIMIT ?
        `, [limit]);
    }

    static async getUserRanking(userId: number): Promise<number> {
        const result = await DatabaseConnection.getInstance().executeQuery(`
            SELECT COUNT(*) + 1 as user_rank
            FROM User_Score_Summary 
            WHERE overall_best_score > (
                SELECT overall_best_score 
                FROM User_Score_Summary 
                WHERE user_id = ?
            )
        `, [userId]);

        const rankingResult = result as any[];
        return rankingResult[0].user_rank;
    }
}

// Analytics Operations
export class AnalyticsOperations {
    static async getUserEngagementStats(days: number = 30): Promise<any> {
        return await DatabaseConnection.getInstance().executeQuery(`
            SELECT 
                DATE(last_activity) as date,
                COUNT(*) as active_users
            FROM User_Score_Summary 
            WHERE last_activity >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(last_activity)
            ORDER BY date DESC
        `, [days]);
    }

    static async getModulePopularity(): Promise<any[]> {
        return await DatabaseConnection.getInstance().executeQuery(`
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

    static async getScenarioAccuracy(): Promise<any[]> {
        return await DatabaseConnection.getInstance().executeQuery(`
            SELECT 
                s.title,
                s.difficulty_level,
                COUNT(ur.response_id) as total_attempts,
                AVG(CASE WHEN ur.is_correct = TRUE THEN 1 ELSE 0 END) * 100 as accuracy_rate,
                AVG(ur.response_time) as avg_response_time
            FROM Accident_Scenarios s
            LEFT JOIN User_Responses ur ON s.scenario_id = ur.scenario_id
            WHERE s.is_active = TRUE
            GROUP BY s.scenario_id, s.title, s.difficulty_level
            ORDER BY accuracy_rate ASC
        `);
    }
}

// Health Check
export async function checkDatabaseHealth(): Promise<{ status: string, timestamp: string }> {
    try {
        await DatabaseConnection.getInstance().executeQuery('SELECT 1');
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

// Export the main database instance
export default DatabaseConnection.getInstance();