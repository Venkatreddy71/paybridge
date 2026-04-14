import React, { useEffect, useRef, useState } from 'react';
import { FxRateCard }        from '../components/FxRateCard';
import { BankSpreadTable }   from '../components/BankSpreadTable';
import { SavingsCalculator } from '../components/SavingsCalculator';
import { ChatMessage }       from '../components/ChatMessage';
import { useChat }           from '../utils/useChat';

const SUGGESTIONS = [
  "I got a $10,000 invoice from a US client",
  "How much does HDFC charge on $25,000?",
  "Compare all banks for €15,000",
  "What is today's USD/INR rate?",
];

export default function App() {
  const { messages, loading, sendMessage, initChat } = useChat();
  const [input,          setInput]          = useState('');
  const [showSuggestions,setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => { initChat(); }, [initChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setShowSuggestions(false);
    sendMessage(msg);
  };

  return (
    <div style={S.page}>
      {/* Background */}
      <div style={S.bg} />

      <div style={S.shell}>
        {/* Header */}
        <header style={S.header}>
          <div style={S.logo}>
            <div style={S.logoMark}>PB</div>
            <div style={S.logoText}>Pay<span style={{ color:'#0FC98A' }}>Bridge</span></div>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={S.liveDot}>Live rates</div>
            <div style={S.tag}>PayBridge Demo · April 14</div>
          </div>
        </header>

        <div style={S.body}>
          {/* Left panel */}
          <div style={S.left}>
            <FxRateCard currency="USD" />
            <BankSpreadTable />
            <SavingsCalculator onResult={() => setShowSuggestions(false)} />
          </div>

          {/* Chat panel */}
          <div style={S.chat}>
            {/* Chat header */}
            <div style={S.chatHeader}>
              <div style={S.agentAvatar}>🤖</div>
              <div>
                <div style={S.agentName}>PayBridge AI Assistant</div>
                <div style={S.agentStatus}>
                  <span style={S.statusDot} />
                  Online · powered by Venkat
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={S.messages}>
              {messages.map(m => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {loading && (
                <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
                  <div style={{ ...S.agentAvatar, width:30, height:30 }}>🤖</div>
                  <div style={S.typingBubble}>
                    <span style={S.dot} /><span style={{ ...S.dot, animationDelay:'.2s' }} /><span style={{ ...S.dot, animationDelay:'.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div style={S.suggestions}>
                {SUGGESTIONS.map(s => (
                  <button key={s} style={S.chip} onClick={() => handleSend(s)}>{s}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={S.inputArea}>
              <textarea
                ref={inputRef}
                style={S.textarea}
                rows={1}
                placeholder="Ask about your invoice, FX rate, or bank charges..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <button style={S.sendBtn} onClick={() => handleSend()} disabled={!input.trim() || loading}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'DM Sans',sans-serif; background:#0B1C3F; color:#fff; }
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(15,201,138,.4)} 50%{opacity:.7;box-shadow:0 0 0 4px rgba(15,201,138,0)} }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        textarea { resize:none; scrollbar-width:thin; }
        select option { background:#142352; color:#fff; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
      `}</style>
    </div>
  );
}

const S = {
  page:        { minHeight:'100vh', position:'relative', overflow:'hidden' },
  bg:          { position:'fixed', inset:0, background:'radial-gradient(ellipse 60% 50% at 10% 20%,rgba(27,79,216,.18) 0%,transparent 60%),radial-gradient(ellipse 40% 60% at 90% 80%,rgba(13,158,117,.12) 0%,transparent 60%)', pointerEvents:'none', zIndex:0 },
  shell:       { position:'relative', zIndex:1, maxWidth:1100, margin:'0 auto', padding:'0 20px 40px' },
  header:      { padding:'24px 0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.08)', marginBottom:24 },
  logo:        { display:'flex', alignItems:'center', gap:12 },
  logoMark:    { width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#2E6BFF,#0FC98A)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, boxShadow:'0 0 20px rgba(46,107,255,.4)' },
  logoText:    { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, letterSpacing:'-0.3px' },
  liveDot:     { display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#0FC98A', background:'rgba(13,158,117,0.1)', border:'1px solid rgba(13,158,117,0.25)', padding:'4px 12px', borderRadius:20 },
  tag:         { fontSize:12, color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.1)', padding:'4px 12px', borderRadius:20 },
  body:        { display:'grid', gridTemplateColumns:'300px 1fr', gap:24 },
  left:        { display:'flex', flexDirection:'column', gap:16 },
  chat:        { display:'flex', flexDirection:'column', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, overflow:'hidden', maxHeight:'calc(100vh - 120px)' },
  chatHeader:  { padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:12 },
  agentAvatar: { width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#1B4FD8,#0D9E75)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 },
  agentName:   { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14 },
  agentStatus: { fontSize:11, color:'#0FC98A', display:'flex', alignItems:'center', gap:4 },
  statusDot:   { width:5, height:5, borderRadius:'50%', background:'#0FC98A', display:'inline-block', animation:'pulse 2s infinite' },
  messages:    { flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:14 },
  typingBubble:{ padding:'12px 16px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, borderBottomLeftRadius:4, display:'flex', gap:4, alignItems:'center' },
  dot:         { width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.4)', display:'inline-block', animation:'bounce 1.2s infinite' },
  suggestions: { padding:'12px 20px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:8, flexWrap:'wrap' },
  chip:        { fontSize:12, padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, cursor:'pointer', color:'rgba(255,255,255,0.7)', transition:'all .2s', whiteSpace:'nowrap' },
  inputArea:   { padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:10, alignItems:'flex-end' },
  textarea:    { flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 16px', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:13.5, outline:'none', maxHeight:100 },
  sendBtn:     { width:42, height:42, borderRadius:10, background:'linear-gradient(135deg,#1B4FD8,#2E6BFF)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 15px rgba(27,79,216,.4)', flexShrink:0 },
};
