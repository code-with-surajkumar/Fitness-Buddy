'use strict';

const { generateText } = require('./granite');

// ─── Meal suggestion service ─────────────────────────────────────────────────

const DIET_LABELS = {
  none: 'no dietary restriction',
  vegetarian: 'vegetarian',
  vegan: 'vegan',
  glutenfree: 'gluten-free',
  dairyfree: 'dairy-free',
  keto: 'ketogenic (low-carb, high-fat)',
  highprotein: 'high-protein',
};

const MEAL_LABELS = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snack: 'healthy snack',
  mealplan: 'full-day meal plan',
};

// ─── Meal suggestion ──────────────────────────────────────────────────────────

/**
 * Generates a nutritious meal suggestion.
 *
 * @param {object} opts
 * @param {string} opts.mealType  - 'breakfast'|'lunch'|'dinner'|'snack'|'mealplan'
 * @param {string} opts.diet      - 'none'|'vegetarian'|'vegan'|'glutenfree'|etc.
 * @param {string} [opts.goal]    - fitness goal context (e.g. 'weight loss')
 * @param {number} [opts.calories]- target calorie range (optional)
 * @returns {Promise<string>}
 */
async function getMealSuggestion({ mealType, diet, goal, calories }) {
  const mealLabel = MEAL_LABELS[mealType] ?? mealType;
  const dietLabel = DIET_LABELS[diet] ?? diet;
  const goalLine = goal ? `\n- Fitness goal: ${goal}` : '';
  const calorieLine = calories ? `\n- Target calories: ~${calories} kcal` : '';

  const prompt = `<|system|>
You are Fitness Buddy, a friendly nutritionist and fitness coach.
Suggest simple, healthy, and delicious meals using everyday ingredients.
Include approximate macros (protein, carbs, fat) when possible.
<|user|>
Suggest a nutritious ${mealLabel} for someone with these preferences:
- Dietary preference: ${dietLabel}${goalLine}${calorieLine}

Format your response as:
🍽️ Meal Name
📝 Ingredients (with rough quantities)
👨‍🍳 Quick Preparation Steps (3–5 steps)
📊 Approx. Nutrition (calories, protein, carbs, fat)
💡 Why it's great for your goal

Keep it practical and easy to prepare in under 30 minutes.
<|assistant|>
`;

  return generateText(prompt, { max_new_tokens: 700 });
}

// ─── Nutrition tip of the day ──────────────────────────────────────────────────

/**
 * Returns a daily nutrition tip.
 * @returns {Promise<string>}
 */
async function getNutritionTip() {
  const prompt = `<|system|>
You are Fitness Buddy, a knowledgeable but approachable nutrition coach.
<|user|>
Share one practical, science-backed nutrition tip for today that helps with fitness and energy levels.
Keep it to 3–4 sentences. Make it actionable.
<|assistant|>
`;
  return generateText(prompt, { max_new_tokens: 180 });
}

module.exports = { getMealSuggestion, getNutritionTip };
