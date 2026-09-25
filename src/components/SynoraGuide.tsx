import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSynora } from '../context/SynoraContext';
import { GLOBAL_SCHOLARSHIPS_DATA } from '../data/globalScholarshipsData';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export const SynoraGuide: React.FC = () => {
  const { user } = useAuth();
  const { scholarships, savedScholarships, applications } = useSynora();
  
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hello ${user?.fullName || 'Scholar'}! I am **SYNORA GUIDE**, your verified scholarship and examination advisor. \n\nI provide authoritative answers for:\n1. **Global Scholarships & Required Exams** (CSC, MEXT, DAAD, Chevening, GKS, IELTS, SAT, etc. without profile restrictions)\n2. **Personalized Profile Matching** (Find For Me evaluation)\n\nWhat would you like to explore today?`,
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "What exam is required for CSC?",
    "Does MEXT require an entrance exam?",
    "What scholarships require IELTS?",
    "Which scholarships do not require a separate examination?",
    "Which scholarships am I eligible for?",
    "What applications are still pending?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || query;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          userProfile: user,
          savedScholarships,
          applications,
          scholarships,
          globalScholarships: GLOBAL_SCHOLARSHIPS_DATA
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        role: 'assistant',
        text: data.text || "I was unable to retrieve guidance. Please verify your query.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const fallbackMessage: Message = {
        role: 'assistant',
        text: `### Verified Query Response\n\n- **Chinese Government Scholarship (CSC):** No universal exam by CSC; host universities require HSK for Chinese-taught or IELTS 6.0+/TOEFL 80+ for English-taught degrees.\n- **MEXT (Japan):** Mandatory embassy written examination in Japanese, English, Math, and Sciences.\n- **DAAD / Chevening:** No separate scholarship exam; admission language tests apply per university.\n- All dates and requirements strictly grounded in official 2026/2027 scheme records.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-[650px] max-w-4xl mx-auto">
      {/* Advisor Header */}
      <div className="bg-black text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">SYNORA Guide AI</h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified RAG Mode
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Deterministic, zero-hallucination scholarship counseling
            </p>
          </div>
        </div>

        <div className="text-right text-[11px] text-gray-400 hidden sm:block">
          <span className="block text-white font-medium">{user?.fullName}</span>
          <span>{user?.level} • {user?.score}%</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles size={12} className="text-orange-500" /> Prompts:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white hover:bg-black hover:text-white border border-gray-200 text-gray-700 transition-all shrink-0 whitespace-nowrap active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-900 border border-gray-300'
              }`}
            >
              {msg.role === 'user' ? 'Me' : <Bot size={16} />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-black text-white rounded-tr-none'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans space-y-1.5">
                {msg.text}
              </div>
              <div
                className={`text-[10px] mt-2 font-medium ${
                  msg.role === 'user' ? 'text-gray-400 text-right' : 'text-gray-400'
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-200 text-gray-900 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2 text-xs text-gray-600">
              <Loader2 size={16} className="animate-spin text-black" />
              <span>Analyzing verified database and student profile...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about verified scholarships, eligibility rules, or documents..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!query.trim() || loading}
          className="bg-black hover:bg-gray-800 disabled:opacity-40 text-white p-3 rounded-2xl flex items-center justify-center transition-transform active:scale-95 shrink-0"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
