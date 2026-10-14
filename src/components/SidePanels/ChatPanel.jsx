import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMeeting } from '../../context/MeetingContext';
import { MessageSquare, X, Send, Lock, Smile } from 'lucide-react';

export default function ChatPanel() {
  const { t } = useLanguage();
  const { messages, sendChatMessage, setActiveSidePanel, localUser } = useMeeting();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleQuickEmoji = (emoji) => {
    sendChatMessage(emoji);
  };

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-mirqam-teal" />
          <h3 className="font-bold text-sm">{t('chat')}</h3>
        </div>
        <button
          onClick={() => setActiveSidePanel(null)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Security Privacy Notice */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <Lock className="w-3.5 h-3.5 text-mirqam-teal shrink-0 mt-0.5" />
        <span>تظهر رسائل المحادثة فقط للمشاركين أثناء المكالمة وتُمسح تلقائياً عند المغادرة.</span>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderName === localUser.name;

          if (msg.system) {
            return (
              <div key={msg.id} className="p-2.5 rounded-xl bg-mirqam-teal/10 border border-mirqam-teal/20 text-center text-xs text-mirqam-teal dark:text-mirqam-teal-light">
                {msg.text}
              </div>
            );
          }

          return (
            <div 
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {isMe ? t('you') : msg.senderName}
                </span>
                <span>{msg.time}</span>
              </div>
              <div 
                className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed break-words shadow-sm ${
                  isMe
                    ? 'bg-mirqam-teal text-white rounded-te-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-ts-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Emojis Row */}
      <div className="px-4 py-2 flex items-center gap-1.5 border-t border-slate-200/60 dark:border-slate-800/60 overflow-x-auto">
        {['👍', '👏', '❤️', '🎉', '🚀', '🙌'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleQuickEmoji(emoji)}
            className="px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('sendToEveryone')}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-mirqam-teal text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-dark text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title={t('send')}
        >
          <Send className="w-4 h-4 rtl:rotate-180" />
        </button>
      </form>

    </div>
  );
}
