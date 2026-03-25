#!/usr/bin/env bash
set -eu

PROJECT_DIR="/home/pedro/Escritorio/My-Portfolio-v3"
BACKUP_DIR="$PROJECT_DIR/data/backups"
STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

tar -czf "$BACKUP_DIR/runtime-$STAMP.tar.gz" -C "$PROJECT_DIR" data/runtime
echo "Backup created at $BACKUP_DIR/runtime-$STAMP.tar.gz"
