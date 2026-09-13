# Database Schema Reference (PostgreSQL 16)

## Tables & Columns

### 1. `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  "displayName" VARCHAR NOT NULL,
  avatar VARCHAR,
  bio VARCHAR,
  "isOnline" BOOLEAN DEFAULT false,
  "lastSeen" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `calls` Table
```sql
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "callerId" UUID NOT NULL REFERENCES users(id),
  "receiverId" UUID REFERENCES users(id),
  "callType" VARCHAR NOT NULL, -- 'audio' | 'video'
  status VARCHAR NOT NULL,     -- 'initiated' | 'accepted' | 'rejected' | 'ended' | 'missed'
  "startedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "endedAt" TIMESTAMP WITH TIME ZONE,
  "durationSeconds" INTEGER DEFAULT 0,
  "isGroup" BOOLEAN DEFAULT false,
  "participantCount" INTEGER DEFAULT 2,
  notes TEXT
);
```

### 3. `friendships` Table
```sql
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user1Id" UUID NOT NULL REFERENCES users(id),
  "user2Id" UUID NOT NULL REFERENCES users(id),
  status VARCHAR NOT NULL, -- 'pending' | 'accepted' | 'declined' | 'blocked'
  "actionUserId" UUID NOT NULL REFERENCES users(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. `messages` Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "senderId" UUID NOT NULL REFERENCES users(id),
  "receiverId" UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  "messageType" VARCHAR DEFAULT 'text',
  "readAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
