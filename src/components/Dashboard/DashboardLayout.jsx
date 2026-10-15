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
  const { language, isAr, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { quickJoinMeeting, userName } = useMeeting();

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
    { id: 'direction', icon: '🧭', labelAr: 'الرؤية والبوصلة', labelEn: 'Direction & Goals', shortAr: 'الرؤية', shortEn: 'Goals' },
    { id: 'tasks', icon: '📋', labelAr: 'المهام وتعيينها', labelEn: 'Tasks & Assignments', shortAr: 'المهام', shortEn: 'Tasks', badge: workspace?.tasks?.filter(t => t.status !== 'completed').length },
    { id: 'sales', icon: '💼', labelAr: 'المبيعات والعمولات', labelEn: 'Sales & Commissions', shortAr: 'المبيعات', shortEn: 'Sales', badge: workspace?.stats?.totalSales },
    { id: 'meet', icon: '📹', labelAr: 'الاجتماع السريع', labelEn: 'Quick Meet', shortAr: 'الاجتماع', shortEn: 'Meet' },
    { id: 'team', icon: '👥', labelAr: 'دليل الفريق', labelEn: 'Team Directory', shortAr: 'الفريق', shortEn: 'Team' }
  ];

  const permanentRoomId = workspace?.meetingRoomConfig?.permanentRoomId || 'mirqam-team';

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F8] dark:bg-[#0A1420] text-slate-800 dark:text-slate-100 transition-colors pb-20 sm:pb-8">
      {/* Top Corporate Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0E1A29]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & Company Title */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-mirqam-teal to-teal-400 flex items-center justify-center text-white font-black text-base sm:text-xl shadow-md shadow-mirqam-teal/20 shrink-0">
                مـ
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                    {isAr ? 'مرقام للأعمال' : 'Mirqam Workspace'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.2 rounded-md bg-mirqam-teal/15 text-mirqam-teal font-bold border border-mirqam-teal/30">
                    2.0
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-[170px] sm:max-w-none">
                  {isAr ? 'شركة مرقام التجارية' : 'Mirqam Company Commercial'} <span className="hidden sm:inline">• {isAr ? 'س.ت:' : 'CR:'} 7055011105</span>
                </div>
              </div>
            </div>

            {/* Middle: Riyadh Clock (Desktop only) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-white/70">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isAr ? 'توقيت الرياض:' : 'Riyadh Time:'}</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{riyadhTime}</span>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Quick Join Team Meeting - Desktop Button */}
              <button
                onClick={() => quickJoinMeeting(permanentRoomId, userName || (isAr ? 'عضو مرقام' : 'Mirqam Member'))}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-hover text-white text-xs font-bold shadow-md shadow-mirqam-teal/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                title={isAr ? 'انضمام فوري لغرفة اجتماع الفريق اليومية' : 'Join permanent daily company room'}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span>{isAr ? 'اجتماع الفريق 📹' : 'Team Huddle 📹'}</span>
              </button>

              {/* Quick Join Team Meeting - Mobile Compact Icon */}
              <button
                onClick={() => quickJoinMeeting(permanentRoomId, userName || (isAr ? 'عضو مرقام' : 'Mirqam Member'))}
                className="md:hidden p-2 rounded-xl bg-mirqam-teal text-white shadow-sm flex items-center justify-center relative active:scale-95"
                title={isAr ? 'اجتماع الفريق' : 'Team Huddle'}
              >
                <span className="text-sm">📹</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-[#0E1A29] rounded-full animate-pulse" />
              </button>

              {/* Language Switch */}
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 transition-colors"
                title={isAr ? 'Switch to English' : 'التحويل للعربية'}
              >
                {isAr ? 'English' : 'عربي'}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 transition-colors"
                title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Desktop Navigation Tabs Bar (Visible sm and up) */}
          <nav className="hidden sm:flex items-center gap-1.5 lg:gap-2 overflow-x-auto py-2 -mb-px scrollbar-none">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-mirqam-teal text-white shadow-sm shadow-mirqam-teal/30 scale-[1.01]'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200'
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

      {/* Mobile Riyadh Clock Bar (Mobile Only) */}
      <div className="sm:hidden flex items-center justify-between px-4 py-1.5 bg-slate-100/80 dark:bg-[#0E1A29]/80 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isAr ? 'الرياض:' : 'Riyadh:'}</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{riyadhTime}</span>
        </span>
        <span>{isAr ? 'س.ت: 7055011105' : 'CR: 7055011105'}</span>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
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

      {/* Mobile Bottom Navigation Bar (Fixed for Mobile Screens) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0E1A29]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-2xl flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-center transition-all relative ${
                isActive
                  ? 'text-mirqam-teal font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span className={`text-lg transition-transform ${isActive ? 'scale-110' : ''}`}>{tab.icon}</span>
              <span className="text-[10px] mt-0.5 whitespace-nowrap">
                {isAr ? tab.shortAr : tab.shortEn}
              </span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute top-0 right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-mirqam-teal text-white text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Corporate Footer (Desktop only or clean padding) */}
      <footer className="hidden sm:block mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#0E1A29]/40 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
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
