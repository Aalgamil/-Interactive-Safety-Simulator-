# Interactive Safety Simulator - Entity Relationship Diagram (ERD)

## Database Schema Overview

The Interactive Safety Simulator database is designed to manage users, safety scenarios, user sessions, and performance tracking across three main training modules: Accident Simulation, Emergency Reporting, and Cybercrime Detection.

## Entities and Relationships

### 1. **Users** (Main Entity)

- **Primary Key**: `user_id`
- **Attributes**:
  - user_id (INT, AUTO_INCREMENT, PRIMARY KEY)
  - username (VARCHAR(50), UNIQUE, NOT NULL)
  - email (VARCHAR(100), UNIQUE, NOT NULL)
  - password_hash (VARCHAR(255), NOT NULL)
  - full_name (VARCHAR(100))
  - created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
  - updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
  - is_active (BOOLEAN, DEFAULT TRUE)
  - last_login (TIMESTAMP)

### 2. **Accident_Scenarios**

- **Primary Key**: `scenario_id`
- **Attributes**:
  - scenario_id (INT, AUTO_INCREMENT, PRIMARY KEY)
  - title (VARCHAR(200), NOT NULL)
  - scenario_description (TEXT, NOT NULL)
  - question_text (TEXT, NOT NULL)
  - option_a (TEXT, NOT NULL)
  - option_b (TEXT, NOT NULL)
  - option_c (TEXT, NOT NULL)
  - option_d (TEXT, NOT NULL)
  - correct_answer (CHAR(1), CHECK (correct_answer IN ('A', 'B', 'C', 'D')))
  - explanation (TEXT, NOT NULL)
  - difficulty_level (ENUM('easy', 'medium', 'hard'), DEFAULT 'medium')
  - category (VARCHAR(50))
  - is_active (BOOLEAN, DEFAULT TRUE)
  - created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 3. **Emergency_Scenarios**

- **Primary Key**: `scenario_id`
- **Attributes**:
  - scenario_id (INT, AUTO_INCREMENT, PRIMARY KEY)
  - title (VARCHAR(200), NOT NULL)
  - scenario_description (TEXT, NOT NULL)
  - emergency_type (ENUM('medical', 'fire', 'crime', 'accident', 'other'))
  - correct_action (TEXT, NOT NULL)
  - wrong_action_1 (TEXT, NOT NULL)
  - wrong_action_2 (TEXT, NOT NULL)
  - phone_number (VARCHAR(20))
  - priority_level (ENUM('low', 'medium', 'high', 'critical'))
  - is_active (BOOLEAN, DEFAULT TRUE)
  - created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 4. **Cybercrime_Messages**

- **Primary Key**: `message_id`
- **Attributes**:
  - message_id (INT, AUTO_INCREMENT, PRIMARY KEY)
  - title (VARCHAR(200), NOT NULL)
  - message_content (TEXT, NOT NULL)
  - message_type (ENUM('email', 'sms', 'whatsapp', 'social_media', 'phone_call'))
  - is_scam (BOOLEAN, NOT NULL)
  - red_flags (JSON)
  - safety_tips (TEXT)
  - legitimate_indicators (TEXT)
  - sender_info (JSON)
  - is_active (BOOLEAN, DEFAULT TRUE)
  - created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 5. **User_Sessions**

- **Primary Key**: `session_id`
- **Foreign Keys**:
  - user_id → Users.user_id
  - scenario_id → (varies by module)
- **Attributes**:
  - session_id (INT, AUTO_INCREMENT, PRIMARY KEY)
  - user_id (INT, FOREIGN KEY → Users.user_id)
  - module_type (ENUM('accident', 'emergency', 'cybercrime'))
  - scenario_id (INT) -- References different scenario tables based on module_type
  - start_time (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
  - end_time (TIMESTAMP)
  - score (INT, CHECK (score >= 0 AND score <= 100))
  - correct_answers (INT, DEFAULT 0)
  - total_questions (INT, DEFAULT 0)
  - time_taken (INT) -- in seconds
  - completed (BOOLEAN, DEFAULT FALSE)

### 6. **User_Responses**

- **Primary Key**: `response_id`
- **Foreign Keys**:
  - session_id → User_Sessions.session_id
  - scenario_id → (varies by module)
- **Attributes**:
  - response_id (INT, AUTO_INCREMENT, PRIMARY KEY)
  - session_id (INT, FOREIGN KEY → User_Sessions.session_id)
  - scenario_id (INT) -- References different scenario tables
  - module_type (ENUM('accident', 'emergency', 'cybercrime'))
  - user_answer (TEXT)
  - is_correct (BOOLEAN)
  - response_time (INT) -- in seconds
  - answered_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 7. **User_Score_Summary**

- **Primary Key**: `summary_id`
- **Foreign Key**: user_id → Users.user_id
- **Attributes**:
  - summary_id (INT, AUTO_INCREMENT, PRIMARY KEY)
  - user_id (INT, FOREIGN KEY → Users.user_id, UNIQUE)
  - accident_best_score (INT, DEFAULT 0)
  - accident_total_attempts (INT, DEFAULT 0)
  - accident_average_score (DECIMAL(5,2), DEFAULT 0.00)
  - emergency_best_score (INT, DEFAULT 0)
  - emergency_total_attempts (INT, DEFAULT 0)
  - emergency_average_score (DECIMAL(5,2), DEFAULT 0.00)
  - cybercrime_best_score (INT, DEFAULT 0)
  - cybercrime_total_attempts (INT, DEFAULT 0)
  - cybercrime_average_score (DECIMAL(5,2), DEFAULT 0.00)
  - overall_best_score (INT, DEFAULT 0)
  - total_sessions (INT, DEFAULT 0)
  - last_activity (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

## Relationships

### Primary Relationships

1. **Users 1:N User_Sessions** - One user can have multiple training sessions
2. **Users 1:1 User_Score_Summary** - One score summary per user
3. **User_Sessions 1:N User_Responses** - One session contains multiple responses
4. **Scenario_Tables 1:N User_Sessions** - Each scenario can be used in multiple sessions
5. **Scenario_Tables 1:N User_Responses** - Each scenario can have multiple user responses

### Foreign Key Constraints

- `User_Sessions.user_id` → `Users.user_id`
- `User_Score_Summary.user_id` → `Users.user_id`
- `User_Responses.session_id` → `User_Sessions.session_id`

## Database Indexes

### Performance Indexes

- `idx_users_email` on `Users(email)`
- `idx_users_username` on `Users(username)`
- `idx_sessions_user_id` on `User_Sessions(user_id)`
- `idx_sessions_module_type` on `User_Sessions(module_type)`
- `idx_responses_session_id` on `User_Responses(session_id)`
- `idx_scenarios_active` on scenario tables (`is_active`)
- `idx_scenarios_category` on scenario tables (`category`)

## Data Integrity Constraints

### Check Constraints

- Scores must be between 0 and 100
- Correct answers must be A, B, C, or D
- Response times must be positive
- Phone numbers must follow valid formats

### Unique Constraints

- Username must be unique
- Email must be unique
- Each user can have only one score summary

## Security Considerations

1. **Password Security**: Passwords are hashed using bcrypt
2. **Data Validation**: All inputs are validated at application level
3. **Session Management**: User sessions are tracked with timestamps
4. **Audit Trail**: All changes are tracked with created_at/updated_at timestamps
5. **Soft Deletes**: Active flags instead of hard deletes for scenario data

## Scalability Features

1. **Partitioning**: User sessions can be partitioned by date
2. **Archiving**: Old sessions can be archived to improve performance
3. **Caching**: User score summaries can be cached for fast retrieval
4. **Read Replicas**: Database can be configured with read replicas for scaling

This ERD provides a robust foundation for the Interactive Safety Simulator with proper normalization, referential integrity, and performance optimization.
