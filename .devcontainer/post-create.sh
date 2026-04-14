#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[codespaces] enabling corepack"
corepack enable

echo "[codespaces] installing workspace dependencies"
pnpm install

echo "[codespaces] preparing frontend env file"
cp packages/frontend/.env.example packages/frontend/.env.local

echo "[codespaces] building frontend for next start"
pnpm --filter @samchon/shopping-frontend build

echo "[codespaces] bootstrap complete"
