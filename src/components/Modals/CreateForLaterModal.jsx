import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMeeting } from '../../context/MeetingContext';
import { Link2, X, Copy, Check, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CreateForLaterModal() {
  const { t, isRtl } = useLanguage();
  const { roomId, setActiveModal, goToGreenRoom } = useMeeting();
  const [copied, setCopied] = useState(false);

  const meetingUrl = `${window.location.origin}/?room=${roomId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`رابط اجتماع مرقام ميت المجدول:\n${meetingUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111F30] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link2 className="w-5 h-5 text-mirqam-teal" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('createForLater')}</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          إليك رابط اجتماعك الجديد. يمكنك حفظه وإرساله لزملائك ليتمكنوا من الانضمام في أي وقت:
        </p>

        {/* Link Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
            {meetingUrl}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-dark text-white text-xs font-semibold shrink-0 transition-colors"
            title={t('copyLink')}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleWhatsApp}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>مشاركة الرابط عبر واتساب</span>
          </button>

          <button
            onClick={() => {
              setActiveModal(null);
              goToGreenRoom(roomId);
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>الدخول إلى غرفة الانتظار الآن</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
}
