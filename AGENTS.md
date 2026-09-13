# AGENTS.md | Calling Platform Workspace Guide

Welcome to the **Calling Platform** codebase. This file serves as the primary orientation and operating guide for AI coding assistants and autonomous agents working in this repository.

---

## 1. Repository Overview

The **Calling Platform** is a full-stack real-time collaboration application featuring:
- **Multi-Party Group Video Calling**: Dynamic adaptive video grid over a P2P WebRTC mesh.
- **Group Voice Calling**: HD audio with real-time frequency equalizer visualizers (Web Audio API).
- **Dynamic Call Merging**: 1-on-1 calls can be seamlessly merged into a multi-party conference mid-call.
- **Screen Sharing**: Desktop and browser tab streaming directly into conference rooms.
- **Synthesized Audio Tones**: Pure Web Audio API oscillators for dial tones, ringtones, and end-call chimes (zero external audio files).
- **Instant Messaging**: Real-time Socket.IO chat with delivery tracking and message history.
- **Unified Deployment**: A single NestJS instance serves REST APIs, WebSockets, and compiles/serves the React SPA on both HTTP (`:3000`) and HTTPS (`:3443`).

---

## 2. Directory Layout

```text
calling-platform/
├── .agents/                        # Agent configurations, skills, rules, and workflows
│   ├── mcp_config.json             # MCP server definitions (including Graphify MCP)
│   ├── rules/                      # Directory-scoped behavioral and architectural rules
│   │   ├── coding-standards.md     # TypeScript, React 18, NestJS 10, Tailwind CSS standards
│   │   ├── graphify.md             # Graphify knowledge graph rules and query guidance
│   │   ├── security-and-auth.md    # JWT, bcrypt, CORS, and mobile SSL certificates
│   │   ├── testing-and-deployment.md # Multi-party testing matrix and Docker procedures
│   │   └── webrtc-protocols.md     # Mesh peer connection lifecycle and track management
│   ├── skills/                     # Specialized agent capabilities and runbooks
│   │   ├── calling-platform-core/  # Run, build, diagnose, and test the full application
│   │   ├── graphify/               # Query and maintain the codebase knowledge graph
│   │   ├── nestjs-typeorm/         # Backend services, entities, and PostgreSQL schema
│   │   └── webrtc-signaling/       # WebSocket events and WebRTC peer connection mesh
│   └── workflows/                  # Agent slash command workflows
│       ├── build-and-verify.md     # Build frontend/backend and verify health
│       ├── graphify.md             # Generate/update knowledge graph and studio
│       └── run-platform.md         # Launch Docker and start dev server
├── .graphify/                      # Persistent knowledge graph artifacts
│   ├── graph.json                  # Graph topology (nodes, edges, communities)
│   ├── GRAPH_REPORT.md             # Architecture audit, hub nodes, and suggested questions
│   └── studio/                     # Static Ontology Studio web app
├── frontend/                       # React 18 + Vite + Tailwind CSS client
│   ├── src/
│   │   ├── components/             # UI components (auth, call, chat, sidebar, settings)
│   │   ├── context/                # AuthContext, CallContext, SocketContext
│   │   ├── services/               # REST API client (axios)
│   │   ├── types/                  # TypeScript interfaces and call types
│   │   └── utils/                  # Web Audio API sound generator (sound.ts)
│   └── vite.config.ts
├── src/                            # NestJS 10 backend
│   ├── auth/                       # JWT auth, passport strategies, and auth controller
│   ├── calls/                      # Call history and duration tracking
│   ├── email/                      # Nodemailer email notification module
│   ├── entities/                   # TypeORM database models (User, Call, Friendship, Message)
│   ├── friends/                    # Friendship management and requests
│   ├── messages/                   # Real-time chat messages
│   ├── signaling/                  # Socket.IO SignalingGateway for WebRTC
│   ├── users/                      # User service, profiles, and demo seeder
│   └── main.ts                     # NestJS bootstrap (HTTP :3000 & HTTPS :3443)
├── ssl/                            # Self-signed SSL certificates for mobile HTTPS testing
├── docker-compose.yml              # PostgreSQL 16 (:5432) & Adminer (:8080)
├── package.json                    # Unified project dependencies and scripts
└── start.sh                        # 1-click launch script
```

---

## 3. Graphify Knowledge Graph Guidance

A full Graphify knowledge graph has been generated in `.graphify/`.
When reasoning about codebase architecture, file dependencies, or refactoring blast radius:
- Run `npm run graphify:summary` (or `graphify summary`) for a rapid overview of top hubs and key communities.
- Run `graphify query "<question>"` to perform a BFS traversal answering architectural questions.
- Run `graphify explain "<NodeName>"` to inspect incoming/outgoing edges of a specific class or method.
- Run `graphify path "<Source>" "<Target>"` to trace connectivity between components.
- The interactive visual studio is exported at `.graphify/studio/studio.html`.
- After modifying code files, update the knowledge graph with `npm run graphify:build`.

---

## 4. Skills & Runbooks

Locate detailed procedures under `.agents/skills/`:
- [`calling-platform-core`](file:///.agents/skills/calling-platform-core/SKILL.md): Starting services, building the unified bundle, health check script.
- [`webrtc-signaling`](file:///.agents/skills/webrtc-signaling/SKILL.md): Socket.IO events, SDP offer/answer negotiation, dynamic call merge, Web Audio visualizer.
- [`nestjs-typeorm`](file:///.agents/skills/nestjs-typeorm/SKILL.md): TypeORM repositories, PostgreSQL tables, relations, and demo user seeding.
- [`graphify`](file:///.agents/skills/graphify/SKILL.md): Deep traversal, semantic extraction, and ontology studio export.

---

## 5. Development Cheat Sheet

```bash
# 1. Start Docker containers (PostgreSQL + Adminer)
npm run docker:up

# 2. Check health & environment
.agents/skills/calling-platform-core/scripts/check-health.sh

# 3. Build Frontend & Backend
npm run build

# 4. Start Unified Development Server
npm run start:dev

# 5. Graphify commands
npm run graphify:summary
npm run graphify:studio
npm run graphify:build
```

### Pre-Seeded Instant Demo Accounts
- **Alice**: `alice@call.app` / `alice123`
- **Bob**: `bob@call.app` / `bob123`
- **Charlie**: `charlie@call.app` / `charlie123`
- **Diana**: `diana@call.app` / `diana123`

### Key Endpoints
- **Web App**: `http://localhost:3000`
- **Mobile Access**: `https://192.168.43.72:3443`
- **Adminer DB Viewer**: `http://localhost:8080`
- **PostgreSQL 16**: `localhost:5432` (`calling_platform`)
