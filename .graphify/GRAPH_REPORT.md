# Graph Report - .  (2026-09-13)

## Corpus Check
- Corpus is ~26,552 words - fits in a single context window. You may not need a graph.

## Summary
- 291 nodes · 434 edges · 33 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: contains: 115 · method: 108 · imports: 95 · imports_from: 76 · calls: 34 · implements: 4 · references: 2


## Input Scope
- Requested: auto
- Resolved: committed (source: cli)
- Included files: 65 · Candidates: 80
- Excluded: 42 untracked · 52993 ignored · 2 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.
## God Nodes (most connected - your core abstractions)
1. `SignalingGateway` - 23 edges
2. `UsersService` - 17 edges
3. `FriendsService` - 16 edges
4. `useAuth()` - 15 edges
5. `User` - 15 edges
6. `useCall()` - 12 edges
7. `FriendsController` - 11 edges
8. `AuthService` - 10 edges
9. `AuthController` - 9 edges
10. `useSocket()` - 8 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (38): LoginModalProps, RegisterModalProps, GroupCallCreatorModal(), GroupCallCreatorModalProps, MergeCallModalProps, ChatHeaderProps, AuthContext, AuthContextType (+30 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (21): AuthModal(), AuthView, IncomingCallModal(), ChatArea(), ChatAreaProps, ChatHeader(), EmptyChatState(), MessageInput() (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (5): CallRoom, OnGatewayConnection, OnGatewayDisconnect, RoomParticipant, SignalingGateway

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (2): OnModuleInit, UsersService

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (2): FriendsService, OnModuleInit

### Community 5 - "Community 5"
Cohesion: 0.19
Nodes (8): ActiveCallModal(), ActiveCallModalProps, CallDurationTimer(), CallDurationTimerProps, CallWaitingBanner(), HeldCallBar(), MergeCallModal(), RemoteHoldBanner()

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (1): FriendsController

### Community 7 - "Community 7"
Cohesion: 0.27
Nodes (1): AuthService

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (1): AuthController

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (1): MessagesService

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (1): UsersController

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (1): CallsService

### Community 12 - "Community 12"
Cohesion: 0.43
Nodes (1): EmailService

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (1): CallsController

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (5): ForgotPasswordDto, RegisterDto, ResendOtpDto, ResetPasswordDto, VerifyOtpDto

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (1): MessagesController

### Community 16 - "Community 16"
Cohesion: 0.73
Nodes (5): getAudioContext(), playCallEndedTone(), playDialTone(), playRingtone(), stopAllSounds()

### Community 17 - "Community 17"
Cohesion: 0.50
Nodes (1): JwtStrategy

### Community 18 - "Community 18"
Cohesion: 0.50
Nodes (3): Call, CallStatus, CallType

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (2): Docker Compose Infrastructure, AppModule

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (2): Friendship, FriendshipStatus

### Community 21 - "Community 21"
Cohesion: 1.00
Nodes (1): AuthModule

### Community 22 - "Community 22"
Cohesion: 1.00
Nodes (1): JwtAuthGuard

### Community 23 - "Community 23"
Cohesion: 1.00
Nodes (1): CallsModule

### Community 24 - "Community 24"
Cohesion: 1.00
Nodes (1): LoginDto

### Community 25 - "Community 25"
Cohesion: 1.00
Nodes (1): EmailModule

### Community 26 - "Community 26"
Cohesion: 1.00
Nodes (1): Message

### Community 27 - "Community 27"
Cohesion: 1.00
Nodes (1): User

### Community 28 - "Community 28"
Cohesion: 1.00
Nodes (1): FriendsModule

### Community 29 - "Community 29"
Cohesion: 1.00
Nodes (1): MessagesModule

### Community 30 - "Community 30"
Cohesion: 1.00
Nodes (1): SignalingModule

### Community 31 - "Community 31"
Cohesion: 1.00
Nodes (1): UsersModule

### Community 32 - "Community 32"
Cohesion: 1.00
Nodes (1): Frontend HTML Shell

## Knowledge Gaps
- **57 isolated node(s):** `AuthView`, `LoginModalProps`, `RegisterModalProps`, `ActiveCallModalProps`, `CallDurationTimerProps` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 3`** (2 nodes): `OnModuleInit`, `UsersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (2 nodes): `FriendsService`, `OnModuleInit`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (1 nodes): `FriendsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (1 nodes): `AuthService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (1 nodes): `AuthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (1 nodes): `MessagesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `UsersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `CallsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `EmailService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `CallsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `MessagesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `JwtStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `Docker Compose Infrastructure`, `AppModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `Friendship`, `FriendshipStatus`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `AuthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `JwtAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `CallsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `LoginDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `EmailModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `Message`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `User`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `FriendsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `MessagesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `SignalingModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `UsersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `Frontend HTML Shell`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Community 0` to `Community 1`, `Community 5`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `User` connect `Community 0` to `Community 5`, `Community 1`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `AuthView`, `LoginModalProps`, `RegisterModalProps` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07922077922077922 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._