import React, { useState } from 'react';
import { calculateSavings } from '../utils/api';

const BANKS = [
  { label: 'SBI',            value: 'SBI' },
  { label: 'HDFC Bank',      value: 'HDFC' },
  { label: 'ICICI Bank',     value: 'ICICI' },
  { label: 'Axis Bank',      value: 'Axis' },
  { label: 'Kotak Bank',     value: 'Kotak' },
  { label: 'Yes Bank',       value: 'Yes Bank' },
  { label: 'Bank of Baroda', value: 'Bank of Baroda' },
  { label: 'Canara Bank',    value: 'Canara' },
];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'SGD'];

export function SavingsCalculator({ onResult }) {
  const [amount,  setAmount]  = useState('');
  const [currency,setCurrency]= useState('USD');
  const [bank,    setBank]    = useState('');
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    if (!amount || !bank) return;
    setLoading(true);
    try {
      const data = await calculateSavings(parseFloat(amount), currency, bank);
      setResult(data);
      if (onResult) onResult(data);
    } catch (err) {
      console.error('Calculation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.wrap}>
      <div style={S.label}>Quick calculator</div>
      <div style={S.row}>
        <select style={S.csel} value={currency} onChange={e => setCurrency(e.target.value)}>
          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" style={S.input} placeholder="Invoice amount"
          value={amount} onChange={e => setAmount(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && calculate()} min="0" />
      </div>
      <select style={S.bsel} value={bank} onChange={e => setBank(e.target.value)}>
        <option value="">Select your bank</option>
        {BANKS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
      </select>
      <button style={{ ...S.btn, opacity: (!amount || !bank || loading) ? 0.5 : 1 }}
        onClick={calculate} disabled={!amount || !bank || loading}>
        {loading ? 'Calculating...' : 'Calculate savings →'}
      </button>
      {result && (
        <div style={S.result}>
          <div style={S.rrow}>
            <span style={S.rl}>Your bank gives</span>
            <span style={{ ...S.rv, color: '#E84545' }}>{result.bank.inr_formatted}</span>
          </div>
          <div style={S.rrow}>
            <span style={S.rl}>PayBridge gives</span>
            <span style={{ ...S.rv, color: '#0FC98A' }}>{result.paybridge.inr_formatted}</span>
          </div>
          <div style={S.sbox}>
            <div style={S.samt}>{result.saving.inr_formatted}</div>
            <div style={S.slbl}>you save with PayBridge</div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  wrap:  { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:20 },
  label: { fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.35)', marginBottom:14, fontWeight:500 },
  row:   { display:'flex', gap:8, marginBottom:10 },
  csel:  { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 12px', color:'#fff', fontSize:13, outline:'none', cursor:'pointer', fontFamily:"'Syne',sans-serif", fontWeight:700 },
  input: { flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 12px', color:'#fff', fontSize:16, outline:'none', fontFamily:"'Syne',sans-serif", fontWeight:700 },
  bsel:  { width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 12px', color:'rgba(255,255,255,0.7)', fontSize:13, outline:'none', cursor:'pointer', marginBottom:12 },
  btn:   { width:'100%', background:'linear-gradient(135deg,#1B4FD8,#2E6BFF)', border:'none', borderRadius:10, padding:12, color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:'0 4px 20px rgba(27,79,216,0.35)' },
  result:{ marginTop:14, padding:14, background:'rgba(13,158,117,0.08)', border:'1px solid rgba(13,158,117,0.2)', borderRadius:12 },
  rrow:  { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 },
  rl:    { color:'rgba(255,255,255,0.5)' },
  rv:    { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14 },
  sbox:  { marginTop:12, padding:10, background:'rgba(13,158,117,0.12)', borderRadius:8, textAlign:'center' },
  samt:  { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:'#0FC98A' },
  slbl:  { fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 },
};
