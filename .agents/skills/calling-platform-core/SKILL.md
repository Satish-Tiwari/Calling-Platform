---
name: calling-platform-core
description: >-
  Use this skill when developing, building, launching, diagnosing, or testing the Calling Platform (NestJS backend, React frontend, PostgreSQL database, Docker services, or SSL setup).
---

# Calling Platform Core Development Skill

This skill provides step-by-step instructions for running, building, testing, and troubleshooting the Calling Platform.

## 1. Quick Development Workflow

### Step 1: Start Database & Adminer
```bash
docker compose up -d
```
Check status:
```bash
docker compose ps
```
- PostgreSQL 16 runs on port `5432` (`calling_platform` database).
- Adminer Web GUI runs on `http://localhost:8080`.

### Step 2: Build Application
```bash
npm run build
```
This runs:
- `npm run build:frontend` (Vite compiles React to `frontend/dist/`)
- `npm run build:backend` (NestJS compiles TypeScript to `dist/`)

### Step 3: Launch Unified Server
For development with hot reload:
```bash
npm run start:dev
```
For production:
```bash
npm run start:prod
# or
./start.sh
```

## 2. Ports & Access Endpoints
- **Web App (Desktop)**: `http://localhost:3000`
- **REST API**: `http://localhost:3000/api`
- **Mobile Access (HTTPS)**: `https://192.168.43.72:3443` (replace with local network IP if changed)
- **Adminer DB Manager**: `http://localhost:8080`

## 3. Pre-Seeded Instant Demo Accounts
The database automatically seeds 4 demo users upon initial startup:
- **Alice**: `alice@call.app` / `alice123`
- **Bob**: `bob@call.app` / `bob123`
- **Charlie**: `charlie@call.app` / `charlie123`
- **Diana**: `diana@call.app` / `diana123`

On the login page, click any of the "Instant Demo Accounts" buttons to log in instantly.

## 4. Diagnostics & Troubleshooting
Run the built-in health check script:
```bash
.agents/skills/calling-platform-core/scripts/check-health.sh
```

### Common Issues:
1. **Port 3000 or 3443 already in use**:
   ```bash
   lsof -i :3000 -i :3443
   kill -9 <PID>
   ```
2. **PostgreSQL Connection Refused**:
   Check if Docker container is up: `docker compose ps`. If down, run `docker compose up -d`.
3. **Microphone/Camera Not Working on Mobile**:
   Ensure you connect via `https://` (port 3443), not `http://`. Modern mobile browsers require a secure context (HTTPS) for `getUserMedia`. Accept the self-signed SSL warning.
