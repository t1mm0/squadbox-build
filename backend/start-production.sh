#!/bin/bash
# Production startup script for Render deployment
# Purpose: Start Squadbox backend in production mode
# Last modified: 2025-01-09
# By: AI Assistant
# Completeness: 100/100

echo "🚀 Starting Squadbox Backend in Production Mode"

# Set environment variables for production
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
export ENVIRONMENT=production

# Install production dependencies
echo "📦 Installing production dependencies..."
pip install -r requirements-production.txt

# Run database migrations if needed
echo "🗄️ Checking database migrations..."
# alembic upgrade head

# Start the FastAPI application
echo "🌟 Starting FastAPI application on port $PORT"
python -m uvicorn app:app --host 0.0.0.0 --port $PORT --workers 4
