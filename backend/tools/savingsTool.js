const { getRate, BANK_SPREADS } = require('./fxTool');

// ── Format number in Indian notation: 1,23,456 ────────────────────────────
function formatINR(n) {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest  = s.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
}

// ── Main calculation function ─────────────────────────────────────────────
async function calculate(amount, currency, bankName = 'typical') {
  // 1. Get live interbank rate
  const fxData = await getRate(currency.toUpperCase(), 'INR');
  const interbankRate = fxData.rate;

  // 2. Find bank spread
  const normalizedBank = Object.keys(BANK_SPREADS).find(
    k => k.toLowerCase() === bankName.toLowerCase()
  ) || 'typical';
  const bankSpreadPct = BANK_SPREADS[normalizedBank] || 2.0;

  // 3. Calculate rates
  const paybridgeSpreadPct = 0.5;
  const bankRate       = interbankRate * (1 - bankSpreadPct / 100);
  const paybridgeRate  = interbankRate * (1 - paybridgeSpreadPct / 100);

  // 4. Calculate INR received
  const bankINR        = amount * bankRate;
  const paybridgeINR   = amount * paybridgeRate;
  const savingINR      = paybridgeINR - bankINR;
  const savingPct      = ((savingINR / bankINR) * 100).toFixed(2);

  return {
    invoice: {
      amount,
      currency: currency.toUpperCase(),
    },
    interbank_rate:    interbankRate,
    bank: {
      name:            normalizedBank,
      spread_pct:      bankSpreadPct,
      effective_rate:  parseFloat(bankRate.toFixed(4)),
      inr_received:    Math.round(bankINR),
      inr_formatted:   '₹' + formatINR(bankINR),
    },
    paybridge: {
      spread_pct:      paybridgeSpreadPct,
      effective_rate:  parseFloat(paybridgeRate.toFixed(4)),
      inr_received:    Math.round(paybridgeINR),
      inr_formatted:   '₹' + formatINR(paybridgeINR),
    },
    saving: {
      inr:             Math.round(savingINR),
      inr_formatted:   '₹' + formatINR(savingINR),
      percentage:      savingPct + '%',
    },
    settlement: {
      bank_days:       '3–5 business days',
      paybridge_days:  '1–2 business days',
    },
    rate_source: fxData.source,
    calculated_at: new Date().toISOString(),
  };
}

module.exports = { calculate, formatINR };
