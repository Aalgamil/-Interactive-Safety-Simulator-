
# API Data Tables

This document explains how to use the new API data tables feature in the
Interactive Safety Simulator.

## Overview

The Interactive Safety Simulator now includes a data tables feature that allows

you to view and analyze data from the backend API in HTML tables. This includes:

1. **Leaderboard Table** - Displays top players and their scores
2. **Analytics Table** - Shows user engagement stats and module performance data

## How to Run the Application

### Prerequisites

- Node.js installed on your machine
- MySQL database server running
- Database named "safety_simulator" created in MySQL

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your database connection in the `.env` file:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=safety_simulator
   ```

3. Set up the database tables by running the SQL scripts in the `database` folder.

### Running the Application

To run both the backend server and the frontend development server simultaneously:

```bash
npm run start
```

This will start:

- Backend API server on port 3001
- Frontend development server on port 3000

Alternatively, you can run them separately:

```bash
# Run the backend server
npm run server

# Run the frontend (in a separate terminal)
npm run dev
```

## Accessing the Data Tables

1. Log in to the application
2. Click the "Data Tables" button in the navigation bar
3. Switch between the Leaderboard and Analytics tabs to view different data

## API Endpoints

The following API endpoints are available:

- `GET /api/leaderboard` - Get leaderboard data
- `GET /api/analytics/engagement` - Get user engagement statistics
- `GET /api/analytics/popularity` - Get module popularity statistics
- `GET /api/users/:id` - Get user data with scores
- `GET /api/scenarios/:type` - Get random scenario by module type
- `GET /api/health` - Health check endpoint

## Technical Details

### Frontend Components

- `DataTables.tsx` - Main page component with tab navigation
- `LeaderboardTable.tsx` - Component for displaying leaderboard data
- `AnalyticsTable.tsx` - Component for displaying analytics data

### Backend Server

- `server.js` - Express.js server with API endpoints
- API requests from the frontend are proxied to the backend server

### Database Integration

The application uses the existing database connection utilities in

`database/database-connection.js` to fetch data from the MySQL database.

## Customization

You can customize the tables by:

1. Modifying the SQL queries in the database operations
2. Adjusting the table columns and styling in the React components
3. Adding new API endpoints in the server.js file
4. Creating new table components following the same pattern

## Troubleshooting

- If you get database connection errors, check your `.env` file configuration
- If API requests fail, ensure the backend server is running on port 3001
- For CORS issues, verify the proxy configuration in vite.config.ts
