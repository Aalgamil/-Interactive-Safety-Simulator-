# Interactive Safety Simulator - Database Solution

A comprehensive MySQL database solution for the Interactive Safety Simulator application with complete ERD, CRUD operations, and maintenance utilities.

## 📋 Table of Contents

- [Overview](#-overview)
- [Database Schema](#-database-schema)
- [Quick Start](#-quick-start)
- [File Structure](#-file-structure)
- [Installation & Setup](#-installation--setup)
- [CRUD Operations](#-crud-operations)
- [Database Utilities](#-database-utilities)
- [Maintenance Tasks](#-maintenance-tasks)
- [API Integration](#-api-integration)
- [Performance Optimization](#-performance-optimization)
- [Security Best Practices](#-security-best-practices)
- [Troubleshooting](#-troubleshooting)

## 🎯 Overview

This database solution provides a complete backend infrastructure for an Interactive Safety Simulator application with three main training modules:

- **Accident Simulation**: Road traffic and workplace accident scenarios
- **Emergency Reporting**: Medical, fire, and crime emergency response training
- **Cybercrime Detection**: Identifying phishing, scams, and cyber threats

### Key Features

✅ **Complete ERD Documentation**  
✅ **Full CRUD Operations**  
✅ **Database Connection Utilities**  
✅ **Maintenance & Optimization Scripts**  
✅ **Sample Data & Seeding**  
✅ **Performance Monitoring**  
✅ **Security Best Practices**  
✅ **Scalable Architecture**

## 🗄️ Database Schema

### Entity Relationship Diagram (ERD)

The database consists of 7 main tables:

```text
Users (1) ←→ (N) User_Sessions (1) ←→ (N) User_Responses
    ↓                          ↓
User_Score_Summary         Scenario Tables:
    ↓                      - Accident_Scenarios
All Scenarios            - Emergency_Scenarios
    ↓                      - Cybercrime_Messages
```

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| **Users** | User management | Authentication, profile data |
| **Accident_Scenarios** | Traffic/workplace scenarios | Multiple choice questions |
| **Emergency_Scenarios** | Emergency response training | Action-based scenarios |
| **Cybercrime_Messages** | Cybersecurity training | Real scam examples |
| **User_Sessions** | Training session tracking | Progress & scoring |
| **User_Responses** | Individual answer tracking | Response analytics |
| **User_Score_Summary** | Aggregated performance data | Leaderboards & rankings |

## 🚀 Quick Start

### 1. Database Setup

```bash
# Create database and tables
mysql -u root -p < create_tables.sql

# Verify installation
mysql -u root -p -e "USE safety_simulator; SHOW TABLES;"
```

### 2. Environment Configuration

```bash
# Create .env file
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=safety_simulator
```

### 3. Test Connection

```bash
# Using Node.js utilities
node database-connection.js

# Or using MySQL directly
mysql -u root -p -e "SELECT 'Connection successful' AS status;"
```

## 📁 File Structure

```text
database/
├── README.md                    # This file
├── ERD.md                      # Entity Relationship Diagram
├── CRUD_Operations.md          # Complete CRUD operations guide
├── create_tables.sql           # Database schema & sample data
├── database-connection.js      # Connection utilities (JavaScript)
├── database-connection.ts      # Connection utilities (TypeScript)
├── package.json               # Dependencies & scripts
├── maintenance-tasks.js       # Database maintenance utilities
└── test-connection.js         # Connection testing script
```

## 📦 Installation & Setup

### Prerequisites

- MySQL 8.0+ or MariaDB 10.5+
- Node.js 14+ (for utility scripts)
- Git (for version control)

### Step-by-Step Setup

1. **Clone and Navigate**

   ```bash
   cd /path/to/your/project
   ```

2. **Create Database**

   ```bash
   mysql -u root -p < database/create_tables.sql
   ```

3. **Install Dependencies** (Optional)

   ```bash
   cd database
   npm install
   ```

4. **Configure Environment**

   ```bash
   # Create .env file in database directory
   echo "DB_HOST=localhost" > .env
   echo "DB_PORT=3306" >> .env
   echo "DB_USER=root" >> .env
   echo "DB_PASSWORD=your_password" >> .env
   echo "DB_NAME=safety_simulator" >> .env
   ```

5. **Verify Installation**

   ```bash
   node database-connection.js
   ```

## 🔧 CRUD Operations

### User Management

```javascript
// Create User
const userOps = require('./database-connection');
const userData = {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securePassword123',
    fullName: 'John Doe'
};
const newUser = await UserOperations.createUser(userData);

// Authenticate User
const user = await UserOperations.authenticateUser('john_doe', 'password');

// Get User Profile
const profile = await UserOperations.getUserWithScore(userId);
```

### Scenario Operations

```javascript
// Get Random Scenario
const scenario = await ScenarioOperations.getRandomScenario('accident');

// Get Specific Scenario
const accidentScenario = await ScenarioOperations.getScenarioById('accident', 1);
```

### Session Management

```javascript
// Start Training Session
const session = await SessionOperations.startSession(userId, 'accident', scenarioId);

// Record User Response
await SessionOperations.recordResponse(
    sessionId, scenarioId, 'accident', 'C', true, 15
);

// Complete Session
await SessionOperations.completeSession(sessionId, 85, 4, 5);
```

### Score Tracking

```javascript
// Update User Score
await ScoreOperations.updateUserScore(userId, 'accident', 85);

// Get Leaderboard
const leaderboard = await ScoreOperations.getLeaderboard(10);
```

### Analytics

```javascript
// Get User Engagement
const engagement = await AnalyticsOperations.getUserEngagementStats(30);

// Get Module Popularity
const popularity = await AnalyticsOperations.getModulePopularity();
```

## 🛠️ Database Utilities

### Connection Management

```javascript
const { DatabaseConnection } = require('./database-connection');

// Get database instance
const db = DatabaseConnection.getInstance();

// Execute custom query
const results = await db.executeQuery(
    'SELECT * FROM Users WHERE is_active = ?', 
    [true]
);

// Execute transaction
const transaction = await db.executeTransaction([
    { query: 'INSERT INTO Users...', params: [...] },
    { query: 'INSERT INTO User_Score_Summary...', params: [...] }
]);
```

### Health Monitoring

```javascript
// Check database health
const health = await checkDatabaseHealth();
console.log(health); // { status: 'healthy', timestamp: '...' }
```

## 🔧 Maintenance Tasks

### Automated Maintenance

```bash
# Full maintenance cycle
node maintenance-tasks.js

# Specific tasks
node maintenance-tasks.js archive      # Archive old sessions
node maintenance-tasks.js cleanup      # Clean orphaned data
node maintenance-tasks.js users        # Deactivate inactive users
node maintenance-tasks.js analyze      # Update table statistics
node maintenance-tasks.js optimize     # Optimize tables
node maintenance-tasks.js check        # Check integrity
node maintenance-tasks.js report       # Generate report
```

### Manual Maintenance

```sql
-- Archive old sessions
INSERT INTO Archived_Sessions 
SELECT * FROM User_Sessions 
WHERE completed = TRUE 
AND end_time < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- Clean orphaned responses
DELETE ur FROM User_Responses ur
LEFT JOIN User_Sessions us ON ur.session_id = us.session_id
WHERE us.session_id IS NULL;

-- Update statistics
ANALYZE TABLE Users, Accident_Scenarios, User_Sessions;

-- Optimize tables
OPTIMIZE TABLE Users, Accident_Scenarios, User_Sessions;
```

## 🔌 API Integration

### Express.js Integration

```javascript
const express = require('express');
const { UserOperations, ScenarioOperations, SessionOperations } = require('./database-connection');
const app = express();

// User registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const user = await UserOperations.createUser(req.body);
        res.json({ success: true, userId: user.userId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get random scenario endpoint
app.get('/api/scenario/:module', async (req, res) => {
    try {
        const scenario = await ScenarioOperations.getRandomScenario(req.params.module);
        res.json({ success: true, scenario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start session endpoint
app.post('/api/session', async (req, res) => {
    try {
        const session = await SessionOperations.startSession(
            req.body.userId, 
            req.body.moduleType, 
            req.body.scenarioId
        );
        res.json({ success: true, sessionId: session.sessionId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### Frontend Integration (React/TypeScript)

```typescript
import { UserOperations, ScenarioOperations, SessionOperations } from './database-connection';

// React hook for user authentication
const useAuth = () => {
    const login = async (username: string, password: string) => {
        try {
            const user = await UserOperations.authenticateUser(username, password);
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };
    
    return { login };
};

// React hook for scenario management
const useScenarios = () => {
    const getRandomScenario = async (moduleType: 'accident' | 'emergency' | 'cybercrime') => {
        try {
            const scenario = await ScenarioOperations.getRandomScenario(moduleType);
            return { success: true, scenario };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };
    
    return { getRandomScenario };
};
```

## 📊 Performance Optimization

### Indexing Strategy

The database includes strategic indexes for optimal performance:

```sql
-- User lookup indexes
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_username ON Users(username);

-- Session tracking indexes
CREATE INDEX idx_sessions_user_id ON User_Sessions(user_id);
CREATE INDEX idx_sessions_module_type ON User_Sessions(module_type);

-- Response tracking indexes
CREATE INDEX idx_responses_session_id ON User_Responses(session_id);
CREATE INDEX idx_responses_correct ON User_Responses(is_correct);
```

### Query Optimization

```sql
-- Optimized user leaderboard query
SELECT u.username, us.overall_best_score, us.total_sessions
FROM Users u
JOIN User_Score_Summary us ON u.user_id = us.user_id
WHERE u.is_active = TRUE
ORDER BY us.overall_best_score DESC
LIMIT 10;

-- Optimized scenario analytics
SELECT s.title, COUNT(ur.response_id) as attempts,
       AVG(CASE WHEN ur.is_correct THEN 1 ELSE 0 END) * 100 as accuracy
FROM Accident_Scenarios s
LEFT JOIN User_Responses ur ON s.scenario_id = ur.scenario_id
WHERE s.is_active = TRUE
GROUP BY s.scenario_id
ORDER BY attempts DESC;
```

## 🔒 Security Best Practices

### Password Security

```javascript
// Always hash passwords
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 10);

// Verify passwords
const isValid = await bcrypt.compare(password, hashedPassword);
```

### SQL Injection Prevention

```javascript
// Use parameterized queries
await db.executeQuery(
    'SELECT * FROM Users WHERE username = ? AND is_active = ?', 
    [username, true]
);

// Avoid string concatenation
// ❌ DON'T: `SELECT * FROM Users WHERE username = '${username}'`
// ✅ DO:   'SELECT * FROM Users WHERE username = ?'
```

### Data Validation

```sql
-- Built-in constraints
CREATE TABLE Users (
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    score INT CHECK (score >= 0 AND score <= 100),
    correct_answer CHAR(1) CHECK (correct_answer IN ('A', 'B', 'C', 'D'))
);
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Failed**

   ```bash
   # Check MySQL service
   systemctl status mysql
   
   # Test connection
   mysql -u root -p -e "SELECT 1;"
   ```

2. **Foreign Key Errors**

   ```sql
   -- Check foreign key constraints
   SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
   WHERE TABLE_SCHEMA = 'safety_simulator';
   
   -- Temporarily disable foreign key checks
   SET FOREIGN_KEY_CHECKS = 0;
   -- (remember to re-enable)
   SET FOREIGN_KEY_CHECKS = 1;
   ```

3. **Permission Errors**

   ```sql
   -- Grant permissions
   GRANT ALL PRIVILEGES ON safety_simulator.* TO 'your_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Performance Issues

1. **Slow Queries**

   ```sql
   -- Enable slow query log
   SET GLOBAL slow_query_log = 'ON';
   SET GLOBAL long_query_time = 2;
   
   -- Analyze query performance
   EXPLAIN SELECT * FROM User_Sessions WHERE user_id = 1;
   ```

2. **Table Locks**

   ```sql
   -- Check for locks
   SHOW PROCESSLIST;
   
   -- Kill blocking process
   KILL [process_id];
   ```

### Monitoring

```sql
-- Database size
SELECT 
    table_schema as 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'safety_simulator'
GROUP BY table_schema;

-- Table row counts
SELECT 
    table_name,
    table_rows
FROM information_schema.TABLES 
WHERE table_schema = 'safety_simulator'
ORDER BY table_rows DESC;
```

## 📈 Scaling Considerations

### Read Replicas

```javascript
// Configuration for read replicas
const dbConfig = {
    master: { host: 'master-db.example.com', ... },
    slaves: [
        { host: 'slave1.example.com', ... },
        { host: 'slave2.example.com', ... }
    ]
};
```

### Partitioning

```sql
-- Partition User_Sessions by date
ALTER TABLE User_Sessions 
PARTITION BY RANGE (YEAR(start_time)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION pfuture VALUES LESS THAN MAXVALUE
);
```

### Caching Strategy

```javascript
// Redis caching for frequent queries
const redis = require('redis');
const client = redis.createClient();

// Cache user score summary
async function getUserScoreSummary(userId) {
    const cacheKey = `user_score_${userId}`;
    let summary = await client.get(cacheKey);
    
    if (!summary) {
        summary = await UserOperations.getUserWithScore(userId);
        await client.setex(cacheKey, 300, JSON.stringify(summary)); // 5 min cache
    }
    
    return JSON.parse(summary);
}
```

## 📝 Contributing

1. **Database Changes**
   - Update ERD.md for schema changes
   - Modify create_tables.sql accordingly
   - Update CRUD_Operations.md

2. **Code Standards**
   - Use parameterized queries
   - Include error handling
   - Add unit tests for new functions

3. **Documentation**
   - Update README.md for new features
   - Include examples in CRUD_Operations.md

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support

For questions or issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [CRUD Operations Guide](CRUD_Operations.md)
3. Check the [ERD Documentation](ERD.md)
4. Run maintenance diagnostics: `node maintenance-tasks.js check`

---

Last Updated: December 2025
