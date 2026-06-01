import { useState, useRef, useEffect } from 'react';
import { listings } from '../data.js';

const WELCOME = '안녕하세요! 원하시는 매물을 말씀해 주세요.\n예) "500만원 이하 제트스키", "부산 근처 낚시보트", "인증된 요트 찾아줘"';

export default function ChatBot({ onSelectListings, onClose, visible }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: WELCOME }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [visible]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          listings: listings.map(l => ({
            id: l.id, category: l.category, title: l.title,
            price: l.price, location: l.location, hours: l.hours,
            badges: l.badges, score: l.score,
          })),
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.message, listingIds: data.listingIds }]);

      if (data.listingIds?.length > 0) {
        onSelectListings(data.listingIds);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '오류가 발생했습니다. 다시 시도해 주세요.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className={`chatbot-wrap${visible ? ' open' : ''}`}>
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <span className="chatbot-icon">🤖</span>
          <div>
            <div className="chatbot-title">모두 AI 매물 추천</div>
            <div className="chatbot-sub">원하는 조건을 말씀해 주세요</div>
          </div>
        </div>
        <button className="chatbot-close" onClick={onClose} aria-label="닫기">✕</button>
      </div>

      <div className="chatbot-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            <div className="chat-text">{m.text}</div>
            {m.listingIds?.length > 0 && (
              <div className="chat-result-hint">
                매물 {m.listingIds.length}건을 찾았어요 ↓ 아래에서 확인하세요
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble bot">
            <div className="chat-loading">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chatbot-input-row">
        <input
          ref={inputRef}
          className="chatbot-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="예) 500만원 이하 제트스키"
          disabled={loading}
        />
        <button
          className="chatbot-send"
          onClick={send}
          disabled={!input.trim() || loading}
          aria-label="전송"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
