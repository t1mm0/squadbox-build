#!/bin/bash

# Backend Virtual Environment Setup for SSH Server
# Database: gdiba2_squadbox
# Server: gdiba2.ssh.tb-hosting.com

echo "🐍 BACKEND VIRTUAL ENVIRONMENT SETUP"
echo "====================================="
echo "Server: gdiba2.ssh.tb-hosting.com"
echo "Database: gdiba2_squadbox"
echo "Python Version: 3.11+"
echo ""

# Check if we're on the SSH server
if [[ "$HOSTNAME" == *"tb-be03-linssh018"* ]]; then
    echo "✅ Running on SSH server"
    SERVER_MODE=true
else
    echo "⚠️  Running locally - will prepare for SSH deployment"
    SERVER_MODE=false
fi

echo ""
echo "🔍 CHECKING PYTHON ENVIRONMENT..."
echo "================================="

# Check Python version
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
    echo "✅ Python 3 found: $PYTHON_VERSION"
    
    # Check if version is 3.11 or higher
    if python3 -c "import sys; exit(0 if sys.version_info >= (3, 11) else 1)" 2>/dev/null; then
        echo "✅ Python version is 3.11+ (compatible)"
    else
        echo "❌ Python version is too old (need 3.11+)"
        echo "   Current: $PYTHON_VERSION"
        echo "   Required: 3.11+"
        exit 1
    fi
else
    echo "❌ Python 3 not found"
    echo "   Please install Python 3.11+ on the server"
    exit 1
fi

# Check pip
if command -v pip3 &> /dev/null; then
    echo "✅ pip3 found"
else
    echo "❌ pip3 not found"
    echo "   Please install pip3"
    exit 1
fi

echo ""
echo "🔧 SETTING UP VIRTUAL ENVIRONMENT..."
echo "===================================="

# Create virtual environment
VENV_DIR="venv"
if [ -d "$VENV_DIR" ]; then
    echo "⚠️  Virtual environment already exists"
    echo "   Removing existing virtual environment..."
    rm -rf "$VENV_DIR"
fi

echo "📦 Creating virtual environment..."
python3 -m venv "$VENV_DIR"

if [ $? -eq 0 ]; then
    echo "✅ Virtual environment created successfully"
else
    echo "❌ Failed to create virtual environment"
    exit 1
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source "$VENV_DIR/bin/activate"

if [ $? -eq 0 ]; then
    echo "✅ Virtual environment activated"
else
    echo "❌ Failed to activate virtual environment"
    exit 1
fi

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

echo ""
echo "📋 INSTALLING BACKEND DEPENDENCIES..."
echo "===================================="

# Create requirements.txt for backend
cat > backend/requirements.txt << EOF
# Squadbox Backend Requirements
# Database: gdiba2_squadbox
# Server: gdiba2.ssh.tb-hosting.com

# FastAPI and ASGI
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# Database
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

# Development (optional)
pytest==7.4.3
pytest-asyncio==0.21.1
black==23.11.0
flake8==6.1.0
EOF

echo "📦 Installing Python dependencies..."
cd backend
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🔧 CONFIGURING BACKEND ENVIRONMENT..."
echo "===================================="

# Create backend startup script
cat > backend/start_backend.sh << 'EOF'
#!/bin/bash

# Backend Startup Script for SSH Server
# Database: gdiba2_squadbox

echo "🚀 STARTING SQUADBOX BACKEND"
echo "============================="
echo "Database: gdiba2_squadbox"
echo "Server: gdiba2.ssh.tb-hosting.com"
echo ""

# Activate virtual environment
source ../venv/bin/activate

# Load backend environment variables
if [ -f "backend.env" ]; then
    echo "📋 Loading backend environment variables..."
    export $(grep -v '^#' backend.env | xargs)
    echo "✅ Environment variables loaded"
else
    echo "⚠️  Backend environment file not found"
    echo "   Using default configuration"
fi

# Set backend configuration
export BE_HOST=0.0.0.0
export BE_PORT=8000
export BE_WORKERS=4
export BE_RELOAD=true
export BE_LOG_LEVEL=INFO
export BE_DEBUG=false

# Database configuration
export BE_DB_PROVIDER=postgresql
export BE_DB_HOST=postgres
export BE_DB_PORT=5432
export BE_DB_NAME=gdiba2_squadbox
export BE_DB_USER=gdiba-2tb-hostingcom
export BE_DB_PASSWORD=xuPxu7-buwxaq-kemryf
export BE_DB_URL=postgresql://gdiba-2tb-hostingcom:xuPxu7-buwxaq-kemryf@postgres:5432/gdiba2_squadbox

# JWT configuration
export BE_AUTH_JWT_SECRET=your-super-secret-jwt-key-here-64-chars-long
export BE_AUTH_JWT_128_KEY=your-super-secret-jwt-128-key-here-128-chars-long-for-enhanced-security
export BE_AUTH_JWT_EXPIRE_DAYS=7

# LLM configuration
export BE_LLM_PROVIDER=ollama
export BE_LLM_HOST=localhost
export BE_LLM_PORT=11434
export BE_LLM_MODEL=tinyllama:latest
export BE_LLM_TIMEOUT=30

# Project configuration
export BE_PROJECT_STORAGE_PATH=/app/generated_projects
export BE_PROJECT_MAX_SIZE_MB=100
export BE_PROJECT_MAX_FILES=1000
export BE_PROJECT_GENERATION_TIMEOUT=300

# Security configuration
export BE_SECURITY_CORS_ORIGINS=https://squadbox.gdiba2.ssh.tb-hosting.com,https://www.squadbox.gdiba2.ssh.tb-hosting.com
export BE_SECURITY_CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
export BE_SECURITY_CORS_HEADERS=*
export BE_SECURITY_CORS_CREDENTIALS=true

# Logging configuration
export BE_LOG_LEVEL=INFO
export BE_LOG_FILE=/app/logs/backend.log

# Monitoring configuration
export BE_MONITOR_HEALTH_ENABLED=true
export BE_MONITOR_METRICS_ENABLED=true
export BE_MONITOR_METRICS_PORT=9090

echo "🔧 Backend configuration loaded"
echo ""

# Create logs directory
mkdir -p /app/logs

# Start backend server
echo "🚀 Starting FastAPI backend server..."
echo "   Host: $BE_HOST"
echo "   Port: $BE_PORT"
echo "   Workers: $BE_WORKERS"
echo "   Database: $BE_DB_URL"
echo "   LLM: $BE_LLM_PROVIDER ($BE_LLM_MODEL)"
echo ""

# Start with uvicorn
exec uvicorn app:app \
    --host $BE_HOST \
    --port $BE_PORT \
    --workers $BE_WORKERS \
    --reload $BE_RELOAD \
    --log-level $BE_LOG_LEVEL \
    --access-log \
    --use-colors
EOF

chmod +x backend/start_backend.sh

# Create backend test script
cat > backend/test_backend.py << 'EOF'
#!/usr/bin/env python3
"""
Backend Test Script for Squadbox
Purpose: Test backend configuration and dependencies
Database: gdiba2_squadbox
"""

import sys
import os
import importlib
from pathlib import Path

def test_python_version():
    """Test Python version"""
    print("🐍 Testing Python version...")
    if sys.version_info >= (3, 11):
        print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro} (compatible)")
        return True
    else:
        print(f"❌ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro} (too old, need 3.11+)")
        return False

def test_imports():
    """Test required imports"""
    print("\n📦 Testing required imports...")
    
    required_modules = [
        'fastapi',
        'uvicorn',
        'psycopg2',
        'sqlalchemy',
        'pymongo',
        'requests',
        'httpx',
        'pydantic',
        'python_dotenv',
        'yaml',
        'jinja2',
        'cryptography',
        'bcrypt'
    ]
    
    failed_imports = []
    
    for module in required_modules:
        try:
            importlib.import_module(module)
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            failed_imports.append(module)
    
    return len(failed_imports) == 0

def test_backend_config():
    """Test backend configuration"""
    print("\n🔧 Testing backend configuration...")
    
    try:
        from backend_config import BackendConfig
        config = BackendConfig()
        
        print(f"✅ Backend configuration loaded")
        print(f"   Host: {config.host}:{config.port}")
        print(f"   Database: {config.db_url}")
        print(f"   LLM: {config.llm_provider} ({config.llm_model})")
        
        # Validate configuration
        if config.validate_config():
            print("✅ Configuration validation passed")
            return True
        else:
            print("❌ Configuration validation failed")
            return False
            
    except Exception as e:
        print(f"❌ Backend configuration error: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    print("\n🗄️  Testing database connection...")
    
    try:
        import psycopg2
        from backend_config import config
        
        # Test PostgreSQL connection
        conn = psycopg2.connect(
            host=config.db_host,
            port=config.db_port,
            database=config.db_name,
            user=config.db_user,
            password=config.db_password
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        
        print(f"✅ PostgreSQL connection successful")
        print(f"   Version: {version}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("   This is expected if PostgreSQL is not running yet")
        return False

def main():
    """Main test function"""
    print("🧪 SQUADBOX BACKEND TEST")
    print("=" * 50)
    print("Database: gdiba2_squadbox")
    print("Server: gdiba2.ssh.tb-hosting.com")
    print("")
    
    tests = [
        ("Python Version", test_python_version),
        ("Required Imports", test_imports),
        ("Backend Configuration", test_backend_config),
        ("Database Connection", test_database_connection)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test failed: {e}")
            results.append((test_name, False))
    
    print("\n📊 TEST RESULTS")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Backend is ready.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
EOF

chmod +x backend/test_backend.py

echo ""
echo "🧪 TESTING BACKEND SETUP..."
echo "============================"

# Run backend test
cd backend
python test_backend.py
TEST_RESULT=$?
cd ..

echo ""
echo "📋 BACKEND SETUP SUMMARY"
echo "========================"

if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ Backend virtual environment setup complete!"
    echo ""
    echo "🚀 TO START THE BACKEND:"
    echo "   cd backend"
    echo "   ./start_backend.sh"
    echo ""
    echo "🔧 TO TEST THE BACKEND:"
    echo "   cd backend"
    echo "   python test_backend.py"
    echo ""
    echo "📁 BACKEND FILES CREATED:"
    echo "   - venv/ (virtual environment)"
    echo "   - backend/requirements.txt"
    echo "   - backend/start_backend.sh"
    echo "   - backend/test_backend.py"
    echo "   - backend/backend.env"
    echo "   - backend/backend_config.py"
else
    echo "❌ Backend setup had issues"
    echo "   Check the test output above for details"
    exit 1
fi

echo ""
echo "🎯 NEXT STEPS:"
echo "==============="
echo "1. Upload files to SSH server"
echo "2. Run setup-backend-venv.sh on server"
echo "3. Start backend with ./start_backend.sh"
echo "4. Deploy with Docker Compose"
echo ""
echo "✅ Backend virtual environment setup complete!"
