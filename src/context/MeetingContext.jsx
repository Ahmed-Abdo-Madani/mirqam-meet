import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';
import { BackgroundProcessor } from '../utils/virtualBackground';

const MeetingContext = createContext();

// Mock team members for testing collaboration features
const DEFAULT_SIMULATED_PEERS = [
  {
    id: 'sim-1',
    name: 'طارق العتيبي (Tariq Al-Otaibi)',
    role: 'رئيس المنتجات | Product Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    audio: true,
    video: true,
    isHost: false,
    handRaised: false,
    audioLevel: 0,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'sim-2',
    name: 'سارة الشمري (Sarah Al-Shammari)',
    role: 'مصممة واجهات | Senior UX Designer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    audio: false,
    video: true,
    isHost: false,
    handRaised: false,
    audioLevel: 0
  },
  {
    id: 'sim-3',
    name: 'عبدالله الغامدي (Abdullah Al-Ghamdi)',
    role: 'مهندس ذكاء اصطناعي | AI Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    audio: true,
    video: false,
    isHost: false,
    handRaised: false,
    audioLevel: 0
  }
];

export function MeetingProvider({ children }) {
  // Navigation & Meeting State
  const [meetingState, setMeetingState] = useState('landing'); // 'landing' | 'greenroom' | 'inmeeting' | 'left'
  const [roomId, setRoomId] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('اجتماع فريق مرقام | Mirqam Sync');

  // User Profile in Meeting
  const [localUser, setLocalUser] = useState({
    name: localStorage.getItem('mirqam_user_name') || 'عضو فريق مرقام',
    avatar: null,
    audio: true,
    video: true,
    isHost: true,
    handRaised: false,
    isPresenting: false
  });

  // Media Streams & Devices
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({}); // { [peerId]: MediaStream }
  const [audioVolume, setAudioVolume] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState('none');
  const [devices, setDevices] = useState({ audioInputs: [], videoInputs: [], audioOutputs: [] });
  const [selectedDevices, setSelectedDevices] = useState({ audioId: '', videoId: '', speakerId: '' });

  // Meeting Room State
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeSidePanel, setActiveSidePanel] = useState(null); // 'details'|'people'|'chat'|'activities'|'whiteboard'|'captions'
  const [activeModal, setActiveModal] = useState(null); // 'settings'|'shortcuts'|'invite'|'schedule'|'createForLater'
  const [layoutMode, setLayoutMode] = useState('auto'); // 'auto'|'grid'|'spotlight'|'sidebar'
  const [pinnedParticipantId, setPinnedParticipantId] = useState(null);
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [reactions, setReactions] = useState([]);

  // Live Captions & Speech Recognition
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState(null);
  const [transcriptLog, setTranscriptLog] = useState([]);

  // Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null);

  // Collaboration: Whiteboard & Polls
  const [whiteboardPaths, setWhiteboardPaths] = useState([]);
  const [polls, setPolls] = useState([]);

  // Scheduled Meetings Store (local persistence)
  const [scheduledMeetings, setScheduledMeetings] = useState(() => {
    const saved = localStorage.getItem('mirqam_scheduled_meetings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'sch-1',
        title: 'مراجعة تحديثات منصة مرقام بوت (Mirqam Bot Sprint)',
        date: 'اليوم، 02:00 م',
        code: 'mqm-bot-sync',
        participantsCount: 4
      },
      {
        id: 'sch-2',
        title: 'جلسة تصميم واجهات الذكاء الاصطناعي (AI UX Review)',
        date: 'غداً، 11:30 ص',
        code: 'mqm-ux-rev',
        participantsCount: 3
      }
    ];
  });

  // Refs
  const socketRef = useRef(null);
  const peerConnectionsRef = useRef(new Map()); // Map<peerId, RTCPeerConnection>
  const iceCandidateQueueRef = useRef(new Map()); // Map<peerId, RTCIceCandidate[]>
  const localStreamRef = useRef(null);
  const backgroundProcessorRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);
  const recordingTimerRef = useRef(null);

  // Save user name
  useEffect(() => {
    if (localUser.name) {
      localStorage.setItem('mirqam_user_name', localUser.name);
    }
  }, [localUser.name]);

  // Save scheduled meetings
  useEffect(() => {
    localStorage.setItem('mirqam_scheduled_meetings', JSON.stringify(scheduledMeetings));
  }, [scheduledMeetings]);

  // WebRTC STUN Servers for real peer-to-peer NAT traversal
  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  };

  // Helper to create or retrieve an RTCPeerConnection for a remote peer
  const createPeerConnection = useCallback((peerId, socket) => {
    if (peerConnectionsRef.current.has(peerId)) {
      return peerConnectionsRef.current.get(peerId);
    }

    console.log(`[WebRTC] Creating RTCPeerConnection for peer ${peerId}`);
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current.set(peerId, pc);

    // Attach local stream tracks (microphone & camera)
    const activeStream = screenStream || localStreamRef.current;
    if (activeStream) {
      activeStream.getTracks().forEach((track) => {
        try {
          pc.addTrack(track, activeStream);
          console.log(`[WebRTC] Added local ${track.kind} track to peer ${peerId}`);
        } catch (e) {
          console.warn('[WebRTC] addTrack warning:', e);
        }
      });
    }

    // Handle local ICE candidates and emit to peer
    pc.onicecandidate = (event) => {
      if (event.candidate && (socket || socketRef.current)) {
        const s = socket || socketRef.current;
        s.emit('signal-ice', {
          to: peerId,
          candidate: event.candidate
        });
      }
    };

    // Handle incoming remote tracks (audio & video)
    pc.ontrack = (event) => {
      console.log(`[WebRTC] Received remote ${event.track.kind} track from peer ${peerId}`);
      let stream = event.streams && event.streams[0];
      if (!stream) {
        stream = new MediaStream([event.track]);
      }
      setRemoteStreams((prev) => {
        const existing = prev[peerId];
        if (existing) {
          if (!existing.getTracks().some(t => t.id === event.track.id)) {
            existing.addTrack(event.track);
          }
          return { ...prev, [peerId]: existing };
        }
        return {
          ...prev,
          [peerId]: stream
        };
      });
    };

    pc.onconnectionstatechange = () => {
      console.log(`[WebRTC] Peer ${peerId} connection state:`, pc.connectionState);
    };

    return pc;
  }, [screenStream]);

  // Connect Socket.IO & Register WebRTC Handlers
  useEffect(() => {
    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });
    socketRef.current = socket;

    socket.on('room-state', (data) => {
      setMessages(data.messages || []);
      setWhiteboardPaths(data.whiteboardPaths || []);
      setPolls(data.polls || []);
      
      // Combine remote real participants with our state
      const serverParticipants = (data.participants || []).filter(p => p.id !== socket.id);
      setParticipants(prev => {
        const sim = prev.filter(p => p.id.startsWith('sim-'));
        return [...serverParticipants, ...sim];
      });
    });

    // 1. Existing user sees someone join -> Initiates WebRTC Offer
    socket.on('user-joined', async ({ participant }) => {
      sounds.playJoinSound();
      setParticipants(prev => {
        if (prev.some(p => p.id === participant.id)) return prev;
        return [...prev, participant];
      });

      try {
        const pc = createPeerConnection(participant.id, socket);
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        await pc.setLocalDescription(offer);
        socket.emit('signal-offer', {
          to: participant.id,
          offer
        });
        console.log(`[WebRTC] Sent offer to newcomer ${participant.name} (${participant.id})`);
      } catch (err) {
        console.error(`[WebRTC] Failed to send offer to ${participant.id}:`, err);
      }
    });

    // 2. Newcomer receives Offer -> Sets remote desc, creates Answer
    socket.on('signal-offer', async ({ from, offer }) => {
      console.log(`[WebRTC] Received signal-offer from ${from}`);
      try {
        const pc = createPeerConnection(from, socket);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        // Flush queued candidates
        const queued = iceCandidateQueueRef.current.get(from) || [];
        for (const cand of queued) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch (e) {
            console.warn('[WebRTC] addIceCandidate queued error:', e);
          }
        }
        iceCandidateQueueRef.current.delete(from);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('signal-answer', {
          to: from,
          answer
        });
        console.log(`[WebRTC] Sent signal-answer to ${from}`);
      } catch (err) {
        console.error(`[WebRTC] Failed to handle offer from ${from}:`, err);
      }
    });

    // 3. Offer creator receives Answer -> Sets remote desc
    socket.on('signal-answer', async ({ from, answer }) => {
      console.log(`[WebRTC] Received signal-answer from ${from}`);
      try {
        const pc = peerConnectionsRef.current.get(from);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));

          // Flush queued candidates
          const queued = iceCandidateQueueRef.current.get(from) || [];
          for (const cand of queued) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(cand));
            } catch (e) {
              console.warn('[WebRTC] addIceCandidate queued error:', e);
            }
          }
          iceCandidateQueueRef.current.delete(from);
          console.log(`[WebRTC] WebRTC handshake complete with ${from}`);
        }
      } catch (err) {
        console.error(`[WebRTC] Failed to handle answer from ${from}:`, err);
      }
    });

    // 4. ICE candidate exchange
    socket.on('signal-ice', async ({ from, candidate }) => {
      if (!candidate) return;
      const pc = peerConnectionsRef.current.get(from);
      if (pc && pc.remoteDescription && pc.remoteDescription.type) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn('[WebRTC] Error adding ICE candidate:', err);
        }
      } else {
        const queued = iceCandidateQueueRef.current.get(from) || [];
        queued.push(candidate);
        iceCandidateQueueRef.current.set(from, queued);
      }
    });

    // 5. User leaves room -> Cleanup peer connection and stream
    socket.on('user-left', ({ userId, userName }) => {
      sounds.playLeaveSound();
      setParticipants(prev => prev.filter(p => p.id !== userId));
      if (peerConnectionsRef.current.has(userId)) {
        try {
          peerConnectionsRef.current.get(userId).close();
        } catch (e) {}
        peerConnectionsRef.current.delete(userId);
      }
      setRemoteStreams((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      iceCandidateQueueRef.current.delete(userId);
    });

    socket.on('user-media-toggled', ({ userId, type, enabled }) => {
      setParticipants(prev => prev.map(p => {
        if (p.id === userId) {
          return { ...p, [type]: enabled };
        }
        return p;
      }));
    });

    socket.on('user-hand-toggled', ({ userId, userName, isHandRaised }) => {
      if (isHandRaised) sounds.playHandRaise();
      setParticipants(prev => prev.map(p => {
        if (p.id === userId) {
          return { ...p, handRaised: isHandRaised };
        }
        return p;
      }));
    });

    socket.on('user-screen-share-toggled', ({ userId, isPresenting }) => {
      setParticipants(prev => prev.map(p => {
        if (p.id === userId) {
          return { ...p, isPresenting };
        }
        return p;
      }));
    });

    socket.on('chat-message', (msg) => {
      sounds.playChatPing();
      setMessages(prev => [...prev, msg]);
      setActiveSidePanel(current => {
        if (current !== 'chat') {
          setUnreadCount(c => c + 1);
        }
        return current;
      });
    });

    socket.on('reaction', (react) => {
      triggerReactionAnimation(react.emoji, react.senderName);
    });

    socket.on('whiteboard-draw', (strokeData) => {
      setWhiteboardPaths(prev => [...prev, strokeData]);
    });

    socket.on('whiteboard-cleared', () => {
      setWhiteboardPaths([]);
    });

    socket.on('poll-created', (newPoll) => {
      setPolls(prev => [...prev, newPoll]);
      sounds.playChatPing();
    });

    socket.on('poll-updated', (updatedPoll) => {
      setPolls(prev => prev.map(p => p.id === updatedPoll.id ? updatedPoll : p));
    });

    socket.on('force-mute', () => {
      toggleAudio(false);
      sounds.playMuteClick(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [createPeerConnection]);

  // Enumerate Media Devices
  const getDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const list = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = list.filter(d => d.kind === 'audioinput');
      const videoInputs = list.filter(d => d.kind === 'videoinput');
      const audioOutputs = list.filter(d => d.kind === 'audiooutput');

      setDevices({ audioInputs, videoInputs, audioOutputs });
      setSelectedDevices(prev => ({
        audioId: prev.audioId || (audioInputs[0]?.deviceId || ''),
        videoId: prev.videoId || (videoInputs[0]?.deviceId || ''),
        speakerId: prev.speakerId || (audioOutputs[0]?.deviceId || '')
      }));
    } catch (err) {
      console.warn('Failed to enumerate devices', err);
    }
  }, []);

  // Audio level analyzer
  const setupAudioMeter = useCallback((stream) => {
    try {
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) return;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let animId;

      const checkVolume = () => {
        if (!audioTrack.enabled) {
          setAudioVolume(0);
          animId = requestAnimationFrame(checkVolume);
          return;
        }
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const vol = Math.min(100, Math.round((avg / 128) * 100));
        setAudioVolume(vol);

        if (vol > 20) {
          setActiveSpeakerId('local');
        } else if (activeSpeakerId === 'local' && vol < 10) {
          setActiveSpeakerId(null);
        }

        animId = requestAnimationFrame(checkVolume);
      };

      animId = requestAnimationFrame(checkVolume);

      return () => {
        if (animId) cancelAnimationFrame(animId);
        if (audioCtx.state !== 'closed') audioCtx.close();
      };
    } catch (e) {
      console.warn('Audio meter init error', e);
    }
  }, [activeSpeakerId]);

  // Safe Media Stream Initializer (handles blocked/no hardware gracefully)
  const initLocalStream = useCallback(async (options = { audio: true, video: true }) => {
    try {
      // Stop old stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: options.audio ? { deviceId: selectedDevices.audioId ? { exact: selectedDevices.audioId } : undefined } : false,
          video: options.video ? {
            deviceId: selectedDevices.videoId ? { exact: selectedDevices.videoId } : undefined,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } : false
        });
      } catch (hardwareError) {
        console.warn('Hardware camera/mic not accessible, creating fallback mock stream', hardwareError);
        // Create synthetic video track using canvas so app continues seamlessly
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#172740';
        ctx.fillRect(0, 0, 640, 360);
        ctx.fillStyle = '#23949A';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('مرقام ميت | Mirqam Meet', 320, 180);
        stream = canvas.captureStream(15);
      }

      localStreamRef.current = stream;
      setLocalStream(stream);
      setupAudioMeter(stream);
      getDevices();
      return stream;
    } catch (err) {
      console.error('Fatal media error', err);
    }
  }, [selectedDevices, setupAudioMeter, getDevices]);

  // Background effects processor
  const changeBackgroundEffect = useCallback((effectType) => {
    setSelectedBackground(effectType);
    if (!backgroundProcessorRef.current) {
      backgroundProcessorRef.current = new BackgroundProcessor();
    }
    backgroundProcessorRef.current.setEffect(effectType);
  }, []);

  // Toggle Audio (Mute / Unmute)
  const toggleAudio = useCallback((forceVal) => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    const nextState = forceVal !== undefined ? forceVal : !localUser.audio;
    if (audioTrack) {
      audioTrack.enabled = nextState;
    }
    setLocalUser(prev => ({ ...prev, audio: nextState }));
    sounds.playMuteClick(!nextState);

    if (socketRef.current && roomId) {
      socketRef.current.emit('toggle-media', { type: 'audio', enabled: nextState });
    }
  }, [localUser.audio, roomId]);

  // Toggle Video (Camera On / Off)
  const toggleVideo = useCallback((forceVal) => {
    if (!localStreamRef.current) return;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    const nextState = forceVal !== undefined ? forceVal : !localUser.video;
    if (videoTrack) {
      videoTrack.enabled = nextState;
    }
    setLocalUser(prev => ({ ...prev, video: nextState }));

    if (socketRef.current && roomId) {
      socketRef.current.emit('toggle-media', { type: 'video', enabled: nextState });
    }
  }, [localUser.video, roomId]);

  // Screen Sharing
  const toggleScreenShare = useCallback(async () => {
    if (localUser.isPresenting) {
      // Stop sharing
      if (screenStream) {
        screenStream.getTracks().forEach(t => t.stop());
        setScreenStream(null);
      }
      setLocalUser(prev => ({ ...prev, isPresenting: false }));
      if (socketRef.current && roomId) {
        socketRef.current.emit('toggle-screen-share', { isPresenting: false });
      }
    } else {
      // Start sharing
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: true
        });

        stream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          setLocalUser(prev => ({ ...prev, isPresenting: false }));
          if (socketRef.current && roomId) {
            socketRef.current.emit('toggle-screen-share', { isPresenting: false });
          }
        };

        setScreenStream(stream);
        setLocalUser(prev => ({ ...prev, isPresenting: true }));
        if (socketRef.current && roomId) {
          socketRef.current.emit('toggle-screen-share', { isPresenting: true });
        }
      } catch (err) {
        console.warn('Screen share canceled or failed', err);
      }
    }
  }, [localUser.isPresenting, screenStream, roomId]);

  // Raise / Lower Hand
  const toggleHandRaise = useCallback(() => {
    const nextVal = !localUser.handRaised;
    setLocalUser(prev => ({ ...prev, handRaised: nextVal }));
    if (nextVal) sounds.playHandRaise();

    if (socketRef.current && roomId) {
      socketRef.current.emit('toggle-hand', { isHandRaised: nextVal });
    }
  }, [localUser.handRaised, roomId]);

  // Floating Reaction & Confetti
  const triggerReactionAnimation = useCallback((emoji, senderName) => {
    const id = Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const leftPercent = 15 + Math.random() * 70;

    setReactions(prev => [...prev, { id, emoji, senderName, left: `${leftPercent}%` }]);

    // Trigger celebration confetti on party / rocket / clap
    if (emoji === '🎉' || emoji === '🚀' || emoji === '👏') {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.85, x: leftPercent / 100 },
        colors: ['#23949A', '#172740', '#84D6D8', '#ffffff']
      });
    }

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 3500);
  }, []);

  const sendReaction = useCallback((emoji) => {
    triggerReactionAnimation(emoji, localUser.name);
    if (socketRef.current && roomId) {
      socketRef.current.emit('send-reaction', { emoji, senderName: localUser.name });
    }
  }, [triggerReactionAnimation, localUser.name, roomId]);

  // In-call Chat
  const sendChatMessage = useCallback((text) => {
    if (!text.trim() || !socketRef.current || !roomId) return;
    socketRef.current.emit('send-chat', {
      text,
      senderName: localUser.name
    });
  }, [localUser.name, roomId]);

  // Speech Recognition / Live Captions
  const toggleCaptions = useCallback(() => {
    const nextState = !captionsEnabled;
    setCaptionsEnabled(nextState);

    if (nextState) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US';

          recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                final += event.results[i][0].transcript;
              } else {
                interim += event.results[i][0].transcript;
              }
            }

            const spokenText = final || interim;
            if (spokenText.trim()) {
              const sub = {
                speaker: localUser.name,
                text: spokenText,
                time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
              };
              setCurrentSubtitle(sub);

              if (final.trim()) {
                setTranscriptLog(prev => [...prev, sub]);
                setTimeout(() => setCurrentSubtitle(null), 4000);
              }
            }
          };

          recognition.onerror = (e) => {
            console.warn('Speech recognition error', e);
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (e) {
          console.warn('SpeechRecognition failed to start', e);
        }
      } else {
        // Fallback simulation for unsupported browsers
        setCurrentSubtitle({
          speaker: 'مرقام ميت (ذكاء اصطناعي)',
          text: 'جاري تشغيل ميزة الشرح المباشر وتلخيص وقائع الاجتماع بدقة.',
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        });
        setTimeout(() => setCurrentSubtitle(null), 5000);
      }
    } else {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        speechRecognitionRef.current = null;
      }
      setCurrentSubtitle(null);
    }
  }, [captionsEnabled, localUser.name]);

  // Meeting Recording (MediaRecorder)
  const startRecording = useCallback(() => {
    if (!localStreamRef.current) return;
    try {
      recordedChunksRef.current = [];
      const streamToRecord = screenStream || localStreamRef.current;
      const recorder = new MediaRecorder(streamToRecord, { mimeType: 'video/webm;codecs=vp8,opus' });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);
    } catch (e) {
      console.warn('Recording start error', e);
    }
  }, [screenStream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setIsRecording(false);
  }, []);

  // Polls & Whiteboard
  const createPoll = useCallback((question, options) => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit('create-poll', {
      question,
      options,
      createdBy: localUser.name
    });
  }, [localUser.name, roomId]);

  const votePoll = useCallback((pollId, optionIndex) => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit('vote-poll', { pollId, optionIndex });
  }, [roomId]);

  const drawWhiteboard = useCallback((strokeData) => {
    setWhiteboardPaths(prev => [...prev, strokeData]);
    if (socketRef.current && roomId) {
      socketRef.current.emit('whiteboard-draw', strokeData);
    }
  }, [roomId]);

  const clearWhiteboard = useCallback(() => {
    setWhiteboardPaths([]);
    if (socketRef.current && roomId) {
      socketRef.current.emit('whiteboard-clear');
    }
  }, [roomId]);

  // Host Control: Mute All
  const muteAllParticipants = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('mute-all');
    }
  }, [roomId]);

  // Room Navigation Helpers
  const generateMeetingCode = () => {
    const part1 = Math.random().toString(36).substring(2, 5);
    const part2 = Math.random().toString(36).substring(2, 6);
    const part3 = Math.random().toString(36).substring(2, 5);
    return `${part1}-${part2}-${part3}`;
  };

  const createInstantMeeting = useCallback(() => {
    const code = generateMeetingCode();
    setRoomId(code);
    initLocalStream({ audio: true, video: true });
    setMeetingState('greenroom');
  }, [initLocalStream]);

  const createMeetingForLater = useCallback(() => {
    const code = generateMeetingCode();
    setRoomId(code);
    setActiveModal('createForLater');
  }, []);

  const scheduleMeeting = useCallback((newMeeting) => {
    const item = {
      id: 'sch-' + Date.now(),
      title: newMeeting.title || 'اجتماع مرقام',
      date: newMeeting.date || 'اليوم',
      code: generateMeetingCode(),
      participantsCount: 1
    };
    setScheduledMeetings(prev => [item, ...prev]);
    setActiveModal(null);
  }, []);

  const goToGreenRoom = useCallback((code) => {
    if (!code) return;
    const cleanCode = code.replace(/https?:\/\/[^/]+\//, '').trim();
    setRoomId(cleanCode);
    initLocalStream({ audio: true, video: true });
    setMeetingState('greenroom');
  }, [initLocalStream]);

  const joinMeetingRoom = useCallback((withSimulation = true) => {
    if (!socketRef.current || !roomId) return;

    socketRef.current.emit('join-room', {
      roomId,
      user: {
        name: localUser.name,
        avatar: localUser.avatar,
        audio: localUser.audio,
        video: localUser.video
      }
    });

    if (withSimulation) {
      setParticipants(DEFAULT_SIMULATED_PEERS);
    } else {
      setParticipants([]);
    }

    sounds.playJoinSound();
    setMeetingState('inmeeting');
  }, [roomId, localUser]);

  const quickJoinMeeting = useCallback(async (code, nameOrObj) => {
    if (!code) return;
    const cleanCode = code.replace(/https?:\/\/[^/]+\//, '').trim();
    setRoomId(cleanCode);
    const resolvedName = typeof nameOrObj === 'string' ? nameOrObj : (nameOrObj?.name || localUser.name);
    if (resolvedName) {
      setLocalUser(prev => ({ ...prev, name: resolvedName }));
    }
    await initLocalStream({ audio: true, video: true });
    if (socketRef.current) {
      socketRef.current.emit('join-room', {
        roomId: cleanCode,
        user: {
          name: resolvedName || 'عضو مرقام',
          avatar: localUser.avatar,
          audio: true,
          video: true
        }
      });
    }
    setParticipants([]);
    sounds.playJoinSound();
    setMeetingState('inmeeting');
  }, [initLocalStream, localUser]);

  const addSimulatedPeers = useCallback(() => {
    setParticipants(prev => {
      const nonSim = prev.filter(p => !p.id.startsWith('sim-'));
      return [...nonSim, ...DEFAULT_SIMULATED_PEERS];
    });
  }, []);

  const removeSimulatedPeers = useCallback(() => {
    setParticipants(prev => prev.filter(p => !p.id.startsWith('sim-')));
  }, []);

  const leaveMeeting = useCallback(() => {
    // Close all WebRTC peer connections
    peerConnectionsRef.current.forEach((pc) => {
      try {
        pc.close();
      } catch (e) {}
    });
    peerConnectionsRef.current.clear();
    setRemoteStreams({});
    iceCandidateQueueRef.current.clear();

    if (isRecording) {
      stopRecording();
    }
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      setLocalStream(null);
    }
    sounds.playLeaveSound();
    setMeetingState('left');
  }, [isRecording, stopRecording, screenStream]);

  const rejoinMeeting = useCallback(() => {
    initLocalStream({ audio: true, video: true });
    setMeetingState('greenroom');
  }, [initLocalStream]);

  const returnHome = useCallback(() => {
    setMeetingState('landing');
    setRoomId('');
    setRecordedBlobUrl(null);
    setTranscriptLog([]);
    setMessages([]);
  }, []);

  return (
    <MeetingContext.Provider
      value={{
        meetingState,
        setMeetingState,
        roomId,
        setRoomId,
        meetingTitle,
        setMeetingTitle,
        localUser,
        setLocalUser,
        localStream,
        screenStream,
        remoteStreams,
        audioVolume,
        participants,
        messages,
        unreadCount,
        setUnreadCount,
        activeSidePanel,
        setActiveSidePanel,
        activeModal,
        setActiveModal,
        layoutMode,
        setLayoutMode,
        pinnedParticipantId,
        setPinnedParticipantId,
        activeSpeakerId,
        reactions,
        captionsEnabled,
        currentSubtitle,
        transcriptLog,
        isRecording,
        recordingDuration,
        recordedBlobUrl,
        whiteboardPaths,
        polls,
        devices,
        selectedDevices,
        setSelectedDevices,
        selectedBackground,
        scheduledMeetings,
        // Handlers
        initLocalStream,
        toggleAudio,
        toggleVideo,
        toggleScreenShare,
        toggleHandRaise,
        sendReaction,
        sendChatMessage,
        toggleCaptions,
        startRecording,
        stopRecording,
        createPoll,
        votePoll,
        drawWhiteboard,
        clearWhiteboard,
        muteAllParticipants,
        changeBackgroundEffect,
        createInstantMeeting,
        createMeetingForLater,
        scheduleMeeting,
        goToGreenRoom,
        joinMeetingRoom,
        quickJoinMeeting,
        addSimulatedPeers,
        removeSimulatedPeers,
        leaveMeeting,
        rejoinMeeting,
        returnHome
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export const useMeeting = () => useContext(MeetingContext);
