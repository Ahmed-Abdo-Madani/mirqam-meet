import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMeeting } from '../../context/MeetingContext';
import { BarChart2, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function PollsPanel() {
  const { t } = useLanguage();
  const { polls, createPoll, votePoll, setActiveSidePanel } = useMeeting();

  const [isCreating, setIsCreating] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleOptionChange = (idx, val) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const handleRemoveOption = (idx) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const handleSubmitPoll = (e) => {
    e.preventDefault();
    const validOptions = options.map(o => o.trim()).filter(Boolean);
    if (!question.trim() || validOptions.length < 2) return;
    createPoll(question.trim(), validOptions);
    setQuestion('');
    setOptions(['', '']);
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-mirqam-teal" />
          <h3 className="font-bold text-sm">{t('polls')}</h3>
        </div>
        <button
          onClick={() => setActiveSidePanel(null)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Toggle Create Form */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-mirqam-teal/15 hover:bg-mirqam-teal text-mirqam-teal hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createPoll')}</span>
          </button>
        ) : (
          <form onSubmit={handleSubmitPoll} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('createPoll')}</h4>
            
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="اكتب سؤال الاستطلاع هنا..."
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-mirqam-teal text-slate-800 dark:text-white"
            />

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-500">الخيارات</label>
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`خيار ${i + 1}`}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-mirqam-teal text-slate-800 dark:text-white"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(i)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="text-[11px] text-mirqam-teal font-semibold hover:underline"
              >
                + إضافة خيار آخر
              </button>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={!question.trim()}
                className="flex-1 py-2 px-3 rounded-xl bg-mirqam-teal text-white text-xs font-bold hover:bg-mirqam-teal-dark disabled:opacity-40 transition-colors"
              >
                نشر الاستطلاع
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* Polls List */}
        <div className="space-y-4">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

            return (
              <div 
                key={poll.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {poll.question}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {totalVotes} {t('votesCount')}
                  </span>
                </div>

                <div className="space-y-2">
                  {poll.options.map((option, idx) => {
                    const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                    return (
                      <button
                        key={idx}
                        onClick={() => votePoll(poll.id, idx)}
                        className="w-full text-start p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-mirqam-teal/60 bg-white dark:bg-slate-900/60 relative overflow-hidden transition-all group"
                      >
                        {/* Progress Bar background */}
                        <div 
                          className="absolute inset-y-0 start-0 bg-mirqam-teal/15 dark:bg-mirqam-teal/25 transition-all duration-300 pointer-events-none"
                          style={{ width: `${percent}%` }}
                        />

                        <div className="relative flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {option.text}
                          </span>
                          <span className="text-[11px] font-bold text-mirqam-teal font-mono">
                            {percent}% ({option.votes})
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
