---
name: nestjs-typeorm
description: >-
  Use this skill when developing, refactoring, or querying NestJS modules, TypeORM entities, PostgreSQL migrations, or database configurations in this project.
---

# NestJS Backend & TypeORM Skill

This skill documents the NestJS backend architecture and TypeORM database layer.

## 1. Directory Structure
```text
src/
├── app.module.ts              # Root NestJS module importing Config, TypeOrm, and feature modules
├── main.ts                    # Entry point: HTTP (3000) & HTTPS (3443) listeners + validation pipes
├── auth/                      # Authentication (JWT strategy, login, register, guards)
├── calls/                     # Call history controller & service
├── email/                     # Nodemailer email notification service
├── entities/                  # TypeORM Entity definitions
│   ├── user.entity.ts
│   ├── call.entity.ts
│   ├── friendship.entity.ts
│   └── message.entity.ts
├── friends/                   # Friends management controller & service
├── messages/                  # Chat messages controller & service
├── signaling/                 # Socket.IO SignalingGateway for WebRTC
└── users/                     # User management & seed service
```

## 2. TypeORM Configuration
Configured in `src/app.module.ts` using `TypeOrmModule.forRootAsync`:
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_NAME', 'calling_platform'),
    entities: [User, Call, Friendship, Message],
    synchronize: true, // auto-syncs schema in development
  }),
  inject: [ConfigService],
})
```

## 3. Database Seeder
On application startup, `UsersService.onModuleInit()` calls `seedInitialUsers()`:
- Seeds default accounts: `alice`, `bob`, `charlie`, `diana`.
- Establishes mutual friendships between all four demo users so they immediately appear online in each other's sidebar.
