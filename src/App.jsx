import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { MeetingProvider, useMeeting } from './context/MeetingContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import GreenRoom from './components/GreenRoom';
import MeetingRoom from './components/MeetingRoom';
import PostMeetingView from './components/PostMeetingView';

// Modals
import SettingsModal from './components/Modals/SettingsModal';
import ShortcutsModal from './components/Modals/ShortcutsModal';
import InviteModal from './components/Modals/InviteModal';
import ScheduleModal from './components/Modals/ScheduleModal';
import CreateForLaterModal from './components/Modals/CreateForLaterModal';

function MainApp() {
  const { 
    meetingState, 
    activeModal, 
    toggleAudio, 
    toggleVideo, 
    toggleHandRaise, 
    toggleScreenShare,
    setActiveSidePanel,
    goToGreenRoom 
  } = useMeeting();

  // Handle URL params e.g. /?room=mqm-abc-xyz
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && meetingState === 'landing') {
      goToGreenRoom(roomParam);
    }
  }, [goToGreenRoom, meetingState]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // Toggle Mic: Ctrl+D or M
      if ((e.ctrlKey && (e.key === 'd' || e.key === 'D')) || e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleAudio();
      }
      // Toggle Camera: Ctrl+E or V
      else if ((e.ctrlKey && (e.key === 'e' || e.key === 'E')) || e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        toggleVideo();
      }
      // Raise Hand: H
      else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        toggleHandRaise();
      }
      // Screen share: S
      else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        toggleScreenShare();
      }
      // Toggle Chat: C
      else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setActiveSidePanel(curr => (curr === 'chat' ? null : 'chat'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAudio, toggleVideo, toggleHandRaise, toggleScreenShare, setActiveSidePanel]);

  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-mirqam-teal selection:text-white">
      {/* Top Header shown on landing, greenroom, and post-meeting */}
      {meetingState !== 'inmeeting' && <Header />}

      {/* Main Views */}
      <main className="flex-1 flex flex-col">
        {meetingState === 'landing' && <LandingPage />}
        {meetingState === 'greenroom' && <GreenRoom />}
        {meetingState === 'inmeeting' && <MeetingRoom />}
        {meetingState === 'left' && <PostMeetingView />}
      </main>

      {/* Modals Container */}
      {activeModal === 'settings' && <SettingsModal />}
      {activeModal === 'shortcuts' && <ShortcutsModal />}
      {activeModal === 'invite' && <InviteModal />}
      {activeModal === 'schedule' && <ScheduleModal />}
      {activeModal === 'createForLater' && <CreateForLaterModal />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MeetingProvider>
          <MainApp />
        </MeetingProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
