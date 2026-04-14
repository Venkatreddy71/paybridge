const { getRate, BANK_SPREADS } = require('./fxTool');
const { formatINR } = require('./savingsTool');

async function compareAll(amount, currency) {
  const fxData        = await getRate(currency.toUpperCase(), 'INR');
  const interbankRate = fxData.rate;
  const paybridgeINR  = amount * interbankRate * (1 - 0.005);

  // Build comparison for every bank + PayBridge
  const comparisons = Object.entries(BANK_SPREADS)
    .filter(([name]) => name !== 'typical')
    .map(([bankName, spreadPct]) => {
      const bankINR   = amount * interbankRate * (1 - spreadPct / 100);
      const savingINR = paybridgeINR - bankINR;
      return {
        bank:           bankName,
        spread_pct:     spreadPct,
        inr_received:   Math.round(bankINR),
        inr_formatted:  '₹' + formatINR(bankINR),
        saving_vs_paybridge: {
          inr:       Math.round(savingINR),
          formatted: '₹' + formatINR(savingINR),
        },
      };
    })
    .sort((a, b) => b.inr_received - a.inr_received); // best rate first

  return {
    invoice:         { amount, currency: currency.toUpperCase() },
    interbank_rate:  interbankRate,
    paybridge: {
      inr_received:  Math.round(paybridgeINR),
      inr_formatted: '₹' + formatINR(paybridgeINR),
      spread_pct:    0.5,
    },
    banks:           comparisons,
    summary: {
      best_bank:     comparisons[0]?.bank,
      worst_bank:    comparisons[comparisons.length - 1]?.bank,
      max_saving_vs_worst: '₹' + formatINR(
        paybridgeINR - comparisons[comparisons.length - 1]?.inr_received
      ),
    },
    calculated_at: new Date().toISOString(),
  };
}

module.exports = { compareAll };
