---
name: webrtc-signaling
description: >-
  Use this skill when modifying, inspecting, or debugging WebRTC signaling, WebSocket events, peer-to-peer mesh media handling, audio/video toggles, screen sharing, or dynamic call merging.
---

# WebRTC Signaling & Mesh Communication Skill

This skill documents how real-time WebRTC media and Socket.IO signaling operate in the Calling Platform.

## 1. Mesh Peer Connection Pattern
In this application, group calling uses a **full mesh**:
- Every client maintains an `RTCPeerConnection` instance for every other participant in the room.
- Tracked on the frontend in `peerConnectionsRef.current`: `Map<string, RTCPeerConnection>` (keyed by participant `socketId`).
- Remote streams are tracked in `remoteStreamsRef.current`: `Map<string, MediaStream>`.

## 2. Core Event Flow

### 1-on-1 Call Initiation
1. Caller calls `startCall(targetUser, 'video')`.
2. Emits `initiate-call` with `{ targetUserIds: [targetUser.id], callType, isGroup: false }`.
3. Gateway emits `incoming-call` to target user's socket(s).
4. Receiver clicks **Accept**: emits `join-call-room` with `{ roomId }`.
5. Gateway emits `participant-joined` to caller, and `existing-participants` to receiver.
6. For each peer, the caller creates an offer and emits `signal-peer` (`{ toSocketId, signal: { type: 'offer', sdp } }`).
7. Receiver handles offer, creates answer, and emits `signal-peer` (`{ toSocketId, signal: { type: 'answer', sdp } }`).
8. ICE candidates are exchanged as they trickle via `signal-peer` (`{ type: 'candidate', candidate }`).

### Dynamic Call Merging
1. Active participant clicks **"Add / Merge Call"** (`MergeCallModal.tsx`).
2. Calls `mergeNewCall(selectedUsers)` which emits `merge-call` with `{ roomId, targetUserIds }`.
3. Gateway identifies current room, marks `isMerge: true`, and broadcasts `incoming-call` to invited users with `currentParticipants`.
4. When invited user accepts:
   - User emits `join-call-room`.
   - Gateway adds user to room, marks room `isGroup: true`, and emits `participant-joined`.
   - Mesh peer connections are established with all current participants.

## 3. Web Audio API Synthesizer (`frontend/src/utils/sound.ts`)
Zero audio file dependencies:
- **`playRingtone()`**: Two-tone 440Hz / 480Hz US telephone standard ring cadenced with Web Audio oscillators.
- **`playDialTone()`**: Dual 350Hz / 440Hz continuous dial tone.
- **`playCallEndedTone()`**: Three descending frequencies (480Hz -> 420Hz -> 360Hz).
- **`stopAllSounds()`**: Instantly fades out gain nodes and closes audio contexts.
