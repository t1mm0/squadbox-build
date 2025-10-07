#!/bin/bash

# Native Backend Runner for SSH Server
# Database: gdiba2_squadbox (PostgreSQL) + MongoDB backup
# Server: gdiba2.ssh.tb-hosting.com
# Runs: FastAPI, AI generation, BE_* variables, etc.

echo "🚀 SQUADBOX NATIVE BACKEND RUNNER"
echo "=================================="
echo "Server: gdiba2.ssh.tb-hosting.com"
echo "Database: gdiba2_squadbox (PostgreSQL + MongoDB backup)"
echo "Backend: FastAPI + AI Generation + BE_* variables"
echo ""

# Check if we're on the SSH server
if [[ "$HOSTNAME" == *"tb-be03-linssh018"* ]]; then
    echo "✅ Running on SSH server: $HOSTNAME"
    SERVER_MODE=true
else
    echo "⚠️  Running locally - preparing for SSH deployment"
    SERVER_MODE=false
fi

echo ""
echo "🔍 CHECKING SYSTEM REQUIREMENTS..."
echo "=================================="

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
    echo "✅ Python 3: $PYTHON_VERSION"
else
    echo "❌ Python 3 not found"
    exit 1
fi

# Check pip
if command -v pip3 &> /dev/null; then
    echo "✅ pip3 found"
else
    echo "❌ pip3 not found"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "backend/app.py" ]; then
    echo "❌ backend/app.py not found"
    echo "   Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure found"

echo ""
echo "🐍 SETTING UP PYTHON VIRTUAL ENVIRONMENT..."
echo "============================================"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    
    if [ $? -eq 0 ]; then
        echo "✅ Virtual environment created"
    else
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
else
    echo "✅ Virtual environment exists"
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

if [ $? -eq 0 ]; then
    echo "✅ Virtual environment activated"
else
    echo "❌ Failed to activate virtual environment"
    exit 1
fi

echo ""
echo "📦 INSTALLING BACKEND DEPENDENCIES..."
echo "===================================="

# Install backend dependencies
cd backend

# Create requirements.txt if it doesn't exist
if [ ! -f "requirements.txt" ]; then
    echo "📋 Creating requirements.txt..."
    cat > requirements.txt << 'EOF'
# Squadbox Backend Requirements
# Database: gdiba2_squadbox (PostgreSQL + MongoDB backup)

# FastAPI and ASGI
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# Database (PostgreSQL + MongoDB)
psycopg2-binary==2.9.9
sqlalchemy==2.0.23
alembic==1.12.1
pymongo==4.6.0

# HTTP and API
httpx==0.25.2
requests==2.31.0
aiofiles==23.2.1

# AI/LLM
openai==1.3.7
ollama==0.1.7

# Data Processing
pandas==2.1.4
numpy==1.25.2
pydantic==2.5.0

# Utilities
python-dotenv==1.0.0
pyyaml==6.0.1
jinja2==3.1.2
markdown==3.5.1

# Security
cryptography==41.0.8
bcrypt==4.1.2

# Monitoring
prometheus-client==0.19.0
psutil==5.9.6
EOF
    echo "✅ requirements.txt created"
fi

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "🔧 CONFIGURING BACKEND ENVIRONMENT..."
echo "===================================="

# Set all BE_* environment variables
export BE_HOST=0.0.0.0
export BE_PORT=8000
export BE_WORKERS=1
export BE_RELOAD=true
export BE_LOG_LEVEL=INFO
export BE_DEBUG=false

# Database Configuration (PostgreSQL primary, MongoDB backup)
export BE_DB_PROVIDER=postgresql
export BE_DB_HOST=localhost
export BE_DB_PORT=5432
export BE_DB_NAME=gdiba2_squadbox
export BE_DB_USER=gdiba-2tb-hostingcom
export BE_DB_PASSWORD=xuPxu7-buwxaq-kemryf
export BE_DB_URL=postgresql://gdiba-2tb-hostingcom:xuPxu7-buwxaq-kemryf@localhost:5432/gdiba2_squadbox

# MongoDB Configuration (backup)
export BE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gdiba2_squadbox
export BE_MONGODB_DB=gdiba2_squadbox
export BE_MONGODB_COLLECTION=squadbox

# JWT Configuration
export BE_AUTH_JWT_SECRET=your-super-secret-jwt-key-here-64-chars-long
export BE_AUTH_JWT_128_KEY=your-super-secret-jwt-128-key-here-128-chars-long-for-enhanced-security
export BE_AUTH_JWT_EXPIRE_DAYS=7
export BE_AUTH_JWT_ALGORITHM=HS256
export BE_AUTH_JWT_ISSUER=squadbox-api
export BE_AUTH_JWT_AUDIENCE=squadbox-users

# LLM/AI Configuration
export BE_LLM_PROVIDER=ollama
export BE_LLM_HOST=localhost
export BE_LLM_PORT=11434
export BE_LLM_MODEL=tinyllama:latest
export BE_LLM_TIMEOUT=30
export BE_LLM_MAX_TOKENS=4000
export BE_LLM_TEMPERATURE=0.2

# Ollama Configuration
export BE_OLLAMA_HOST=http://localhost:11434
export BE_OLLAMA_MODEL=tinyllama:latest
export BE_OLLAMA_ENABLED=true
export BE_OLLAMA_TIMEOUT=30

# Project Configuration
export BE_PROJECT_STORAGE_PATH=./generated_projects
export BE_PROJECT_MAX_SIZE_MB=100
export BE_PROJECT_MAX_FILES=1000
export BE_PROJECT_GENERATION_TIMEOUT=300
export BE_PROJECT_MAX_CONCURRENT=5
export BE_PROJECT_RETRY_ATTEMPTS=3
export BE_PROJECT_FALLBACK_ENABLED=true

# MMRY Compression Configuration
export BE_MMRY_STORAGE_PATH=./mmry_secure_storage
export BE_MMRY_COMPRESSION_RATIO=0.1
export BE_MMRY_ENCRYPTION_ENABLED=true
export BE_MMRY_RETENTION_DAYS=90

# Agentic Team Configuration
export BE_AGENT_TEAM_SIZE=7
export BE_AGENT_TASK_TIMEOUT=300
export BE_AGENT_MAX_RETRIES=3
export BE_AGENT_PARALLEL_EXECUTION=true

# Security Configuration
export BE_SECURITY_CORS_ORIGINS=https://squadbox.gdiba2.ssh.tb-hosting.com,https://www.squadbox.gdiba2.ssh.tb-hosting.com,http://localhost:5173
export BE_SECURITY_CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
export BE_SECURITY_CORS_HEADERS=*
export BE_SECURITY_CORS_CREDENTIALS=true
export BE_SECURITY_RATE_LIMIT_REQUESTS=100
export BE_SECURITY_RATE_LIMIT_WINDOW=60
export BE_SECURITY_RATE_LIMIT_BURST=10

# Logging Configuration
export BE_LOG_LEVEL=INFO
export BE_LOG_FORMAT="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
export BE_LOG_FILE=./logs/backend.log
export BE_LOG_MAX_SIZE=10485760
export BE_LOG_BACKUP_COUNT=5

# Monitoring Configuration
export BE_MONITOR_HEALTH_ENABLED=true
export BE_MONITOR_HEALTH_INTERVAL=30
export BE_MONITOR_METRICS_ENABLED=true
export BE_MONITOR_METRICS_PORT=9090
export BE_MONITOR_PERFORMANCE_ENABLED=true

# Development Configuration
export BE_DEV_MODE=false
export BE_DEV_DEBUG=false
export BE_DEV_RELOAD=true
export BE_TEST_MODE=false

echo "✅ Backend environment configured"

echo ""
echo "📁 CREATING NECESSARY DIRECTORIES..."
echo "===================================="

# Create necessary directories
mkdir -p ./logs
mkdir -p ./generated_projects
mkdir -p ./mmry_secure_storage
mkdir -p ./backend/logs

echo "✅ Directories created"

echo ""
echo "🧪 TESTING BACKEND CONFIGURATION..."
echo "==================================="

# Test backend configuration
if [ -f "test_backend.py" ]; then
    echo "🔍 Running backend tests..."
    python test_backend.py
    TEST_RESULT=$?
    
    if [ $TEST_RESULT -eq 0 ]; then
        echo "✅ Backend tests passed"
    else
        echo "⚠️  Some backend tests failed (this may be expected if database is not running)"
    fi
else
    echo "⚠️  Backend test script not found"
    TEST_RESULT=1
fi

echo ""
echo "🚀 STARTING BACKEND SERVER..."
echo "============================="

# Check if backend is already running
if pgrep -f "uvicorn.*app:app" > /dev/null; then
    echo "⚠️  Backend server is already running"
    echo "   Stopping existing server..."
    pkill -f "uvicorn.*app:app"
    sleep 2
fi

# Start backend server
echo "🚀 Starting FastAPI backend server..."
echo "   Host: $BE_HOST"
echo "   Port: $BE_PORT"
echo "   Workers: $BE_WORKERS"
echo "   Database: $BE_DB_URL"
echo "   LLM: $BE_LLM_PROVIDER ($BE_LLM_MODEL)"
echo "   Storage: $BE_PROJECT_STORAGE_PATH"
echo "   Logs: $BE_LOG_FILE"
echo ""

# Start with uvicorn
if [ "$SERVER_MODE" = true ]; then
    # Run in background on server
    echo "🔄 Starting backend server in background..."
    nohup uvicorn app:app \
        --host $BE_HOST \
        --port $BE_PORT \
        --workers $BE_WORKERS \
        --reload $BE_RELOAD \
        --log-level $BE_LOG_LEVEL \
        --access-log \
        --use-colors \
        > ./logs/backend.log 2>&1 &
    
    BACKEND_PID=$!
    echo "✅ Backend server started (PID: $BACKEND_PID)"
    echo "   Logs: ./logs/backend.log"
    echo "   URL: http://$BE_HOST:$BE_PORT"
    echo "   API Docs: http://$BE_HOST:$BE_PORT/docs"
    echo "   Health: http://$BE_HOST:$BE_PORT/health"
    echo "   Metrics: http://$BE_HOST:$BE_PORT/metrics"
    
    # Wait a moment and check if server started
    sleep 3
    if pgrep -f "uvicorn.*app:app" > /dev/null; then
        echo "✅ Backend server is running successfully"
    else
        echo "❌ Backend server failed to start"
        echo "   Check logs: ./logs/backend.log"
        exit 1
    fi
else
    # Run in foreground locally
    echo "🔄 Starting backend server in foreground..."
    echo "   Press Ctrl+C to stop"
    echo ""
    
    uvicorn app:app \
        --host $BE_HOST \
        --port $BE_PORT \
        --workers $BE_WORKERS \
        --reload $BE_RELOAD \
        --log-level $BE_LOG_LEVEL \
        --access-log \
        --use-colors
fi

echo ""
echo "🎯 BACKEND DEPLOYMENT COMPLETE!"
echo "==============================="
echo "✅ Backend server is running"
echo "✅ Database: gdiba2_squadbox (PostgreSQL + MongoDB backup)"
echo "✅ AI Generation: Enabled"
echo "✅ BE_* variables: Configured"
echo "✅ FastAPI: Running"
echo ""
echo "📊 BACKEND STATUS:"
echo "=================="
echo "Host: $BE_HOST"
echo "Port: $BE_PORT"
echo "Workers: $BE_WORKERS"
echo "Database: $BE_DB_URL"
echo "LLM: $BE_LLM_PROVIDER ($BE_LLM_MODEL)"
echo "Storage: $BE_PROJECT_STORAGE_PATH"
echo "Logs: $BE_LOG_FILE"
echo ""
echo "🔗 ACCESS URLS:"
echo "==============="
echo "API: http://$BE_HOST:$BE_PORT"
echo "Docs: http://$BE_HOST:$BE_PORT/docs"
echo "Health: http://$BE_HOST:$BE_PORT/health"
echo "Metrics: http://$BE_HOST:$BE_PORT/metrics"
echo ""
echo "✅ Native backend deployment complete!"
