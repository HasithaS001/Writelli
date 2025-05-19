const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Enable better error logging
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Enable better error logging
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Load environment variables
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('Environment variables loaded:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
console.log('PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Configure CORS with specific options
// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://frontend-7z24h.ondigitalocean.app', 'https://writelli.com']
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
const toolsRouter = require('./routes/tools');
app.use('/api/tools', toolsRouter);

const webhooksRouter = require('./routes/webhooks');
app.use('/api/webhooks', webhooksRouter);

// Handle 404s - After all routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested endpoint does not exist' });
});

// Error handling middleware - Must be last
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
