import { io } from 'socket.io-client';

async function runTests() {
  console.log('🧪 Starting Mirqam Meet E2E Socket & Signaling Tests...');
  const url = 'http://localhost:3000';
  const roomId = 'mqm-test-' + Date.now().toString(36);

  // 1. Connect Client A
  const socketA = io(url, { transports: ['websocket'] });
  // 2. Connect Client B
  const socketB = io(url, { transports: ['websocket'] });

  await new Promise((resolve) => {
    let connected = 0;
    const check = () => {
      connected++;
      if (connected === 2) resolve();
    };
    socketA.on('connect', check);
    socketB.on('connect', check);
  });
  console.log('✅ Both sockets connected successfully');

  // Test join room
  let joinPromise = new Promise((resolve) => {
    socketA.on('user-joined', ({ participant }) => {
      console.log('✅ Socket A received user-joined event for:', participant.name);
      resolve(participant);
    });
  });

  socketA.emit('join-room', {
    roomId,
    user: { name: 'أحمد مرقام (Ahmed)', audio: true, video: true }
  });

  // Delay a bit before Socket B joins
  await new Promise(r => setTimeout(r, 200));

  socketB.emit('join-room', {
    roomId,
    user: { name: 'سارة مرقام (Sarah)', audio: false, video: true }
  });

  const joinedParticipant = await joinPromise;
  if (!joinedParticipant.name.includes('Sarah') && !joinedParticipant.name.includes('سارة')) {
    throw new Error('Unexpected participant name: ' + joinedParticipant.name);
  }

  // Test Chat
  let chatPromise = new Promise((resolve) => {
    socketA.on('chat-message', (msg) => {
      console.log('✅ Socket A received chat message:', msg.text, 'from', msg.senderName);
      resolve(msg);
    });
  });

  socketB.emit('send-chat', {
    text: 'مرحباً بالجميع في اجتماع شركة مرقام! الجودة ممتازة.',
    senderName: 'سارة مرقام'
  });

  const receivedMsg = await chatPromise;
  if (!receivedMsg.text.includes('مرقام')) {
    throw new Error('Message text mismatch');
  }

  // Test Hand Raise
  let handPromise = new Promise((resolve) => {
    socketA.on('user-hand-toggled', (data) => {
      console.log('✅ Socket A received hand-toggle:', data.userName, data.isHandRaised);
      resolve(data);
    });
  });

  socketB.emit('toggle-hand', { isHandRaised: true });
  await handPromise;

  // Test Poll
  let pollPromise = new Promise((resolve) => {
    socketA.on('poll-created', (poll) => {
      console.log('✅ Socket A received created poll:', poll.question);
      resolve(poll);
    });
  });

  socketB.emit('create-poll', {
    question: 'هل تفضلون جدولة الاجتماع القادم صباحاً أم مساءً؟',
    options: ['صباحاً (Morning)', 'مساءً (Evening)'],
    createdBy: 'سارة'
  });

  const createdPoll = await pollPromise;

  // Test Vote
  let votePromise = new Promise((resolve) => {
    socketB.on('poll-updated', (updated) => {
      console.log('✅ Received poll vote update:', updated.options[0].votes, 'votes on option 0');
      resolve(updated);
    });
  });

  socketA.emit('vote-poll', {
    pollId: createdPoll.id,
    optionIndex: 0
  });

  await votePromise;

  // Cleanup
  socketA.disconnect();
  socketB.disconnect();

  console.log('\n🎉 ALL MIRQAM MEET REAL-TIME COLLABORATION TESTS PASSED 100%!\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
