'use client';
import React, { useState } from 'react';
import { useCreateChatMutation, useAskWorkflowMutation } from '@/redux/slices/chat/chatApi';
import { useRouter } from 'next/navigation';

const truncateTitle = (text, n = 60) => {
  const s = text.trim().replace(/\s+/g, ' ');
  return s.length <= n ? s : s.slice(0, n).trim() + '…';
};

const MessageInput = ({ chatId, onOptimisticAdd, onRefetch, isAnalyzing, setIsAnalyzing }) => {
  const router = useRouter();
  const [text, setText] = useState('');
  const [creating, setCreating] = useState(false);
  const [createChat] = useCreateChatMutation();
  const [askWorkflow] = useAskWorkflowMutation();

  const handleSend = async (e) => {
    e?.preventDefault();
    const q = text.trim();
    if (!q) return;

    setText('');
    setIsAnalyzing(true); // ✅ disable input immediately

    const tempUserMsg = {
      _id: `tmp-user-${Date.now()}`,
      role: 'user',
      content: q,
      createdAt: new Date().toISOString(),
    };
    const tempAssistantMsg = {
      _id: `tmp-assistant-${Date.now()}`,
      role: 'assistant',
      content: 'Analyzing data...',
      createdAt: new Date().toISOString(),
    };

    onOptimisticAdd?.(tempUserMsg, tempAssistantMsg);

    try {
      let realChatId = chatId;

      if (!chatId || chatId === 'new') {
        setCreating(true);
        const title = truncateTitle(q, 60);
        const created = await createChat({ title }).unwrap();
        realChatId = created?._id || created?.id;
        if (realChatId) router.replace(`/chat/${realChatId}`);
      }

      await askWorkflow({ chatId: realChatId, question: q }).unwrap();
      await onRefetch?.();
    } catch (err) {
      console.error('Send failed', err);
    } finally {
      setCreating(false);
      setIsAnalyzing(false); // ✅ re-enable input when done
    }
  };

  const disabled = creating || isAnalyzing;

  return (
    <div className="p-6 border-t border-slate-700/50 bg-slate-800/40 backdrop-blur-xl flex-shrink-0">
      <form onSubmit={handleSend} className="max-w-5xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                isAnalyzing
                  ? 'Analyzing your question...'
                  : 'Ask about cricket data: teams, matches, trends...'
              }
              className="w-full bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200"
              style={{
                clipPath:
                  'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
              }}
              disabled={disabled}
            />
            {isAnalyzing && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold relative overflow-hidden group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              clipPath:
                'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
            }}
            disabled={disabled || !text.trim()}
          >
            <span className="relative z-10 flex items-center gap-2">
              {disabled ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isAnalyzing ? 'Analyzing' : 'Processing'}
                </>
              ) : (
                <>
                  Send
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
