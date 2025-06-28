#!/bin/bash

# Production deployment script with additional optimizations

echo "🏭 Starting production deployment..."

# Set production environment variables
export NODE_ENV=production
export DOCKER_BUILDKIT=1

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down --remove-orphans

# Remove old images to save space
echo "🗑️  Removing old images..."
docker image prune -f

# Build production images with optimizations
echo "🔨 Building optimized production images..."
docker-compose build --no-cache --parallel

if [ $? -eq 0 ]; then
    echo "✅ Production images built successfully"
else
    echo "❌ Failed to build production images"
    exit 1
fi

# Start production containers
echo "🚀 Starting production containers..."
docker-compose up -d --remove-orphans

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Perform health check
echo "🏥 Performing health check..."
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ Production deployment successful!"
    echo ""
    echo "🌐 Application is live at: http://localhost:3000"
    echo ""
    echo "📊 Container status:"
    docker-compose ps
    echo ""
    echo "💡 Useful commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop app:  docker-compose down"
    echo "   Restart:   docker-compose restart"
    echo "   Update:    git pull && ./production-deploy.sh"
else
    echo "❌ Health check failed. Checking logs..."
    docker-compose logs
    exit 1
fi