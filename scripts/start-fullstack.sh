#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "[fullstack] waiting for PostgreSQL"
until pg_isready -h "${SHOPPING_POSTGRES_HOST:-127.0.0.1}" -p "${SHOPPING_POSTGRES_PORT:-5432}" -U postgres 2>/dev/null; do
  sleep 1
done

echo "[fullstack] preparing backend env"
pnpm --filter @samchon/shopping-backend build:env

echo "[fullstack] creating schema and seeding demo data"
(
  cd packages/backend
  pnpm schema 2>/dev/null || true
)

echo "[fullstack] starting backend"
pnpm --filter @samchon/shopping-backend start &
BACKEND_PID=$!

echo "[fullstack] waiting for backend"
node <<'EOF'
const net = require("net");

const host = "127.0.0.1";
const port = 37001;
const deadline = Date.now() + 120_000;

function attempt() {
  const socket = net.createConnection({ host, port });
  socket.on("connect", () => {
    socket.end();
    process.exit(0);
  });
  socket.on("error", () => {
    socket.destroy();
    if (Date.now() > deadline) {
      console.error(`[fullstack] backend did not become ready at ${host}:${port}`);
      process.exit(1);
    }
    setTimeout(attempt, 1000);
  });
}

attempt();
EOF

echo "[fullstack] starting frontend"
cd packages/frontend
exec pnpm exec next start --hostname 0.0.0.0 --port 3000
