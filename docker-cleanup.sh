#!/bin/bash

# Cleanup script for Docker resources

echo "🧹 Docker cleanup utility"
echo ""

read -p "This will remove all exam-converter related Docker resources. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 1
fi

echo "🛑 Stopping all containers..."
docker-compose down --remove-orphans

echo "🗑️  Removing Docker images..."
docker rmi $(docker images | grep exam-converter | awk '{print $3}') 2>/dev/null || echo "No exam-converter images found"

echo "🧽 Removing unused Docker resources..."
docker system prune -f

echo "📊 Current Docker usage:"
docker system df

echo "✅ Cleanup completed!"