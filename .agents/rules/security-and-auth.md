# Security, Authentication, & Network Guidelines

## 1. Authentication & Tokens
- **JWT (JSON Web Token)**:
  - Tokens are signed with `JWT_SECRET` configured in `.env`.
  - Expiry is set by default to 7 days (`7d`).
  - Tokens must be sent in the HTTP `Authorization` header as `Bearer <token>`.
  - Frontend stores token in `localStorage` under key `calling_platform_token` and the user profile under `calling_platform_user`.
- **Password Security**:
  - Passwords are hashed with `bcrypt` using 10 salt rounds before persisting to PostgreSQL.
  - Plaintext passwords must never be logged or returned in user responses. The `password` field on `User` entity has `{ select: false }` or is omitted from DTO outputs.

## 2. WebSocket & CORS Security
- **CORS Configuration**:
  - NestJS HTTP server and Socket.IO gateway are configured to allow cross-origin requests (`origin: '*'`, `credentials: true`) to support both local web browsers and mobile IP connections (`https://192.168.43.72:3443`).
- **Socket Registration**:
  - On connection, clients must emit `register-user` with `{ userId }`.
  - Sockets without valid user registration must not be allowed to receive or route private signals.

## 3. SSL / HTTPS Requirements for Mobile WebRTC
- Modern mobile browsers (iOS Safari, Android Chrome) strictly block `navigator.mediaDevices.getUserMedia()` on non-secure origins (`http://`).
- The application binds an HTTPS listener on port **3443** using certificates stored in `ssl/` (`cert.pem`, `key.pem`).
- When testing on physical mobile devices, connect via **`https://<HOST_IP>:3443`** and accept the self-signed certificate exception.
- Never commit private key files (`ssl/key.pem`, `.env`) to git. Keep them listed in `.gitignore`.

## 4. Environment Variables
- All secrets and configuration must be loaded via `@nestjs/config` from `.env`.
- Refer to `.env.example` as the canonical reference for environment variables:
  - `PORT=3000`
  - `HTTPS_PORT=3443`
  - `DB_HOST=localhost`
  - `DB_PORT=5432`
  - `DB_USERNAME=postgres`
  - `DB_PASSWORD=postgres`
  - `DB_NAME=calling_platform`
  - `JWT_SECRET=...`
