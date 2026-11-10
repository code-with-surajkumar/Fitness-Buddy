'use strict';

require('dotenv').config();
const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');

// ─── IBM Granite client (watsonx.ai) ────────────────────────────────────────

let watsonxClient = null;

/**
 * Lazily initialises and returns the watsonx.ai client.
 * Authentication is done via IBM Cloud IAM API key.
 */
function getWatsonxClient() {
  if (!watsonxClient) {
    if (!process.env.IBM_API_KEY || !process.env.IBM_WATSONX_URL) {
      throw new Error(
        'IBM_API_KEY and IBM_WATSONX_URL must be set in your .env file.'
      );
    }

    watsonxClient = WatsonXAI.newInstance({
      version: '2024-05-31',
      serviceUrl: process.env.IBM_WATSONX_URL,
    });
  }
  return watsonxClient;
}

// ─── Generation parameters ───────────────────────────────────────────────────

const DEFAULT_PARAMS = {
  max_new_tokens: parseInt(process.env.AI_MAX_NEW_TOKENS ?? '600', 10),
  temperature: parseFloat(process.env.AI_TEMPERATURE ?? '0.75'),
  top_p: parseFloat(process.env.AI_TOP_P ?? '0.9'),
  top_k: parseInt(process.env.AI_TOP_K ?? '50', 10),
  repetition_penalty: parseFloat(process.env.AI_REPETITION_PENALTY ?? '1.1'),
};

const MODEL_ID =
  process.env.IBM_GRANITE_MODEL_ID ?? 'ibm/granite-13b-chat-v2';

const PROJECT_ID = process.env.IBM_WATSONX_PROJECT_ID;

// ─── Core generation function ─────────────────────────────────────────────────

/**
 * Sends a prompt to IBM Granite and returns the generated text.
 *
 * @param {string} prompt   - Full prompt string to send
 * @param {object} [params] - Optional generation parameter overrides
 * @returns {Promise<string>}
 */
async function generateText(prompt, params = {}) {
  const client = getWatsonxClient();

  const response = await client.generateText({
    input: prompt,
    modelId: MODEL_ID,
    projectId: PROJECT_ID,
    parameters: { ...DEFAULT_PARAMS, ...params },
  });

  const result = response.result;

  if (result?.results?.[0]?.generated_text) {
    return result.results[0].generated_text.trim();
  }

  throw new Error('Unexpected response structure from watsonx.ai');
}

// ─── Health-check (verifies connectivity without consuming many tokens) ───────

async function pingGranite() {
  const text = await generateText('Hello', { max_new_tokens: 10 });
  return { status: 'ok', model: MODEL_ID, sample: text };
}

module.exports = { generateText, pingGranite };
