# Coding Standards & Architecture Rules

## 1. General Principles
- **TypeScript First**: All code in both `src/` (backend) and `frontend/src/` (frontend) must be written in TypeScript with strict typing. Avoid `any` whenever possible; declare explicit interfaces and types.
- **Unified Deployment Model**: The frontend React app is bundled into `frontend/dist/` and served statically by NestJS (`@nestjs/serve-static`) on port 3000 (HTTP) and port 3443 (HTTPS with SSL).
- **Separation of Concerns**:
  - Backend controllers handle HTTP routing and parameter validation via DTOs (`class-validator`).
  - Backend services encapsulate business logic and database queries (`TypeORM`).
  - Gateways (`SignalingGateway`) handle real-time WebSockets and WebRTC signaling only.
  - Frontend components focus on UI presentation; state and socket management reside in React contexts (`AuthContext`, `CallContext`, `SocketContext`).

## 2. Backend (NestJS 10) Rules
- **Modular Structure**: Keep each feature grouped into its own module (`auth`, `calls`, `friends`, `messages`, `signaling`, `users`, `email`).
- **Entity Management**: All database models reside in `src/entities/` (`user.entity.ts`, `call.entity.ts`, `friendship.entity.ts`, `message.entity.ts`). Do not write raw SQL strings unless necessary; utilize TypeORM Repository methods.
- **DTOs & Validation**:
  - Always define DTOs in a `dto/` subfolder (e.g., `src/auth/dto/`).
  - Use `class-validator` decorators (`@IsString()`, `@IsEmail()`, `@MinLength()`) to validate incoming payloads.
- **Dependency Injection**: Use constructor injection for all services and repositories. Avoid instantiating services manually.
- **WebSocket Gateways**:
  - Always track socket state cleanly in thread-safe memory maps (`userSockets`, `socketToUser`, `socketToRoom`, `rooms`).
  - Clean up socket mappings on `handleDisconnect` to prevent memory leaks and zombie sessions.

## 3. Frontend (React 18 + Vite + Tailwind CSS) Rules
- **Functional Components & Hooks**: Use functional components with React hooks exclusively.
- **Context Boundaries**:
  - `AuthContext`: Manages active user session, JWT storage in `localStorage`, and login/register/logout actions.
  - `SocketContext`: Maintains singleton Socket.IO connection to `http://localhost:3000` or `https://192.168.43.72:3443`.
  - `CallContext`: Coordinates WebRTC peer connections, room state, media streams, audio/video toggles, screen sharing, and dynamic merging.
- **Tailwind CSS**:
  - Use Tailwind utility classes for all styling. Maintain dark-themed, glassmorphic UI consistency.
  - Avoid inline `style={{ ... }}` unless calculating dynamic dimensions or transform properties.
- **Asset Integrity**:
  - Tones and audio alerts must use Web Audio API synthesizers (`src/utils/sound.ts`) rather than relying on external MP3/WAV assets that can fail to load.

## 4. Error Handling & Logging
- In NestJS, use `Logger` from `@nestjs/common` rather than raw `console.log`.
- In React, handle async errors with user-friendly alerts or toasts, and ensure promises inside `useEffect` or callbacks are caught.
