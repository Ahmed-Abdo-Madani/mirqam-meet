import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMeeting } from '../context/MeetingContext';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Subtitles, 
  Hand, 
  Monitor, 
  Smile, 
  Edit3, 
  MoreVertical, 
  PhoneOff, 
  Info, 
  Users, 
  MessageSquare, 
  Grid, 
  Maximize, 
  Settings, 
  HelpCircle, 
  Disc, 
  BarChart2, 
  ShieldCheck,
  LayoutGrid,
  Square,
  Sparkles
} from 'lucide-react';

export default function MeetingControls() {
  const { t, locale } = useLanguage();
  const { 
    roomId, 
    localUser, 
    audioVolume,
    toggleAudio, 
    toggleVideo, 
    toggleScreenShare, 
    toggleHandRaise, 
    toggleCaptions,
    captionsEnabled,
    sendReaction,
    activeSidePanel, 
    setActiveSidePanel, 
    activeModal, 
    setActiveModal,
    leaveMeeting,
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    unreadCount,
    setUnreadCount,
    participants,
    layoutMode,
    setLayoutMode
  } = useMeeting();

  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [layoutMenuOpen, setLayoutMenuOpen] = useState(false);
  const [clockStr, setClockStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockStr(now.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [locale]);

  const togglePanel = (panelName) => {
    if (activeSidePanel === panelName) {
      setActiveSidePanel(null);
    } else {
      setActiveSidePanel(panelName);
      if (panelName === 'chat') {
        setUnreadCount(0);
      }
    }
  };

  const formatRecordingTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const reactionEmojis = ['👍', '❤️', '👏', '😂', '😮', '🎉', '🚀', '💡'];

  return (
    <div className="w-full px-4 py-3 bg-[#172740]/95 dark:bg-[#0E1A29]/95 backdrop-blur-xl border-t border-slate-700/60 flex items-center justify-between text-white select-none z-30">
      
      {/* Left Info: Saudi Time & Meeting Code & Recording Badge */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <span className="font-mono text-sm text-slate-300 font-medium hidden sm:inline">
          {clockStr}
        </span>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <span className="font-mono text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
          {roomId}
        </span>

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-rose-600/20 border border-rose-500/50 text-rose-400 text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>REC {formatRecordingTime(recordingDuration)}</span>
          </div>
        )}
      </div>

      {/* Center Controls: Floating Buttons Bar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        
        {/* Microphone Toggle Button */}
        <button
          onClick={() => toggleAudio()}
          className={`relative p-3 sm:p-3.5 rounded-full transition-transform active:scale-95 shadow-md ${
            localUser.audio
              ? 'bg-slate-700/80 hover:bg-slate-600/90 text-white border border-slate-600'
              : 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500'
          }`}
          title={localUser.audio ? t('turnOffMic') : t('turnOnMic')}
        >
          {localUser.audio ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          
          {/* Subtle audio volume ring */}
          {localUser.audio && audioVolume > 15 && (
            <span 
              className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-60 pointer-events-none"
              style={{ animationDuration: '1s' }}
            />
          )}
        </button>

        {/* Camera Toggle Button */}
        <button
          onClick={() => toggleVideo()}
          className={`p-3 sm:p-3.5 rounded-full transition-transform active:scale-95 shadow-md ${
            localUser.video
              ? 'bg-slate-700/80 hover:bg-slate-600/90 text-white border border-slate-600'
              : 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500'
          }`}
          title={localUser.video ? t('turnOffCam') : t('turnOnCam')}
        >
          {localUser.video ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Captions Toggle (CC) */}
        <button
          onClick={toggleCaptions}
          className={`p-3 sm:p-3.5 rounded-full transition-transform active:scale-95 shadow-md ${
            captionsEnabled
              ? 'bg-mirqam-teal text-white border border-mirqam-teal-light'
              : 'bg-slate-700/80 hover:bg-slate-600/90 text-white border border-slate-600'
          }`}
          title={captionsEnabled ? t('captionsOn') : t('captionsOff')}
        >
          <Subtitles className="w-5 h-5" />
        </button>

        {/* Raise Hand Button */}
        <button
          onClick={toggleHandRaise}
          className={`p-3 sm:p-3.5 rounded-full transition-transform active:scale-95 shadow-md ${
            localUser.handRaised
              ? 'bg-amber-500 text-white border border-amber-400 animate-bounce'
              : 'bg-slate-700/80 hover:bg-slate-600/90 text-white border border-slate-600'
          }`}
          title={localUser.handRaised ? t('lowerHand') : t('raiseHand')}
        >
          <Hand className="w-5 h-5" />
        </button>

        {/* Screen Share Button */}
        <button
          onClick={toggleScreenShare}
          className={`p-3 sm:p-3.5 rounded-full transition-transform active:scale-95 shadow-md ${
            localUser.isPresenting
              ? 'bg-sky-500 text-white border border-sky-400'
              : 'bg-slate-700/80 hover:bg-slate-600/90 text-white border border-slate-600'
          }`}
          title={localUser.isPresenting ? t('stopSharing') : t('shareScreen')}
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* Emoji Reactions Popover */}
        <div className="relative">
          <button
            onClick={() => setReactionsOpen(!reactionsOpen)}
            className={`p-3 sm:p-3.5 rounded-full transition-transform active:scale-95 shadow-md ${
              reactionsOpen
                ? 'bg-mirqam-teal text-white border border-mirqam-teal-light'
                : 'bg-slate-700/80 hover:bg-slate-600/90 text-white border border-slate-600'
            }`}
            title={t('reactions')}
          >
            <Smile className="w-5 h-5" />
          </button>

          {reactionsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setReactionsOpen(false)} />
              <div className="absolute bottom-full mb-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center gap-1.5 p-2 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl z-50 animate-in fade-in zoom-in-90 duration-150">
                {reactionEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      sendReaction(emoji);
                      setReactionsOpen(false);
                    }}
                    className="w-10 h-10 rounded-xl hover:bg-slate-800 text-xl flex items-center justify-center hover:scale-125 transition-all"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Whiteboard / Jamboard Button */}
        <button
          onClick={() => togglePanel('whiteboard')}
          className={`p-3 sm:p-3.5 rounded-full transition-transform active:scale-95 shadow-md ${
            activeSidePanel === 'whiteboard'
              ? 'bg-mirqam-teal text-white border border-mirqam-teal-light'
              : 'bg-slate-700/80 hover:bg-slate-600/90 text-white border border-slate-600'
          }`}
          title={t('whiteboard')}
        >
          <Edit3 className="w-5 h-5" />
        </button>

        {/* More Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="p-3 sm:p-3.5 rounded-full bg-slate-700/80 hover:bg-slate-600/90 text-white border border-slate-600 transition-transform active:scale-95 shadow-md"
            title={t('moreOptions')}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {moreMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />
              <div className="absolute bottom-full mb-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-64 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                
                {/* Record Meeting */}
                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (isRecording) {
                      stopRecording();
                    } else {
                      startRecording();
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
                >
                  <Disc className={`w-4 h-4 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                  <span>{isRecording ? t('stopRecording') : t('recordMeeting')}</span>
                </button>

                {/* Change Layout */}
                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setLayoutMenuOpen(!layoutMenuOpen);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-4 h-4 text-slate-400" />
                    <span>تغيير التخطيط (Layout)</span>
                  </div>
                  <span className="text-[10px] text-mirqam-teal uppercase font-semibold">{layoutMode}</span>
                </button>

                {/* Toggle Fullscreen */}
                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen().catch(() => {});
                    } else {
                      document.exitFullscreen().catch(() => {});
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
                >
                  <Maximize className="w-4 h-4 text-slate-400" />
                  <span>ملء الشاشة</span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setActiveModal('settings');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>{t('settings')}</span>
                </button>

                {/* Shortcuts */}
                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setActiveModal('shortcuts');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>{t('shortcuts')}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* End Call Button (Red Pill) */}
        <button
          onClick={leaveMeeting}
          className="px-5 py-3 sm:py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
          title={t('leaveCall')}
        >
          <PhoneOff className="w-5 h-5" />
          <span className="text-xs font-semibold hidden md:inline">{t('leaveCall')}</span>
        </button>
      </div>

      {/* Right Side Panels Toggles: Info, People, Chat, Polls, Host Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-[200px] justify-end">
        
        {/* Meeting Info (i) */}
        <button
          onClick={() => togglePanel('details')}
          className={`p-2.5 rounded-xl transition-colors ${
            activeSidePanel === 'details'
              ? 'bg-mirqam-teal text-white'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
          title={t('meetingDetails')}
        >
          <Info className="w-5 h-5" />
        </button>

        {/* Participants / People List */}
        <button
          onClick={() => togglePanel('people')}
          className={`p-2.5 rounded-xl transition-colors relative ${
            activeSidePanel === 'people'
              ? 'bg-mirqam-teal text-white'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
          title={t('people')}
        >
          <Users className="w-5 h-5" />
          <span className="absolute -top-1 -end-1 bg-mirqam-teal dark:bg-mirqam-teal text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full border border-slate-900">
            {participants.length + 1}
          </span>
        </button>

        {/* In-Call Chat */}
        <button
          onClick={() => togglePanel('chat')}
          className={`p-2.5 rounded-xl transition-colors relative ${
            activeSidePanel === 'chat'
              ? 'bg-mirqam-teal text-white'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
          title={t('chat')}
        >
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -end-1 bg-rose-500 text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full border border-slate-900 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Activities / Polls */}
        <button
          onClick={() => togglePanel('activities')}
          className={`p-2.5 rounded-xl transition-colors ${
            activeSidePanel === 'activities'
              ? 'bg-mirqam-teal text-white'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
          title={t('polls')}
        >
          <BarChart2 className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
