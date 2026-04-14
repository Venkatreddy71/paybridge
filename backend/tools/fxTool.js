const axios = require('axios');

// ── Bank spread data ──────────────────────────────────────────────────────
const BANK_SPREADS = {
  'SBI':             2.3,
  'HDFC':            2.1,
  'HDFC Bank':       2.1,
  'ICICI':           1.9,
  'ICICI Bank':      1.9,
  'Axis':            1.8,
  'Axis Bank':       1.8,
  'Kotak':           1.7,
  'Kotak Bank':      1.7,
  'Yes Bank':        2.0,
  'Yes':             2.0,
  'Bank of Baroda':  2.1,
  'Canara':          2.2,
  'Canara Bank':     2.2,
  'Union Bank':      2.2,
  'IndusInd':        1.8,
  'Federal':         2.0,
  'typical':         2.0,
};

// Cache rate for 60 seconds to avoid excessive API calls
let rateCache = {};

async function getRate(fromCurrency = 'USD', toCurrency = 'INR') {
  const cacheKey = `${fromCurrency}_${toCurrency}`;
  const now = Date.now();

  // Return cached rate if fresh
  if (rateCache[cacheKey] && now - rateCache[cacheKey].fetchedAt < 60000) {
    console.log(`[FX Tool] Using cached rate: ${fromCurrency}/${toCurrency}`);
    return rateCache[cacheKey].data;
  }

  try {
    const appId = process.env.OPENEXCHANGE_APP_ID;
    let rate;

    if (appId && appId !== 'your_openexchangerates_app_id_here') {
      // Use Open Exchange Rates API (requires free account)
      const url = `https://openexchangerates.org/api/latest.json?app_id=${appId}&symbols=${toCurrency}&base=${fromCurrency}`;
      const res = await axios.get(url, { timeout: 5000 });
      rate = res.data.rates[toCurrency];
    } else {
      // Fallback: use free no-auth API
      const url = `https://open.er-api.com/v6/latest/${fromCurrency}`;
      const res = await axios.get(url, { timeout: 5000 });
      rate = res.data.rates[toCurrency];
    }

    if (!rate) throw new Error('Rate not found in response');

    const result = {
      from:       fromCurrency,
      to:         toCurrency,
      rate:       parseFloat(rate.toFixed(4)),
      source:     'Open Exchange Rates (interbank)',
      fetched_at: new Date().toISOString(),
      note:       'This is the interbank (wholesale) rate. Banks add 1.5–2.5% on top.',
    };

    rateCache[cacheKey] = { data: result, fetchedAt: now };
    console.log(`[FX Tool] Live rate fetched: ${fromCurrency}/${toCurrency} = ${rate}`);
    return result;

  } catch (err) {
    console.warn('[FX Tool] API failed, using fallback rates:', err.message);

    // Fallback rates (updated manually)
    const FALLBACK = { USD: 83.82, EUR: 90.15, GBP: 105.40, AED: 22.82, SGD: 62.10 };
    const fallbackRate = FALLBACK[fromCurrency] || 83.82;

    return {
      from:       fromCurrency,
      to:         toCurrency,
      rate:       fallbackRate,
      source:     'Fallback reference rate',
      fetched_at: new Date().toISOString(),
      note:       'Live API unavailable. Using reference rate.',
    };
  }
}

module.exports = { getRate, BANK_SPREADS };
