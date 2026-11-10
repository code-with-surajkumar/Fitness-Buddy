'use strict';

const express = require('express');
const { getMotivation, getHabitTip, getWeeklyCheckIn } = require('../services/motivationService');

const router = express.Router();

// POST /api/motivation — get a personalised motivational message
router.post('/', async (req, res) => {
  const { context, name } = req.body;
  try {
    const message = await getMotivation({ context, name });
    return res.json({ message, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[motivation] Error:', err.message);
    return res.status(502).json({ error: 'Failed to get motivational message. Please try again.' });
  }
});

// GET /api/motivation/habit — habit-building tip
router.get('/habit', async (req, res) => {
  const { area } = req.query;
  try {
    const tip = await getHabitTip(area ?? 'exercise');
    return res.json({ tip, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[habit tip] Error:', err.message);
    return res.status(502).json({ error: 'Failed to get habit tip. Please try again.' });
  }
});

// POST /api/motivation/checkin — weekly check-in
router.post('/checkin', async (req, res) => {
  const { workoutsCompleted, workoutsPlanned, challenge } = req.body;

  if (workoutsCompleted === undefined || workoutsPlanned === undefined) {
    return res.status(400).json({
      error: 'workoutsCompleted and workoutsPlanned are required.',
    });
  }

  try {
    const feedback = await getWeeklyCheckIn({
      workoutsCompleted: parseInt(workoutsCompleted, 10),
      workoutsPlanned: parseInt(workoutsPlanned, 10),
      challenge,
    });
    return res.json({ feedback, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[checkin] Error:', err.message);
    return res.status(502).json({ error: 'Failed to generate check-in. Please try again.' });
  }
});

module.exports = router;
