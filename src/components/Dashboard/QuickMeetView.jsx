import React, { useState } from 'react';
import { useMeeting } from '../../context/MeetingContext';
import { useLanguage } from '../../context/LanguageContext';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function QuickMeetView() {
  const { 
    quickJoinMeeting, 
    audioEnabled, 
    videoEnabled, 
    toggleAudio, 
    toggleVideo, 
    userName, 
    setUserName 
  } = useMeeting();
  const { workspace } = useWorkspace();
  const { isAr } = useLanguage();

  const permanentRoomId = workspace?.meetingRoomConfig?.permanentRoomId || 'mirqam-team';
  const [clientRoomCode, setClientRoomCode] = useState(() => `mqm-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`);
  const [copied, setCopied] = useState(false);

  const clientMeetingUrl = `${window.location.origin}/?room=${clientRoomCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(clientMeetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      isAr 
        ? `مرحباً بك، تدعوك شركة مرقام التجارية لحضور اجتماع عبر الرابط:\n${clientMeetingUrl}`
        : `Hello, Mirqam Company invites you to join an online meeting:\n${clientMeetingUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const generateNewClientLink = () => {
    setClientRoomCode(`mqm-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <span>📹</span>
          <span>{isAr ? 'اجتماعات مرقام المبسطة' : 'Simplified Mirqam Meet'}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isAr 
            ? 'انضمام فوري لغرفة الفريق الدائمة بنقرة واحدة، أو إنشاء رابط سريع لمكالمة عميل خارجي'
            : '1-click permanent team daily room, or instant guest links for prospective clients'}
        </p>
      </div>

      {/* Main Grid: 2 Cards Stackable on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: Permanent Team Room */}
        <div className="bg-gradient-to-br from-mirqam-navy via-[#122033] to-[#0A1420] text-white rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-mirqam-teal/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isAr ? 'غرفة دائمة مفتوحة 24/7' : 'Always Ready Huddle'}
              </span>
              <span className="text-[11px] text-white/50 font-mono">#{permanentRoomId}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              {isAr ? 'غرفة اجتماع الفريق اليومي' : 'Company Daily Huddle'}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {isAr 
                ? 'غرفة مرقام الثابتة للنقاشات اليومية ومتابعة المبيعات بين الموظفين الـ 3 وفريق العمولات. ادخل مباشرة دون الحاجة لطلب رابط.'
                : 'Permanent company room for internal syncs, daily standups, and sales tracking. No new link required.'}
            </p>

            {/* Quick Nickname & Device Toggles */}
            <div className="mt-4 sm:mt-5 p-3 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div>
                <label className="block text-[11px] text-white/80 mb-1">
                  {isAr ? 'اسمك في الاجتماع:' : 'Your display name:'}
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={isAr ? 'اسمك...' : 'Your name...'}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-mirqam-teal"
                />
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    audioEnabled 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  <span>{audioEnabled ? '🎤' : '🔇'}</span>
                  <span>{audioEnabled ? (isAr ? 'المايك يعمل' : 'Mic On') : (isAr ? 'المايك مكتوم' : 'Muted')}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleVideo}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    videoEnabled 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  <span>{videoEnabled ? '📹' : '🚫'}</span>
                  <span>{videoEnabled ? (isAr ? 'الكاميرا تعمل' : 'Camera On') : (isAr ? 'الكاميرا مغلقة' : 'Cam Off')}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              onClick={() => quickJoinMeeting(permanentRoomId, userName || (isAr ? 'عضو مرقام' : 'Mirqam Member'))}
              className="w-full py-3 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-hover text-white text-xs sm:text-sm font-bold shadow-lg shadow-mirqam-teal/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{isAr ? 'انضمام لاجتماع الفريق الآن' : 'Join Team Huddle Now'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: External Client Link */}
        <div className="bg-white dark:bg-[#122033] rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-mirqam-teal/20 text-mirqam-teal border border-teal-200 dark:border-mirqam-teal/30">
                <span>🤝</span>
                {isAr ? 'مكالمة عميل خارجي' : 'External Client Call'}
              </span>
              <button
                onClick={generateNewClientLink}
                className="text-xs text-slate-400 hover:text-mirqam-teal transition-colors flex items-center gap-1"
                title={isAr ? 'توليد كود غرفة جديد' : 'Generate new link'}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isAr ? 'تغيير' : 'Regenerate'}</span>
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'رابط سريع لمقابلة العميل' : 'Instant Guest Client Link'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {isAr 
                ? 'انسخ الرابط وأرسله لعميلك أو متجرك المستهدف عبر واتساب. يدخل العميل بنقرة واحدة من المتصفح دون الحاجة لتسجيل حساب أو تحميل تطبيق.'
                : 'Share this link with prospective clients. They can join right away from mobile/PC browsers without account creation.'}
            </p>

            {/* Generated Link Box */}
            <div className="mt-4 sm:mt-5 p-3 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAr ? 'رابط الاجتماع المباشر:' : 'Direct Meeting Link:'}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={clientMeetingUrl}
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    copied 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-mirqam-teal text-white hover:bg-mirqam-teal-hover'
                  }`}
                >
                  {copied ? (isAr ? '✓ تم النسخ' : 'Copied!') : (isAr ? 'نسخ' : 'Copy')}
                </button>
              </div>
            </div>

            {/* WhatsApp Share Button */}
            <div className="mt-3">
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>💬</span>
                <span>{isAr ? 'إرسال الرابط للعميل عبر واتساب' : 'Share Link via WhatsApp'}</span>
              </button>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => quickJoinMeeting(clientRoomCode, userName || (isAr ? 'فريق مرقام' : 'Mirqam Team'))}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <span>{isAr ? 'دخول الغرفة كمضيف' : 'Enter Room as Host'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 sm:pt-4 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 text-center">
        <span className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-bold">✓</span>
          {isAr ? 'جودة صوت وصورة فائقة ببروتوكول WebRTC' : 'Direct Peer-to-Peer HD Video/Audio'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-bold">✓</span>
          {isAr ? 'مشاركة شاشة بنقرة واحدة للعروض والـ Demo' : '1-Click Screen Share for Sales Demos'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-bold">✓</span>
          {isAr ? 'مشفرة وآمنة وفق معايير شركة مرقام' : 'Encrypted & Private'}
        </span>
      </div>
    </div>
  );
}
