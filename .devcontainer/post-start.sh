#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

start_if_needed() {
  local name="$1"
  local command="$2"
  local pid_file="/tmp/${name}.pid"
  local log_file="/tmp/${name}.log"

  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file")"
    if kill -0 "$pid" 2>/dev/null; then
      echo "[codespaces] ${name} already running (pid ${pid})"
      return
    fi
    rm -f "$pid_file"
  fi

  echo "[codespaces] starting ${name}"
  nohup bash -lc "cd '$ROOT_DIR' && ${command}" >"$log_file" 2>&1 &
  echo $! >"$pid_file"
}

start_if_needed "shopping-backend" "pnpm --filter @samchon/shopping-backend start"
start_if_needed "shopping-frontend" "cd packages/frontend && pnpm exec next start --hostname 0.0.0.0 --port 3000"

echo "[codespaces] frontend log: /tmp/shopping-frontend.log"
echo "[codespaces] backend log: /tmp/shopping-backend.log"
echo "[codespaces] make port 3000 public before sharing the demo URL"
