#!/bin/bash

# Deployment script for Competitive Exam Document Converter

echo "🚀 Starting deployment process..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Build and start the application
echo "🔨 Building Docker images..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    echo "✅ Docker images built successfully"
else
    echo "❌ Failed to build Docker images"
    exit 1
fi

echo "🚀 Starting the application..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✅ Application started successfully"
    echo ""
    echo "🌐 Application is now running at:"
    echo "   Production: http://localhost:3000"
    echo ""
    echo "📊 To check the status:"
    echo "   docker-compose ps"
    echo ""
    echo "📝 To view logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 To stop the application:"
    echo "   docker-compose down"
else
    echo "❌ Failed to start the application"
    exit 1
fi