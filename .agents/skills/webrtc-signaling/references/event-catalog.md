# WebSocket & WebRTC Signaling Event Catalog

Reference of all Socket.IO messages handled in `SignalingGateway` (`src/signaling/signaling.gateway.ts`):

| Direction | Event Name | Payload Structure | Description |
| :--- | :--- | :--- | :--- |
| Client -> Server | `register-user` | `{ userId: string }` | Associates socket ID with logged-in user and broadcasts online status |
| Client -> Server | `initiate-call` | `{ targetUserIds: string[], callType: 'audio' \| 'video', isGroup: boolean, title?: string }` | Creates a new call room and rings target users |
| Server -> Client | `incoming-call` | `{ roomId, fromUserId, callType, isGroup, isMerge, title, callerInfo, currentParticipants }` | Sent to recipients to trigger ringtone and incoming call modal |
| Server -> Client | `call-initiated` | `{ roomId, callType, isGroup, title, targetUserIds }` | Sent back to caller confirming call room created |
| Client -> Server | `join-call-room` | `{ roomId: string }` | Emitted when accepting a call or joining conference |
| Server -> Client | `existing-participants` | `{ participants: RoomParticipant[] }` | Sent to new joiner with current room members |
| Server -> Client | `participant-joined` | `{ participant: RoomParticipant, isGroup: boolean }` | Broadcast to existing members when new peer connects |
| Client -> Server | `signal-peer` | `{ toSocketId: string, signal: RTCSessionDescriptionInit \| RTCIceCandidateInit }` | Relays SDP offer/answer or ICE candidate directly to target peer |
| Server -> Client | `peer-signal` | `{ fromSocketId: string, signal }` | Forwarded signal received from remote peer |
| Client -> Server | `merge-call` | `{ roomId: string, targetUserIds: string[] }` | Dynamically invites users into an ongoing call room |
| Client -> Server | `decline-call` | `{ roomId: string, reason?: string }` | Rejects an incoming call invitation |
| Server -> Client | `call-declined` | `{ byUserId: string, reason?: string }` | Sent to room initiator when user declines |
| Client -> Server | `leave-call-room` | `{ roomId: string }` | User leaves the call room |
| Server -> Client | `participant-left` | `{ participantId: string, remainingCount: number }` | Broadcast to remaining members when someone leaves |
| Server -> Client | `call-ended` | `{ roomId: string, reason: string }` | Broadcast when call terminates |
| Client -> Server | `toggle-media` | `{ roomId: string, type: 'audio' \| 'video', enabled: boolean }` | Broadcasts mute/camera state changes |
| Client -> Server | `call-hold` | `{ roomId: string, isOnHold: boolean }` | Toggles call hold state |
| Client -> Server | `send-message` | `{ receiverId: string, content: string, messageType?: string }` | Sends instant chat message |
| Server -> Client | `receive-message` | `{ message: Message }` | Delivered live to recipient |
| Client -> Server | `delete-message` | `{ messageId: string, receiverId: string }` | Deletes message for both users |
| Client -> Server | `clear-chat` | `{ friendId: string }` | Clears conversation history |
