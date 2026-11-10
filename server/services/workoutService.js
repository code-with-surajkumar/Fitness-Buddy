'use strict';

const { generateText } = require('./granite');

// ─── Workout categories ───────────────────────────────────────────────────────

const GOAL_MAP = {
  weightloss: 'weight loss and fat burning',
  musclebuild: 'muscle building and strength',
  flexibility: 'flexibility and mobility',
  endurance: 'cardiovascular endurance and stamina',
  beginner: 'general beginner fitness and getting active',
  stress: 'stress relief and mental wellbeing through movement',
};

const LEVEL_MAP = {
  beginner: 'beginner (no experience)',
  intermediate: 'intermediate (6–12 months experience)',
  advanced: 'advanced (1+ years experience)',
};

const EQUIPMENT_MAP = {
  none: 'no equipment — bodyweight only',
  minimal: 'minimal equipment (resistance bands, dumbbells)',
  full: 'full home gym setup',
};

// ─── Workout recommendation ───────────────────────────────────────────────────

/**
 * Generates a personalised home workout plan.
 *
 * @param {object} opts
 * @param {string} opts.goal       - e.g. 'weightloss', 'musclebuild', 'flexibility'
 * @param {string} opts.level      - e.g. 'beginner', 'intermediate', 'advanced'
 * @param {string} opts.equipment  - e.g. 'none', 'minimal', 'full'
 * @param {number} [opts.duration] - Session duration in minutes (default: 30)
 * @param {string} [opts.focus]    - Optional body-part focus (e.g. 'core', 'upper body')
 * @returns {Promise<string>}
 */
async function getWorkoutPlan({ goal, level, equipment, duration = 30, focus }) {
  const goalDesc = GOAL_MAP[goal] ?? goal;
  const levelDesc = LEVEL_MAP[level] ?? level;
  const equipDesc = EQUIPMENT_MAP[equipment] ?? equipment;
  const focusLine = focus ? `\n- Target area: ${focus}` : '';

  const prompt = `<|system|>
You are Fitness Buddy, a certified virtual fitness coach specialising in home workouts.
Create practical, safe, and motivating workout plans with clear instructions.
<|user|>
Create a detailed ${duration}-minute home workout plan with the following profile:
- Goal: ${goalDesc}
- Fitness level: ${levelDesc}
- Available equipment: ${equipDesc}${focusLine}

Format your response with:
1. A brief warm-up (5 min)
2. Main workout (numbered exercises with sets, reps/duration, and rest periods)
3. Cool-down stretches (3–5 min)
4. One motivational closing note

Keep exercises simple and clearly explained.
<|assistant|>
`;

  return generateText(prompt, { max_new_tokens: 800 });
}

// ─── Quick daily workout tip ──────────────────────────────────────────────────

/**
 * Returns a quick workout tip or micro-challenge of the day.
 * @returns {Promise<string>}
 */
async function getDailyWorkoutTip() {
  const prompt = `<|system|>
You are Fitness Buddy, an enthusiastic fitness coach.
<|user|>
Give me one quick, energising home workout challenge or exercise tip for today. 
Keep it to 3–5 sentences. Make it fun and doable in under 10 minutes.
<|assistant|>
`;
  return generateText(prompt, { max_new_tokens: 200 });
}

module.exports = { getWorkoutPlan, getDailyWorkoutTip };
