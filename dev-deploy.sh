#!/bin/bash

# Development deployment script

echo "🔧 Starting development environment..."

# Build and start development environment
echo "🔨 Building development Docker images..."
docker-compose --profile dev build --no-cache

if [ $? -eq 0 ]; then
    echo "✅ Development images built successfully"
else
    echo "❌ Failed to build development images"
    exit 1
fi

echo "🚀 Starting development server..."
docker-compose --profile dev up -d

if [ $? -eq 0 ]; then
    echo "✅ Development environment started successfully"
    echo ""
    echo "🌐 Development server is running at:"
    echo "   http://localhost:5173"
    echo ""
    echo "🔄 Hot reload is enabled for development"
    echo ""
    echo "📊 To check the status:"
    echo "   docker-compose --profile dev ps"
    echo ""
    echo "📝 To view logs:"
    echo "   docker-compose --profile dev logs -f"
    echo ""
    echo "🛑 To stop development environment:"
    echo "   docker-compose --profile dev down"
else
    echo "❌ Failed to start development environment"
    exit 1
fi