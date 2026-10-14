import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMeeting } from '../../context/MeetingContext';
import { HelpCircle, X, Keyboard } from 'lucide-react';

export default function ShortcutsModal() {
  const { t } = useLanguage();
  const { setActiveModal } = useMeeting();

  const shortcutsList = [
    { key: 'Ctrl + D / M', label: 'كتم أو تشغيل الميكروفون' },
    { key: 'Ctrl + E / V', label: 'إيقاف أو تشغيل الكاميرا' },
    { key: 'H', label: 'رفع أو خفض اليد' },
    { key: 'C', label: 'فتح أو إغلاق نافذة المحادثة' },
    { key: 'S', label: 'بدء أو إيقاف مشاركة الشاشة' },
    { key: 'F', label: 'تفعيل أو إلغاء ملء الشاشة' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111F30] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-mirqam-teal" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('shortcuts')}</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcutsList.map((sc, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs"
            >
              <span className="text-slate-700 dark:text-slate-200">{sc.label}</span>
              <kbd className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => setActiveModal(null)}
            className="px-5 py-2 rounded-xl bg-mirqam-teal text-white text-xs font-bold hover:bg-mirqam-teal-dark transition-colors"
          >
            حسناً
          </button>
        </div>

      </div>
    </div>
  );
}
