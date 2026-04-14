#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[codespaces] enabling corepack"
corepack enable

echo "[codespaces] installing workspace dependencies"
pnpm install

echo "[codespaces] waiting for postgres"
node <<'EOF'
const net = require("net");

const host = process.env.SHOPPING_POSTGRES_HOST || "postgres";
const port = Number(process.env.SHOPPING_POSTGRES_PORT || "5432");
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
      console.error(`[codespaces] postgres did not become ready at ${host}:${port}`);
      process.exit(1);
    }
    setTimeout(attempt, 1000);
  });
}

attempt();
EOF

echo "[codespaces] preparing backend env files"
pnpm --filter @samchon/shopping-backend build:env

echo "[codespaces] creating schema and seeding demo data"
(
  cd packages/backend
  pnpm schema
)

echo "[codespaces] generating sdk from the backend"
pnpm --filter @samchon/shopping-backend build:sdk

echo "[codespaces] building frontend for next start"
pnpm --filter @samchon/shopping-frontend build

echo "[codespaces] bootstrap complete"
