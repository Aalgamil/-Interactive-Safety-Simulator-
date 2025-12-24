-- Interactive Safety Simulator Database Setup
-- Create Database
CREATE DATABASE IF NOT EXISTS safety_simulator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE safety_simulator;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- TABLE 1: USERS (Main entity)
-- =====================================================
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_username (username),
    INDEX idx_users_active (is_active)
);

-- =====================================================
-- TABLE 2: ACCIDENT_SCENARIOS
-- =====================================================
CREATE TABLE Accident_Scenarios (
    scenario_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    scenario_description TEXT NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    explanation TEXT NOT NULL,
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_accident_active (is_active),
    INDEX idx_accident_category (category),
    INDEX idx_accident_difficulty (difficulty_level)
);

-- =====================================================
-- TABLE 3: EMERGENCY_SCENARIOS
-- =====================================================
CREATE TABLE Emergency_Scenarios (
    scenario_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    scenario_description TEXT NOT NULL,
    emergency_type ENUM('medical', 'fire', 'crime', 'accident', 'other') NOT NULL,
    correct_action TEXT NOT NULL,
    wrong_action_1 TEXT NOT NULL,
    wrong_action_2 TEXT NOT NULL,
    phone_number VARCHAR(20),
    priority_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_emergency_active (is_active),
    INDEX idx_emergency_type (emergency_type),
    INDEX idx_emergency_priority (priority_level)
);

-- =====================================================
-- TABLE 4: CYBERCRIME_MESSAGES
-- =====================================================
CREATE TABLE Cybercrime_Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message_content TEXT NOT NULL,
    message_type ENUM('email', 'sms', 'whatsapp', 'social_media', 'phone_call') NOT NULL,
    is_scam BOOLEAN NOT NULL,
    red_flags JSON,
    safety_tips TEXT,
    legitimate_indicators TEXT,
    sender_info JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cyber_active (is_active),
    INDEX idx_cyber_type (message_type),
    INDEX idx_cyber_scam (is_scam)
);

-- =====================================================
-- TABLE 5: USER_SESSIONS
-- =====================================================
CREATE TABLE User_Sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_type ENUM('accident', 'emergency', 'cybercrime') NOT NULL,
    scenario_id INT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    score INT DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    correct_answers INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    time_taken INT DEFAULT 0, -- in seconds
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_module_type (module_type),
    INDEX idx_sessions_completed (completed),
    INDEX idx_sessions_start_time (start_time)
);

-- =====================================================
-- TABLE 6: USER_RESPONSES
-- =====================================================
CREATE TABLE User_Responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    scenario_id INT NOT NULL,
    module_type ENUM('accident', 'emergency', 'cybercrime') NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN,
    response_time INT DEFAULT 0, -- in seconds
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES User_Sessions(session_id) ON DELETE CASCADE,
    INDEX idx_responses_session_id (session_id),
    INDEX idx_responses_scenario (scenario_id),
    INDEX idx_responses_module (module_type),
    INDEX idx_responses_correct (is_correct)
);

-- =====================================================
-- TABLE 7: USER_SCORE_SUMMARY
-- =====================================================
CREATE TABLE User_Score_Summary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    accident_best_score INT DEFAULT 0,
    accident_total_attempts INT DEFAULT 0,
    accident_average_score DECIMAL(5,2) DEFAULT 0.00,
    emergency_best_score INT DEFAULT 0,
    emergency_total_attempts INT DEFAULT 0,
    emergency_average_score DECIMAL(5,2) DEFAULT 0.00,
    cybercrime_best_score INT DEFAULT 0,
    cybercrime_total_attempts INT DEFAULT 0,
    cybercrime_average_score DECIMAL(5,2) DEFAULT 0.00,
    overall_best_score INT DEFAULT 0,
    total_sessions INT DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_summary_user_id (user_id),
    INDEX idx_summary_last_activity (last_activity)
);

-- =====================================================
-- INITIAL DATA INSERTION
-- =====================================================

-- Insert sample Accident Scenarios
INSERT INTO Accident_Scenarios (title, scenario_description, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, category) VALUES
('Two-Car Collision', 'You witness a two-car collision at an intersection. One driver appears injured and the other is standing outside their vehicle.', 'What should be your first priority?', 'Take photos of the damage', 'Ask the standing driver what happened', 'Call emergency services (999) for the injured person', 'Move the vehicles to clear traffic', 'C', 'Always prioritize human life. If someone is injured, call 999 immediately before doing anything else.', 'medium', 'traffic_accident'),
('Gasoline Leak', 'You notice a strong gasoline smell near a parked car with a visible fuel leak.', 'What should you do immediately?', 'Start the car to move it away', 'Call the owner of the vehicle', 'Move away from the area and call emergency services', 'Try to fix the leak yourself', 'C', 'Gasoline leaks create serious fire and explosion hazards. Your safety comes first.', 'easy', 'vehicle_hazard'),
('Minor Fender-Bender', 'A minor fender-bender occurs with no injuries and minimal damage. Both drivers are present.', 'What is the correct procedure?', 'Call 999 for emergency services', 'Call 901 for police non-emergency line', 'Don''t call anyone, just exchange insurance information', 'Leave the scene immediately', 'B', 'For non-emergency accidents with no injuries, call 901 to report to police.', 'easy', 'traffic_accident');

-- Insert sample Emergency Scenarios
INSERT INTO Emergency_Scenarios (title, scenario_description, emergency_type, correct_action, wrong_action_1, wrong_action_2, phone_number, priority_level) VALUES
('Heart Attack Symptoms', 'An elderly person suddenly clutches their chest and says they feel severe chest pain and shortness of breath.', 'medical', 'Call 999 immediately and stay with the person', 'Give them water to drink', 'Tell them to walk around to feel better', '999', 'critical'),
('Kitchen Fire', 'A small fire starts in your kitchen while cooking. The fire is contained to the pot on the stove.', 'fire', 'Turn off the heat source and use a lid to smother the fire', 'Pour water on the fire', 'Use flour to put out the fire', '997', 'high'),
('Traffic Violation', 'You witness a traffic violation you witnessed yesterday and want to report it.', 'crime', 'Call 901 to report non-urgent police matters', 'Call 999 as it''s an emergency', 'Ignore it as it happened yesterday', '901', 'low');

-- Insert sample Cybercrime Messages
INSERT INTO Cybercrime_Messages (title, message_content, message_type, is_scam, red_flags, safety_tips, legitimate_indicators, sender_info) VALUES
('Dubai Police Lottery', 'Congratulations! You have won AED 50,000 in Dubai Police lottery. Click this link to claim: bit.ly/dp-lottery-claim', 'email', TRUE, '["Too good to be true", "Dubai Police doesn''t run lotteries", "Suspicious shortened URL", "Asks for personal information"]', 'Never click on suspicious links. Dubai Police never runs lotteries or asks for personal information via email.', 'Legitimate police communications come from official domains and never offer prizes.', '{"sender": "noreply@dp-lottery.fake", "domain": "dp-lottery.fake"}'),
('Police OTP Request', 'This is Officer Ahmed from Dubai Police. We need your OTP to verify your identity for an ongoing investigation. Please send your 6-digit OTP immediately.', 'sms', TRUE, '["Unsolicited message from unknown number", "Requests sensitive information (OTP)", "Creates false urgency", "Police never ask for OTPs"]', 'Never share OTPs with anyone. Official police investigations never request such information via SMS.', 'Legitimate police contact will come through official channels and proper procedures.', '{"sender": "+971501234567", "number": "unverified"}'),
('Bank Security Alert', 'Your account has been compromised. Verify your identity by clicking here: http://security-alerts-bank.com/verify', 'email', TRUE, '["Misspelled domain", "Creates urgency and fear", "Suspicious URL", "Requests immediate action"]', 'Banks never ask you to verify via external links sent through email. Always contact your bank directly.', 'Official bank emails come from verified domains and don''t include suspicious links.', '{"sender": "security@alerts-bank.com", "domain": "alerts-bank.com"}');

-- Create a default admin user (password: admin123 - should be changed)
INSERT INTO Users (username, email, password_hash, full_name) VALUES 
('admin', 'admin@safetysimulator.com', '$2b$10$rOK6I8vW8V6Y8Z8Z8Z8Z8uN8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'System Administrator');

-- Create initial score summary for admin user
INSERT INTO User_Score_Summary (user_id) VALUES (1);

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the database setup

-- Show all tables
-- SHOW TABLES;

-- Show table structures
-- DESCRIBE Users;
-- DESCRIBE Accident_Scenarios;
-- DESCRIBE Emergency_Scenarios;
-- DESCRIBE Cybercrime_Messages;
-- DESCRIBE User_Sessions;
-- DESCRIBE User_Responses;
-- DESCRIBE User_Score_Summary;

-- Check foreign key constraints
-- SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
-- FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
-- WHERE TABLE_SCHEMA = 'safety_simulator';

-- Check indexes
-- SHOW INDEX FROM Users;
-- SHOW INDEX FROM Accident_Scenarios;
-- SHOW INDEX FROM User_Sessions;