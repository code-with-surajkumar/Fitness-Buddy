'use strict';

const { generateText } = require('./granite');

// ─── System persona ───────────────────────────────────────────────────────────

const SYSTEM_PERSONA = `You are Fitness Buddy, a friendly, knowledgeable, and motivating AI-powered health and fitness coach. 
You specialise in:
- Recommending home workouts and personalised exercise routines
- Providing daily motivation and mental wellness tips  
- Suggesting simple, nutritious, and budget-friendly meal ideas
- Building sustainable healthy habits and consistency

Tone: warm, encouraging, practical, and science-backed. Keep responses clear and actionable.
Always remind users to consult a doctor before starting any new exercise or diet programme if they have health conditions.`;

// ─── Conversation history store (in-memory, per session) ─────────────────────

/** @type {Map<string, Array<{role: string, content: string}>>} */
const sessions = new Map();

const MAX_HISTORY = 12; // keep last 12 turns per session

/**
 * Gets or creates a conversation history for a session.
 * @param {string} sessionId
 * @returns {Array<{role: string, content: string}>}
 */
function getHistory(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return sessions.get(sessionId);
}

/**
 * Clears the conversation history for a session.
 * @param {string} sessionId
 */
function clearHistory(sessionId) {
  sessions.delete(sessionId);
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

/**
 * Builds a Granite-compatible chat prompt from the conversation history.
 * Uses the <|system|>...<|user|>...<|assistant|> chat template.
 *
 * @param {Array<{role: string, content: string}>} history
 * @param {string} userMessage
 * @returns {string}
 */
function buildPrompt(history, userMessage) {
  let prompt = `<|system|>\n${SYSTEM_PERSONA}\n`;

  // Append prior turns
  for (const turn of history) {
    if (turn.role === 'user') {
      prompt += `<|user|>\n${turn.content}\n`;
    } else {
      prompt += `<|assistant|>\n${turn.content}\n`;
    }
  }

  // Append current user message and signal assistant turn
  prompt += `<|user|>\n${userMessage}\n<|assistant|>\n`;
  return prompt;
}

// ─── Main chat function ───────────────────────────────────────────────────────

/**
 * Processes a chat message for a given session and returns the AI response.
 *
 * @param {string} sessionId   - Unique session identifier
 * @param {string} userMessage - The user's message
 * @returns {Promise<{ reply: string, sessionId: string }>}
 */
async function chat(sessionId, userMessage) {
  const history = getHistory(sessionId);

  // Build prompt with conversation context
  const prompt = buildPrompt(history, userMessage);

  // Call IBM Granite
  const reply = await generateText(prompt);

  // Update history (trim to keep MAX_HISTORY turns)
  history.push({ role: 'user', content: userMessage });
  history.push({ role: 'assistant', content: reply });

  if (history.length > MAX_HISTORY * 2) {
    history.splice(0, 2); // remove oldest pair
  }

  return { reply, sessionId };
}

module.exports = { chat, clearHistory, getHistory };
