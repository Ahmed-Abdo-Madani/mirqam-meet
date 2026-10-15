import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMeeting } from '../context/MeetingContext';
import { 
  Mic, 
  MicOff, 
  Pin, 
  PinOff, 
  Hand, 
  Monitor, 
  Volume2
} from 'lucide-react';
import MeetingControls from './MeetingControls';
import ParticipantsPanel from './SidePanels/ParticipantsPanel';
import ChatPanel from './SidePanels/ChatPanel';
import MeetingInfoPanel from './SidePanels/MeetingInfoPanel';
import PollsPanel from './SidePanels/PollsPanel';
import WhiteboardPanel from './SidePanels/WhiteboardPanel';

// Dedicated Remote Participant Video & Audio Player
function RemoteParticipantTile({
  peer,
  stream,
  isCompact = false,
  isPinned = false,
  onPin,
  isSpeaking = false,
  t
}) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Attach and play remote video track
  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Remote video play warning:', e));
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  // Attach and play remote audio track
  useEffect(() => {
    if (audioRef.current) {
      if (stream) {
        audioRef.current.srcObject = stream;
        audioRef.current.play().catch(e => console.warn('Remote audio play warning:', e));
      } else {
        audioRef.current.srcObject = null;
      }
    }
  }, [stream]);

  const hasStream = !!stream;
  const isVideoOn = hasStream ? peer.video !== false : !!peer.video;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-[#132235] border transition-all duration-200 flex items-center justify-center group ${
        isCompact ? 'w-full h-36 shrink-0' : 'w-full h-full min-h-[180px]'
      } ${
        isSpeaking 
          ? 'border-mirqam-teal shadow-[0_0_20px_rgba(35,148,154,0.5)] ring-2 ring-mirqam-teal' 
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Remote Audio Track: NOT muted, plays sound directly to speaker */}
      {hasStream && (
        <audio ref={audioRef} autoPlay playsInline />
      )}

      {/* Real WebRTC Video Feed */}
      {hasStream && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${isVideoOn ? 'block' : 'hidden'}`}
        />
      )}

      {/* Fallback Avatar or Demo Video */}
      {(!hasStream || !isVideoOn) && (
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
          <div className="flex flex-col items-center gap-2">
            {peer.avatar ? (
              <img 
                src={peer.avatar} 
                alt={peer.name} 
                className={`${isCompact ? 'w-12 h-12' : 'w-20 h-20'} rounded-full object-cover border-2 border-slate-700 shadow-lg`}
              />
            ) : (
              <div className={`${isCompact ? 'w-12 h-12 text-sm' : 'w-20 h-20 text-2xl'} rounded-full bg-gradient-to-br from-indigo-600 to-mirqam-navy flex items-center justify-center text-white font-bold border-2 border-indigo-400/40 shadow-lg`}>
                {peer.name.charAt(0)}
              </div>
            )}
            <span className="text-[11px] text-slate-400">{t('cameraOff')}</span>
          </div>
        )
      )}

      {/* Hand Raise Badge */}
      {peer.handRaised && (
        <div className="absolute top-2.5 end-2.5 p-1.5 rounded-full bg-amber-500 text-white shadow-lg hand-active z-10" title={t('handRaised')}>
          <Hand className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Pin Tile Button */}
      <button
        onClick={() => onPin(isPinned ? null : peer.id)}
        className="absolute top-2.5 start-2.5 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title={isPinned ? t('unpinTile') : t('pinTile')}
      >
        {isPinned ? <PinOff className="w-3.5 h-3.5 text-mirqam-teal" /> : <Pin className="w-3.5 h-3.5" />}
      </button>

      {/* Bottom Name & Mic Tag */}
      <div className="absolute bottom-2.5 start-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-medium z-10">
        <span className="truncate max-w-[120px]">{peer.name}</span>
        {peer.audio === false ? (
          <MicOff className="w-3 h-3 text-rose-400" />
        ) : (
          <div className="flex items-center gap-0.5">
            <span className="w-1 h-2 bg-emerald-400 rounded-full" />
            <span className="w-1 h-3 bg-emerald-400 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function MeetingRoom() {
  const { t, isRtl } = useLanguage();
  const { 
    roomId,
    returnHome,
    localUser, 
    localStream, 
    screenStream,
    remoteStreams,
    participants, 
    activeSidePanel, 
    pinnedParticipantId, 
    setPinnedParticipantId,
    activeSpeakerId,
    reactions,
    captionsEnabled,
    currentSubtitle,
    toggleScreenShare
  } = useMeeting();

  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);

  // Trigger screen share if user entered with present=true from GreenRoom
  useEffect(() => {
    if (localUser.isPresenting && !screenStream) {
      toggleScreenShare();
    }
  }, []);

  // Unlock browser audio autoplay policy on user interaction
  useEffect(() => {
    const unlockAudio = () => {
      document.querySelectorAll('audio, video').forEach(media => {
        if (media.paused && media.srcObject) {
          media.play().catch(() => {});
        }
      });
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Bind local stream to local video tag
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

  const hasSpotlight = (localUser.isPresenting && screenStream) || pinnedParticipantId;
  const isLocalPinned = pinnedParticipantId === 'local';
  const pinnedRemote = participants.find(p => p.id === pinnedParticipantId);

  // Local User Tile Renderer
  const renderLocalTile = (isCompact = false) => {
    return (
      <div 
        className={`relative rounded-2xl overflow-hidden bg-[#132235] border transition-all duration-200 flex items-center justify-center group ${
          isCompact ? 'w-full h-36 shrink-0' : 'w-full h-full min-h-[180px]'
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
            <div className={`${isCompact ? 'w-12 h-12 text-sm' : 'w-20 h-20 text-2xl'} rounded-full bg-gradient-to-br from-mirqam-teal to-mirqam-navy flex items-center justify-center text-white font-bold border-2 border-mirqam-teal/40 shadow-lg`}>
              {localUser.name ? localUser.name.charAt(0) : 'أ'}
            </div>
            <span className="text-[11px] text-slate-400">{t('cameraOff')}</span>
          </div>
        )}

        {/* Hand Raise Badge */}
        {localUser.handRaised && (
          <div className="absolute top-2.5 end-2.5 p-1.5 rounded-full bg-amber-500 text-white shadow-lg hand-active z-10" title={t('handRaised')}>
            <Hand className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Pin Tile Button */}
        <button
          onClick={() => setPinnedParticipantId(isLocalPinned ? null : 'local')}
          className="absolute top-2.5 start-2.5 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title={isLocalPinned ? t('unpinTile') : t('pinTile')}
        >
          {isLocalPinned ? <PinOff className="w-3.5 h-3.5 text-mirqam-teal" /> : <Pin className="w-3.5 h-3.5" />}
        </button>

        {/* Bottom Name & Mic Tag */}
        <div className="absolute bottom-2.5 start-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-medium z-10">
          <span className="truncate max-w-[120px]">{localUser.name} ({t('you')})</span>
          {!localUser.audio ? (
            <MicOff className="w-3 h-3 text-rose-400" />
          ) : (
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse delay-75" />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Normal Equal Grid Class calculation
  const totalCount = participants.length + 1;
  const getGridClasses = () => {
    if (totalCount === 1) return 'grid grid-cols-1 max-w-4xl w-full mx-auto h-full max-h-[75vh]';
    if (totalCount === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full h-full max-w-6xl mx-auto';
    if (totalCount <= 4) return 'grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full h-full';
    if (totalCount <= 6) return 'grid grid-cols-2 md:grid-cols-3 gap-3.5 w-full h-full';
    return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 w-full h-full';
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A1420] text-white relative">
      {/* Top Header inside meeting */}
      <div className="w-full px-4 py-2.5 bg-black/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-mirqam-teal to-teal-400 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            مـ
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wide">
              {roomId === 'mirqam-team' ? (isRtl ? 'اجتماع فريق مرقام اليومي' : 'Mirqam Team Daily Huddle') : `${isRtl ? 'غرفة:' : 'Room:'} ${roomId}`}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse me-1" />
              {isRtl ? 'مباشر' : 'Live'}
            </span>
          </div>
        </div>

        <button
          onClick={returnHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all hover:scale-[1.02]"
          title={isRtl ? 'الرجوع إلى لوحة أعمال مرقام' : 'Return to Mirqam Workspace'}
        >
          <span>🏢</span>
          <span>{isRtl ? 'لوحة الأعمال' : 'Workspace'}</span>
        </button>
      </div>
      
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

          {/* SPOTLIGHT / SCREEN SHARE LAYOUT */}
          {hasSpotlight ? (
            <div className="flex-1 flex flex-col lg:flex-row gap-3 h-full overflow-hidden">
              
              {/* Primary Stage */}
              <div className="flex-1 h-full min-h-[300px] rounded-2xl overflow-hidden bg-black border-2 border-sky-500/60 relative flex items-center justify-center shadow-2xl">
                {localUser.isPresenting && screenStream ? (
                  <>
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
                  </>
                ) : isLocalPinned ? (
                  renderLocalTile(false)
                ) : pinnedRemote ? (
                  <RemoteParticipantTile
                    peer={pinnedRemote}
                    stream={remoteStreams[pinnedRemote.id]}
                    isCompact={false}
                    isPinned={true}
                    onPin={setPinnedParticipantId}
                    isSpeaking={activeSpeakerId === pinnedRemote.id}
                    t={t}
                  />
                ) : null}
              </div>

              {/* Sidebar Filmstrip of Attendees */}
              <div className="lg:w-60 flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto shrink-0 max-h-full">
                {/* Render local tile in strip if not in spotlight */}
                {!isLocalPinned && renderLocalTile(true)}

                {/* Render remote participants in strip */}
                {participants
                  .filter(p => p.id !== pinnedParticipantId)
                  .map(p => (
                    <RemoteParticipantTile
                      key={p.id}
                      peer={p}
                      stream={remoteStreams[p.id]}
                      isCompact={true}
                      isPinned={false}
                      onPin={setPinnedParticipantId}
                      isSpeaking={activeSpeakerId === p.id}
                      t={t}
                    />
                  ))}
              </div>

            </div>
          ) : (
            /* STANDARD EQUAL GRID LAYOUT */
            <div className={`flex-1 ${getGridClasses()} items-center justify-center overflow-y-auto`}>
              {renderLocalTile(false)}
              {participants.map(p => (
                <RemoteParticipantTile
                  key={p.id}
                  peer={p}
                  stream={remoteStreams[p.id]}
                  isCompact={false}
                  isPinned={pinnedParticipantId === p.id}
                  onPin={setPinnedParticipantId}
                  isSpeaking={activeSpeakerId === p.id}
                  t={t}
                />
              ))}
            </div>
          )}

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
