import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useMeeting } from '../../context/MeetingContext';

import GoalsView from './GoalsView';
import TasksView from './TasksView';
import SalesView from './SalesView';
import QuickMeetView from './QuickMeetView';
import TeamView from './TeamView';

export default function DashboardLayout() {
  const { workspace, loading, error, activeTab, setActiveTab } = useWorkspace();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { quickJoinMeeting, userName } = useMeeting();
  const isAr = language === 'ar';

  // Riyadh Live Clock
  const [riyadhTime, setRiyadhTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Riyadh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setRiyadhTime(new Intl.DateTimeFormat(isAr ? 'ar-SA' : 'en-US', options).format(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [isAr]);

  const tabs = [
    { id: 'direction', icon: '🧭', labelAr: 'الرؤية والبوصلة', labelEn: 'Direction & Goals' },
    { id: 'tasks', icon: '📋', labelAr: 'المهام وتعيينها', labelEn: 'Tasks & Assignments', badge: workspace?.tasks?.filter(t => t.status !== 'completed').length },
    { id: 'sales', icon: '💼', labelAr: 'المبيعات والعمولات', labelEn: 'Sales & Commissions', badge: workspace?.stats?.totalSales },
    { id: 'meet', icon: '📹', labelAr: 'الاجتماع السريع', labelEn: 'Quick Meet' },
    { id: 'team', icon: '👥', labelAr: 'دليل الفريق', labelEn: 'Team Directory' }
  ];

  const permanentRoomId = workspace?.meetingRoomConfig?.permanentRoomId || 'mirqam-team';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-mirqam-dark text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Corporate Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-mirqam-navy/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Company Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mirqam-teal to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-mirqam-teal/20">
                مـ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                    {isAr ? 'مرقام للأعمال' : 'Mirqam Workspace'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-mirqam-teal/15 text-mirqam-teal font-bold border border-mirqam-teal/30">
                    2.0
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {isAr ? 'شركة مرقام التجارية' : 'Mirqam Company Commercial'} • {isAr ? 'س.ت:' : 'CR:'} 7055011105
                </div>
              </div>
            </div>

            {/* Middle: Riyadh Clock (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-white/70">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isAr ? 'توقيت الرياض:' : 'Riyadh:'}</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{riyadhTime}</span>
            </div>

            {/* Right: Quick Join Team Meeting + Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Instant Team Huddle Join Button */}
              <button
                onClick={() => quickJoinMeeting(permanentRoomId, userName || 'عضو مرقام')}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-hover text-white text-xs font-bold shadow-md shadow-mirqam-teal/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                title={isAr ? 'انضمام فوري لغرفة اجتماع الفريق اليومية' : 'Join permanent daily company room'}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span>{isAr ? 'غرفة اجتماع الفريق 📹' : 'Team Huddle 📹'}</span>
              </button>

              {/* Language Switch */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-white transition-colors"
                title={isAr ? 'Switch to English' : 'التحويل للعربية'}
              >
                {isAr ? 'EN' : 'عربي'}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors"
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 -mb-px scrollbar-none">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-mirqam-teal text-white shadow-sm shadow-mirqam-teal/30 scale-[1.02]'
                      : 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/80'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading && !workspace ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
            <div className="w-10 h-10 border-4 border-mirqam-teal border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-medium">
              {isAr ? 'جاري تحميل لوحة أعمال مرقام...' : 'Loading Mirqam Workspace...'}
            </p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-sm font-bold text-rose-500">{isAr ? 'خطأ في جلب البيانات' : 'Error loading data'}</h3>
            <p className="text-xs text-slate-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-1.5 rounded-lg bg-mirqam-teal text-white text-xs font-semibold"
            >
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : (
          <div>
            {activeTab === 'direction' && <GoalsView />}
            {activeTab === 'tasks' && <TasksView />}
            {activeTab === 'sales' && <SalesView />}
            {activeTab === 'meet' && <QuickMeetView />}
            {activeTab === 'team' && <TeamView />}
          </div>
        )}
      </main>

      {/* Corporate Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-white/10 bg-white/60 dark:bg-mirqam-navy/40 py-4 text-center text-xs text-slate-500 dark:text-white/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            {isAr ? '© 2026 شركة مرقام التجارية (Mirqam Co.) - جميع الحقوق محفوظة' : '© 2026 Mirqam Company Commercial - All Rights Reserved'}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{isAr ? 'سجل تجاري:' : 'CR:'} 7055011105</span>
            <span>•</span>
            <span>{isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
