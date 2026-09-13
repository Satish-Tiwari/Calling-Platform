# WebRTC & Real-Time Signaling Protocol Rules

## 1. Mesh Topology Architecture
- The calling platform uses a **Full-Mesh WebRTC Topology**:
  - In an $N$-participant room, each participant maintains $N-1$ direct peer connections (`RTCPeerConnection`).
  - Suitable for low to moderate group sizes (up to 4–6 active participants) without requiring an external SFU/MCU media server.

## 2. Peer Connection Lifecycle
- **STUN Configuration**:
  ```typescript
  const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };
  ```
- **Signaling Exchange**:
  1. Initiator generates SDP Offer (`createOffer()` -> `setLocalDescription()`).
  2. Offer sent via Socket.IO event `signal-peer` with payload `{ toSocketId, signal: { type: 'offer', sdp } }`.
  3. Receiver sets remote description (`setRemoteDescription()`), generates SDP Answer (`createAnswer() -> setLocalDescription()`).
  4. Receiver sends Answer back via `signal-peer` with payload `{ toSocketId, signal: { type: 'answer', sdp } }`.
  5. Initiator sets remote description (`setRemoteDescription()`).
  6. Trickle ICE: ICE candidates are exchanged immediately as discovered via `signal-peer` (`{ type: 'candidate', candidate }`).
  7. If remote description is not yet set, queue candidate messages until `setRemoteDescription` resolves.

## 3. Dynamic Call Merging Protocol
- When a user in an active call clicks **"Add / Merge Call"**:
  1. Frontend emits `merge-call` to `SignalingGateway` with `{ roomId, targetUserIds: string[] }`.
  2. Gateway creates incoming call invitations for target users with `isMerge: true` and `currentParticipants`.
  3. When an invited user accepts:
     - Gateway emits `participant-joined` with `newParticipant` details to all existing members.
     - New participant receives the list of all existing socket IDs and establishes mesh peer connections with each.

## 4. Track Management & Cleanup
- **Adding Tracks**:
  - Always add local stream tracks to each peer connection using `pc.addTrack(track, localStream)`.
- **Muting / Unmuting**:
  - Audio: Toggle `track.enabled = !track.enabled` on local audio tracks, and broadcast `toggle-media` (`{ type: 'audio', enabled }`).
  - Video: Toggle `track.enabled = !track.enabled` on local video tracks, and broadcast `toggle-media` (`{ type: 'video', enabled }`).
- **Screen Sharing**:
  - Call `navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })`.
  - Replace video track on each peer connection sender:
    ```typescript
    const sender = pc.getSenders().find(s => s.track?.kind === 'video');
    if (sender) await sender.replaceTrack(screenTrack);
    ```
  - When screen share ends (`track.onended`), revert back to the camera video track.
- **Tear Down & Garbage Collection**:
  - Always stop all `MediaStreamTrack` instances: `stream.getTracks().forEach(t => t.stop())`.
  - Close each `RTCPeerConnection`: `pc.close()`.
  - Clear peer connection maps and reset audio contexts to prevent memory and CPU leaks.
