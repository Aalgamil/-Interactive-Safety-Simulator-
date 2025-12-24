// Database Connection Test Script
// This script tests the database connection and demonstrates basic operations

const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'safety_simulator',
    charset: 'utf8mb4'
};

class DatabaseTester {
    constructor() {
        this.pool = null;
        this.testResults = [];
    }

    async initialize() {
        try {
            this.pool = mysql.createPool(dbConfig);
            console.log('✅ Database connection pool initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize connection pool:', error.message);
            return false;
        }
    }

    async testConnection() {
        console.log('\n🔌 Testing Database Connection...');
        try {
            const connection = await this.pool.getConnection();
            const [rows] = await connection.execute('SELECT NOW() as `current_time`, DATABASE() as `current_db`');
            connection.release();

            console.log('✅ Connection successful');
            console.log(`   Current database: ${rows[0].current_db}`);
            console.log(`   Server time: ${rows[0].current_time}`);
            this.testResults.push({ test: 'Connection', status: 'PASS' });
            return true;
        } catch (error) {
            console.error('❌ Connection failed:', error.message);
            this.testResults.push({ test: 'Connection', status: 'FAIL', error: error.message });
            return false;
        }
    }

    async testTableExistence() {
        console.log('\n📋 Checking Table Existence...');
        try {
            const [rows] = await this.pool.execute(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = ?
                ORDER BY TABLE_NAME
            `, [dbConfig.database]);

            const expectedTables = [
                'users', 'accident_scenarios', 'emergency_scenarios',
                'cybercrime_messages', 'user_sessions', 'user_responses',
                'user_score_summary'
            ];

            const existingTables = rows.map(row => row.TABLE_NAME);
            const missingTables = expectedTables.filter(table => !existingTables.includes(table));

            if (missingTables.length === 0) {
                console.log('✅ All expected tables exist');
                existingTables.forEach(table => console.log(`   📄 ${table}`));
                this.testResults.push({ test: 'Table Existence', status: 'PASS' });
                return true;
            } else {
                console.log('❌ Missing tables:', missingTables.join(', '));
                this.testResults.push({ test: 'Table Existence', status: 'FAIL', error: `Missing tables: ${missingTables.join(', ')}` });
                return false;
            }
        } catch (error) {
            console.error('❌ Table existence check failed:', error.message);
            this.testResults.push({ test: 'Table Existence', status: 'FAIL', error: error.message });
            return false;
        }
    }

    async testSampleData() {
        console.log('\n📊 Checking Sample Data...');
        try {
            const checks = [
                { table: 'accident_scenarios', query: 'SELECT COUNT(*) as count FROM accident_scenarios WHERE is_active = TRUE' },
                { table: 'emergency_scenarios', query: 'SELECT COUNT(*) as count FROM emergency_scenarios WHERE is_active = TRUE' },
                { table: 'cybercrime_messages', query: 'SELECT COUNT(*) as count FROM cybercrime_messages WHERE is_active = TRUE' },
                { table: 'users', query: 'SELECT COUNT(*) as count FROM users WHERE is_active = TRUE' }
            ];

            let allPassed = true;
            for (const check of checks) {
                const [rows] = await this.pool.execute(check.query);
                const count = rows[0].count;

                if (count > 0) {
                    console.log(`   ✅ ${check.table}: ${count} records`);
                } else {
                    console.log(`   ⚠️  ${check.table}: No data found`);
                    allPassed = false;
                }
            }

            if (allPassed) {
                this.testResults.push({ test: 'Sample Data', status: 'PASS' });
            } else {
                this.testResults.push({ test: 'Sample Data', status: 'WARNING', error: 'Some tables have no data' });
            }

            return allPassed;
        } catch (error) {
            console.error('❌ Sample data check failed:', error.message);
            this.testResults.push({ test: 'Sample Data', status: 'FAIL', error: error.message });
            return false;
        }
    }

    async testForeignKeys() {
        console.log('\n🔗 Testing Foreign Key Constraints...');
        try {
            const [rows] = await this.pool.execute(`
                SELECT 
                    TABLE_NAME,
                    COLUMN_NAME,
                    CONSTRAINT_NAME,
                    REFERENCED_TABLE_NAME,
                    REFERENCED_COLUMN_NAME
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = ? 
                AND REFERENCED_TABLE_NAME IS NOT NULL
                ORDER BY TABLE_NAME, COLUMN_NAME
            `, [dbConfig.database]);

            if (rows.length > 0) {
                console.log('✅ Foreign key constraints found:');
                rows.forEach(row => {
                    console.log(`   🔗 ${row.TABLE_NAME}.${row.COLUMN_NAME} → ${row.REFERENCED_TABLE_NAME}.${row.REFERENCED_COLUMN_NAME}`);
                });
                this.testResults.push({ test: 'Foreign Keys', status: 'PASS' });
            } else {
                console.log('⚠️  No foreign key constraints found');
                this.testResults.push({ test: 'Foreign Keys', status: 'WARNING', error: 'No foreign key constraints' });
            }

            return true;
        } catch (error) {
            console.error('❌ Foreign key test failed:', error.message);
            this.testResults.push({ test: 'Foreign Keys', status: 'FAIL', error: error.message });
            return false;
        }
    }

    async testIndexes() {
        console.log('\n📇 Checking Database Indexes...');
        try {
            const [rows] = await this.pool.execute(`
                SELECT 
                    TABLE_NAME,
                    INDEX_NAME,
                    COLUMN_NAME,
                    NON_UNIQUE
                FROM INFORMATION_SCHEMA.STATISTICS 
                WHERE TABLE_SCHEMA = ?
                AND INDEX_NAME != 'PRIMARY'
                ORDER BY TABLE_NAME, INDEX_NAME
            `, [dbConfig.database]);

            const indexCount = rows.length;
            console.log(`✅ Found ${indexCount} indexes`);

            // Group by table
            const indexesByTable = {};
            rows.forEach(row => {
                if (!indexesByTable[row.TABLE_NAME]) {
                    indexesByTable[row.TABLE_NAME] = [];
                }
                indexesByTable[row.TABLE_NAME].push(row);
            });

            Object.keys(indexesByTable).forEach(table => {
                console.log(`   📄 ${table}: ${indexesByTable[table].length} indexes`);
            });

            this.testResults.push({ test: 'Indexes', status: 'PASS', details: `${indexCount} indexes found` });
            return true;
        } catch (error) {
            console.error('❌ Index check failed:', error.message);
            this.testResults.push({ test: 'Indexes', status: 'FAIL', error: error.message });
            return false;
        }
    }

    async testSampleQueries() {
        console.log('\n🔍 Testing Sample Queries...');
        const queries = [
            {
                name: 'Get Random Accident Scenario',
                query: 'SELECT * FROM Accident_Scenarios WHERE is_active = TRUE ORDER BY RAND() LIMIT 1'
            },
            {
                name: 'Get User Leaderboard',
                query: `
                    SELECT u.username, us.overall_best_score 
                    FROM Users u 
                    JOIN User_Score_Summary us ON u.user_id = us.user_id 
                    WHERE u.is_active = TRUE 
                    ORDER BY us.overall_best_score DESC 
                    LIMIT 5
                `
            },
            {
                name: 'Get Session Statistics',
                query: `
                    SELECT 
                        module_type,
                        COUNT(*) as total_sessions,
                        AVG(score) as avg_score
                    FROM User_Sessions 
                    WHERE completed = TRUE 
                    GROUP BY module_type
                `
            }
        ];

        let allPassed = true;
        for (const queryTest of queries) {
            try {
                const [rows] = await this.pool.execute(queryTest.query);
                console.log(`   ✅ ${queryTest.name}: ${rows.length} results`);
            } catch (error) {
                console.log(`   ❌ ${queryTest.name}: Failed - ${error.message}`);
                allPassed = false;
            }
        }

        if (allPassed) {
            this.testResults.push({ test: 'Sample Queries', status: 'PASS' });
        } else {
            this.testResults.push({ test: 'Sample Queries', status: 'FAIL', error: 'Some queries failed' });
        }

        return allPassed;
    }

    async testPerformance() {
        console.log('\n⚡ Testing Performance...');
        try {
            const startTime = Date.now();

            // Run a complex query
            const [rows] = await this.pool.execute(`
                SELECT 
                    u.username,
                    COUNT(us.session_id) as total_sessions,
                    AVG(us.score) as avg_score,
                    MAX(us.score) as best_score
                FROM Users u
                LEFT JOIN User_Sessions us ON u.user_id = us.user_id AND us.completed = TRUE
                WHERE u.is_active = TRUE
                GROUP BY u.user_id, u.username
                ORDER BY total_sessions DESC
                LIMIT 10
            `);

            const endTime = Date.now();
            const duration = endTime - startTime;

            console.log(`   ✅ Complex query completed in ${duration}ms`);
            console.log(`   📊 Processed ${rows.length} user records`);

            if (duration < 1000) {
                this.testResults.push({ test: 'Performance', status: 'PASS', details: `${duration}ms response time` });
            } else {
                this.testResults.push({ test: 'Performance', status: 'WARNING', details: `${duration}ms response time (slow)` });
            }

            return true;
        } catch (error) {
            console.error('❌ Performance test failed:', error.message);
            this.testResults.push({ test: 'Performance', status: 'FAIL', error: error.message });
            return false;
        }
    }

    async printTestSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📋 TEST SUMMARY');
        console.log('='.repeat(60));

        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const warnings = this.testResults.filter(r => r.status === 'WARNING').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;

        this.testResults.forEach(result => {
            const icon = result.status === 'PASS' ? '✅' :
                result.status === 'WARNING' ? '⚠️' : '❌';
            console.log(`${icon} ${result.test}: ${result.status}`);
            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
            if (result.details) {
                console.log(`   Details: ${result.details}`);
            }
        });

        console.log('\n' + '-'.repeat(60));
        console.log(`📊 Overall Results: ${passed} PASS, ${warnings} WARNING, ${failed} FAIL`);

        if (failed === 0) {
            console.log('🎉 All critical tests passed! Database is ready for use.');
        } else {
            console.log('⚠️  Some tests failed. Please check the errors above.');
        }

        console.log('='.repeat(60));
    }

    async runAllTests() {
        console.log('🚀 Starting Database Connection Tests');
        console.log(`📍 Database: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`);
        console.log('='.repeat(60));

        const initialized = await this.initialize();
        if (!initialized) {
            return false;
        }

        // Run all tests
        await this.testConnection();
        await this.testTableExistence();
        await this.testSampleData();
        await this.testForeignKeys();
        await this.testIndexes();
        await this.testSampleQueries();
        await this.testPerformance();

        // Print summary
        await this.printTestSummary();

        return true;
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
            console.log('\n🔌 Database connection pool closed');
        }
    }
}

// Demo function to show CRUD operations
async function demonstrateCRUDOperations() {
    console.log('\n' + '='.repeat(60));
    console.log('🔧 DEMONSTRATING CRUD OPERATIONS');
    console.log('='.repeat(60));

    try {
        const pool = mysql.createPool(dbConfig);

        // CREATE - Demonstrate adding a test scenario
        console.log('\n📝 CREATE Operation: Adding test scenario');
        const [insertResult] = await pool.execute(`
            INSERT INTO Accident_Scenarios (
                title, scenario_description, question_text,
                option_a, option_b, option_c, option_d,
                correct_answer, explanation, difficulty_level, category
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            'Test Scenario', 'A test scenario for demonstration', 'What should you do?',
            'Option A', 'Option B', 'Option C', 'Option D',
            'A', 'This is the correct explanation', 'easy', 'test'
        ]);
        const testScenarioId = insertResult.insertId;
        console.log(`   ✅ Created scenario with ID: ${testScenarioId}`);

        // READ - Demonstrate querying the scenario
        console.log('\n📖 READ Operation: Fetching scenario');
        const [selectResult] = await pool.execute(
            'SELECT * FROM Accident_Scenarios WHERE scenario_id = ?',
            [testScenarioId]
        );
        if (selectResult.length > 0) {
            console.log(`   ✅ Retrieved scenario: ${selectResult[0].title}`);
        }

        // UPDATE - Demonstrate updating the scenario
        console.log('\n✏️  UPDATE Operation: Modifying scenario');
        await pool.execute(
            'UPDATE Accident_Scenarios SET explanation = ? WHERE scenario_id = ?',
            ['Updated explanation for test', testScenarioId]
        );
        console.log('   ✅ Updated scenario explanation');

        // DELETE - Demonstrate removing the test scenario
        console.log('\n🗑️  DELETE Operation: Removing test scenario');
        await pool.execute(
            'DELETE FROM Accident_Scenarios WHERE scenario_id = ?',
            [testScenarioId]
        );
        console.log('   ✅ Deleted test scenario');

        await pool.end();
        console.log('\n🎉 CRUD Operations demonstration completed successfully!');

    } catch (error) {
        console.error('❌ CRUD demonstration failed:', error.message);
    }
}

// Main execution
if (require.main === module) {
    const tester = new DatabaseTester();

    (async () => {
        try {
            await tester.runAllTests();
            await demonstrateCRUDOperations();
        } catch (error) {
            console.error('❌ Test execution failed:', error);
        } finally {
            await tester.close();
            process.exit(0);
        }
    })();
}

module.exports = DatabaseTester;