'use strict';

const express = require('express');
const { getMealSuggestion, getNutritionTip } = require('../services/nutritionService');

const router = express.Router();

// POST /api/nutrition/meal — get a meal suggestion
router.post('/meal', async (req, res) => {
  const { mealType, diet, goal, calories } = req.body;

  if (!mealType || !diet) {
    return res.status(400).json({
      error: 'mealType and diet are required.',
      validMealTypes: ['breakfast', 'lunch', 'dinner', 'snack', 'mealplan'],
      validDiets: ['none', 'vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'keto', 'highprotein'],
    });
  }

  try {
    const suggestion = await getMealSuggestion({
      mealType,
      diet,
      goal,
      calories: calories ? parseInt(calories, 10) : undefined,
    });
    return res.json({ suggestion, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[nutrition] Error:', err.message);
    return res.status(502).json({ error: 'Failed to get meal suggestion. Please try again.' });
  }
});

// GET /api/nutrition/tip — daily nutrition tip
router.get('/tip', async (_req, res) => {
  try {
    const tip = await getNutritionTip();
    return res.json({ tip, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[nutrition tip] Error:', err.message);
    return res.status(502).json({ error: 'Failed to get nutrition tip. Please try again.' });
  }
});

module.exports = router;
