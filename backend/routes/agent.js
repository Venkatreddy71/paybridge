const express = require('express');
const router  = express.Router();
const { runAgent } = require('../../agent/agent');

// POST /api/agent/chat
// Body: { messages: [{role, content}] }
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Validate message format
    const valid = messages.every(m =>
      m.role && m.content &&
      ['user', 'assistant'].includes(m.role)
    );
    if (!valid) {
      return res.status(400).json({ error: 'Invalid message format. Each message needs role and content.' });
    }

    const result = await runAgent(messages);
    res.json({ success: true, ...result });

  } catch (err) {
    console.error('[Agent Route] Error:', err.message);
    res.status(500).json({
      error: 'Agent error',
      message: err.message,
    });
  }
});

module.exports = router;
