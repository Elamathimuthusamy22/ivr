const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
require('dotenv').config();

const twilioRoutes = require('./routes/twilio');
const callRoutes = require('./routes/calls');
const databaseRoutes = require('./routes/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : true,
  credentials: true
}));

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/twilio', twilioRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/database', databaseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'IVR System is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to IVR System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      twilio: '/api/twilio',
      calls: '/api/calls',
      database: '/api/database'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 IVR Server running on port ${PORT}`);
  console.log(`📞 Twilio webhook URL: http://localhost:${PORT}/api/twilio/voice`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 