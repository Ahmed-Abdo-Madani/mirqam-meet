import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useMeeting } from '../context/MeetingContext';
import { 
  Sun, 
  Moon, 
  Languages, 
  HelpCircle, 
  Settings, 
  ShieldCheck, 
  Video,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Header() {
  const { locale, toggleLanguage, t, isRtl } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { setActiveModal, meetingState, localUser } = useMeeting();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [locale]);

  return (
    <header className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-mirqam-border/40 dark:border-mirqam-border-dark/60 bg-white/70 dark:bg-mirqam-navy/70 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-3">
          {/* Mirqam Meet Logo Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mirqam-teal to-mirqam-teal-dark p-2 flex items-center justify-center shadow-lg shadow-mirqam-teal/20 transition-transform hover:scale-105">
            <svg viewBox="45 145 880 660" className="w-full h-full text-white fill-current">
              <path fill="currentColor" fillRule="evenodd" d="M 587.500 194.079 C 563.850 204.511, 536.684 216.485, 527.130 220.689 C 517.577 224.892, 508.464 229.422, 506.879 230.756 C 503.763 233.377, 497.558 243.797, 496.461 248.250 C 495.939 250.369, 496.143 251, 497.351 251 C 498.213 251, 506.924 247.340, 516.709 242.867 C 536.728 233.715, 545.970 229.633, 591.467 209.844 C 609.049 202.197, 624.522 194.941, 625.850 193.720 C 630.870 189.105, 635.363 174.893, 631.750 175.056 C 631.063 175.087, 611.150 183.648, 587.500 194.079 M 406.086 252.396 C 404.754 254.001, 389 292.822, 389 294.499 C 389 295.096, 390.831 300.065, 393.070 305.542 C 402.211 327.908, 408.136 353.840, 411.910 388 C 415.205 417.819, 416.090 441.566, 417.012 524.855 C 417.916 606.468, 418.174 611.278, 422.557 628.236 C 427.142 645.972, 435.870 661.509, 445.828 669.660 C 452.449 675.080, 462.811 680.232, 472 682.673 C 480.962 685.054, 499.765 685.057, 511 682.679 C 531.588 678.322, 558.765 666.962, 578.498 654.466 C 599.976 640.864, 620.499 622.999, 631.268 608.528 C 643.045 592.703, 653.061 568.557, 658.450 543 C 666.839 503.212, 663.132 467.311, 647.358 435.568 C 639.049 418.847, 628.390 406.893, 614.527 398.748 C 604.531 392.875, 597.153 390.776, 588 391.203 C 574.177 391.847, 565.194 398.143, 556.002 413.631 C 549.451 424.670, 545.647 433.608, 539.462 452.500 C 532.013 475.249, 529.624 487.550, 529.556 503.500 C 529.504 515.468, 529.706 516.937, 532.090 522 C 538.732 536.103, 548.943 542, 566.720 542 C 577.135 542, 586.332 540.361, 600.649 535.954 C 611.715 532.548, 616.859 532.299, 622.571 534.893 C 632.851 539.562, 639.289 556.094, 634.125 564.563 C 630.507 570.495, 615.126 582.162, 595 594.239 C 569.032 609.821, 547.395 619.052, 522.500 625.168 C 509.873 628.271, 493.245 628.311, 483.458 625.262 C 461.196 618.328, 449.533 601.759, 444.911 570.500 C 444.329 566.568, 443.509 528.878, 443.039 484.500 C 442.580 441.050, 441.698 398.750, 441.081 390.500 C 436.693 331.887, 427.813 290.537, 413.010 259.779 C 409.211 251.887, 407.778 250.358, 406.086 252.396" />
              <path fill="#23949A" fillRule="evenodd" d="M 615.341 281.770 C 611.579 286.043, 604.900 294.130, 600.500 299.740 C 596.100 305.351, 592.164 309.955, 591.753 309.971 C 591.342 309.987, 582.872 303.186, 572.930 294.859 C 557.760 282.152, 554.646 279.941, 553.564 281.109 C 551.952 282.847, 529.363 311.207, 525.664 316.137 L 522.935 319.774 529.218 325.192 C 532.673 328.172, 541.293 335.496, 548.373 341.467 C 561.035 352.147, 561.273 352.291, 562.873 350.250 C 563.768 349.108, 570.528 340.729, 577.896 331.629 C 591.115 315.302, 591.320 315.106, 593.442 316.792 C 594.625 317.731, 602.265 324.350, 610.421 331.500 C 618.577 338.650, 625.951 344.500, 626.809 344.500 C 628.170 344.500, 651.581 318.440, 657.210 310.659 L 659.266 307.818 652.383 300.833 C 645.116 293.458, 623.596 274, 622.706 274 C 622.418 274, 619.104 277.496, 615.341 281.770" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl text-mirqam-navy dark:text-white tracking-tight">
                {t('brand')}
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-mirqam-teal/15 text-mirqam-teal dark:text-mirqam-teal-light border border-mirqam-teal/30">
                Enterprise
              </span>
            </div>
            <span className="text-[11px] text-mirqam-muted dark:text-mirqam-muted-dark hidden sm:inline">
              {t('brandSubtitle')} • {t('companyLegal')}
            </span>
          </div>
        </div>
      </div>

      {/* Clock & Action Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live Saudi Time */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-mirqam-navy-soft/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-mirqam-teal" />
          <span className="font-medium font-mono">{timeStr}</span>
        </div>

        {/* Shortcuts / Help */}
        <button
          onClick={() => setActiveModal('shortcuts')}
          title={t('shortcuts')}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-mirqam-navy-card transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Settings Modal Toggle */}
        <button
          onClick={() => setActiveModal('settings')}
          title={t('settings')}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-mirqam-navy-card transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          title={locale === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-mirqam-navy-soft hover:bg-slate-200 dark:hover:bg-mirqam-navy-card text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700/60"
        >
          <Languages className="w-4 h-4 text-mirqam-teal" />
          <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-mirqam-navy-card transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-mirqam-navy" />}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div 
            onClick={() => setActiveModal('settings')}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-mirqam-teal to-cyan-500 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-sm hover:ring-2 hover:ring-mirqam-teal/50 transition-all"
            title={localUser.name}
          >
            {localUser.name ? localUser.name.charAt(0) : 'م'}
          </div>
        </div>
      </div>
    </header>
  );
}
