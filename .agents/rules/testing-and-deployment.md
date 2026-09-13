# Testing, Docker, & Deployment Guidelines

## 1. Environment & Container Services
The application requires PostgreSQL 16 and Adminer running via Docker Compose:
```bash
# Start Docker containers in detached mode
docker compose up -d

# Verify container status
docker compose ps

# Stop containers
docker compose down
```
- **PostgreSQL 16**: Port `5432` (`postgres:postgres@localhost:5432/calling_platform`)
- **Adminer GUI**: Port `8080` (`http://localhost:8080` or `http://<HOST_IP>:8080`)

## 2. Build Pipeline
The production build compiles both the frontend React client and the NestJS backend:
```bash
# Build frontend and backend together
npm run build

# Individual builds
npm run build:frontend  # Vite build output into frontend/dist/
npm run build:backend   # NestJS build output into dist/
```
The NestJS server uses `@nestjs/serve-static` to serve `frontend/dist/` at `/` for all unhandled client routes.

## 3. Server Startup
- **Production Mode**:
  ```bash
  npm run start:prod
  ```
- **Development Mode**:
  ```bash
  npm run start:dev
  ```
- **One-Click Script**:
  ```bash
  ./start.sh
  ```

## 4. Multi-Party WebRTC Verification
When testing multi-party video calling and call merging, follow this standardized test matrix:
1. **Participant 1 (Alice)**: Open `http://localhost:3000` in Desktop Chrome. Click Instant Demo Account **Alice**.
2. **Participant 2 (Bob)**: Open `http://localhost:3000` in an Incognito Window. Click Instant Demo Account **Bob**.
3. **Participant 3 (Charlie)**: Open `https://<LOCAL_IP>:3443` on a mobile device or second browser profile. Click Instant Demo Account **Charlie**.
4. Test 1-on-1 calling between Alice and Bob. Verify audio & video stream both ways.
5. In Alice's toolbar, click **"Add / Merge Call"**, select **Charlie**, and verify Charlie receives the merge invite.
6. When Charlie accepts, verify a 3-way video grid (adaptive 2x2 layout) renders with active Web Audio frequency equalizer visualizers.
