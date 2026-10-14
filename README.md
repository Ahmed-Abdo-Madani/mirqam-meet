# مرقام ميت | Mirqam Meet
**منصة الاجتماعات المرئية الذكية والمشفرة لشركة مرقام التجارية**  
*Enterprise Video Conferencing Platform — Built to match the Mirqam Design System*

---

## 🌟 Overview
**مرقام ميت (Mirqam Meet)** is an enterprise-grade Google Meet clone designed specifically for **شركة مرقام التجارية (Mirqam Company Commercial)**. Built with the company's official visual identity, colors (Teal `#23949A` & Navy `#172740`), typography (`IBM Plex Sans Arabic`), and glassmorphism styling (`mirqam-glass.css`), it provides secure, high-definition video conferencing with real-time peer collaboration.

---

## ✨ Features

### 1. 🏢 Mirqam Brand & Design System
- **Official Brand Palette:** Primary Teal (`#23949A`), Dark Navy (`#172740`), and background accents.
- **Official Mirqam Vector Logo:** Rendered in both header, icons, and favicon.
- **Glassmorphism UI:** Frosted glass controls bar, translucent modals, smooth shadows.
- **Bilingual RTL/LTR:** Arabic-first with one-click English toggle, auto layout mirroring.
- **Dark & Light Modes:** Tailored dark room experience for video focus and crisp light mode.

### 2. 📹 Green Room / Pre-Join Lobby
- **Live Camera & Mic Preview:** Video check before entering with mirrored webcam feed.
- **Audio Waveform Meter:** Real-time volume visualizer using Web Audio API.
- **Virtual Backgrounds & Effects:**
  - Slight Blur & Heavy Blur
  - Executive Mirqam Office background
  - Abstract Mirqam Teal geometric backdrop
- **Device Selector:** Select preferred camera, microphone, or speaker with test tone playback.
- **Quick Name Setup:** Custom display name with local persistence.

### 3. 👥 In-Call Meeting Experience (Google Meet Clone)
- **Dynamic Multi-Party Video Grid:** Auto-adapts for 1 to 16+ participants (1x1, 1x2, 2x2, 3x3, spotlight).
- **Smart Active Speaker Detection:** Glowing Teal border (`#23949A`) highlights speaking participants.
- **Tile Pinning & Spotlight:** Pin any participant or presenter to primary full screen.
- **Screen Sharing:** Native `getDisplayMedia` screen sharing with presenter spotlight and viewer banner.
- **WebRTC Peer Calling:** Native peer-to-peer signaling over WebSockets for multi-tab/device calling.
- **Simulated Colleagues:** Pre-configured Mirqam team members (Product Lead, Senior UX, AI Engineer) for instant testing.

### 4. 💬 Collaboration & Activities
- **In-Call Real-Time Chat:** Group messaging with timestamp, system notices, and quick emojis.
- **Interactive Live Polls:** Create polls, vote in real-time, live percentage progress bars.
- **Collaborative Whiteboard (Jamboard Style):** Multi-color drawing canvas, stroke size, eraser, and PNG export.
- **Floating Reactions:** Rising emoji animations (👍 ❤️ 👏 😂 😮 🎉 🚀 💡) with celebration confetti!
- **Hand Raise Queue:** Audible ding notification and pulsing hand badge on participant tile.
- **Live Captions / Subtitles:** Real-time bilingual speech recognition via Web Speech API.
- **Meeting Recording:** Local/screen recording with instant download as WebM file.

### 5. 🛡️ Trust & Security
- **End-to-End Encryption:** Secured peer streams and ephemeral in-memory room states.
- **Commercial Trust Block:** Official Commercial Registration (CR: `7055011105`) and company legal identity.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
npm install
```

### Running Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### Building for Production
```bash
npm run build
npm start
```

### Running Real-Time Signaling Tests
```bash
node scripts/test_meet.js
```

---

## ⌨️ Keyboard Shortcuts
- **Ctrl + D** or **M**: Toggle Microphone (Mute / Unmute)
- **Ctrl + E** or **V**: Toggle Camera (On / Off)
- **H**: Raise or Lower Hand
- **C**: Toggle In-Call Chat panel
- **S**: Toggle Screen Sharing
- **F**: Toggle Fullscreen

---

## 🏛️ Company Information
- **Company Name:** شركة مرقام التجارية (Mirqam Company Commercial)
- **CR Number (السجل التجاري):** 7055011105
- **Headquarters:** المملكة العربية السعودية (Kingdom of Saudi Arabia)
- **Product:** مرقام ميت (Mirqam Meet Enterprise)
