import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMeeting } from '../context/MeetingContext';
import { 
  Video, 
  Keyboard, 
  Plus, 
  Link2, 
  Calendar, 
  ShieldCheck, 
  Server, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  Users,
  MessageSquare,
  Sparkles,
  Share2,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function LandingPage() {
  const { t, isRtl } = useLanguage();
  const { 
    createInstantMeeting, 
    createMeetingForLater, 
    setActiveModal, 
    goToGreenRoom, 
    scheduledMeetings 
  } = useMeeting();

  const [meetingCodeInput, setMeetingCodeInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: isRtl ? 'اتصال مرئي فائق الوضوح وآمن' : 'Crystal Clear, Secure Video Meetings',
      description: isRtl 
        ? 'شبكة اتصال مرئي مباشرة ومستقرة، مع تحديد المتحدث الذكي وإلغاء الضوضاء المحيطة.'
        : 'Enterprise-grade video calls with smart active speaker detection and crystal clear sound.',
      badge: isRtl ? 'جودة 1080p فائقة' : 'Full HD 1080p',
      icon: Video
    },
    {
      title: isRtl ? 'شرح مباشر ونصوص تفريغ فورية' : 'Live Speech-to-Text & Subtitles',
      description: isRtl 
        ? 'تعرف صوتي مباشر يدعم اللغة العربية والإنجليزية وتدوين وقائع الجلسة تلقائياً.'
        : 'Real-time spoken captions supporting Arabic and English with automated meeting logs.',
      badge: isRtl ? 'ذكاء اصطناعي مدمج' : 'Built-in AI',
      icon: Sparkles
    },
    {
      title: isRtl ? 'سبورة تفاعلية واستطلاعات رأي' : 'Collaborative Whiteboard & Polls',
      description: isRtl 
        ? 'تعاون مع فريقك في رسم الأفكار، والتصويت على القرارات فورياً أثناء المكالمة.'
        : 'Brainstorm ideas together on the real-time drawing canvas and run audience polls.',
      badge: isRtl ? 'تعاون فوري' : 'Live Sync',
      icon: Users
    }
  ];

  const handleJoin = (e) => {
    e.preventDefault();
    if (!meetingCodeInput.trim()) return;
    goToGreenRoom(meetingCodeInput.trim());
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Headline, Actions & Join Input */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="space-y-4">
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mirqam-teal/10 border border-mirqam-teal/25 text-mirqam-teal dark:text-mirqam-teal-light text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('encryptedBadge')} • {t('saudiCloudBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-mirqam-navy dark:text-white leading-[1.25]">
              {t('landingTagline')}
            </h1>

            <p className="text-base sm:text-lg text-mirqam-muted dark:text-mirqam-muted-dark leading-relaxed max-w-xl">
              {t('landingDescription')}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            {/* New Meeting Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-mirqam-teal to-mirqam-teal-dark hover:from-mirqam-teal-dark hover:to-teal-800 text-white font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-mirqam-teal/25 hover:shadow-xl hover:shadow-mirqam-teal/30 active:scale-[0.98] transition-all"
              >
                <Video className="w-5 h-5" />
                <span>{t('newMeeting')}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <div className="absolute top-full mt-2 w-72 rounded-2xl bg-white dark:bg-mirqam-navy-card border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        createInstantMeeting();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-right text-slate-800 dark:text-slate-100 transition-colors text-sm font-medium"
                    >
                      <div className="p-2 rounded-lg bg-mirqam-teal/15 text-mirqam-teal">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">{t('instantMeeting')}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">انضم للمكالمة فوراً وجهّز الرابط</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        createMeetingForLater();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-right text-slate-800 dark:text-slate-100 transition-colors text-sm font-medium"
                    >
                      <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-500">
                        <Link2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">{t('createForLater')}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">احصل على رابط مشاركة لترسله لفريقك</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setActiveModal('schedule');
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-right text-slate-800 dark:text-slate-100 transition-colors text-sm font-medium"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-500">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">{t('scheduleMeeting')}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">حدد موعد وأجندة الاجتماع مسبقاً</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Enter Code or Link Form */}
            <form onSubmit={handleJoin} className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                  <Keyboard className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={meetingCodeInput}
                  onChange={(e) => setMeetingCodeInput(e.target.value)}
                  placeholder={t('enterCodeOrLink')}
                  className="w-full ps-11 pe-4 py-3.5 rounded-2xl bg-white dark:bg-mirqam-navy-card/90 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-mirqam-teal/40 focus:border-mirqam-teal text-sm transition-all shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={!meetingCodeInput.trim()}
                className="px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-slate-200/80 dark:bg-slate-800 hover:bg-mirqam-teal hover:text-white dark:hover:bg-mirqam-teal text-slate-700 dark:text-slate-200"
              >
                {t('join')}
              </button>
            </form>
          </div>

          <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />

          {/* Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-mirqam-navy-card/40 border border-slate-200/50 dark:border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-mirqam-teal/15 text-mirqam-teal flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('encryptedBadge')}</span>
                <span className="text-[11px] text-slate-500">حماية تامة للمكالمات والبيانات</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-mirqam-navy-card/40 border border-slate-200/50 dark:border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('saudiCloudBadge')}</span>
                <span className="text-[11px] text-slate-500">مراكز بيانات داخل المملكة</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-mirqam-navy-card/40 border border-slate-200/50 dark:border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('latencyBadge')}</span>
                <span className="text-[11px] text-slate-500">استجابة فورية بدون تقطيع</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Google Meet Showcase & Scheduled Meetings */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Feature Carousel Card */}
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-mirqam-navy to-mirqam-navy-dark border border-mirqam-teal/30 shadow-2xl text-white">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 end-0 w-64 h-64 bg-mirqam-teal/20 rounded-full blur-3xl pointer-events-none" />

            {/* Slide Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-mirqam-teal/25 text-mirqam-teal-light border border-mirqam-teal/40">
                {slides[activeSlide].badge}
              </span>
              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      activeSlide === i ? 'w-6 bg-mirqam-teal' : 'w-2 bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Feature Art / Preview Window */}
            <div className="w-full h-44 rounded-2xl bg-slate-900/80 border border-slate-700/60 p-4 flex flex-col justify-between mb-6 relative overflow-hidden group">
              {/* Meeting Tile Preview */}
              <div className="grid grid-cols-2 gap-2 h-full">
                <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-2 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded text-slate-300">طارق (مستضيف)</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-mirqam-teal/30 text-mirqam-teal-light font-bold flex items-center justify-center text-sm border border-mirqam-teal/40">
                      ط
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-1 flex-1 bg-mirqam-teal rounded-full animate-pulse" />
                    <div className="h-1 flex-1 bg-mirqam-teal rounded-full animate-pulse delay-75" />
                    <div className="h-1 flex-1 bg-mirqam-teal rounded-full animate-pulse delay-150" />
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-2 flex flex-col justify-between relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded text-slate-300">سارة (مشاركة)</span>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-sm border border-indigo-400/40">
                      س
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-center">الكاميرا نشطة</div>
                </div>
              </div>

              {/* Mini Subtitle Preview Banner */}
              <div className="absolute bottom-2 inset-x-2 bg-slate-950/90 backdrop-blur rounded-lg px-2.5 py-1 text-[11px] text-slate-200 flex items-center gap-2 border border-slate-700/50">
                <span className="text-mirqam-teal font-semibold">مرقام ميت:</span>
                <span className="truncate">"نظام الاتصال الموحد لفريق العمل بجودة 4K"</span>
              </div>
            </div>

            {/* Slide Text */}
            <h3 className="text-xl font-bold mb-2 text-white">
              {slides[activeSlide].title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {slides[activeSlide].description}
            </p>

            {/* Slide Arrows */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                {activeSlide + 1} من {slides.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSlide(prev => (prev > 0 ? prev - 1 : slides.length - 1))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  onClick={() => setActiveSlide(prev => (prev < slides.length - 1 ? prev + 1 : 0))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Team Meetings Widget */}
          <div className="rounded-3xl p-6 bg-white dark:bg-mirqam-navy-card border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-mirqam-teal" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('upcomingMeetings')}</h4>
              </div>
              <button
                onClick={() => setActiveModal('schedule')}
                className="text-xs text-mirqam-teal font-semibold hover:underline"
              >
                + {t('scheduleNew')}
              </button>
            </div>

            <div className="space-y-3">
              {scheduledMeetings.slice(0, 2).map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-mirqam-teal/40 transition-all"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.date} • {item.code}
                    </span>
                  </div>
                  <button
                    onClick={() => goToGreenRoom(item.code)}
                    className="px-3 py-1.5 rounded-xl bg-mirqam-teal/15 hover:bg-mirqam-teal text-mirqam-teal hover:text-white text-xs font-semibold transition-all"
                  >
                    {t('join')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Mirqam Corporate Footer Block */}
      <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{t('companyLegal')}</span>
          <span>•</span>
          <span>{t('crNumber')}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>المملكة العربية السعودية (KSA)</span>
          <span>•</span>
          <span>مرقام ميت v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
