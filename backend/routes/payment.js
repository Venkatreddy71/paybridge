const express     = require('express');
const router      = express.Router();
const savingsTool = require('../tools/savingsTool');
const banksTool   = require('../tools/banksTool');
const paymentTool = require('../tools/paymentTool');

// POST /api/payment/calculate
// Body: { amount, currency, bankName }
router.post('/calculate', async (req, res) => {
  try {
    const { amount, currency, bankName } = req.body;
    if (!amount || !currency) {
      return res.status(400).json({ error: 'amount and currency are required' });
    }
    const result = await savingsTool.calculate(
      parseFloat(amount), currency, bankName || 'typical'
    );
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/compare-banks
// Body: { amount, currency }
router.post('/compare-banks', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || !currency) {
      return res.status(400).json({ error: 'amount and currency are required' });
    }
    const result = await banksTool.compareAll(parseFloat(amount), currency);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payment/status/:id
router.get('/status/:id', (req, res) => {
  const result = paymentTool.getStatus(req.params.id);
  res.json({ success: true, data: result });
});

module.exports = router;
