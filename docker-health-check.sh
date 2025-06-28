#!/bin/bash

# Health check script for the deployed application

echo "🏥 Performing health check..."

# Check if containers are running
echo "📊 Checking container status..."
docker-compose ps

# Check if the application is responding
echo ""
echo "🌐 Testing application endpoints..."

# Test production endpoint
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ Production server (port 3000) is responding"
else
    echo "❌ Production server (port 3000) is not responding"
fi

# Test development endpoint if running
if curl -f -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Development server (port 5173) is responding"
else
    echo "ℹ️  Development server (port 5173) is not running"
fi

# Check Docker logs for any errors
echo ""
echo "📝 Recent logs (last 20 lines):"
docker-compose logs --tail=20

echo ""
echo "💾 Disk usage by Docker images:"
docker images | grep exam-converter

echo ""
echo "🔍 Container resource usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"