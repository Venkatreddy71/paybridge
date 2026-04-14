import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// ── FX ────────────────────────────────────────────────────────────────────
export const fetchRate = (from = 'USD', to = 'INR') =>
  api.get(`/fx/rate?from=${from}&to=${to}`).then(r => r.data.data);

export const fetchBanks = () =>
  api.get('/fx/banks').then(r => r.data.data);

// ── Payments ──────────────────────────────────────────────────────────────
export const calculateSavings = (amount, currency, bankName) =>
  api.post('/payment/calculate', { amount, currency, bankName }).then(r => r.data.data);

export const compareBanks = (amount, currency) =>
  api.post('/payment/compare-banks', { amount, currency }).then(r => r.data.data);

export const getPaymentStatus = (id = 'latest') =>
  api.get(`/payment/status/${id}`).then(r => r.data.data);

// ── Agent ─────────────────────────────────────────────────────────────────
export const chatWithAgent = (messages) =>
  api.post('/agent/chat', { messages }).then(r => r.data);
