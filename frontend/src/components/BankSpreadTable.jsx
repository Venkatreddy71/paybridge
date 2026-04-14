import React from 'react';

const BANKS = [
  { name:'SBI',            spread:2.3 },
  { name:'HDFC Bank',      spread:2.1 },
  { name:'ICICI Bank',     spread:1.9 },
  { name:'Axis Bank',      spread:1.8 },
  { name:'Kotak Bank',     spread:1.7 },
  { name:'PayBridge',      spread:0.5, isUs:true },
];

export function BankSpreadTable() {
  return (
    <div style={S.wrap}>
      <div style={S.label}>Bank FX spreads (typical)</div>
      {BANKS.map(b => (
        <div key={b.name} style={{ ...S.row, background: b.isUs ? 'rgba(13,158,117,0.06)' : 'transparent' }}>
          <span style={{ ...S.name, color: b.isUs ? '#0FC98A' : 'rgba(255,255,255,0.7)', fontWeight: b.isUs ? 600 : 400 }}>
            {b.name}{b.isUs ? ' ★' : ''}
          </span>
          <span style={{ ...S.spread, color: b.isUs ? '#0FC98A' : '#E84545' }}>
            −{b.spread}%
          </span>
        </div>
      ))}
    </div>
  );
}

const S = {
  wrap:   { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:20 },
  label:  { fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.35)', marginBottom:12, fontWeight:500 },
  row:    { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 6px', borderBottom:'1px solid rgba(255,255,255,0.05)', borderRadius:6 },
  name:   { fontSize:13 },
  spread: { fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:13 },
};
