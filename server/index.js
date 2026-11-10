'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const chatRouter = require('./routes/chat');
const workoutRouter = require('./routes/workout');
const nutritionRouter = require('./routes/nutrition');
const motivationRouter = require('./routes/motivation');
const { pingGranite } = require('./services/granite');

// ─── App setup ────────────────────────────────────────────────────────────────

const app = express();
const PORT = parseInt(process.env.PORT ?? '3000', 10);

// ─── Security & logging middleware ────────────────────────────────────────────

app.use(
  helmet({
    contentSecurityPolicy: false, // allow inline styles/scripts in the served HTML
  })
);
app.use(morgan('dev'));

// ─── CORS ─────────────────────────────────────────────────────────────────────

const corsOptions = {
  origin: process.env.CORS_ORIGIN ?? '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// ─── Body parsing ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Rate limiting ────────────────────────────────────────────────────────────

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '30', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment and try again.' },
});
app.use('/api', limiter);

// ─── Static frontend ──────────────────────────────────────────────────────────

app.use(express.static(path.join(__dirname, '../public')));

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/chat', chatRouter);
app.use('/api/workout', workoutRouter);
app.use('/api/nutrition', nutritionRouter);
app.use('/api/motivation', motivationRouter);

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', async (_req, res) => {
  try {
    const granite = await pingGranite();
    return res.json({
      status: 'ok',
      service: 'Fitness Buddy API',
      granite,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(503).json({
      status: 'degraded',
      service: 'Fitness Buddy API',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ─── API info ─────────────────────────────────────────────────────────────────

app.get('/api', (_req, res) => {
  res.json({
    name: 'Fitness Buddy API',
    version: '1.0.0',
    poweredBy: 'IBM Granite on watsonx.ai',
    endpoints: {
      'POST /api/chat': 'Conversational AI fitness chat',
      'DELETE /api/chat/:sessionId': 'Clear chat session',
      'POST /api/workout/plan': 'Generate personalised workout plan',
      'GET  /api/workout/tip': 'Get daily workout tip',
      'POST /api/nutrition/meal': 'Get meal suggestion',
      'GET  /api/nutrition/tip': 'Get daily nutrition tip',
      'POST /api/motivation': 'Get personalised motivation message',
      'GET  /api/motivation/habit': 'Get habit-building tip',
      'POST /api/motivation/checkin': 'Weekly fitness check-in',
      'GET  /api/health': 'Service health & Granite connectivity check',
    },
  });
});

// ─── Catch-all → serve frontend ───────────────────────────────────────────────

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ─── Global error handler ─────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║          🏋️  FITNESS BUDDY SERVER  🏋️          ║
║──────────────────────────────────────────────║
║  Running at  http://localhost:${PORT}           ║
║  IBM Granite model: ${process.env.IBM_GRANITE_MODEL_ID ?? 'ibm/granite-13b-chat-v2'}  
║  Environment: ${process.env.NODE_ENV ?? 'development'}               ║
╚══════════════════════════════════════════════╝
`);
});

module.exports = app;
