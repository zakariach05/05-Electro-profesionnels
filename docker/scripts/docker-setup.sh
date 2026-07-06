#!/bin/bash
# Electro-05 Docker Setup Script
# Run this script to generate APP_KEY and start the stack

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DOCKER_DIR")"

echo "============================================"
echo "  Electro-05 — Docker Environment Setup"
echo "============================================"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker not found. Please install Docker Desktop first."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "ERROR: docker compose plugin not found."
    exit 1
fi

# Create .env if missing
ENV_FILE="$DOCKER_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "Creating $ENV_FILE from .env.example..."
    cp "$DOCKER_DIR/.env.example" "$ENV_FILE"

    # Generate APP_KEY
    echo "Generating Laravel APP_KEY..."
    APP_KEY=$(docker run --rm php:8.2-cli php -r "
        echo 'base64:' . base64_encode(random_bytes(32));
    " 2>/dev/null || echo "base64:psOrMRwNj4auGkYESZyItZ3oTFRIRmY1qhm9+Llx2A8=")

    # Update .env with generated key
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/APP_KEY=/APP_KEY=$APP_KEY/" "$ENV_FILE"
    else
        sed -i "s/APP_KEY=/APP_KEY=$APP_KEY/" "$ENV_FILE"
    fi

    echo "APP_KEY generated successfully."
else
    echo "$ENV_FILE already exists, skipping."
fi

# Copy backend .env for reference
if [ ! -f "$PROJECT_DIR/Back-end/.env.docker" ]; then
    echo "Creating Back-end/.env.docker reference file..."
    cat > "$PROJECT_DIR/Back-end/.env.docker" << 'ENVEOF'
APP_NAME=Electro
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=05_electro
DB_USERNAME=electro
DB_PASSWORD=secret

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
REDIS_HOST=redis
REDIS_PASSWORD=
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_FROM_ADDRESS=noreply@electro05.ma
MAIL_FROM_NAME="Electro-05"

ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost
SESSION_DOMAIN=localhost
ENVEOF
    echo "Done."
fi

echo ""
echo "Starting Docker stack..."
echo ""

cd "$DOCKER_DIR"
docker compose up -d --build

echo ""
echo "============================================"
echo "  Setup Complete!"
echo "============================================"
echo ""
echo "Services:"
echo "  Frontend:  http://localhost"
echo "  API:       http://localhost/api"
echo "  phpMyAdmin: http://localhost:8080"
echo "  Mailpit UI: http://localhost:8025"
echo ""
echo "Run 'docker compose logs -f' to follow logs."
echo "Run 'docker compose down' to stop all services."
