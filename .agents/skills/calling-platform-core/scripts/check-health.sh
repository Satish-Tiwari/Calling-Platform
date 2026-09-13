#!/usr/bin/env bash
set -euo pipefail

echo "========================================"
echo " Calling Platform Diagnostics & Health"
echo "========================================"

# Check Node.js and NPM
echo -n "Checking Node.js... "
if command -v node >/dev/null 2>&1; then
  echo "OK ($(node -v))"
else
  echo "MISSING"
fi

echo -n "Checking NPM... "
if command -v npm >/dev/null 2>&1; then
  echo "OK ($(npm -v))"
else
  echo "MISSING"
fi

# Check Docker & Docker Compose
echo -n "Checking Docker... "
if command -v docker >/dev/null 2>&1; then
  echo "OK"
  echo -n "Checking Docker containers... "
  if docker compose ps >/dev/null 2>&1; then
    RUNNING=$(docker compose ps --services --filter "status=running" | tr '\n' ' ')
    echo "Running services: ${RUNNING:-None}"
  else
    echo "Docker daemon not reachable"
  fi
else
  echo "MISSING"
fi

# Check Ports
check_port() {
  local port=$1
  local name=$2
  echo -n "Checking port $port ($name)... "
  if lsof -i :"$port" >/dev/null 2>&1; then
    local pid
    pid=$(lsof -t -i :"$port" | head -n1)
    echo "ACTIVE (PID: $pid)"
  else
    echo "FREE"
  fi
}

check_port 3000 "HTTP Server"
check_port 3443 "HTTPS Server"
check_port 5432 "PostgreSQL"
check_port 8080 "Adminer GUI"

# Check SSL Certificates
echo -n "Checking SSL certificates... "
if [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
  echo "OK (ssl/cert.pem and ssl/key.pem present)"
else
  echo "WARNING: ssl certificates missing in ssl/"
fi

# Check Frontend Build
echo -n "Checking Frontend Build (frontend/dist/index.html)... "
if [ -f "frontend/dist/index.html" ]; then
  echo "OK"
else
  echo "MISSING (Run: npm run build:frontend)"
fi

# Check Backend Build
echo -n "Checking Backend Build (dist/main.js)... "
if [ -f "dist/main.js" ]; then
  echo "OK"
else
  echo "MISSING (Run: npm run build:backend)"
fi

# Check Graphify Knowledge Graph
echo -n "Checking Graphify Knowledge Graph (.graphify/graph.json)... "
if [ -f ".graphify/graph.json" ]; then
  echo "OK"
else
  echo "MISSING (Run: npm run graphify:build)"
fi

echo "========================================"
