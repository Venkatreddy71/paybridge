require('dotenv').config();

const express = require('express');
const cors = require('cors');

const agentRoutes = require('./routes/agent');
const fxRoutes = require('./routes/fx');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ── Request logger ──────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/agent', agentRoutes);
app.use('/api/fx', fxRoutes);
app.use('/api/payment', paymentRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error handler ───────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\nPayBridge backend running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health\n`);
});
