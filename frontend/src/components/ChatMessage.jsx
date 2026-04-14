import React from 'react';

export function ChatMessage({ message }) {
  const isAgent = message.role === 'assistant';

  const savingsResult = message.toolResults?.find(
    t => t.toolName === 'calculate_savings' && t.result?.saving
  )?.result;

  const comparisonResult = message.toolResults?.find(
    t => t.toolName === 'compare_all_banks' && t.result?.banks
  )?.result;

  return (
    <div style={{ ...S.wrap, flexDirection: isAgent ? 'row' : 'row-reverse' }}>
      <div style={{ ...S.avatar, background: isAgent ? 'linear-gradient(135deg,#1B4FD8,#0D9E75)' : 'rgba(255,255,255,0.1)' }}>
        {isAgent ? '🤖' : '👤'}
      </div>
      <div style={{ ...S.bubble, ...(isAgent ? S.agentBubble : S.userBubble) }}>
        <div style={S.text} dangerouslySetInnerHTML={{
          __html: message.text
            .replace(/\n/g, '<br/>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        }} />
        {savingsResult    && <SavingsCard    data={savingsResult} />}
        {comparisonResult && <BanksCard      data={comparisonResult} />}
        <div style={S.time}>
          {message.timestamp?.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
        </div>
      </div>
    </div>
  );
}

function SavingsCard({ data }) {
  return (
    <div style={C.card}>
      <div style={C.header}>
        Payment breakdown — {data.invoice?.currency} {data.invoice?.amount?.toLocaleString()}
      </div>
      <div style={C.body}>
        <Row label="Interbank rate"     value={`₹${data.interbank_rate?.toFixed(2)} / ${data.invoice?.currency}`} />
        <Row label={`${data.bank?.name} rate (−${data.bank?.spread_pct}%)`} value={data.bank?.inr_formatted}        color="#E84545" />
        <Row label="PayBridge rate (−0.5%)"                                  value={data.paybridge?.inr_formatted}    color="#0FC98A" bold />
        <div style={C.banner}>
          <div>
            <div style={C.bannerLbl}>You save with PayBridge</div>
            <div style={C.bannerTag}>Settles in {data.settlement?.paybridge_days}</div>
          </div>
          <div style={C.bannerAmt}>{data.saving?.inr_formatted}</div>
        </div>
      </div>
    </div>
  );
}

function BanksCard({ data }) {
  return (
    <div style={C.card}>
      <div style={C.header}>All banks — {data.invoice?.currency} {data.invoice?.amount?.toLocaleString()}</div>
      <div style={C.body}>
        <div style={{ ...C.brow, background:'rgba(13,158,117,0.1)', borderRadius:6, padding:'6px 8px', marginBottom:4 }}>
          <span style={{ color:'#0FC98A', fontWeight:700, fontSize:13 }}>PayBridge ★</span>
          <span style={{ color:'#0FC98A', fontWeight:700, fontSize:13 }}>{data.paybridge?.inr_formatted}</span>
        </div>
        {data.banks?.slice(0,6).map(b => (
          <div key={b.bank} style={C.brow}>
            <span style={{ color:'rgba(255,255,255,0.6)', fontSize:12 }}>{b.bank} (−{b.spread_pct}%)</span>
            <div style={{ textAlign:'right' }}>
              <div style={{ color:'rgba(255,255,255,0.8)', fontSize:12 }}>{b.inr_formatted}</div>
              <div style={{ color:'#E84545', fontSize:11 }}>−{b.saving_vs_paybridge?.formatted}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, color, bold }) {
  return (
    <div style={C.row}>
      <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>{label}</span>
      <span style={{ color: color || 'rgba(255,255,255,0.8)', fontWeight: bold ? 700 : 500, fontSize:13 }}>{value}</span>
    </div>
  );
}

const S = {
  wrap:       { display:'flex', gap:10 },
  avatar:     { width:30, height:30, borderRadius:8, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, alignSelf:'flex-end' },
  bubble:     { maxWidth:'78%', padding:'12px 16px', borderRadius:16, fontSize:13.5, lineHeight:1.6 },
  agentBubble:{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderBottomLeftRadius:4, color:'rgba(255,255,255,0.9)' },
  userBubble: { background:'linear-gradient(135deg,#1B4FD8,#2E6BFF)', borderBottomRightRadius:4, color:'#fff' },
  text:       { marginBottom:4 },
  time:       { fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:6, textAlign:'right' },
};
const C = {
  card:      { marginTop:12, background:'rgba(11,28,63,0.6)', border:'1px solid rgba(27,79,216,0.3)', borderRadius:14, overflow:'hidden' },
  header:    { padding:'10px 14px', background:'rgba(27,79,216,0.15)', fontWeight:700, fontSize:11, color:'#2E6BFF', textTransform:'uppercase', letterSpacing:'0.05em' },
  body:      { padding:14 },
  row:       { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' },
  banner:    { marginTop:12, padding:'10px 14px', background:'rgba(13,158,117,0.15)', border:'1px solid rgba(13,158,117,0.3)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'space-between' },
  bannerLbl: { fontSize:12, color:'rgba(255,255,255,0.5)' },
  bannerTag: { fontSize:11, color:'#0FC98A', marginTop:3 },
  bannerAmt: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:'#0FC98A' },
  brow:      { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' },
};
