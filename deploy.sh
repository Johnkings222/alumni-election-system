#!/bin/bash

# Alumni Election System - Quick Deploy Script
# This script helps you deploy to your server easily

set -e

echo "=================================================="
echo "Alumni Election System - Deployment Helper"
echo "=================================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Docker
if ! command_exists docker; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check for Docker Compose
if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
    echo "❌ Docker Compose is not installed!"
    echo "Please install Docker Compose first"
    exit 1
fi

echo "✓ Docker is installed"
echo "✓ Docker Compose is installed"
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.production backend/.env
    echo ""
    echo "📝 IMPORTANT: Edit backend/.env and change:"
    echo "   - ADMIN_PASSWORD"
    echo "   - SECRET_KEY"
    echo ""
    read -p "Press Enter after editing .env file, or Ctrl+C to exit..."
fi

echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "=================================================="
    echo "✅ Deployment Successful!"
    echo "=================================================="
    echo ""
    echo "Your application is now running at:"
    echo ""
    echo "  🌐 Main App:  http://localhost"
    echo "  👨‍💼 Admin:     http://localhost/admin"
    echo "  📊 Results:   http://localhost/results"
    echo "  📖 API Docs:  http://localhost:8000/docs"
    echo ""
    echo "Default Admin Credentials:"
    echo "  Username: admin"
    echo "  Password: (check backend/.env)"
    echo ""
    echo "Useful commands:"
    echo "  View logs:    docker-compose logs -f"
    echo "  Stop:         docker-compose down"
    echo "  Restart:      docker-compose restart"
    echo "  Status:       docker-compose ps"
    echo ""
    echo "=================================================="
else
    echo ""
    echo "❌ Deployment failed. Check logs:"
    echo "   docker-compose logs"
    exit 1
fi
