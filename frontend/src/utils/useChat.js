import { useState, useCallback } from 'react';
import { chatWithAgent } from '../utils/api';

export function useChat() {
  const [messages,  setMessages]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  // Add initial welcome message
  const initChat = useCallback(() => {
    setMessages([{
      id:   'welcome',
      role: 'assistant',
      text: "Namaste! I'm your PayBridge AI assistant.\n\nI help Indian SME exporters stop losing money to hidden bank FX charges. Tell me your invoice amount and which bank you use — I'll show you exactly how much your bank takes silently. 💸",
      timestamp: new Date(),
    }]);
  }, []);

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || loading) return;

    // Add user message to UI immediately
    const userMsg = {
      id:        Date.now() + '-user',
      role:      'user',
      text:      userText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      // Build history for API (only user/assistant messages, no welcome)
      const history = [...messages, userMsg]
        .filter(m => ['user', 'assistant'].includes(m.role) && m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.text }));

      const result = await chatWithAgent(history);

      const agentMsg = {
        id:          Date.now() + '-agent',
        role:        'assistant',
        text:        result.message,
        toolResults: result.toolResults || [],
        timestamp:   new Date(),
      };

      setMessages(prev => [...prev, agentMsg]);

    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, {
        id:        Date.now() + '-error',
        role:      'assistant',
        text:      'Sorry, I had trouble connecting. Please check your backend is running and try again.',
        timestamp: new Date(),
        isError:   true,
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const clearChat = useCallback(() => {
    initChat();
    setError(null);
  }, [initChat]);

  return { messages, loading, error, sendMessage, initChat, clearChat };
}
