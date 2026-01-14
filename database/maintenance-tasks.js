// Database Maintenance Tasks for Interactive Safety Simulator
// This script handles routine database maintenance operations

const mysql = require('mysql2/promise');
const moment = require('moment');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'safety_simulator'
};

class DatabaseMaintenance {
    constructor() {
        this.pool = mysql.createPool(dbConfig);
    }

    async executeQuery(query, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.execute(query, params);
            return rows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async executeTransaction(queries) {
        const connection = await this.pool.getConnection();
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
            throw error;
        } finally {
            connection.release();
        }
    }

    // Archive old sessions (older than 6 months)
    async archiveOldSessions() {
        try {
            // Create archive table if it doesn't exist
            await this.executeQuery(`
                CREATE TABLE IF NOT EXISTS Archived_Sessions (
                    archive_id INT AUTO_INCREMENT PRIMARY KEY,
                    session_id INT,
                    user_id INT,
                    module_type ENUM('accident', 'emergency', 'cybercrime'),
                    scenario_id INT,
                    start_time TIMESTAMP,
                    end_time TIMESTAMP,
                    score INT,
                    correct_answers INT,
                    total_questions INT,
                    time_taken INT,
                    completed BOOLEAN,
                    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Move old sessions to archive
            const archivedCount = await this.executeQuery(`
                INSERT INTO Archived_Sessions 
                SELECT 
                    NULL as archive_id,
                    session_id, user_id, module_type, scenario_id, 
                    start_time, end_time, score, correct_answers, 
                    total_questions, time_taken, completed,
                    NOW() as archived_at
                FROM User_Sessions 
                WHERE completed = TRUE 
                AND end_time < DATE_SUB(NOW(), INTERVAL 6 MONTH)
            `);

            // Delete archived sessions from main table
            const deletedCount = await this.executeQuery(`
                DELETE FROM User_Sessions 
                WHERE completed = TRUE 
                AND end_time < DATE_SUB(NOW(), INTERVAL 6 MONTH)
            `);

            return archivedCount.length;

        } catch (error) {
            throw error;
        }
    }

    // Remove orphaned responses
    async cleanupOrphanedResponses() {
        try {
            const deletedCount = await this.executeQuery(`
                DELETE ur FROM User_Responses ur
                LEFT JOIN User_Sessions us ON ur.session_id = us.session_id
                WHERE us.session_id IS NULL
            `);

            return deletedCount.affectedRows;

        } catch (error) {
            throw error;
        }
    }

    // Update table statistics
    async analyzeTableStatistics() {
        const tables = [
            'Users', 'Accident_Scenarios', 'Emergency_Scenarios',
            'Cybercrime_Messages', 'User_Sessions', 'User_Responses',
            'User_Score_Summary'
        ];

        for (const table of tables) {
            try {
                await this.executeQuery(`ANALYZE TABLE ${table}`);
            } catch (error) {
            }
        }
    }

    // Optimize tables
    async optimizeTables() {
        const tables = [
            'Users', 'Accident_Scenarios', 'Emergency_Scenarios',
            'Cybercrime_Messages', 'User_Sessions', 'User_Responses',
            'User_Score_Summary'
        ];

        for (const table of tables) {
            try {
                await this.executeQuery(`OPTIMIZE TABLE ${table}`);
            } catch (error) {
            }
        }
    }

    // Check table integrity
    async checkTableIntegrity() {
        const tables = [
            'Users', 'Accident_Scenarios', 'Emergency_Scenarios',
            'Cybercrime_Messages', 'User_Sessions', 'User_Responses',
            'User_Score_Summary'
        ];

        const results = {};

        for (const table of tables) {
            try {
                const result = await this.executeQuery(`CHECK TABLE ${table}`);
                results[table] = result[0];
            } catch (error) {
                results[table] = { Msg_text: 'Error checking table' };
            }
        }

        return results;
    }

    // Clean up inactive users
    async cleanupInactiveUsers() {
        try {
            // Deactivate users who haven't logged in for 2 years and never completed any session
            const deactivatedCount = await this.executeQuery(`
                UPDATE Users 
                SET is_active = FALSE 
                WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR) 
                AND last_login IS NULL
                AND user_id NOT IN (
                    SELECT DISTINCT user_id 
                    FROM User_Sessions 
                    WHERE completed = TRUE
                )
            `);

            return deactivatedCount.affectedRows;

        } catch (error) {
            throw error;
        }
    }

    // Generate maintenance report
    async generateMaintenanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            tables: {},
            statistics: {}
        };

        // Get table sizes
        try {
            const tableSizes = await this.executeQuery(`
                SELECT 
                    table_name,
                    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'size_mb',
                    table_rows
                FROM information_schema.TABLES 
                WHERE table_schema = ?
                ORDER BY (data_length + index_length) DESC
            `, [dbConfig.database]);

            report.tables = tableSizes.reduce((acc, table) => {
                acc[table.table_name] = {
                    size_mb: table.size_mb,
                    rows: table.table_rows
                };
                return acc;
            }, {});

        } catch (error) {
        }

        // Get statistics
        try {
            const stats = await this.executeQuery(`
                SELECT 
                    (SELECT COUNT(*) FROM Users WHERE is_active = TRUE) as active_users,
                    (SELECT COUNT(*) FROM User_Sessions WHERE completed = TRUE) as completed_sessions,
                    (SELECT COUNT(*) FROM User_Sessions WHERE completed = FALSE) as active_sessions,
                    (SELECT COUNT(*) FROM Accident_Scenarios WHERE is_active = TRUE) as active_accident_scenarios,
                    (SELECT COUNT(*) FROM Emergency_Scenarios WHERE is_active = TRUE) as active_emergency_scenarios,
                    (SELECT COUNT(*) FROM Cybercrime_Messages WHERE is_active = TRUE) as active_cybercrime_scenarios
            `);

            report.statistics = stats[0];

        } catch (error) {
        }

        return report;
    }

    // Complete maintenance cycle
    async runMaintenanceCycle() {
        try {
            // Step 1: Generate report before maintenance
            const initialReport = await this.generateMaintenanceReport();

            // Step 2: Archive old sessions
            const archivedCount = await this.archiveOldSessions();

            // Step 3: Clean up orphaned responses
            const cleanedResponses = await this.cleanupOrphanedResponses();

            // Step 4: Clean up inactive users
            const deactivatedUsers = await this.cleanupInactiveUsers();

            // Step 5: Analyze table statistics
            await this.analyzeTableStatistics();

            // Step 6: Optimize tables
            await this.optimizeTables();

            // Step 7: Check table integrity
            const integrityResults = await this.checkTableIntegrity();

            // Step 8: Generate final report
            const finalReport = await this.generateMaintenanceReport();

            return {
                success: true,
                archivedCount,
                cleanedResponses,
                deactivatedUsers,
                integrityResults,
                initialReport,
                finalReport
            };

        } catch (error) {
            throw error;
        }
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
        }
    }
}

// CLI Interface
if (require.main === module) {
    const maintenance = new DatabaseMaintenance();

    const command = process.argv[2] || 'full';

    (async () => {
        try {
            switch (command) {
                case 'archive':
                    await maintenance.archiveOldSessions();
                    break;

                case 'cleanup':
                    await maintenance.cleanupOrphanedResponses();
                    break;

                case 'users':
                    await maintenance.cleanupInactiveUsers();
                    break;

                case 'analyze':
                    await maintenance.analyzeTableStatistics();
                    break;

                case 'optimize':
                    await maintenance.optimizeTables();
                    break;

                case 'check':
                    await maintenance.checkTableIntegrity();
                    break;

                case 'report':
                    await maintenance.generateMaintenanceReport();
                    break;

                case 'full':
                default:
                    await maintenance.runMaintenanceCycle();
                    break;
            }

        } catch (error) {
            process.exit(1);
        } finally {
            await maintenance.close();
            process.exit(0);
        }
    })();
}

module.exports = DatabaseMaintenance;