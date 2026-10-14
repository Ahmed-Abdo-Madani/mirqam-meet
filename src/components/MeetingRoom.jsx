import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMeeting } from '../context/MeetingContext';
import { 
  Mic, 
  MicOff, 
  Pin, 
  PinOff, 
  Hand, 
  Maximize, 
  MoreVertical, 
  Volume2, 
  ShieldCheck, 
  Sparkles,
  Monitor,
  X
} from 'lucide-react';
import MeetingControls from './MeetingControls';
import ParticipantsPanel from './SidePanels/ParticipantsPanel';
import ChatPanel from './SidePanels/ChatPanel';
import MeetingInfoPanel from './SidePanels/MeetingInfoPanel';
import PollsPanel from './SidePanels/PollsPanel';
import WhiteboardPanel from './SidePanels/WhiteboardPanel';

export default function MeetingRoom() {
  const { t, isRtl } = useLanguage();
  const { 
    localUser, 
    localStream, 
    screenStream,
    participants, 
    activeSidePanel, 
    setActiveSidePanel,
    pinnedParticipantId, 
    setPinnedParticipantId,
    activeSpeakerId,
    reactions,
    captionsEnabled,
    currentSubtitle,
    audioVolume,
    toggleScreenShare
  } = useMeeting();

  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);

  // Bind local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localUser.video]);

  // Bind screen share stream
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // Determine grid layout classes based on total tiles
  const totalCount = participants.length + 1 + (localUser.isPresenting ? 1 : 0);

  const getGridClasses = () => {
    if (pinnedParticipantId || localUser.isPresenting) {
      return 'flex flex-col lg:flex-row gap-3 h-full';
    }
    if (totalCount === 1) return 'grid grid-cols-1 max-w-4xl mx-auto h-full';
    if (totalCount === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-3 h-full max-w-6xl mx-auto';
    if (totalCount <= 4) return 'grid grid-cols-1 sm:grid-cols-2 gap-3 h-full';
    if (totalCount <= 6) return 'grid grid-cols-2 md:grid-cols-3 gap-3 h-full';
    return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 h-full';
  };

  const isLocalPinned = pinnedParticipantId === 'local';
  const pinnedRemote = participants.find(p => p.id === pinnedParticipantId);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A1420] text-white relative">
      
      {/* Floating Reactions Layer */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {reactions.map((react) => (
          <div
            key={react.id}
            className="reaction-bubble flex flex-col items-center"
            style={{ left: react.left, bottom: '80px' }}
          >
            <span className="text-4xl filter drop-shadow-lg">{react.emoji}</span>
            <span className="text-[11px] font-semibold text-white/90 bg-slate-900/80 px-2 py-0.5 rounded-full mt-1 border border-white/20">
              {react.senderName}
            </span>
          </div>
        ))}
      </div>

      {/* Main Video Arena & Side Panel Drawer */}
      <div className="flex-1 flex overflow-hidden p-3 sm:p-4 gap-3">
        
        {/* Video Grid Arena */}
        <div className="flex-1 flex flex-col min-w-0 relative h-full">
          
          {/* "You are presenting" Banner */}
          {localUser.isPresenting && (
            <div className="mb-2 px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-between text-xs text-sky-200">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-sky-400" />
                <span className="font-semibold">{t('youArePresenting')}</span>
              </div>
              <button
                onClick={toggleScreenShare}
                className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold transition-colors"
              >
                {t('stopSharing')}
              </button>
            </div>
          )}

          {/* Videos Grid Container */}
          <div className={`w-full h-full flex-1 ${getGridClasses()} items-center justify-center overflow-y-auto`}>
            
            {/* Screen Share Tile (if presenting) */}
            {localUser.isPresenting && screenStream && (
              <div className="flex-1 w-full h-full min-h-[300px] rounded-2xl overflow-hidden bg-black border-2 border-sky-500/60 relative flex items-center justify-center shadow-2xl">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-3 start-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-sky-300 flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-sky-400" />
                  <span>مشاركة الشاشة الحية (Screen Share)</span>
                </div>
              </div>
            )}

            {/* Local User Tile */}
            <div 
              className={`relative rounded-2xl overflow-hidden bg-[#132235] border transition-all duration-200 flex items-center justify-center group ${
                isLocalPinned ? 'flex-1 h-full' : 'w-full h-full min-h-[160px]'
              } ${
                activeSpeakerId === 'local' 
                  ? 'border-mirqam-teal shadow-[0_0_20px_rgba(35,148,154,0.5)] ring-2 ring-mirqam-teal' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {localUser.video && localStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-mirqam-teal to-mirqam-navy flex items-center justify-center text-white text-2xl font-bold border-2 border-mirqam-teal/40 shadow-lg">
                    {localUser.name ? localUser.name.charAt(0) : 'أ'}
                  </div>
                </div>
              )}

              {/* Hand Raise Badge */}
              {localUser.handRaised && (
                <div className="absolute top-3 end-3 p-2 rounded-full bg-amber-500 text-white shadow-lg hand-active z-10" title={t('handRaised')}>
                  <Hand className="w-4 h-4" />
                </div>
              )}

              {/* Pin Tile Button */}
              <button
                onClick={() => setPinnedParticipantId(isLocalPinned ? null : 'local')}
                className="absolute top-3 start-3 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title={isLocalPinned ? t('unpinTile') : t('pinTile')}
              >
                {isLocalPinned ? <PinOff className="w-4 h-4 text-mirqam-teal" /> : <Pin className="w-4 h-4" />}
              </button>

              {/* Bottom Name & Mic Tag */}
              <div className="absolute bottom-3 start-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-medium z-10">
                <span className="truncate max-w-[140px]">{localUser.name} ({t('you')})</span>
                {!localUser.audio ? (
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse delay-75" />
                  </div>
                )}
              </div>
            </div>

            {/* Remote Participants Tiles */}
            {participants.map((peer) => {
              const isPinned = pinnedParticipantId === peer.id;
              const isSpeaking = activeSpeakerId === peer.id;

              return (
                <div
                  key={peer.id}
                  className={`relative rounded-2xl overflow-hidden bg-[#132235] border transition-all duration-200 flex items-center justify-center group ${
                    isPinned ? 'flex-1 h-full' : 'w-full h-full min-h-[160px]'
                  } ${
                    isSpeaking 
                      ? 'border-mirqam-teal shadow-[0_0_20px_rgba(35,148,154,0.5)] ring-2 ring-mirqam-teal' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {peer.video ? (
                    peer.videoUrl ? (
                      <video
                        src={peer.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                        <img 
                          src={peer.avatar} 
                          alt={peer.name} 
                          className="w-full h-full object-cover filter brightness-95" 
                        />
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {peer.avatar ? (
                        <img 
                          src={peer.avatar} 
                          alt={peer.name} 
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-700 shadow-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-600 to-mirqam-navy flex items-center justify-center text-white text-2xl font-bold border-2 border-indigo-400/40 shadow-lg">
                          {peer.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hand Raise Badge */}
                  {peer.handRaised && (
                    <div className="absolute top-3 end-3 p-2 rounded-full bg-amber-500 text-white shadow-lg hand-active z-10" title={t('handRaised')}>
                      <Hand className="w-4 h-4" />
                    </div>
                  )}

                  {/* Pin Tile Button */}
                  <button
                    onClick={() => setPinnedParticipantId(isPinned ? null : peer.id)}
                    className="absolute top-3 start-3 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title={isPinned ? t('unpinTile') : t('pinTile')}
                  >
                    {isPinned ? <PinOff className="w-4 h-4 text-mirqam-teal" /> : <Pin className="w-4 h-4" />}
                  </button>

                  {/* Bottom Name & Mic Tag */}
                  <div className="absolute bottom-3 start-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-medium z-10">
                    <span className="truncate max-w-[150px]">{peer.name}</span>
                    {!peer.audio ? (
                      <MicOff className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-2 bg-emerald-400 rounded-full" />
                        <span className="w-1 h-3 bg-emerald-400 rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Live Subtitles Banner (Google Meet Captions) */}
          {captionsEnabled && currentSubtitle && (
            <div className="absolute bottom-4 inset-x-8 sm:inset-x-24 z-20 flex justify-center pointer-events-none">
              <div className="max-w-2xl px-5 py-3 rounded-2xl bg-black/85 backdrop-blur-md border border-slate-700/80 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <span className="font-bold text-mirqam-teal text-xs whitespace-nowrap">
                  {currentSubtitle.speaker}:
                </span>
                <span className="text-sm font-medium text-slate-100 leading-snug">
                  {currentSubtitle.text}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Collapsible Right Side Panel Drawer */}
        {activeSidePanel && (
          <aside className="w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#111F30] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right-4 duration-200 z-30">
            {activeSidePanel === 'details' && <MeetingInfoPanel />}
            {activeSidePanel === 'people' && <ParticipantsPanel />}
            {activeSidePanel === 'chat' && <ChatPanel />}
            {activeSidePanel === 'activities' && <PollsPanel />}
            {activeSidePanel === 'whiteboard' && <WhiteboardPanel />}
          </aside>
        )}

      </div>

      {/* Floating Bottom Control Bar */}
      <MeetingControls />
    </div>
  );
}
