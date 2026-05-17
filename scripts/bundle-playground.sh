#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WEBSITE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PLAYGROUND_ROOT="$(cd "$WEBSITE_ROOT/../execgo-playground" && pwd)"
VERSION="0.1.0"
OUT_DIR="$WEBSITE_ROOT/public/downloads"
ARCHIVE_NAME="execgo-playground-v${VERSION}.tar.gz"

mkdir -p "$OUT_DIR"

tar -czf "$OUT_DIR/$ARCHIVE_NAME" \
  -C "$PLAYGROUND_ROOT/.." \
  --exclude='execgo-playground/.git' \
  --exclude='execgo-playground/.idea' \
  --exclude='execgo-playground/.pytest_cache' \
  --exclude='execgo-playground/var' \
  --exclude='execgo-playground/desktop-client/node_modules' \
  --exclude='execgo-playground/desktop-client/.npm-cache' \
  --exclude='execgo-playground/desktop-client/dist' \
  --exclude='execgo-playground/desktop-client/src-tauri/target' \
  --exclude='execgo-playground/.venv' \
  --exclude='execgo-playground/__pycache__' \
  --exclude='execgo-playground/src/execgo_playground.egg-info' \
  --exclude='*.pyc' \
  execgo-playground

echo "✓ Packaged: $OUT_DIR/$ARCHIVE_NAME ($(du -h "$OUT_DIR/$ARCHIVE_NAME" | cut -f1))"
