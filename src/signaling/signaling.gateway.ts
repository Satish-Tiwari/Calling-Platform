import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { CallsService } from '../calls/calls.service';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';

export interface RoomParticipant {
  userId: string;
  socketId: string;
  displayName: string;
  avatar: string;
  username: string;
}

export interface CallRoom {
  roomId: string;
  callType: 'audio' | 'video';
  isGroup: boolean;
  title?: string;
  initiatorId: string;
  startedAt?: Date;
  // socketId -> RoomParticipant
  participants: Map<string, RoomParticipant>;
  // set of userIds invited
  invitedUserIds: Set<string>;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class SignalingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SignalingGateway.name);

  // userId -> Set of socket IDs
  private userSockets: Map<string, Set<string>> = new Map();
  // socketId -> userId
  private socketToUser: Map<string, string> = new Map();
  // socketId -> current roomId
  private socketToRoom: Map<string, string> = new Map();
  // roomId -> CallRoom
  private rooms: Map<string, CallRoom> = new Map();

  constructor(
    private readonly callsService: CallsService,
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketToUser.get(client.id);
    this.logger.log(`Client disconnected: ${client.id} (user: ${userId})`);

    // Clean up room participation
    const roomId = this.socketToRoom.get(client.id);
    if (roomId) {
      this.handleLeaveRoomInternal(client, roomId);
    }

    if (userId) {
      this.socketToUser.delete(client.id);
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
      this.broadcastOnlineUsers();
    }
  }

  @SubscribeMessage('register-user')
  handleRegisterUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    if (!data || !data.userId) return;

    this.socketToUser.set(client.id, data.userId);
    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, new Set());
    }
    this.userSockets.get(data.userId)!.add(client.id);

    this.logger.log(`User ${data.userId} registered on socket ${client.id}`);
    this.broadcastOnlineUsers();
  }

  /**
   * Start a direct call or a multi-party group call
   */
  @SubscribeMessage('initiate-call')
  async handleInitiateCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      targetUserIds: string[];
      callType: 'audio' | 'video';
      title?: string;
      callerInfo: { id: string; displayName: string; avatar: string; username: string };
    },
  ) {
    const callerId = this.socketToUser.get(client.id);
    if (!callerId) return;

    const roomId = `call-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const isGroup = data.targetUserIds.length > 1;

    const room: CallRoom = {
      roomId,
      callType: data.callType,
      isGroup,
      title: data.title || (isGroup ? 'Group Conference' : undefined),
      initiatorId: callerId,
      participants: new Map(),
      invitedUserIds: new Set(data.targetUserIds),
    };

    // Add caller to room
    const callerParticipant: RoomParticipant = {
      userId: callerId,
      socketId: client.id,
      displayName: data.callerInfo.displayName,
      avatar: data.callerInfo.avatar,
      username: data.callerInfo.username,
    };
    room.participants.set(client.id, callerParticipant);
    client.join(roomId);
    this.socketToRoom.set(client.id, roomId);
    this.rooms.set(roomId, room);

    // Confirm initiation to caller
    client.emit('call-initiated', {
      roomId,
      callType: data.callType,
      isGroup,
      title: room.title,
    });

    // Notify all target recipients
    for (const targetUserId of data.targetUserIds) {
      this.emitToUser(targetUserId, 'incoming-call', {
        roomId,
        fromUserId: callerId,
        callType: data.callType,
        isGroup,
        title: room.title,
        callerInfo: data.callerInfo,
        currentParticipants: [data.callerInfo],
      });
    }
  }

  /**
   * Merge call / Invite more participants to active call
   */
  @SubscribeMessage('merge-call')
  async handleMergeCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      roomId: string;
      targetUserIds: string[];
    },
  ) {
    const inviterId = this.socketToUser.get(client.id);
    const room = this.rooms.get(data.roomId);
    if (!room || !inviterId) return;

    room.isGroup = true;
    if (!room.title) room.title = 'Merged Conference';

    const inviterParticipant = room.participants.get(client.id);
    const currentParticipantsList = Array.from(room.participants.values()).map(p => ({
      id: p.userId,
      displayName: p.displayName,
      avatar: p.avatar,
      username: p.username,
    }));

    for (const targetUserId of data.targetUserIds) {
      room.invitedUserIds.add(targetUserId);
      this.emitToUser(targetUserId, 'incoming-call', {
        roomId: room.roomId,
        fromUserId: inviterId,
        callType: room.callType,
        isGroup: true,
        isMerge: true,
        title: room.title,
        callerInfo: inviterParticipant,
        currentParticipants: currentParticipantsList,
      });
    }

    // Inform current participants in room that new users were invited to merge
    this.server.to(room.roomId).emit('participants-invited', {
      targetUserIds: data.targetUserIds,
      isGroup: true,
    });
  }

  /**
   * Join an active call room (Answer call)
   */
  @SubscribeMessage('join-call-room')
  handleJoinCallRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      roomId: string;
      userInfo: { id: string; displayName: string; avatar: string; username: string };
    },
  ) {
    const room = this.rooms.get(data.roomId);
    if (!room) {
      client.emit('call-failed', { message: 'Call room no longer exists or has ended' });
      return;
    }

    if (!room.startedAt) {
      room.startedAt = new Date();
    }

    const participant: RoomParticipant = {
      userId: data.userInfo.id,
      socketId: client.id,
      displayName: data.userInfo.displayName,
      avatar: data.userInfo.avatar,
      username: data.userInfo.username,
    };

    // Get list of existing peers in the room before adding the new participant
    const existingParticipants = Array.from(room.participants.values()).filter(p => p.socketId !== client.id);

    client.join(room.roomId);
    room.participants.set(client.id, participant);
    this.socketToRoom.set(client.id, room.roomId);

    // Send existing peers to the newcomer so the newcomer can initiate WebRTC offers to them
    client.emit('room-existing-participants', {
      roomId: room.roomId,
      callType: room.callType,
      isGroup: room.isGroup,
      title: room.title,
      participants: existingParticipants,
    });

    // Notify all existing peers in the room about the newcomer
    client.to(room.roomId).emit('new-participant-joined', {
      participant,
      roomId: room.roomId,
      isGroup: room.participants.size > 2,
    });
  }

  /**
   * Relay WebRTC signals (SDP offer/answer, ICE candidates) between peers in mesh
   */
  @SubscribeMessage('signal-peer')
  handleSignalPeer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      toSocketId: string;
      signal: any;
      userInfo?: any;
    },
  ) {
    this.server.to(data.toSocketId).emit('peer-signal', {
      fromSocketId: client.id,
      signal: data.signal,
      userInfo: data.userInfo,
    });
  }

  /**
   * Decline an incoming call
   */
  @SubscribeMessage('decline-call')
  handleDeclineCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; reason?: string },
  ) {
    const userId = this.socketToUser.get(client.id);
    const room = this.rooms.get(data.roomId);
    if (room && userId) {
      client.to(data.roomId).emit('call-declined', {
        fromUserId: userId,
        reason: data.reason || 'Call declined',
      });
      // If 1-on-1 and callee declined, record as rejected
      if (room.participants.size <= 1) {
        this.callsService.createCallRecord({
          callerId: room.initiatorId,
          calleeId: userId,
          callType: room.callType,
          status: 'rejected',
          duration: 0,
        }).catch(err => this.logger.error('Failed to log rejected call', err));
        this.rooms.delete(data.roomId);
      }
    }
  }

  /**
   * Leave call room
   */
  @SubscribeMessage('leave-call-room')
  handleLeaveCallRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    this.handleLeaveRoomInternal(client, data.roomId);
  }

  private handleLeaveRoomInternal(client: Socket, roomId: string) {
    const room = this.rooms.get(roomId);
    const userId = this.socketToUser.get(client.id);

    client.leave(roomId);
    this.socketToRoom.delete(client.id);

    if (room) {
      room.participants.delete(client.id);
      client.to(roomId).emit('participant-left', {
        socketId: client.id,
        userId,
      });

      // If less than 2 participants left, record call log and cleanup
      if (room.participants.size <= 1) {
        const duration = room.startedAt ? Math.round((Date.now() - room.startedAt.getTime()) / 1000) : 0;
        const lastParticipant = room.participants.values().next().value;
        const calleeId = lastParticipant ? lastParticipant.userId : (Array.from(room.invitedUserIds)[0] || room.initiatorId);

        this.callsService.createCallRecord({
          callerId: room.initiatorId,
          calleeId,
          callType: room.callType,
          status: duration > 0 ? 'completed' : 'cancelled',
          duration,
          isGroup: room.isGroup,
          groupTitle: room.title,
          participantCount: Math.max(room.invitedUserIds.size + 1, 2),
          startedAt: room.startedAt || new Date(),
          endedAt: new Date(),
        }).catch(err => this.logger.error('Failed to save call log', err));

        // If 1 person left, notify them call has ended
        if (lastParticipant) {
          this.server.to(lastParticipant.socketId).emit('call-ended', {
            reason: 'All other participants have left',
          });
          const lastSocket = this.server.sockets.sockets.get(lastParticipant.socketId);
          if (lastSocket) {
            lastSocket.leave(roomId);
            this.socketToRoom.delete(lastParticipant.socketId);
          }
        }
        this.rooms.delete(roomId);
      }
    }
  }

  /**
   * Sync media states (Audio muted, Video turned off, Screen sharing)
   */
  @SubscribeMessage('toggle-media')
  handleToggleMedia(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; isMuted?: boolean; isVideoOff?: boolean; isScreenSharing?: boolean },
  ) {
    const fromUserId = this.socketToUser.get(client.id);
    client.to(data.roomId).emit('participant-media-changed', {
      socketId: client.id,
      fromUserId,
      ...data,
    });
  }

  /**
   * Put call on hold or resume
   */
  @SubscribeMessage('call-hold')
  handleCallHold(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; isHeld: boolean },
  ) {
    const fromUserId = this.socketToUser.get(client.id);
    client.to(data.roomId).emit('peer-hold-status', {
      socketId: client.id,
      fromUserId,
      isHeld: data.isHeld,
    });
  }

  /**
   * Merge a held call with an active call room
   */
  @SubscribeMessage('merge-held-call')
  handleMergeHeldCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { activeRoomId: string; heldRoomId: string },
  ) {
    client.to(data.heldRoomId).emit('transfer-to-room', {
      newRoomId: data.activeRoomId,
    });
  }

  /**
   * Hang up a specific call room (e.g. held call)
   */
  @SubscribeMessage('end-specific-call')
  handleEndSpecificCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    this.handleLeaveRoomInternal(client, data.roomId);
  }

  /**
   * Chat messages
   */
  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { toUserId: string; content: string },
  ) {
    const senderId = this.socketToUser.get(client.id);
    if (!senderId || !data.content?.trim()) return;

    const savedMsg = await this.messagesService.saveMessage(senderId, data.toUserId, data.content.trim());
    this.emitToUser(data.toUserId, 'new-message', savedMsg);
    client.emit('message-sent', savedMsg);
  }

  @SubscribeMessage('delete-message')
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; toUserId?: string },
  ) {
    const userId = this.socketToUser.get(client.id);
    if (!userId || !data.messageId) return;

    await this.messagesService.deleteMessage(data.messageId, userId);
    client.emit('message-deleted', { messageId: data.messageId });
    if (data.toUserId) {
      this.emitToUser(data.toUserId, 'message-deleted', { messageId: data.messageId });
    }
  }

  @SubscribeMessage('clear-chat')
  async handleClearChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { otherUserId: string },
  ) {
    const userId = this.socketToUser.get(client.id);
    if (!userId || !data.otherUserId) return;

    await this.messagesService.clearConversation(userId, data.otherUserId);
    client.emit('chat-cleared', { otherUserId: data.otherUserId });
    this.emitToUser(data.otherUserId, 'chat-cleared', { otherUserId: userId });
  }

  public emitToUser(userId: string, event: string, payload: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      for (const socketId of sockets) {
        this.server.to(socketId).emit(event, payload);
      }
    }
  }

  private broadcastOnlineUsers() {
    const onlineUserIds = Array.from(this.userSockets.keys());
    this.server.emit('online-users', onlineUserIds);
  }
}
