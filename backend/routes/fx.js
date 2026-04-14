const express = require('express');
const router  = express.Router();
const fxTool  = require('../tools/fxTool');

// GET /api/fx/rate?from=USD&to=INR
router.get('/rate', async (req, res) => {
  try {
    const from = (req.query.from || 'USD').toUpperCase();
    const to   = (req.query.to   || 'INR').toUpperCase();
    const data = await fxTool.getRate(from, to);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/fx/banks — return all bank spreads
router.get('/banks', (_req, res) => {
  const banks = Object.entries(fxTool.BANK_SPREADS)
    .filter(([name]) => name !== 'typical')
    .map(([name, spread]) => ({ name, spread_pct: spread }))
    .sort((a, b) => a.spread_pct - b.spread_pct);
  res.json({ success: true, data: banks });
});

module.exports = router;
