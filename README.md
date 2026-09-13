# ⚡ Calling Platform | Real-Time Group Audio & Video Collaboration

A next-generation real-time communication platform featuring **Multi-Party Group Video Calling**, **Group Voice Calling**, **Dynamic Call Merging**, **Screen Sharing**, and **Instant Messaging**. Built with **React 18 (Vite + Tailwind CSS)** and **NestJS (TypeScript + WebSockets + TypeORM + PostgreSQL)**.

Containerized with **Docker (PostgreSQL & Adminer)** and served through a **single, unified NestJS deployment**.

---

## 🌟 Core Features

- 📹 **Group Video Calling**: Dynamic multi-participant grid (adaptive 1x1, 2x2, 3x3 layout) with peer video streaming over P2P WebRTC mesh.
- 🎙️ **Group Audio Calling**: High-definition spatial group voice rooms with dynamic equalizer wave visualizers for active speakers.
- 🔀 **Call Merging & Dynamic Invite**:
  - Merge a 1-on-1 call into a multi-party conference anytime with the **"Add / Merge Call"** button.
  - Invite any online contact into your ongoing call in real time.
- 🖥️ **Screen Sharing**: 1-click desktop and tab sharing directly into group conference rooms.
- 🎛️ **Floating & Minimized Mode**: Keep active calls docked in a sleek floating widget at the bottom corner while texting or browsing.
- 🔔 **Synthesized Futuristic Tones**: Web Audio API melodic ringtones and dial tones with zero external audio assets.
- 💬 **Live Instant Messaging**: Real-time chat with delivery receipts and timestamps.
- 📜 **Conference Call Logs**: Tracks group calls, participant count, and exact call durations in PostgreSQL.
- 🗄️ **Adminer Database Viewer**: Direct web-based database management interface.

---

## 🌐 Network Access & Ports

| Service | Port | Access URL | Details |
| :--- | :--- | :--- | :--- |
| **Unified Web App** | `3000` | [http://localhost:3000](http://localhost:3000) | Desktop / Laptop browser access |
| **Mobile Access (HTTPS)** | `3443` | **`https://192.168.43.72:3443`** | Mobile browser access with camera & mic support |
| **REST API** | `3000` | [http://localhost:3000/api](http://localhost:3000/api) | Authentication, Users, Messages, Call logs |
| **WebSockets & WebRTC** | `3000` / `3443` | `ws://` / `wss://` | Room-based mesh WebRTC signaling |
| **Adminer Database GUI** | `8080` | [http://192.168.43.72:8080](http://192.168.43.72:8080) | PostgreSQL web manager |
| **PostgreSQL 16** | `5432` | `localhost:5432` | Database: `calling_platform` |

---

## ⚡ Quick Start

```bash
# 1. Start Docker containers (PostgreSQL + Adminer)
docker compose up -d

# 2. Build both Frontend and Backend
npm run build

# 3. Start Unified Server
npm run start:prod
# Or run with 1-click script:
# ./start.sh
```

---

## 🧪 Testing Group Calling & Call Merging

### Test Scenario: 3-Way Group Video Call with Call Merging

1. **Window 1 (Laptop - Alice)**:
   - Go to [http://localhost:3000](http://localhost:3000).
   - Click **Alice** under *Instant Demo Accounts*.
2. **Window 2 (Laptop Incognito - Bob)**:
   - Go to [http://localhost:3000](http://localhost:3000).
   - Click **Bob** to log in.
3. **Window 3 (Mobile Phone or 2nd Browser - Charlie)**:
   - Go to **`https://192.168.43.72:3443`** on your phone (or browser).
   - Click **Charlie** to log in.

#### Option A: Direct Group Call Initiation
- In Alice's window, click the **"Group Call"** button in the sidebar header.
- Select both **Bob** and **Charlie** with checkboxes.
- Click **"Start (2)"**. Both Bob and Charlie's devices will ring with the incoming conference modal!
- When both accept, all 3 participants enter a 3-way video grid!

#### Option B: Dynamic Call Merging (Add to Active Call)
- Start a 1-on-1 call between **Alice** and **Bob**.
- While Alice and Bob are talking, Alice clicks the **"Add / Merge Call"** (`UserPlus`) button in the bottom floating toolbar.
- Alice selects **Charlie** and clicks **"Merge Call"**.
- Charlie receives an incoming call invitation: *"Alice invited you to join an active call with Bob"*.
- When Charlie taps **"Merge & Join"**, Charlie is seamlessly added into the active conference room, and all 3 participants are connected together!
