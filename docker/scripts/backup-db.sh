#!/bin/bash
# Database backup script for Electro-05
# Usage: ./backup-db.sh [output-dir]

set -e

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="${DB_DATABASE:-05_electro}"
DB_USER="${DB_USERNAME:-electro}"
DB_PASS="${DB_PASSWORD:-secret}"
CONTAINER="electro-mysql"

mkdir -p "$BACKUP_DIR"

echo "Backing up $DB_NAME from $CONTAINER..."
docker exec "$CONTAINER" mysqldump \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --add-drop-table \
    -u "$DB_USER" \
    -p"$DB_PASS" \
    "$DB_NAME" \
    | gzip > "${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "Backup complete: ${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

# Keep only last 30 backups
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -mtime +30 -delete
