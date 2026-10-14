import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMeeting } from '../context/MeetingContext';
import { 
  PhoneOff, 
  RotateCcw, 
  Home, 
  Star, 
  Download, 
  FileText, 
  Video, 
  CheckCircle2,
  ShieldCheck 
} from 'lucide-react';

export default function PostMeetingView() {
  const { t, isRtl } = useLanguage();
  const { 
    roomId, 
    rejoinMeeting, 
    returnHome, 
    recordedBlobUrl, 
    transcriptLog 
  } = useMeeting();

  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  const handleRate = (stars) => {
    setRating(stars);
    setRated(true);
  };

  const downloadTranscript = () => {
    if (transcriptLog.length === 0) return;
    const text = transcriptLog
      .map(entry => `[${entry.time}] ${entry.speaker}: ${entry.text}`)
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mirqam-transcript-${roomId}.txt`;
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full px-4 py-12 text-center animate-in fade-in duration-200">
      
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mb-6 shadow-lg border border-rose-500/20">
        <PhoneOff className="w-8 h-8" />
      </div>

      {/* Headline */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
        {t('meetingLeftTitle')}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        {t('meetingLeftDesc')}
      </p>

      {/* Main Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm mb-8">
        <button
          onClick={rejoinMeeting}
          className="w-full py-3.5 px-6 rounded-2xl bg-mirqam-teal hover:bg-mirqam-teal-dark text-white font-bold text-sm shadow-lg shadow-mirqam-teal/25 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('rejoin')}</span>
        </button>

        <button
          onClick={returnHome}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>{t('returnHome')}</span>
        </button>
      </div>

      {/* Recording & Transcript Artifacts (if available) */}
      {(recordedBlobUrl || transcriptLog.length > 0) && (
        <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-8 space-y-3 text-start">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            ملفات ومخرجات الاجتماع:
          </span>

          {recordedBlobUrl && (
            <a
              href={recordedBlobUrl}
              download={`mirqam-meeting-${roomId}.webm`}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-mirqam-teal transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Video className="w-5 h-5 text-rose-500" />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">تسجيل الفيديو الكامل</span>
                  <span className="text-[10px] text-slate-400">صيغة WebM عالية الوضوح</span>
                </div>
              </div>
              <Download className="w-4 h-4 text-mirqam-teal group-hover:scale-110 transition-transform" />
            </a>
          )}

          {transcriptLog.length > 0 && (
            <button
              onClick={downloadTranscript}
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-mirqam-teal transition-all group"
            >
              <div className="flex items-center gap-2.5 text-start">
                <FileText className="w-5 h-5 text-mirqam-teal" />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">تفريغ المحادثة الصوتي (Transcript)</span>
                  <span className="text-[10px] text-slate-400">{transcriptLog.length} سطر مسجل</span>
                </div>
              </div>
              <Download className="w-4 h-4 text-mirqam-teal group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      )}

      {/* Quality Rating Box */}
      <div className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-3">
          {t('rateMeeting')}
        </span>

        {!rated ? (
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className={`p-1.5 rounded-lg transition-transform hover:scale-125 ${
                  rating >= star ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                }`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-500">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('rateThanks')}</span>
          </div>
        )}
      </div>

    </div>
  );
}
