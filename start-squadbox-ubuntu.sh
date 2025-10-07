#!/bin/bash

# Squadbox Ubuntu VM Startup Script
# Database: gdiba2_squadbox (PostgreSQL + MongoDB backup)
# Full Docker + Native support

echo "🚀 STARTING SQUADBOX ON UBUNTU VM"
echo "=================================="
echo "Database: gdiba2_squadbox (PostgreSQL + MongoDB backup)"
echo "Backend: FastAPI + AI Generation + BE_* variables"
echo "Mode: Full Docker + Native support"
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker is available - using Docker deployment"
    
    # Start with Docker Compose
    if [ -f "docker-compose.ubuntu.yml" ]; then
        echo "🚀 Starting Docker services..."
        docker-compose -f docker-compose.ubuntu.yml up -d --build
        
        if [ $? -eq 0 ]; then
            echo "✅ Docker services started"
            echo "   Frontend: http://localhost:3000"
            echo "   Backend: http://localhost:8000"
            echo "   API Docs: http://localhost:8000/docs"
        else
            echo "❌ Failed to start Docker services"
            echo "   Falling back to native deployment..."
            
            # Fallback to native deployment
            if [ -f "setup-backend-venv.sh" ]; then
                ./setup-backend-venv.sh
                ./run-backend-native.sh &
            fi
        fi
    else
        echo "❌ Docker Compose file not found"
        echo "   Using native deployment..."
        
        # Use native deployment
        if [ -f "setup-backend-venv.sh" ]; then
            ./setup-backend-venv.sh
            ./run-backend-native.sh &
        fi
    fi
else
    echo "⚠️  Docker not available - using native deployment"
    
    # Use native deployment
    if [ -f "setup-backend-venv.sh" ]; then
        ./setup-backend-venv.sh
        ./run-backend-native.sh &
    else
        echo "❌ Native deployment scripts not found"
        exit 1
    fi
fi

echo ""
echo "🎯 SQUADBOX STARTUP COMPLETE!"
echo "============================="
echo "✅ Services are starting..."
echo "✅ Database: gdiba2_squadbox (PostgreSQL + MongoDB backup)"
echo "✅ Backend: FastAPI + AI Generation + BE_* variables"
echo ""
echo "🔗 ACCESS URLS:"
echo "==============="
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "Health: http://localhost:8000/health"
echo ""
echo "✅ Squadbox startup complete!"
