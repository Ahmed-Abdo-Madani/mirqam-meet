import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMeeting } from '../context/MeetingContext';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Sparkles, 
  Settings, 
  Share2, 
  Copy, 
  Check, 
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Monitor,
  Users,
  Volume2
} from 'lucide-react';

export default function GreenRoom() {
  const { t, isRtl } = useLanguage();
  const { 
    roomId, 
    localUser, 
    setLocalUser, 
    localStream, 
    audioVolume,
    toggleAudio, 
    toggleVideo, 
    joinMeetingRoom, 
    returnHome, 
    setActiveModal,
    selectedBackground,
    changeBackgroundEffect
  } = useMeeting();

  const videoRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [userNameInput, setUserNameInput] = useState(localUser.name);

  // Bind local stream to video tag
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/?room=${roomId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNameChange = (e) => {
    setUserNameInput(e.target.value);
    setLocalUser(prev => ({ ...prev, name: e.target.value }));
  };

  const handleJoin = (present = false) => {
    if (!userNameInput.trim()) {
      setLocalUser(prev => ({ ...prev, name: isRtl ? 'عضو فريق مرقام' : 'Mirqam Team Member' }));
    }
    if (present) {
      setLocalUser(prev => ({ ...prev, isPresenting: true }));
    }
    joinMeetingRoom(true);
  };

  const backgrounds = [
    { id: 'none', label: t('noBackground'), previewColor: 'bg-slate-700' },
    { id: 'blur-light', label: t('backgroundBlurLight'), previewColor: 'bg-slate-500 blur-xs' },
    { id: 'blur-heavy', label: t('backgroundBlurHeavy'), previewColor: 'bg-slate-400 blur-sm' },
    { id: 'office', label: t('backgroundMirqamOffice'), previewColor: 'bg-gradient-to-tr from-slate-900 to-mirqam-navy' },
    { id: 'abstract-teal', label: t('backgroundModernTeal'), previewColor: 'bg-gradient-to-tr from-mirqam-teal to-mirqam-navy' }
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Top back navigation */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={returnHome}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-mirqam-teal dark:hover:text-mirqam-teal-light transition-colors"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('returnHome')}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-mirqam-navy-card px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span>{roomId}</span>
          <button onClick={handleCopyLink} className="hover:text-mirqam-teal transition-colors" title={t('copyLink')}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
        
        {/* Left Column: Video Preview Box & Controls */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl flex items-center justify-center group">
            
            {/* Real Webcam Stream or Fallback Avatar */}
            {localUser.video && localStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-mirqam-teal to-mirqam-navy text-white text-3xl font-bold flex items-center justify-center shadow-lg border-2 border-mirqam-teal/40">
                  {userNameInput ? userNameInput.charAt(0) : 'م'}
                </div>
                <span className="text-sm text-slate-400">{t('cameraOff')}</span>
              </div>
            )}

            {/* Mic Volume Waveform Visualizer */}
            {localUser.audio && (
              <div className="absolute top-4 start-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs">
                <div className="flex items-end gap-0.5 h-4 w-5">
                  <div 
                    className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                    style={{ height: `${Math.max(20, Math.min(100, audioVolume * 1.5))}%` }}
                  />
                  <div 
                    className="w-1 bg-emerald-400 rounded-full transition-all duration-75 delay-75"
                    style={{ height: `${Math.max(30, Math.min(100, audioVolume * 1.8))}%` }}
                  />
                  <div 
                    className="w-1 bg-emerald-400 rounded-full transition-all duration-75 delay-150"
                    style={{ height: `${Math.max(15, Math.min(100, audioVolume * 1.2))}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-emerald-400">ميكروفون نشط</span>
              </div>
            )}

            {/* Quick Action Floating Bar on Video */}
            <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-3 z-20">
              {/* Mic Toggle */}
              <button
                onClick={() => toggleAudio()}
                className={`p-3.5 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-95 ${
                  localUser.audio
                    ? 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                    : 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-500'
                }`}
                title={localUser.audio ? t('turnOffMic') : t('turnOnMic')}
              >
                {localUser.audio ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Video Toggle */}
              <button
                onClick={() => toggleVideo()}
                className={`p-3.5 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-95 ${
                  localUser.video
                    ? 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                    : 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-500'
                }`}
                title={localUser.video ? t('turnOffCam') : t('turnOnCam')}
              >
                {localUser.video ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Visual Effects Drawer Toggle */}
              <button
                onClick={() => setShowEffects(!showEffects)}
                className={`p-3.5 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-95 ${
                  showEffects || selectedBackground !== 'none'
                    ? 'bg-mirqam-teal text-white border border-mirqam-teal-light'
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                }`}
                title={t('visualEffects')}
              >
                <Sparkles className="w-5 h-5" />
              </button>

              {/* Settings Modal Toggle */}
              <button
                onClick={() => setActiveModal('settings')}
                className="p-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-md shadow-lg transition-transform active:scale-95"
                title={t('settings')}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Visual Effects Drawer */}
          {showEffects && (
            <div className="p-4 rounded-2xl bg-white dark:bg-mirqam-navy-card border border-slate-200 dark:border-slate-800 shadow-xl animate-in slide-in-from-top-3 duration-200">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-3">
                {t('visualEffects')}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => changeBackgroundEffect(bg.id)}
                    className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedBackground === bg.id
                        ? 'border-mirqam-teal bg-mirqam-teal/10 text-mirqam-teal font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className={`w-12 h-8 rounded-lg ${bg.previewColor} border border-slate-600/40 shadow-inner`} />
                    <span className="text-[11px] text-center line-clamp-1">{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Name input & Join CTAs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-mirqam-navy dark:text-white">
              {t('readyToJoin')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              فريق مرقام التقني في انتظارك في غرفة الاتصال الآمنة.
            </p>
          </div>

          {/* Attendees already in room summary */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-mirqam-navy-soft/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 rounded-full bg-mirqam-teal text-white text-xs font-bold flex items-center justify-center border-2 border-slate-900">
                ط
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center border-2 border-slate-900">
                س
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center border-2 border-slate-900">
                ع
              </div>
            </div>
            <div className="flex flex-col text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold">3 أعضاء متواجدون في المكالمة الآن</span>
              <span className="text-slate-400 text-[11px]">طارق، سارة، عبدالله</span>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('enterYourName')}
            </label>
            <input
              type="text"
              value={userNameInput}
              onChange={handleNameChange}
              placeholder={t('defaultUserName')}
              className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-mirqam-navy-card border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-mirqam-teal/40 focus:border-mirqam-teal text-sm transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Join Now Button */}
            <button
              onClick={() => handleJoin(false)}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-mirqam-teal to-mirqam-teal-dark hover:from-mirqam-teal-dark hover:to-teal-800 text-white font-bold text-sm shadow-lg shadow-mirqam-teal/25 hover:shadow-xl hover:shadow-mirqam-teal/35 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>{t('joinNow')}</span>
            </button>

            {/* Present Directly Button */}
            <button
              onClick={() => handleJoin(true)}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              <span>{t('presentDirectly')}</span>
            </button>
          </div>

          {/* Meeting link copy pill */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500">
            <span className="truncate max-w-[260px] font-mono">{roomId}</span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-mirqam-teal font-semibold hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t('linkCopied') : t('copyLink')}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
