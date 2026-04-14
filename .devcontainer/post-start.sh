#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="/tmp/shopping-fullstack.pid"
LOG_FILE="/tmp/shopping-fullstack.log"

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE")"
  if kill -0 "$PID" 2>/dev/null; then
    echo "[codespaces] shopping fullstack already running (pid ${PID})"
    exit 0
  fi
  rm -f "$PID_FILE"
fi

echo "[codespaces] starting shopping fullstack"
nohup bash -lc "cd '$ROOT_DIR' && ./scripts/start-fullstack.sh" >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"

echo "[codespaces] fullstack log: $LOG_FILE"
echo "[codespaces] make port 3000 public before sharing the demo URL"
