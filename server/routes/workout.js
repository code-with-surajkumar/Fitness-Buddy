'use strict';

const express = require('express');
const { getWorkoutPlan, getDailyWorkoutTip } = require('../services/workoutService');

const router = express.Router();

// POST /api/workout/plan — generate a personalised workout plan
router.post('/plan', async (req, res) => {
  const { goal, level, equipment, duration, focus } = req.body;

  if (!goal || !level || !equipment) {
    return res.status(400).json({
      error: 'goal, level, and equipment are required.',
      validGoals: ['weightloss', 'musclebuild', 'flexibility', 'endurance', 'beginner', 'stress'],
      validLevels: ['beginner', 'intermediate', 'advanced'],
      validEquipment: ['none', 'minimal', 'full'],
    });
  }

  try {
    const plan = await getWorkoutPlan({
      goal,
      level,
      equipment,
      duration: duration ? parseInt(duration, 10) : 30,
      focus,
    });
    return res.json({ plan, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[workout] Error:', err.message);
    return res.status(502).json({ error: 'Failed to generate workout plan. Please try again.' });
  }
});

// GET /api/workout/tip — get a quick daily workout tip
router.get('/tip', async (_req, res) => {
  try {
    const tip = await getDailyWorkoutTip();
    return res.json({ tip, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[workout tip] Error:', err.message);
    return res.status(502).json({ error: 'Failed to get workout tip. Please try again.' });
  }
});

module.exports = router;
