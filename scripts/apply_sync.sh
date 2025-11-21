#!/usr/bin/env bash
set -euo pipefail
if [ ! -d .sync_tmp ]; then
  echo ".sync_tmp not found"
  exit 1
fi
mkdir -p badges global
cp .sync_tmp/health.json ./badges/health.json 2>/dev/null || true
cp .sync_tmp/latest_image.png ./badges/latest_image.png 2>/dev/null || true
cp .sync_tmp/heartbeat-canary.json ./badges/heartbeat-canary.json 2>/dev/null || true
echo "Applied sync payload locally"
