import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMeeting } from '../../context/MeetingContext';
import { UserPlus, X, Copy, Check, MessageCircle, Mail } from 'lucide-react';

export default function InviteModal() {
  const { t } = useLanguage();
  const { roomId, meetingTitle, setActiveModal } = useMeeting();
  const [copied, setCopied] = useState(false);

  const meetingUrl = `${window.location.origin}/?room=${roomId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`مرحباً! أدعوك للانضمام إلى اجتماع مرقام ميت (${meetingTitle}):\n${meetingUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`دعوة لاجتماع مرقام ميت: ${meetingTitle}`);
    const body = encodeURIComponent(`السلام عليكم،\n\nأدعوك للانضمام إلى اجتماع مرقام ميت:\n${meetingUrl}\n\nرمز الاجتماع: ${roomId}\n\nشركة مرقام التجارية.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111F30] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-mirqam-teal" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('addPeople')}</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          شارك هذا الرابط مع الأشخاص الذين ترغب في انضمامهم لهذا الاجتماع:
        </p>

        {/* Link box */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
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

        {/* Quick share options */}
        <div className="space-y-2">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>مشاركة عبر واتساب (WhatsApp)</span>
          </button>

          <button
            onClick={handleEmailShare}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>إرسال بريد إلكتروني (Email)</span>
          </button>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => setActiveModal(null)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
}
