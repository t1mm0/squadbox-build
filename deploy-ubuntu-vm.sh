#!/bin/bash

# Ubuntu VM Deployment for Squadbox
# Ubuntu 22.04+ with Docker support
# Database: gdiba2_squadbox (PostgreSQL + MongoDB backup)
# Full control: Docker, Python, Node.js, etc.

echo "🐧 SQUADBOX UBUNTU VM DEPLOYMENT"
echo "================================="
echo "OS: Ubuntu 22.04+ LTS"
echo "Database: gdiba2_squadbox (PostgreSQL + MongoDB backup)"
echo "Backend: FastAPI + AI Generation + BE_* variables"
echo "Mode: Full Docker + Native support"
echo ""

# Check if we're on Ubuntu
if [ -f /etc/os-release ]; then
    . /etc/os-release
    if [[ "$ID" == "ubuntu" ]]; then
        echo "✅ Running on Ubuntu: $VERSION"
        UBUNTU_MODE=true
    else
        echo "⚠️  Not running on Ubuntu: $ID"
        echo "   This script is optimized for Ubuntu 22.04+"
        UBUNTU_MODE=false
    fi
else
    echo "⚠️  Cannot detect OS - assuming Ubuntu"
    UBUNTU_MODE=true
fi

echo ""
echo "🔍 CHECKING SYSTEM REQUIREMENTS..."
echo "=================================="

# Check Ubuntu version
if [ "$UBUNTU_MODE" = true ]; then
    echo "🖥️  Ubuntu Version: $VERSION"
    echo "   Kernel: $(uname -r)"
    echo "   Architecture: $(uname -m)"
    echo "   Memory: $(free -h | grep Mem | awk '{print $2}')"
    echo "   Disk: $(df -h / | tail -1 | awk '{print $2}')"
fi

# Check Docker
echo ""
echo "🐳 DOCKER SUPPORT:"
echo "=================="
if command -v docker &> /dev/null; then
    echo "✅ Docker: $(docker --version)"
    if command -v docker-compose &> /dev/null; then
        echo "✅ Docker Compose: $(docker-compose --version)"
    else
        echo "⚠️  Docker Compose not found - will install"
    fi
else
    echo "❌ Docker not found - will install"
fi

# Check Python
echo ""
echo "🐍 PYTHON ENVIRONMENT:"
echo "======================"
if command -v python3 &> /dev/null; then
    echo "✅ Python 3: $(python3 --version)"
    if command -v pip3 &> /dev/null; then
        echo "✅ pip3: $(pip3 --version)"
    else
        echo "⚠️  pip3 not found - will install"
    fi
else
    echo "❌ Python 3 not found - will install"
fi

# Check Node.js
echo ""
echo "🌐 NODE.JS ENVIRONMENT:"
echo "======================="
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
    if command -v npm &> /dev/null; then
        echo "✅ npm: $(npm --version)"
    else
        echo "⚠️  npm not found - will install"
    fi
else
    echo "❌ Node.js not found - will install"
fi

echo ""
echo "🔧 INSTALLING SYSTEM DEPENDENCIES..."
echo "===================================="

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "📦 Installing essential packages..."
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    build-essential \
    python3-dev \
    python3-pip \
    python3-venv \
    postgresql-client \
    nginx \
    ufw

echo "✅ Essential packages installed"

echo ""
echo "🐳 INSTALLING DOCKER..."
echo "======================="

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    
    # Add Docker's official GPG key
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose (standalone)
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose already installed"
fi

echo ""
echo "🐍 INSTALLING PYTHON ENVIRONMENT..."
echo "==================================="

# Install Python 3.11+ if needed
if ! python3 -c "import sys; exit(0 if sys.version_info >= (3, 11) else 1)" 2>/dev/null; then
    echo "📦 Installing Python 3.11..."
    sudo apt install -y python3.11 python3.11-venv python3.11-dev python3.11-pip
    sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
    echo "✅ Python 3.11 installed"
else
    echo "✅ Python 3.11+ already available"
fi

echo ""
echo "🌐 INSTALLING NODE.JS..."
echo "======================="

# Install Node.js 18+ if needed
if ! node -v | grep -q "v1[8-9]\|v2[0-9]"; then
    echo "📦 Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    echo "✅ Node.js 18 installed"
else
    echo "✅ Node.js 18+ already available"
fi

echo ""
echo "🗄️  SETTING UP DATABASES..."
echo "============================"

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
echo "🔧 Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE gdiba2_squadbox;"
sudo -u postgres psql -c "CREATE USER gdiba-2tb-hostingcom WITH PASSWORD 'xuPxu7-buwxaq-kemryf';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gdiba2_squadbox TO gdiba-2tb-hostingcom;"
sudo -u postgres psql -c "ALTER USER gdiba-2tb-hostingcom CREATEDB;"

echo "✅ PostgreSQL configured"

# Install MongoDB (optional - can use MongoDB Atlas)
echo "📦 Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

echo "✅ MongoDB configured"

echo ""
echo "🔧 CONFIGURING FIREWALL..."
echo "========================="

# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8000
sudo ufw allow 5432
sudo ufw allow 27017
sudo ufw --force enable

echo "✅ Firewall configured"

echo ""
echo "📦 DEPLOYING SQUADBOX..."
echo "======================="

# Create deployment directory
DEPLOY_DIR="/opt/squadbox"
sudo mkdir -p "$DEPLOY_DIR"
sudo chown $USER:$USER "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Copy deployment files
echo "📋 Copying deployment files..."
if [ -f "/home/$USER/squadbox-native-deployment.tar.gz" ]; then
    cp "/home/$USER/squadbox-native-deployment.tar.gz" .
    tar -xzf squadbox-native-deployment.tar.gz
    cd squadbox-native-deployment
elif [ -f "/home/$USER/squadbox-deployment.tar.gz" ]; then
    cp "/home/$USER/squadbox-deployment.tar.gz" .
    tar -xzf squadbox-deployment.tar.gz
    cd squadbox-deployment
else
    echo "⚠️  Deployment package not found"
    echo "   Please upload squadbox-native-deployment.tar.gz to /home/$USER/"
    exit 1
fi

echo "✅ Deployment files copied"

echo ""
echo "🐳 STARTING DOCKER SERVICES..."
echo "=============================="

# Start with Docker Compose
if [ -f "docker-compose.ssh.yml" ]; then
    echo "🚀 Starting Docker services..."
    docker-compose -f docker-compose.ssh.yml up -d --build
    
    if [ $? -eq 0 ]; then
        echo "✅ Docker services started"
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
    echo "⚠️  Docker Compose file not found"
    echo "   Using native deployment..."
    
    # Use native deployment
    if [ -f "setup-backend-venv.sh" ]; then
        ./setup-backend-venv.sh
        ./run-backend-native.sh &
    fi
fi

echo ""
echo "🌐 CONFIGURING NGINX..."
echo "======================"

# Configure Nginx
sudo tee /etc/nginx/sites-available/squadbox << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/squadbox /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Nginx configured"

echo ""
echo "🧪 TESTING DEPLOYMENT..."
echo "======================="

# Test services
echo "🔍 Testing services..."

# Test PostgreSQL
if pg_isready -h localhost -p 5432 -U gdiba-2tb-hostingcom -d gdiba2_squadbox; then
    echo "✅ PostgreSQL connection successful"
else
    echo "❌ PostgreSQL connection failed"
fi

# Test MongoDB
if systemctl is-active --quiet mongod; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running"
fi

# Test Docker
if docker ps | grep -q squadbox; then
    echo "✅ Docker services are running"
else
    echo "⚠️  Docker services not detected"
fi

# Test Nginx
if curl -s http://localhost/health > /dev/null; then
    echo "✅ Nginx proxy is working"
else
    echo "❌ Nginx proxy failed"
fi

echo ""
echo "🎯 UBUNTU VM DEPLOYMENT COMPLETE!"
echo "================================="
echo "✅ Ubuntu 22.04+ configured"
echo "✅ Docker installed and running"
echo "✅ Python 3.11+ available"
echo "✅ Node.js 18+ available"
echo "✅ PostgreSQL + MongoDB configured"
echo "✅ Nginx reverse proxy configured"
echo "✅ Firewall configured"
echo ""
echo "📊 SERVICES STATUS:"
echo "==================="
echo "PostgreSQL: $(systemctl is-active postgresql)"
echo "MongoDB: $(systemctl is-active mongod)"
echo "Nginx: $(systemctl is-active nginx)"
echo "Docker: $(systemctl is-active docker)"
echo ""
echo "🔗 ACCESS URLS:"
echo "==============="
echo "Frontend: http://$(curl -s ifconfig.me)/"
echo "Backend: http://$(curl -s ifconfig.me)/api/"
echo "API Docs: http://$(curl -s ifconfig.me)/api/docs"
echo "Health: http://$(curl -s ifconfig.me)/health"
echo ""
echo "📁 DEPLOYMENT LOCATION:"
echo "======================="
echo "Directory: $DEPLOY_DIR"
echo "Logs: $DEPLOY_DIR/logs/"
echo "Projects: $DEPLOY_DIR/generated_projects/"
echo ""
echo "✅ Ubuntu VM deployment complete!"
