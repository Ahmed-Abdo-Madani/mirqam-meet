import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  ar: {
    brand: 'مرقام ميت',
    brandSubtitle: 'منصة الاجتماعات الذكية',
    companyLegal: 'شركة مرقام التجارية',
    crNumber: 'السجل التجاري: 7055011105',
    landingTagline: 'اجتماعات فيديو احترافية، آمنة وموثوقة لفريق عملك',
    landingDescription: 'تواصل وتعاون مع فريقك وعملائك بجودة فائقة الدقة وتشفير متكامل، مبنية ومصممة بأعلى معايير الأمان السعودية.',
    newMeeting: 'اجتماع جديد',
    instantMeeting: 'بدء اجتماع فوري',
    createForLater: 'إنشاء اجتماع لوقت لاحق',
    scheduleMeeting: 'جدولة موعد اجتماع',
    enterCodeOrLink: 'أدخل رمز الاجتماع أو الرابط',
    join: 'انضمام',
    learnMore: 'تعرف على المزيد',
    encryptedBadge: 'تشفير تام بين الطرفين',
    saudiCloudBadge: 'استضافة سحابية سعودية معتمدة',
    latencyBadge: 'زمن استجابة منخفض جداً',
    readyToJoin: 'جاهز للانضمام؟',
    joinNow: 'انضم الآن',
    presentDirectly: 'مشاركة الشاشة مباشرة',
    enterYourName: 'اكتب اسمك الذي سيظهر للآخرين',
    defaultUserName: 'عضو فريق مرقام',
    cameraOff: 'الكاميرا متوقفة',
    micMuted: 'الميكروفون مكتوم',
    turnOnMic: 'تشغيل الميكروفون',
    turnOffMic: 'كتم الميكروفون',
    turnOnCam: 'تشغيل الكاميرا',
    turnOffCam: 'إيقاف الكاميرا',
    visualEffects: 'التأثيرات والخلفيات',
    backgroundBlurLight: 'تمويه خفيف',
    backgroundBlurHeavy: 'تمويه كامل',
    backgroundMirqamOffice: 'مكتب مرقام',
    backgroundModernTeal: 'ثيم مرقام التجريدي',
    noBackground: 'بدون خلفية',
    meetingDetails: 'تفاصيل الاجتماع',
    copyLink: 'نسخ رابط الدعوة',
    linkCopied: 'تم نسخ الرابط إلى الحافظة!',
    people: 'المشاركون',
    searchParticipants: 'بحث عن مشارك...',
    muteAll: 'كتم الجميع',
    addPeople: 'دعوة أشخاص',
    chat: 'محادثة الاجتماع',
    sendToEveryone: 'أرسل رسالة إلى الجميع...',
    send: 'إرسال',
    whiteboard: 'السبورة التعاونية',
    captions: 'الشرح والنص المباشر',
    captionsOn: 'إيقاف الشرح المباشر',
    captionsOff: 'تشغيل الشرح المباشر',
    listeningCaptions: 'جاري الاستماع للحديث وترجمته فورياً...',
    captionsNotSupported: 'المتصفح لا يدعم التعرف الصوتي المباشر، جاري محاكاة الشرح.',
    raiseHand: 'رفع اليد',
    lowerHand: 'خفض اليد',
    handRaised: 'قام برفع يده',
    shareScreen: 'مشاركة الشاشة',
    stopSharing: 'إيقاف المشاركة',
    youArePresenting: 'أنت تشارك شاشتك الآن مع الجميع',
    recordMeeting: 'تسجيل الاجتماع',
    recordingActive: 'جاري تسجيل الاجتماع',
    stopRecording: 'إيقاف التسجيل وحفظ الفيديو',
    reactions: 'إرسال تفاعل',
    moreOptions: 'المزيد من الخيارات',
    leaveCall: 'مغادرة الاجتماع',
    endCallForAll: 'إنهاء الاجتماع للجميع',
    settings: 'الإعدادات',
    audioSettings: 'إعدادات الصوت',
    videoSettings: 'إعدادات الفيديو',
    generalSettings: 'عام',
    microphone: 'الميكروفون',
    speaker: 'مكبر الصوت',
    camera: 'الكاميرا',
    testAudio: 'اختبار الصوت',
    polls: 'استطلاعات الرأي',
    createPoll: 'إنشاء استطلاع',
    pollQuestion: 'سؤال الاستطلاع',
    pollOptions: 'الخيارات',
    vote: 'تصويت',
    votesCount: 'صوت',
    pinTile: 'تثبيت في العرض الرئيسي',
    unpinTile: 'إلغاء التثبيت',
    you: 'أنت',
    meetingLeftTitle: 'لقد غادرت الاجتماع',
    meetingLeftDesc: 'شكراً لاستخدامك مرقام ميت. يمكنك إعادة الانضمام أو العودة للرئيسية.',
    rejoin: 'إعادة الانضمام',
    returnHome: 'العودة للرئيسية',
    rateMeeting: 'كيف كانت جودة الاتصال؟',
    rateThanks: 'شكراً لتقييمك!',
    upcomingMeetings: 'الاجتماعات القادمة',
    noUpcoming: 'لا توجد اجتماعات مجدولة اليوم',
    scheduleNew: 'جدولة اجتماع جديد',
    meetingTitle: 'عنوان الاجتماع',
    meetingDate: 'التاريخ والوقت',
    saveSchedule: 'حفظ الموعد',
    cancel: 'إلغاء',
    shortcuts: 'اختصارات لوحة المفاتيح',
    shortcutMic: 'كتم/تشغيل المايك (Ctrl+D أو M)',
    shortcutCam: 'كتم/تشغيل الكاميرا (Ctrl+E أو V)',
    shortcutHand: 'رفع/خفض اليد (H)',
    shortcutChat: 'فتح المحادثة (C)',
    shortcutScreen: 'مشاركة الشاشة (S)'
  },
  en: {
    brand: 'Mirqam Meet',
    brandSubtitle: 'Intelligent Video Meetings',
    companyLegal: 'Mirqam Company Commercial',
    crNumber: 'Commercial Register: 7055011105',
    landingTagline: 'Secure, enterprise-grade video meetings for modern teams',
    landingDescription: 'Connect and collaborate with ultra-low latency, crystal clear HD video, and end-to-end security designed to meet enterprise standards.',
    newMeeting: 'New meeting',
    instantMeeting: 'Start an instant meeting',
    createForLater: 'Create a meeting for later',
    scheduleMeeting: 'Schedule a meeting',
    enterCodeOrLink: 'Enter a code or link',
    join: 'Join',
    learnMore: 'Learn more',
    encryptedBadge: 'End-to-End Encrypted',
    saudiCloudBadge: 'Saudi Cloud Infrastructure',
    latencyBadge: 'Ultra-low Latency',
    readyToJoin: 'Ready to join?',
    joinNow: 'Join now',
    presentDirectly: 'Present screen directly',
    enterYourName: 'Enter your name',
    defaultUserName: 'Mirqam Team Member',
    cameraOff: 'Camera is off',
    micMuted: 'Microphone is muted',
    turnOnMic: 'Turn on microphone',
    turnOffMic: 'Mute microphone',
    turnOnCam: 'Turn on camera',
    turnOffCam: 'Turn off camera',
    visualEffects: 'Visual effects & backgrounds',
    backgroundBlurLight: 'Slight blur',
    backgroundBlurHeavy: 'Heavy blur',
    backgroundMirqamOffice: 'Mirqam Office',
    backgroundModernTeal: 'Mirqam Teal Abstract',
    noBackground: 'No background',
    meetingDetails: 'Meeting details',
    copyLink: 'Copy meeting link',
    linkCopied: 'Link copied to clipboard!',
    people: 'Participants',
    searchParticipants: 'Search participants...',
    muteAll: 'Mute all',
    addPeople: 'Add people',
    chat: 'In-call messages',
    sendToEveryone: 'Send a message to everyone...',
    send: 'Send',
    whiteboard: 'Collaborative Whiteboard',
    captions: 'Live Captions & Subtitles',
    captionsOn: 'Turn off live captions',
    captionsOff: 'Turn on live captions',
    listeningCaptions: 'Listening and transcribing speech in real-time...',
    captionsNotSupported: 'Speech recognition is not supported in this browser; simulating captions.',
    raiseHand: 'Raise hand',
    lowerHand: 'Lower hand',
    handRaised: 'raised their hand',
    shareScreen: 'Share screen',
    stopSharing: 'Stop sharing',
    youArePresenting: 'You are presenting your screen to everyone',
    recordMeeting: 'Record meeting',
    recordingActive: 'Recording is in progress',
    stopRecording: 'Stop recording & save video',
    reactions: 'Send a reaction',
    moreOptions: 'More options',
    leaveCall: 'Leave call',
    endCallForAll: 'End call for all',
    settings: 'Settings',
    audioSettings: 'Audio settings',
    videoSettings: 'Video settings',
    generalSettings: 'General',
    microphone: 'Microphone',
    speaker: 'Speaker',
    camera: 'Camera',
    testAudio: 'Test Audio',
    polls: 'Live Polls',
    createPoll: 'Start a poll',
    pollQuestion: 'Poll question',
    pollOptions: 'Options',
    vote: 'Vote',
    votesCount: 'votes',
    pinTile: 'Pin to main screen',
    unpinTile: 'Unpin tile',
    you: 'You',
    meetingLeftTitle: 'You left the meeting',
    meetingLeftDesc: 'Thank you for using Mirqam Meet. You can rejoin or return to the home screen.',
    rejoin: 'Rejoin',
    returnHome: 'Return to home',
    rateMeeting: 'How was the audio & video quality?',
    rateThanks: 'Thank you for your feedback!',
    upcomingMeetings: 'Upcoming Meetings',
    noUpcoming: 'No meetings scheduled for today',
    scheduleNew: 'Schedule New Meeting',
    meetingTitle: 'Meeting Title',
    meetingDate: 'Date & Time',
    saveSchedule: 'Save Meeting',
    cancel: 'Cancel',
    shortcuts: 'Keyboard shortcuts',
    shortcutMic: 'Toggle mic (Ctrl+D or M)',
    shortcutCam: 'Toggle camera (Ctrl+E or V)',
    shortcutHand: 'Raise/lower hand (H)',
    shortcutChat: 'Toggle chat (C)',
    shortcutScreen: 'Share screen (S)'
  }
};

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    // Default Arabic-first as requested
    const saved = localStorage.getItem('mirqam_lang');
    return saved === 'en' ? 'en' : 'ar';
  });

  useEffect(() => {
    localStorage.setItem('mirqam_lang', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const toggleLanguage = () => {
    setLocale(prev => {
      const next = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('mirqam_lang', next);
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      return next;
    });
  };

  const t = (key) => {
    return (translations[locale] && translations[locale][key]) || (translations['ar'] && translations['ar'][key]) || key;
  };

  const isAr = locale === 'ar';

  return (
    <LanguageContext.Provider value={{ 
      locale, 
      language: locale, 
      setLocale, 
      toggleLanguage, 
      t, 
      isRtl: isAr,
      isAr 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
