import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMeeting } from '../../context/MeetingContext';
import { Calendar, X, Clock, Users } from 'lucide-react';

export default function ScheduleModal() {
  const { t } = useLanguage();
  const { scheduleMeeting, setActiveModal } = useMeeting();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedDate = date ? `${date} ${time || ''}` : 'اليوم، 03:00 م';
    scheduleMeeting({
      title: title.trim(),
      date: formattedDate
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111F30] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-mirqam-teal" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('scheduleMeeting')}</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('meetingTitle')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: مراجعة خطة إطلاق منصة مرقام"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-mirqam-teal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                التاريخ
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-mirqam-teal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                الوقت
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-mirqam-teal"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-dark text-white text-xs font-bold transition-colors disabled:opacity-40"
            >
              {t('saveSchedule')}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
