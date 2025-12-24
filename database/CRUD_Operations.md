# Interactive Safety Simulator - CRUD Operations Guide

## Overview

This guide provides comprehensive CRUD (Create, Read, Update, Delete) operations for the Interactive Safety Simulator database. Each operation includes multiple examples with proper error handling and validation.

## Database Connection Setup

### Basic Connection Configuration

```sql
-- Connection settings
Host: localhost
Port: 3306
Database: safety_simulator
Character Set: utf8mb4
```

### Connection Test Query

```sql
SELECT 'Database Connection Successful' AS status, NOW() AS timestamp;
```

---

## 1. USER OPERATIONS

### CREATE - User Registration

```sql
-- Create new user
INSERT INTO Users (username, email, password_hash, full_name) 
VALUES (?, ?, ?, ?);

-- Example:
INSERT INTO Users (username, email, password_hash, full_name) 
VALUES ('john_doe', 'john.doe@email.com', '$2b$10$hashed_password', 'John Doe');

-- Create user with score summary
INSERT INTO Users (username, email, password_hash, full_name) 
VALUES (?, ?, ?, ?);

-- Create corresponding score summary
INSERT INTO User_Score_Summary (user_id) 
VALUES (LAST_INSERT_ID());
```

### READ - User Queries

```sql
-- Get user by ID
SELECT * FROM Users WHERE user_id = ?;

-- Get user by username
SELECT * FROM Users WHERE username = ?;

-- Get user by email
SELECT * FROM Users WHERE email = ?;

-- Get user with score summary
SELECT u.*, s.* 
FROM Users u 
LEFT JOIN User_Score_Summary s ON u.user_id = s.user_id 
WHERE u.user_id = ?;

-- Get all active users
SELECT user_id, username, email, full_name, created_at, last_login 
FROM Users 
WHERE is_active = TRUE 
ORDER BY created_at DESC;

-- Get user statistics
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_users,
    COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as recent_logins
FROM Users;
```

### UPDATE - User Operations

```sql
-- Update user profile
UPDATE Users 
SET 
    full_name = ?,
    email = ?,
    updated_at = NOW()
WHERE user_id = ?;

-- Update password
UPDATE Users 
SET password_hash = ?, updated_at = NOW()
WHERE user_id = ?;

-- Update last login
UPDATE Users 
SET last_login = NOW()
WHERE user_id = ?;

-- Deactivate user
UPDATE Users 
SET is_active = FALSE, updated_at = NOW()
WHERE user_id = ?;

-- Activate user
UPDATE Users 
SET is_active = TRUE, updated_at = NOW()
WHERE user_id = ?;
```

### DELETE - User Operations

```sql
-- Soft delete user (recommended)
UPDATE Users 
SET is_active = FALSE, updated_at = NOW()
WHERE user_id = ?;

-- Hard delete user (with foreign key constraints)
DELETE FROM User_Score_Summary WHERE user_id = ?;
DELETE FROM User_Sessions WHERE user_id = ?;
DELETE FROM Users WHERE user_id = ?;
```

---

## 2. SCENARIO OPERATIONS

### CREATE - Add New Scenarios

#### Accident Scenarios

```sql
INSERT INTO Accident_Scenarios (
    title, scenario_description, question_text, 
    option_a, option_b, option_c, option_d, 
    correct_answer, explanation, difficulty_level, category
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Example:
INSERT INTO Accident_Scenarios (
    'Workplace Injury', 'A colleague has cut their hand on machinery', 
    'What should you do first?', 'Apply a bandage', 'Call for first aid assistance', 
    'Clean the wound with water', 'Take a photo for documentation', 
    'B', 'Always prioritize getting professional medical help for serious injuries', 
    'medium', 'workplace_safety'
);
```

#### Emergency Scenarios

```sql
INSERT INTO Emergency_Scenarios (
    title, scenario_description, emergency_type, 
    correct_action, wrong_action_1, wrong_action_2, 
    phone_number, priority_level
) VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- Example:
INSERT INTO Emergency_Scenarios (
    'Office Fire Alarm', 'Fire alarm sounds in the office building', 
    'fire', 'Evacuate immediately following emergency procedures', 
    'Investigate the source of the alarm', 'Continue working until told otherwise', 
    '997', 'high'
);
```

#### Cybercrime Messages

```sql
INSERT INTO Cybercrime_Messages (
    title, message_content, message_type, 
    is_scam, red_flags, safety_tips, 
    legitimate_indicators, sender_info
) VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- Example:
INSERT INTO Cybercrime_Messages (
    'Fake Bank Alert', 'Your account is suspended. Click here to reactivate', 
    'email', TRUE, 
    '["Urgency", "Suspicious link", "Account suspension claim"]', 
    'Never click suspicious links from banks', 
    'Official bank emails contain verified sender information',
    '{"sender": "alerts@fake-bank.com"}'
);
```

### READ - Scenario Queries

```sql
-- Get all active scenarios by type
SELECT * FROM Accident_Scenarios WHERE is_active = TRUE;
SELECT * FROM Emergency_Scenarios WHERE is_active = TRUE;
SELECT * FROM Cybercrime_Messages WHERE is_active = TRUE;

-- Get scenarios by difficulty/category
SELECT * FROM Accident_Scenarios 
WHERE is_active = TRUE AND difficulty_level = ? AND category = ?;

-- Get random scenario for quiz
SELECT * FROM Accident_Scenarios 
WHERE is_active = TRUE 
ORDER BY RAND() LIMIT 1;

-- Get scenario by ID
SELECT * FROM Accident_Scenarios WHERE scenario_id = ?;

-- Get scenarios with response statistics
SELECT 
    s.*,
    COUNT(ur.response_id) as times_used,
    AVG(CASE WHEN ur.is_correct = TRUE THEN 1 ELSE 0 END) * 100 as accuracy_rate
FROM Accident_Scenarios s
LEFT JOIN User_Responses ur ON s.scenario_id = ur.scenario_id
WHERE s.is_active = TRUE
GROUP BY s.scenario_id;
```

### UPDATE - Scenario Operations

```sql
-- Update scenario
UPDATE Accident_Scenarios 
SET 
    title = ?,
    scenario_description = ?,
    question_text = ?,
    correct_answer = ?,
    explanation = ?,
    difficulty_level = ?,
    category = ?
WHERE scenario_id = ?;

-- Deactivate scenario
UPDATE Accident_Scenarios 
SET is_active = FALSE 
WHERE scenario_id = ?;

-- Update scenario statistics
UPDATE Accident_Scenarios 
SET category = ?, difficulty_level = ?
WHERE scenario_id = ?;
```

### DELETE - Scenario Operations

```sql
-- Soft delete scenario
UPDATE Accident_Scenarios 
SET is_active = FALSE 
WHERE scenario_id = ?;

-- Hard delete scenario (only if not used in responses)
DELETE FROM Accident_Scenarios 
WHERE scenario_id = ? 
AND scenario_id NOT IN (SELECT DISTINCT scenario_id FROM User_Responses);
```

---

## 3. SESSION OPERATIONS

### CREATE - User Sessions

```sql
-- Start new user session
INSERT INTO User_Sessions (
    user_id, module_type, scenario_id, start_time
) VALUES (?, ?, ?, NOW());

-- Example: Start accident simulation session
INSERT INTO User_Sessions (user_id, module_type, scenario_id) 
VALUES (1, 'accident', 1);

-- Get session ID for responses
SET @session_id = LAST_INSERT_ID();
```

### READ - Session Queries

```sql
-- Get user's current session
SELECT * FROM User_Sessions 
WHERE user_id = ? AND completed = FALSE 
ORDER BY start_time DESC LIMIT 1;

-- Get user's session history
SELECT 
    us.*,
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
ORDER BY us.start_time DESC;

-- Get session with detailed responses
SELECT 
    us.*,
    ur.response_id,
    ur.user_answer,
    ur.is_correct,
    ur.response_time,
    ur.answered_at
FROM User_Sessions us
LEFT JOIN User_Responses ur ON us.session_id = ur.session_id
WHERE us.session_id = ?;
```

### UPDATE - Session Operations

```sql
-- Complete session and calculate score
UPDATE User_Sessions 
SET 
    end_time = NOW(),
    score = ?,
    correct_answers = ?,
    total_questions = ?,
    time_taken = TIMESTAMPDIFF(SECOND, start_time, NOW()),
    completed = TRUE
WHERE session_id = ?;

-- Update session progress
UPDATE User_Sessions 
SET 
    correct_answers = ?,
    total_questions = ?
WHERE session_id = ?;
```

### DELETE - Session Operations

```sql
-- Delete session and all responses
DELETE FROM User_Responses WHERE session_id = ?;
DELETE FROM User_Sessions WHERE session_id = ?;

-- Archive old sessions (move to archive table)
INSERT INTO Archived_Sessions 
SELECT * FROM User_Sessions 
WHERE end_time < DATE_SUB(NOW(), INTERVAL 1 YEAR);

DELETE FROM User_Sessions 
WHERE end_time < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

---

## 4. RESPONSE OPERATIONS

### CREATE - User Responses

```sql
-- Record user response
INSERT INTO User_Responses (
    session_id, scenario_id, module_type, 
    user_answer, is_correct, response_time
) VALUES (?, ?, ?, ?, ?, ?);

-- Example:
INSERT INTO User_Responses (1, 1, 'accident', 'C', TRUE, 15);
```

### READ - Response Queries

```sql
-- Get all responses for a session
SELECT * FROM User_Responses 
WHERE session_id = ? 
ORDER BY answered_at;

-- Get user's response accuracy
SELECT 
    module_type,
    COUNT(*) as total_responses,
    SUM(CASE WHEN is_correct = TRUE THEN 1 ELSE 0 END) as correct_responses,
    (SUM(CASE WHEN is_correct = TRUE THEN 1 ELSE 0 END) / COUNT(*)) * 100 as accuracy_percentage
FROM User_Responses 
WHERE session_id IN (
    SELECT session_id FROM User_Sessions 
    WHERE user_id = ?
)
GROUP BY module_type;

-- Get response statistics
SELECT 
    AVG(response_time) as avg_response_time,
    MIN(response_time) as min_response_time,
    MAX(response_time) as max_response_time,
    COUNT(CASE WHEN is_correct = TRUE THEN 1 END) as correct_count,
    COUNT(CASE WHEN is_correct = FALSE THEN 1 END) as incorrect_count
FROM User_Responses 
WHERE session_id = ?;
```

### UPDATE - Response Operations

```sql
-- Update response (if needed)
UPDATE User_Responses 
SET 
    user_answer = ?,
    is_correct = ?,
    response_time = ?
WHERE response_id = ?;
```

### DELETE - Response Operations

```sql
-- Delete specific response
DELETE FROM User_Responses WHERE response_id = ?;

-- Delete all responses for a session
DELETE FROM User_Responses WHERE session_id = ?;
```

---

## 5. SCORE SUMMARY OPERATIONS

### CREATE - Initialize Score Summary

```sql
-- Create score summary for new user
INSERT INTO User_Score_Summary (user_id) 
VALUES (?);
```

### READ - Score Queries

```sql
-- Get user's score summary
SELECT * FROM User_Score_Summary 
WHERE user_id = ?;

-- Get leaderboard (top 10 users)
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
LIMIT 10;

-- Get user's ranking
SELECT 
    COUNT(*) + 1 as user_rank
FROM User_Score_Summary 
WHERE overall_best_score > (
    SELECT overall_best_score 
    FROM User_Score_Summary 
    WHERE user_id = ?
);
```

### UPDATE - Score Operations

```sql
-- Update scores after session completion
UPDATE User_Score_Summary 
SET 
    accident_best_score = CASE 
        WHEN ? > accident_best_score THEN ? 
        ELSE accident_best_score 
    END,
    accident_total_attempts = accident_total_attempts + 1,
    accident_average_score = (
        (accident_average_score * accident_total_attempts) + ? 
    ) / (accident_total_attempts + 1),
    total_sessions = total_sessions + 1,
    last_activity = NOW()
WHERE user_id = ?;

-- Update overall best score
UPDATE User_Score_Summary 
SET overall_best_score = GREATEST(
    accident_best_score, 
    emergency_best_score, 
    cybercrime_best_score
),
last_activity = NOW()
WHERE user_id = ?;
```

---

## 6. BULK OPERATIONS

### Bulk User Import

```sql
-- Import multiple users
INSERT INTO Users (username, email, password_hash, full_name) 
VALUES 
    ('user1', 'user1@email.com', 'hash1', 'User One'),
    ('user2', 'user2@email.com', 'hash2', 'User Two'),
    ('user3', 'user3@email.com', 'hash3', 'User Three')
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    updated_at = NOW();
```

### Bulk Scenario Import

```sql
-- Import multiple scenarios
INSERT INTO Accident_Scenarios (
    title, scenario_description, question_text,
    option_a, option_b, option_c, option_d,
    correct_answer, explanation, difficulty_level, category
) VALUES 
    ('Scenario 1', 'Description 1', 'Question 1', 'A1', 'B1', 'C1', 'D1', 'A', 'Explanation 1', 'easy', 'cat1'),
    ('Scenario 2', 'Description 2', 'Question 2', 'A2', 'B2', 'C2', 'D2', 'B', 'Explanation 2', 'medium', 'cat2')
ON DUPLICATE KEY UPDATE
    scenario_description = VALUES(scenario_description),
    explanation = VALUES(explanation);
```

---

## 7. ANALYTICS QUERIES

### User Engagement Analytics

```sql
-- Daily active users
SELECT 
    DATE(last_activity) as date,
    COUNT(*) as active_users
FROM User_Score_Summary 
WHERE last_activity >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(last_activity)
ORDER BY date DESC;

-- Module popularity
SELECT 
    module_type,
    COUNT(*) as session_count,
    AVG(score) as avg_score,
    AVG(time_taken) as avg_time
FROM User_Sessions 
WHERE completed = TRUE
GROUP BY module_type
ORDER BY session_count DESC;
```

### Performance Analytics

```sql
-- Scenario difficulty analysis
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
ORDER BY accuracy_rate ASC;
```

---

## 8. MAINTENANCE OPERATIONS

### Database Optimization

```sql
-- Analyze table statistics
ANALYZE TABLE Users, Accident_Scenarios, Emergency_Scenarios, 
              Cybercrime_Messages, User_Sessions, User_Responses, 
              User_Score_Summary;

-- Optimize tables
OPTIMIZE TABLE Users, Accident_Scenarios, Emergency_Scenarios, 
               Cybercrime_Messages, User_Sessions, User_Responses, 
               User_Score_Summary;

-- Check table integrity
CHECK TABLE Users, Accident_Scenarios, Emergency_Scenarios, 
            Cybercrime_Messages, User_Sessions, User_Responses, 
            User_Score_Summary;
```

### Data Cleanup

```sql
-- Archive old completed sessions
INSERT INTO Archived_Sessions 
SELECT * FROM User_Sessions 
WHERE completed = TRUE 
AND end_time < DATE_SUB(NOW(), INTERVAL 6 MONTHS);

DELETE FROM User_Sessions 
WHERE completed = TRUE 
AND end_time < DATE_SUB(NOW(), INTERVAL 6 MONTHS);

-- Remove orphaned responses
DELETE ur FROM User_Responses ur
LEFT JOIN User_Sessions us ON ur.session_id = us.session_id
WHERE us.session_id IS NULL;

-- Clean up inactive users (older than 2 years)
UPDATE Users 
SET is_active = FALSE 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR) 
AND last_login IS NULL;
```

---

## 9. TRANSACTION EXAMPLES

### Complete User Registration Transaction

```sql
START TRANSACTION;

-- Create user
INSERT INTO Users (username, email, password_hash, full_name) 
VALUES (?, ?, ?, ?);

SET @user_id = LAST_INSERT_ID();

-- Create score summary
INSERT INTO User_Score_Summary (user_id) 
VALUES (@user_id);

-- Log the registration
INSERT INTO System_Logs (event_type, user_id, details) 
VALUES ('USER_REGISTERED', @user_id, CONCAT('User ', ?, ' registered'));

COMMIT;
```

### Complete Session Transaction

```sql
START TRANSACTION;

-- Start session
INSERT INTO User_Sessions (user_id, module_type, scenario_id) 
VALUES (?, ?, ?);

SET @session_id = LAST_INSERT_ID();

-- Record responses
INSERT INTO User_Responses (session_id, scenario_id, module_type, user_answer, is_correct, response_time) 
VALUES 
    (@session_id, ?, ?, ?, ?, ?),
    (@session_id, ?, ?, ?, ?, ?);

-- Update session with final score
UPDATE User_Sessions 
SET 
    end_time = NOW(),
    score = ?,
    correct_answers = ?,
    total_questions = ?,
    completed = TRUE
WHERE session_id = @session_id;

COMMIT;
```

---

## Error Handling Best Practices

### Common Error Codes

- **1062**: Duplicate entry (handle unique constraint violations)
- **1451**: Cannot delete or update parent row (foreign key constraint)
- **1452**: Cannot add child row (foreign key constraint violation)
- **1264**: Out of range value (check constraint violation)

### Transaction Rollback Example

```sql
START TRANSACTION;

BEGIN
    INSERT INTO Users (...) VALUES (...);
    
    IF ROW_COUNT() = 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Failed to create user';
    END IF;
    
    INSERT INTO User_Score_Summary (user_id) VALUES (LAST_INSERT_ID());
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RESIGNAL;
END;
```

This comprehensive CRUD guide provides all necessary operations for managing the Interactive Safety Simulator database effectively.
