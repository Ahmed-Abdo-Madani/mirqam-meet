import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMeeting } from '../../context/MeetingContext';
import { 
  Info, 
  X, 
  Copy, 
  Check, 
  Phone, 
  ShieldCheck, 
  Paperclip, 
  FileText, 
  Share2 
} from 'lucide-react';

export default function MeetingInfoPanel() {
  const { t } = useLanguage();
  const { roomId, meetingTitle, setActiveSidePanel, setActiveModal } = useMeeting();
  const [copied, setCopied] = useState(false);

  const meetingUrl = `${window.location.origin}/?room=${roomId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-mirqam-teal" />
          <h3 className="font-bold text-sm">{t('meetingDetails')}</h3>
        </div>
        <button
          onClick={() => setActiveSidePanel(null)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Meeting Title & Code */}
        <div className="space-y-1">
          <h4 className="font-bold text-base text-slate-900 dark:text-white">{meetingTitle}</h4>
          <span className="text-xs font-mono text-slate-500">{roomId}</span>
        </div>

        {/* Joining Info Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            {t('joiningInfo')}
          </span>
          <p className="text-xs text-slate-500 break-all font-mono">
            {meetingUrl}
          </p>
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-dark text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t('linkCopied') : t('copyLink')}</span>
          </button>
        </div>

        {/* Dial-in info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Phone className="w-4 h-4 text-mirqam-teal" />
            <span>الانضمام عبر الهاتف (Dial-in)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 font-mono space-y-1">
            <div>+966 11 800 4422 (السعودية)</div>
            <div>رمز التعريف (PIN): 849 203#</div>
          </div>
        </div>

        {/* Meeting Attachments & Agenda */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Paperclip className="w-4 h-4 text-mirqam-teal" />
            <span>المستندات والمرفقات</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 flex items-center gap-3">
            <FileText className="w-6 h-6 text-mirqam-teal" />
            <div className="flex flex-col text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">أجندة اجتماع شركة مرقام.pdf</span>
              <span className="text-[10px] text-slate-400">1.4 ميجابايت • مشترك مع الجميع</span>
            </div>
          </div>
        </div>

        {/* Security & Data Residency */}
        <div className="p-3 rounded-xl bg-mirqam-teal/10 border border-mirqam-teal/20 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-mirqam-teal shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            مكالمتك مشفرة بتشفير AES-256 بين الطرفين، وتخضع لسياسات أمن المعلومات لشركة مرقام التجارية.
          </div>
        </div>

      </div>

    </div>
  );
}
