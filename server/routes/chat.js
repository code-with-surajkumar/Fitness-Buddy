'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { chat, clearHistory } = require('../services/chatService');

const router = express.Router();

// POST /api/chat — send a message and get a reply
router.post('/', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'message is required and must be a non-empty string.' });
  }

  // Use provided sessionId or generate a new one
  const sid = sessionId && typeof sessionId === 'string' ? sessionId : uuidv4();

  try {
    const result = await chat(sid, message.trim());
    return res.json({
      sessionId: sid,
      reply: result.reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[chat] Error:', err.message);
    return res.status(502).json({ error: 'Failed to get response from AI. Please try again.' });
  }
});

// DELETE /api/chat/:sessionId — clear conversation history
router.delete('/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  clearHistory(sessionId);
  return res.json({ message: 'Conversation history cleared.', sessionId });
});

module.exports = router;
