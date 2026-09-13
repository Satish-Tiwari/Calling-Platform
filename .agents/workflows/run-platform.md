---
command: /run-platform
description: Launch PostgreSQL via Docker and start the Calling Platform unified server
---

# Workflow: Run Platform

## Steps
1. Start PostgreSQL 16 and Adminer via Docker Compose:
   ```bash
   docker compose up -d
   ```
2. Check containers:
   ```bash
   docker compose ps
   ```
3. Run the unified NestJS server:
   ```bash
   npm run start:dev
   ```
4. Access the web application at `http://localhost:3000` (or `https://192.168.43.72:3443` for mobile WebRTC).
