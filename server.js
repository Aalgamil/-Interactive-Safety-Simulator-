
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Logging system that can be controlled by environment variables
const isProduction = process.env.NODE_ENV === 'production';
const enableLogging = process.env.SERVER_ENABLE_LOGGING !== 'false';

const logger = {
  log: (...args) => {
    // Logging disabled for audit compliance - console.log stripped
  },
  error: (...args) => {
    // Logging disabled for audit compliance - console.error stripped
  }
};

// Import database operations
const {
  ScoreOperations,
  AnalyticsOperations,
  UserOperations,
  ScenarioOperations
} = require('./database/database-connection.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server', message: err.message });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API Routes

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await UserOperations.createUser({
      username,
      email,
      password,
      fullName
    });

    res.json({ success: true, userId: user.userId });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(400).json({ error: error.message });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await UserOperations.authenticateUser(username, password);
    res.json({ success: true, user });
  } catch (error) {
    logger.error('Error authenticating user:', error);
    res.status(401).json({ error: error.message });
  }
});

// Get leaderboard data
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await ScoreOperations.getLeaderboard(limit);
    res.json(leaderboard);
  } catch (error) {
    logger.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

// Get user engagement statistics
app.get('/api/analytics/engagement', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const stats = await AnalyticsOperations.getUserEngagementStats(days);
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching engagement stats:', error);
    res.status(500).json({ error: 'Failed to fetch engagement statistics' });
  }
});

// Get module popularity statistics
app.get('/api/analytics/popularity', async (req, res) => {
  try {
    const stats = await AnalyticsOperations.getModulePopularity();
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching popularity stats:', error);
    res.status(500).json({ error: 'Failed to fetch popularity statistics' });
  }
});

// Get user data with scores
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserOperations.getUserWithScore(userId);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user[0]);
  } catch (error) {
    logger.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Get random scenario by module type
app.get('/api/scenarios/:type', async (req, res) => {
  try {
    const moduleType = req.params.type;
    const scenario = await ScenarioOperations.getRandomScenario(moduleType);
    if (!scenario) {
      return res.status(404).json({ error: 'No scenarios found' });
    }
    res.json(scenario);
  } catch (error) {
    logger.error('Error fetching scenario:', error);
    res.status(500).json({ error: 'Failed to fetch scenario' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// The "catchall" handler: for any request that doesn't match one above
app.use((req, res) => {
  // If the request is for an API endpoint, return JSON error
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  // Otherwise, send back React's index.html file
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  logger.log(`Server is running on port ${PORT}`);
  logger.log(`Server address: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  logger.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
  }
});
