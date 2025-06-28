#!/bin/bash

# Real-time monitoring script for the deployed application

echo "📊 Starting real-time monitoring..."
echo "Press Ctrl+C to stop monitoring"
echo ""

# Function to display metrics
show_metrics() {
    clear
    echo "🏥 Exam Converter - Live Monitoring"
    echo "=================================="
    echo "⏰ $(date)"
    echo ""
    
    echo "📊 Container Status:"
    docker-compose ps
    echo ""
    
    echo "💾 Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    echo ""
    
    echo "🌐 Application Health:"
    if curl -f -s http://localhost:3000 > /dev/null; then
        echo "✅ Production (port 3000): HEALTHY"
    else
        echo "❌ Production (port 3000): DOWN"
    fi
    
    if curl -f -s http://localhost:5173 > /dev/null 2>&1; then
        echo "✅ Development (port 5173): HEALTHY"
    else
        echo "ℹ️  Development (port 5173): NOT RUNNING"
    fi
    echo ""
    
    echo "📝 Recent Logs (last 5 lines):"
    docker-compose logs --tail=5 | tail -10
    echo ""
    echo "🔄 Refreshing in 5 seconds... (Ctrl+C to stop)"
}

# Monitor loop
while true; do
    show_metrics
    sleep 5
done