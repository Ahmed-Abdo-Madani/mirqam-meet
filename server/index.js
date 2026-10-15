import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// In-memory Room State
const rooms = new Map();

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      createdAt: Date.now(),
      participants: new Map(),
      messages: [
        {
          id: 'welcome-1',
          senderId: 'system',
          senderName: 'مرقام ميت (النظام)',
          text: 'مرحباً بكم في مرقام ميت. جميع المكالمات مشفرة وآمنة وفق معايير شركة مرقام التجارية.',
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          system: true
        }
      ],
      whiteboardPaths: [],
      polls: [
        {
          id: 'poll-default-1',
          question: 'ما هو رأيك في جودة الاتصال وتصميم مرقام ميت؟',
          questionEn: 'How do you rate Mirqam Meet audio/video quality & design?',
          options: [
            { text: 'ممتازة جداً (Excellent)', votes: 3, voters: ['user-1', 'user-2', 'user-3'] },
            { text: 'جيدة (Good)', votes: 0, voters: [] },
            { text: 'تحتاج تحسين (Needs improvement)', votes: 0, voters: [] }
          ],
          createdBy: 'مرقام ميت'
        }
      ]
    });
  }
  return rooms.get(roomId);
}

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Mirqam Workspace & Meet',
    version: '2.0.0',
    company: 'Mirqam Company Commercial (شركة مرقام التجارية)',
    cr: '7055011105',
    activeRooms: rooms.size
  });
});

app.get('/api/workspace', (req, res) => {
  try {
    const data = db.getWorkspace();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/workspace/direction', (req, res) => {
  try {
    const updated = db.updateCompanyDirection(req.body);
    io.emit('workspace-updated', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tasks Endpoints
app.post('/api/tasks', (req, res) => {
  try {
    const result = db.createTask(req.body);
    io.emit('workspace-updated', result.workspace);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tasks/:id', (req, res) => {
  try {
    const result = db.updateTask(req.params.id, req.body);
    if (!result) return res.status(404).json({ error: 'Task not found' });
    io.emit('workspace-updated', result.workspace);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const updatedWorkspace = db.deleteTask(req.params.id);
    io.emit('workspace-updated', updatedWorkspace);
    res.json({ success: true, workspace: updatedWorkspace });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sales Endpoints
app.post('/api/sales', (req, res) => {
  try {
    const result = db.createSale(req.body);
    io.emit('workspace-updated', result.workspace);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/sales/:id', (req, res) => {
  try {
    const result = db.updateSale(req.params.id, req.body);
    if (!result) return res.status(404).json({ error: 'Sale record not found' });
    io.emit('workspace-updated', result.workspace);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/sales/:id', (req, res) => {
  try {
    const updatedWorkspace = db.deleteSale(req.params.id);
    io.emit('workspace-updated', updatedWorkspace);
    res.json({ success: true, workspace: updatedWorkspace });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Team Member Endpoint
app.post('/api/team', (req, res) => {
  try {
    const result = db.addTeamMember(req.body);
    io.emit('workspace-updated', result.workspace);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  if (!room) {
    return res.json({ exists: false, participantsCount: 0 });
  }
  res.json({
    exists: true,
    roomId: room.id,
    participantsCount: room.participants.size
  });
});

// Socket.io Real-time signaling & collaboration
io.on('connection', (socket) => {
  let currentRoomId = null;

  socket.on('join-room', ({ roomId, user }) => {
    currentRoomId = roomId;
    socket.join(roomId);

    const room = getOrCreateRoom(roomId);
    const isFirst = room.participants.size === 0;

    const participant = {
      id: socket.id,
      name: user.name || (socket.handshake.query.lang === 'en' ? 'Mirqam Guest' : 'ضيف مرقام'),
      avatar: user.avatar || null,
      audio: user.audio !== undefined ? user.audio : true,
      video: user.video !== undefined ? user.video : true,
      handRaised: false,
      isPresenting: false,
      isHost: isFirst,
      joinedAt: Date.now()
    };

    room.participants.set(socket.id, participant);

    // Send room state to the newly joined user
    socket.emit('room-state', {
      roomId,
      currentUser: participant,
      participants: Array.from(room.participants.values()),
      messages: room.messages,
      whiteboardPaths: room.whiteboardPaths,
      polls: room.polls
    });

    // Notify other participants in the room
    socket.to(roomId).emit('user-joined', {
      participant
    });

    console.log(`[Mirqam Meet] User ${participant.name} (${socket.id}) joined room ${roomId}`);
  });

  // WebRTC Peer-to-Peer Signaling
  socket.on('signal-offer', ({ to, offer }) => {
    io.to(to).emit('signal-offer', {
      from: socket.id,
      offer
    });
  });

  socket.on('signal-answer', ({ to, answer }) => {
    io.to(to).emit('signal-answer', {
      from: socket.id,
      answer
    });
  });

  socket.on('signal-ice', ({ to, candidate }) => {
    io.to(to).emit('signal-ice', {
      from: socket.id,
      candidate
    });
  });

  // Media Status Toggles (Mic / Camera)
  socket.on('toggle-media', ({ type, enabled }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;
    const p = room.participants.get(socket.id);
    if (p) {
      if (type === 'audio') p.audio = enabled;
      if (type === 'video') p.video = enabled;
      io.to(currentRoomId).emit('user-media-toggled', {
        userId: socket.id,
        type,
        enabled
      });
    }
  });

  // Hand Raise
  socket.on('toggle-hand', ({ isHandRaised }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;
    const p = room.participants.get(socket.id);
    if (p) {
      p.handRaised = isHandRaised;
      io.to(currentRoomId).emit('user-hand-toggled', {
        userId: socket.id,
        userName: p.name,
        isHandRaised
      });
    }
  });

  // Screen Share status
  socket.on('toggle-screen-share', ({ isPresenting }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;
    const p = room.participants.get(socket.id);
    if (p) {
      p.isPresenting = isPresenting;
      io.to(currentRoomId).emit('user-screen-share-toggled', {
        userId: socket.id,
        userName: p.name,
        isPresenting
      });
    }
  });

  // In-call Chat Message
  socket.on('send-chat', ({ text, senderName }) => {
    if (!currentRoomId || !text.trim()) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const message = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      senderId: socket.id,
      senderName: senderName || 'عضو مرقام',
      text: text.trim(),
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    room.messages.push(message);
    io.to(currentRoomId).emit('chat-message', message);
  });

  // Floating Emoji Reaction
  socket.on('send-reaction', ({ emoji, senderName }) => {
    if (!currentRoomId) return;
    io.to(currentRoomId).emit('reaction', {
      id: 'react-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      emoji,
      senderId: socket.id,
      senderName: senderName || 'عضو'
    });
  });

  // Whiteboard drawing synchronization
  socket.on('whiteboard-draw', (strokeData) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (room) {
      room.whiteboardPaths.push(strokeData);
      socket.to(currentRoomId).emit('whiteboard-draw', strokeData);
    }
  });

  socket.on('whiteboard-clear', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (room) {
      room.whiteboardPaths = [];
      io.to(currentRoomId).emit('whiteboard-cleared');
    }
  });

  // Polls
  socket.on('create-poll', ({ question, options, createdBy }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const newPoll = {
      id: 'poll-' + Date.now(),
      question,
      options: options.map(opt => ({ text: opt, votes: 0, voters: [] })),
      createdBy: createdBy || 'عضو'
    };

    room.polls.push(newPoll);
    io.to(currentRoomId).emit('poll-created', newPoll);
  });

  socket.on('vote-poll', ({ pollId, optionIndex }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const poll = room.polls.find(p => p.id === pollId);
    if (poll && poll.options[optionIndex]) {
      // Remove any previous vote by this user on this poll
      poll.options.forEach(opt => {
        const idx = opt.voters.indexOf(socket.id);
        if (idx !== -1) {
          opt.voters.splice(idx, 1);
          opt.votes = Math.max(0, opt.votes - 1);
        }
      });

      // Add vote
      poll.options[optionIndex].voters.push(socket.id);
      poll.options[optionIndex].votes += 1;

      io.to(currentRoomId).emit('poll-updated', poll);
    }
  });

  // Host Control: Mute All
  socket.on('mute-all', () => {
    if (!currentRoomId) return;
    socket.to(currentRoomId).emit('force-mute');
  });

  // Disconnection handler
  socket.on('disconnect', () => {
    if (currentRoomId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        const p = room.participants.get(socket.id);
        room.participants.delete(socket.id);
        if (p) {
          socket.to(currentRoomId).emit('user-left', {
            userId: socket.id,
            userName: p.name
          });
          console.log(`[Mirqam Meet] User ${p.name} (${socket.id}) left room ${currentRoomId}`);
        }
        if (room.participants.size === 0) {
          // Keep room for 30 minutes in case of rejoin
          setTimeout(() => {
            if (room.participants.size === 0) {
              rooms.delete(currentRoomId);
            }
          }, 30 * 60 * 1000);
        }
      }
    }
  });
});

// Vite Middleware for Development / Static file serving for Production
async function setupViteOrStatic() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }
}

setupViteOrStatic().then(() => {
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🌟 Mirqam Meet Server Running at http://localhost:${PORT}`);
    console.log(`  🏢 Company: Mirqam Company Commercial (شركة مرقام التجارية)`);
    console.log(`  ✨ Mode: ${isProd ? 'Production' : 'Development (Vite HMR)'}`);
    console.log(`======================================================\n`);
  });
});
