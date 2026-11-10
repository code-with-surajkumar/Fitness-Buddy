'use strict';

const { generateText } = require('./granite');

// ─── Motivation categories ────────────────────────────────────────────────────

const MOTIVATION_CONTEXTS = [
  'starting a new fitness journey',
  'getting back on track after a break',
  'pushing through a workout plateau',
  'staying consistent during a busy week',
  'celebrating a small fitness win',
  'overcoming self-doubt about fitness',
  'building a morning workout habit',
  'finding balance between rest and training',
];

// ─── Daily motivation ──────────────────────────────────────────────────────────

/**
 * Generates a personalised motivational message.
 *
 * @param {object} [opts]
 * @param {string} [opts.context] - Optional context (e.g. 'feeling tired today')
 * @param {string} [opts.name]    - Optional user's name for personalisation
 * @returns {Promise<string>}
 */
async function getMotivation({ context, name } = {}) {
  const randomCtx =
    MOTIVATION_CONTEXTS[Math.floor(Math.random() * MOTIVATION_CONTEXTS.length)];

  const contextLine = context
    ? `The user says: "${context}"`
    : `Context: ${randomCtx}`;

  const nameLine = name ? `Address the user as ${name}.` : '';

  const prompt = `<|system|>
You are Fitness Buddy, an uplifting and empathetic fitness coach.
Your motivational messages are genuine, concise, and action-oriented — not generic platitudes.
<|user|>
${contextLine}
${nameLine}
Write a short motivational message (4–6 sentences) to inspire them to take action today.
End with one concrete, tiny action they can take RIGHT NOW.
<|assistant|>
`;

  return generateText(prompt, { max_new_tokens: 250 });
}

// ─── Habit tip ────────────────────────────────────────────────────────────────

/**
 * Returns a habit-building tip for consistency.
 * @param {string} [area] - 'exercise'|'nutrition'|'sleep'|'mindset'
 * @returns {Promise<string>}
 */
async function getHabitTip(area = 'exercise') {
  const prompt = `<|system|>
You are Fitness Buddy, a habit coach who helps people build sustainable healthy routines.
<|user|>
Give one specific, practical habit-building tip for improving consistency with ${area}.
Include a simple implementation strategy using the habit-stacking or 2-minute rule principle.
Keep it to 4–5 sentences.
<|assistant|>
`;
  return generateText(prompt, { max_new_tokens: 200 });
}

// ─── Weekly check-in ──────────────────────────────────────────────────────────

/**
 * Generates a personalised weekly fitness check-in and advice.
 *
 * @param {object} opts
 * @param {number} opts.workoutsCompleted - workouts done this week
 * @param {number} opts.workoutsPlanned   - workouts planned this week
 * @param {string} [opts.challenge]       - biggest challenge faced
 * @returns {Promise<string>}
 */
async function getWeeklyCheckIn({ workoutsCompleted, workoutsPlanned, challenge }) {
  const ratio = workoutsPlanned > 0
    ? Math.round((workoutsCompleted / workoutsPlanned) * 100)
    : 0;

  const challengeLine = challenge
    ? `Their biggest challenge this week: "${challenge}"`
    : '';

  const prompt = `<|system|>
You are Fitness Buddy, a supportive fitness coach doing a weekly review.
<|user|>
Weekly check-in for a fitness buddy user:
- Completed ${workoutsCompleted} out of ${workoutsPlanned} planned workouts (${ratio}% completion)
${challengeLine}

Give a warm, non-judgmental 4–6 sentence check-in response:
1. Acknowledge their effort (whether high or low completion)
2. Address their challenge if provided
3. Give one specific tip for next week
4. End with an encouraging commitment question
<|assistant|>
`;

  return generateText(prompt, { max_new_tokens: 300 });
}

module.exports = { getMotivation, getHabitTip, getWeeklyCheckIn };
