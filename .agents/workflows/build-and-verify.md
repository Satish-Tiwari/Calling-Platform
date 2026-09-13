---
command: /build-and-verify
description: Build both frontend and backend and verify health of the project
---

# Workflow: Build and Verify

## Steps
1. Run `.agents/skills/calling-platform-core/scripts/check-health.sh` to inspect environment prerequisites.
2. Build frontend and backend:
   ```bash
   npm run build
   ```
3. Re-sync Graphify knowledge graph:
   ```bash
   npm run graphify:build
   ```
4. Verify graph summary:
   ```bash
   npm run graphify:summary
   ```
