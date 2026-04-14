import React from 'react';
import { useFxRate } from '../utils/useFxRate';

export function FxRateCard({ currency = 'USD' }) {
  const { rate, loading, lastFetch } = useFxRate(currency, 'INR');

  return (
    <div style={styles.card}>
      <div style={styles.label}>Live interbank rate</div>

      {loading && !rate ? (
        <div style={styles.loading}>Fetching live rate...</div>
      ) : (
        <>
          <div style={styles.pair}>{currency} / INR</div>
          <div style={styles.rateRow}>
            <span style={styles.rateWhole}>
              {Math.floor(rate?.rate || 0)}
            </span>
            <span style={styles.rateDec}>
              {((rate?.rate || 0) % 1).toFixed(2).substring(1)}
            </span>
          </div>
          <div style={styles.source}>{rate?.source}</div>
          {lastFetch && (
            <div style={styles.updated}>
              <span style={styles.dot} /> Updated {lastFetch.toLocaleTimeString()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 10, textTransform: 'uppercase',
    letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)',
    marginBottom: 12, fontWeight: 500,
  },
  pair: {
    fontSize: 12, color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.05em', marginBottom: 6,
  },
  rateRow: { display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 1 },
  rateWhole: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800,
    fontSize: 38, color: '#fff', letterSpacing: -1,
  },
  rateDec: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 22, color: '#0FC98A',
  },
  source: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 },
  updated: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 5, fontSize: 11, color: '#0FC98A',
    marginTop: 8,
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#0FC98A', display: 'inline-block',
    animation: 'pulse 2s infinite',
  },
  loading: { color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '20px 0' },
};
