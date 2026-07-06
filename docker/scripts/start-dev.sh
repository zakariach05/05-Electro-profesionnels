#!/bin/bash
# A helper script to cleanly reset and start the Docker development environment

# Exit immediately if a command exits with a non-zero status
set -e

echo "=========================================================="
echo "    Electro-05 Docker Dev Environment Setup & Reset"
echo "=========================================================="

cd "$(dirname "$0")/.."

echo ""
echo "🛑 Step 1: Stopping existing containers and removing orphans..."
docker compose --profile dev down -v --remove-orphans

echo ""
echo "🧹 Step 2: Cleaning up unused Docker resources..."
# We use -f to force without prompting. 
# This removes stopped containers, unused networks, dangling images, and build cache.
docker system prune -f

echo ""
echo "🚀 Step 3: Building and starting the stack in dev mode..."
# We run detached (-d) so the script doesn't hang.
docker compose --profile dev up --build -d

echo ""
echo "⏳ Step 4: Waiting for services to become healthy..."
echo "This might take a few minutes (especially for React to compile the first time)."
echo "You can view the startup logs by running: docker compose --profile dev logs -f"
echo ""
echo "To check the health status of all containers, run:"
echo "docker compose --profile dev ps"

echo ""
echo "🌐 Access Points once everything is healthy:"
echo "----------------------------------------------------------"
echo "- React Frontend : http://localhost:8080"
echo "- Laravel API    : http://localhost:8080/api"
echo "- phpMyAdmin     : http://localhost:8888"
echo "- Mailpit UI     : http://localhost:8025"
echo "----------------------------------------------------------"
echo ""
echo "✅ Setup initiated successfully!"
