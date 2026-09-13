# Calling Platform System Architecture

```
                                  +---------------------------+
                                  |   Browser Clients (P2P)   |
                                  | (Alice, Bob, Charlie...)  |
                                  +-------------+-------------+
                                                |
               +--------------------------------+--------------------------------+
               | WebRTC Media Streams (Mesh P2P)                                | WebSocket Signaling (ws://, wss://)
               v                                                                v
+-------------------------------+                              +-------------------------------+
|  Local Media / P2P WebRTC     |                              |   SignalingGateway            |
|  - RTCPeerConnection mesh     |                              |   (Socket.IO / NestJS)        |
|  - Screen share replacement   |                              |   - Room coordinator          |
|  - Web Audio API equalizer    |                              |   - Call state manager        |
+-------------------------------+                              +---------------+---------------+
                                                                               |
                               +-----------------------------------------------+
                               |
                               v
+-------------------------------------------------------------------------------+
| NestJS Application Server (Port 3000 HTTP / Port 3443 HTTPS)                  |
|                                                                               |
|  Controllers & Modules:                                                       |
|  - AuthModule: Registration, Login, JWT verification                          |
|  - UsersModule: User profiles, online status, demo seeding                    |
|  - FriendsModule: Friend requests, accept/decline, friend lists               |
|  - MessagesModule: Real-time chat messages, deletion, clearing                |
|  - CallsModule: Call logs, duration records, participant history              |
|  - ServeStaticModule: Serves compiled React app from frontend/dist/          |
+--------------------------------------+----------------------------------------+
                                       |
                                       | TypeORM
                                       v
                     +-----------------------------------+
                     | PostgreSQL 16 (Port 5432)         |
                     | - users, friendships,             |
                     |   messages, calls                 |
                     +-----------------+-----------------+
                                       |
                                       v
                     +-----------------------------------+
                     | Adminer GUI (Port 8080)           |
                     +-----------------------------------+
```

## Data Models
1. **User** (`src/entities/user.entity.ts`):
   - `id`, `username`, `email`, `password`, `displayName`, `avatar`, `bio`, `isOnline`, `lastSeen`
2. **Call** (`src/entities/call.entity.ts`):
   - `id`, `callerId`, `receiverId`, `callType` (`audio` | `video`), `status` (`initiated` | `accepted` | `rejected` | `ended` | `missed`), `startedAt`, `endedAt`, `durationSeconds`, `isGroup`, `participantCount`, `notes`
3. **Friendship** (`src/entities/friendship.entity.ts`):
   - `id`, `user1Id`, `user2Id`, `status` (`pending` | `accepted` | `declined` | `blocked`), `actionUserId`, `createdAt`
4. **Message** (`src/entities/message.entity.ts`):
   - `id`, `senderId`, `receiverId`, `content`, `messageType`, `readAt`, `createdAt`
