
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database operations
const {
  ScoreOperations,
  AnalyticsOperations,
  UserOperations,
  ScenarioOperations
} = require('./database/database-connection.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes

// Get leaderboard data
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await ScoreOperations.getLeaderboard(limit);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
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
    console.error('Error fetching engagement stats:', error);
    res.status(500).json({ error: 'Failed to fetch engagement statistics' });
  }
});

// Get module popularity statistics
app.get('/api/analytics/popularity', async (req, res) => {
  try {
    const stats = await AnalyticsOperations.getModulePopularity();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching popularity stats:', error);
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
    console.error('Error fetching user data:', error);
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
    console.error('Error fetching scenario:', error);
    res.status(500).json({ error: 'Failed to fetch scenario' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server address: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});
