import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMeeting } from '../../context/MeetingContext';
import { sounds } from '../../utils/soundEffects';
import { 
  Settings, 
  X, 
  Mic, 
  Volume2, 
  Video, 
  Sliders, 
  Play, 
  ShieldCheck 
} from 'lucide-react';

export default function SettingsModal() {
  const { t } = useLanguage();
  const { 
    devices, 
    selectedDevices, 
    setSelectedDevices, 
    setActiveModal,
    audioVolume 
  } = useMeeting();

  const [activeTab, setActiveTab] = useState('audio'); // 'audio' | 'video' | 'general'
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const handleTestSpeaker = () => {
    setIsPlayingTest(true);
    sounds.playTestTone();
    setTimeout(() => setIsPlayingTest(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#111F30] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-mirqam-teal" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('settings')}</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs Row */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-6">
          <button
            onClick={() => setActiveTab('audio')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'audio'
                ? 'border-mirqam-teal text-mirqam-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{t('audioSettings')}</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'video'
                ? 'border-mirqam-teal text-mirqam-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{t('videoSettings')}</span>
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'general'
                ? 'border-mirqam-teal text-mirqam-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t('generalSettings')}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {activeTab === 'audio' && (
            <div className="space-y-4">
              
              {/* Mic device */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('microphone')}
                </label>
                <select
                  value={selectedDevices.audioId}
                  onChange={(e) => setSelectedDevices(prev => ({ ...prev, audioId: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-mirqam-teal"
                >
                  {devices.audioInputs.length > 0 ? (
                    devices.audioInputs.map((d, i) => (
                      <option key={d.deviceId || i} value={d.deviceId}>
                        {d.label || `ميكروفون ${i + 1}`}
                      </option>
                    ))
                  ) : (
                    <option value="">الميكروفون الافتراضي للنظام</option>
                  )}
                </select>

                {/* Input level bar */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">مستوى الصوت:</span>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-75"
                      style={{ width: `${audioVolume}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Speaker device & Test */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('speaker')}
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDevices.speakerId}
                    onChange={(e) => setSelectedDevices(prev => ({ ...prev, speakerId: e.target.value }))}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-mirqam-teal"
                  >
                    {devices.audioOutputs.length > 0 ? (
                      devices.audioOutputs.map((d, i) => (
                        <option key={d.deviceId || i} value={d.deviceId}>
                          {d.label || `مكبر صوت ${i + 1}`}
                        </option>
                      ))
                    ) : (
                      <option value="">مكبر الصوت الافتراضي للنظام</option>
                    )}
                  </select>
                  <button
                    onClick={handleTestSpeaker}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Play className={`w-3.5 h-3.5 ${isPlayingTest ? 'text-emerald-500 animate-spin' : ''}`} />
                    <span>{t('testAudio')}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-4">
              
              {/* Camera device */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('camera')}
                </label>
                <select
                  value={selectedDevices.videoId}
                  onChange={(e) => setSelectedDevices(prev => ({ ...prev, videoId: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-mirqam-teal"
                >
                  {devices.videoInputs.length > 0 ? (
                    devices.videoInputs.map((d, i) => (
                      <option key={d.deviceId || i} value={d.deviceId}>
                        {d.label || `كاميرا ${i + 1}`}
                      </option>
                    ))
                  ) : (
                    <option value="">الكاميرا الافتراضية للجهاز</option>
                  )}
                </select>
              </div>

              {/* Resolution */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  دقة الإرسال (Send Resolution)
                </label>
                <select className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none">
                  <option value="1080p">عالية الدقة (1080p Full HD)</option>
                  <option value="720p">قياسية (720p HD)</option>
                  <option value="360p">موفرة للبيانات (360p)</option>
                </select>
              </div>

            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-mirqam-teal" />
                  <span>شركة مرقام التجارية (Mirqam Commercial)</span>
                </div>
                <div>السجل التجاري: 7055011105</div>
                <div>الخوادم: سحابة مرقام السعودية المعتمدة</div>
                <div>إصدار المنصة: Mirqam Meet v1.0.0 Enterprise</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-5 py-2.5 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-dark text-white text-xs font-bold transition-all shadow-sm"
          >
            تم
          </button>
        </div>

      </div>
    </div>
  );
}
