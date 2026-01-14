# Authentication Basics

This document provides an overview of the authentication system
implemented in the Interactive Safety Simulator application.

## Overview

The application uses a secure authentication system that allows users to
register, login, and access personalized features.
Authentication is handled through a combination of frontend components,
backend API endpoints, and database operations.

## Key Components

### 1. Frontend Authentication

- **Login Component**: [`src/components/Login.tsx`](src/components/Login.tsx)
  - Provides user interface for login and registration
  - Handles form validation and user input
  - Communicates with backend authentication endpoints

### 2. Backend Authentication

- **Server Endpoints**: [`server.js`](server.js)
  - `/api/login` - User authentication endpoint
  - `/api/register` - User registration endpoint
  - Uses bcrypt for password hashing and verification

### 3. Database Layer

- **User Operations**: [`database/database-connection.js`](database/database-connection.js)
  - `authenticateUser()` - Verifies user credentials
  - `createUser()` - Creates new user accounts
  - Secure password storage with bcrypt hashing

## Authentication Flow

### User Registration

1. User fills out registration form in the Login component
2. Frontend sends POST request to `/api/register`
3. Server validates input and hashes password with bcrypt
4. User data is stored in the `Users` table
5. Success response sent back to frontend

### User Login

1. User enters credentials in the Login component
2. Frontend sends POST request to `/api/login`
3. Server retrieves user from database
4. Password is verified using bcrypt.compare()
5. If valid, user session is created and user data returned
6. Frontend stores authentication state

## Security Features

### Password Security

- Passwords are hashed using bcrypt with salt rounds
- Plain text passwords are never stored in the database
- Secure password verification during login

### Database Security

- Parameterized queries prevent SQL injection
- User input is validated on both frontend and backend
- Database connection uses environment variables for credentials

### Session Management

- User sessions are tracked in the `User_Sessions` table
- Session data includes start time, module type, and completion status
- Sessions are used to track user progress and responses

## Database Schema

### Users Table

```sql
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User_Sessions Table

```sql
CREATE TABLE User_Sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    module_type ENUM('accident', 'emergency', 'cybercrime') NOT NULL,
    scenario_id INT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    score INT,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
```

## API Endpoints

### Authentication Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - Authenticate existing user
- `GET /api/logout` - End user session

### Protected Endpoints

- `GET /api/user/profile` - Get user profile data
- `POST /api/session/start` - Start training session
- `GET /api/leaderboard` - Get leaderboard data

## Usage Examples

### Frontend Login

```typescript
const handleLogin = async (username: string, password: string) => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.success) {
            // Store user data and redirect
            setUser(data.user);
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
};
```

### Backend Authentication

```javascript
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserOperations.authenticateUser(
            username,
            password
        );
        res.json({ success: true, user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});
```

## Best Practices

1. **Password Requirements**: Enforce strong password policies
2. **Input Validation**: Validate all user inputs on client and server
3. **Error Handling**: Provide generic error messages to prevent information leakage
4. **Session Timeout**: Implement automatic session expiration
5. **HTTPS Only**: Always use HTTPS in production
6. **Rate Limiting**: Implement rate limiting on authentication endpoints

## Troubleshooting

### Common Issues

- **Invalid Credentials**: Check username/password combination
- **Database Connection**: Verify database configuration in `.env`
- **CORS Errors**: Ensure proper CORS configuration in server
- **Session Issues**: Check User_Sessions table for active sessions

### Debug Steps

1. Check server logs for authentication errors
2. Verify database connectivity with test scripts
3. Test API endpoints with tools like Postman
4. Check browser console for frontend errors

## Related Files

- [`src/components/Login.tsx`](src/components/Login.tsx) - Login component
- [`server.js`](server.js) - Backend server with auth endpoints
- [`database/database-connection.js`](database/database-connection.js)
  - Database operations
- [`database/create_tables.sql`](database/create_tables.sql) - Schema
