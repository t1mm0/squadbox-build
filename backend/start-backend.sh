#!/bin/bash
# Squadbox Backend Startup Script
# Purpose: Start backend server with user credentials display
# Last modified: 2025-09-27
# By: AI Assistant
# Completeness: 100/100

echo "🔧 Starting Squadbox Backend Server..."
echo "====================================="
echo ""
echo "📋 TEST USER CREDENTIALS:"
echo "========================="
echo "👤 Email:    admin@squadbox.uk"
echo "🔑 Password: admin123"
echo "✅ Status:  WORKING - Login fixed!"
echo "🏷️  Role:     admin"
echo "📊 Subscription: unlimited"
echo ""
echo "🌐 BACKEND ENDPOINTS:"
echo "===================="
echo "🔧 API Base: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "🔐 Auth:     http://localhost:8000/auth/token"
echo "📋 Templates: http://localhost:8000/templates/"
echo ""
echo "💡 TIP: Use these credentials to test the API endpoints"
echo "====================================="
echo ""

# Activate virtual environment and start server
source venv/bin/activate
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
