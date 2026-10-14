import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMeeting } from '../../context/MeetingContext';
import { 
  Users, 
  X, 
  Search, 
  UserPlus, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Pin, 
  PinOff, 
  Hand, 
  VolumeX, 
  ShieldCheck, 
  MoreVertical 
} from 'lucide-react';

export default function ParticipantsPanel() {
  const { t } = useLanguage();
  const { 
    localUser, 
    participants, 
    setActiveSidePanel, 
    setActiveModal, 
    muteAllParticipants,
    addSimulatedPeers,
    removeSimulatedPeers,
    pinnedParticipantId,
    setPinnedParticipantId 
  } = useMeeting();

  const [searchQuery, setSearchQuery] = useState('');

  const hasSimulated = participants.some(p => p.id.startsWith('sim-'));

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-100">
      
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-mirqam-teal" />
          <h3 className="font-bold text-sm">
            {t('people')} ({participants.length + 1})
          </h3>
        </div>
        <button
          onClick={() => setActiveSidePanel(null)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Top Action Buttons: Add People & Mute All */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('invite')}
            className="flex-1 py-2 px-3 rounded-xl bg-mirqam-teal/15 hover:bg-mirqam-teal text-mirqam-teal hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('addPeople')}</span>
          </button>

          <button
            onClick={muteAllParticipants}
            className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="كتم صوت جميع المشاركين في المكالمة"
          >
            <VolumeX className="w-4 h-4" />
            <span>{t('muteAll')}</span>
          </button>
        </div>

        {/* Demo Test Mode Button */}
        <button
          onClick={hasSimulated ? removeSimulatedPeers : addSimulatedPeers}
          className="w-full py-1.5 px-2.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:border-mirqam-teal text-[11px] text-slate-500 dark:text-slate-400 hover:text-mirqam-teal transition-colors flex items-center justify-center gap-1.5"
        >
          <span>{hasSimulated ? '✕ إزالة المشاركين التجريبيين (Demo)' : '+ إضافة مشاركين تجريبيين للاختبار (Demo)'}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="px-4 py-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="relative">
          <Search className="w-4 h-4 absolute inset-y-0 start-3 my-auto text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchParticipants')}
            className="w-full ps-9 pe-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-mirqam-teal text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        
        {/* Local User */}
        <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mirqam-teal to-mirqam-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
              {localUser.name ? localUser.name.charAt(0) : 'أ'}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold truncate">{localUser.name}</span>
                <span className="text-[10px] text-slate-400">({t('you')})</span>
              </div>
              <span className="text-[10px] text-mirqam-teal font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>مستضيف الاجتماع</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            {localUser.handRaised && <Hand className="w-4 h-4 text-amber-500 animate-bounce" />}
            {localUser.audio ? <Mic className="w-4 h-4 text-emerald-500" /> : <MicOff className="w-4 h-4 text-rose-500" />}
            {localUser.video ? <Video className="w-4 h-4 text-slate-400" /> : <VideoOff className="w-4 h-4 text-rose-500" />}
          </div>
        </div>

        {/* Remote Attendees */}
        {filteredParticipants.map((peer) => {
          const isPinned = pinnedParticipantId === peer.id;

          return (
            <div 
              key={peer.id}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {peer.avatar ? (
                  <img src={peer.avatar} alt={peer.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {peer.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate">{peer.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{peer.role || 'عضو مشارك'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                {peer.handRaised && <Hand className="w-4 h-4 text-amber-500 animate-bounce" />}
                
                {/* Pin button */}
                <button
                  onClick={() => setPinnedParticipantId(isPinned ? null : peer.id)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                  title={isPinned ? t('unpinTile') : t('pinTile')}
                >
                  {isPinned ? <PinOff className="w-3.5 h-3.5 text-mirqam-teal" /> : <Pin className="w-3.5 h-3.5" />}
                </button>

                {peer.audio ? <Mic className="w-4 h-4 text-emerald-500" /> : <MicOff className="w-4 h-4 text-rose-500" />}
                {peer.video ? <Video className="w-4 h-4 text-slate-400" /> : <VideoOff className="w-4 h-4 text-rose-500" />}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
