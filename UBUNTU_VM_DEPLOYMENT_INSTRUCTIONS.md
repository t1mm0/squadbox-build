# Squadbox Ubuntu VM Deployment Instructions

## VM Requirements
- **OS**: Ubuntu 22.04+ LTS
- **RAM**: 4GB+ (8GB recommended)
- **Storage**: 20GB+ (50GB recommended)
- **CPU**: 2+ cores (4+ recommended)
- **Network**: Public IP with ports 80, 443, 8000 open

## What This Deployment Includes

### Full Stack Services
- **Frontend**: React + Vite (port 3000)
- **Backend**: FastAPI + Python (port 8000)
- **Database**: PostgreSQL primary + MongoDB backup
- **AI/LLM**: Ollama integration
- **Web Server**: Nginx reverse proxy
- **Containerization**: Full Docker support

### BE_* Environment Variables
- `BE_HOST`, `BE_PORT`: Server configuration
- `BE_DB_*`: Database configuration (PostgreSQL + MongoDB)
- `BE_AUTH_*`: JWT authentication
- `BE_LLM_*`: AI/LLM configuration
- `BE_PROJECT_*`: Project generation settings
- `BE_MMRY_*`: Compression settings
- `BE_AGENT_*`: Agentic team configuration
- `BE_SECURITY_*`: Security and CORS settings
- `BE_LOG_*`: Logging configuration
- `BE_MONITOR_*`: Monitoring and health checks

## Deployment Options

### Option 1: Full Docker Deployment (Recommended)
```bash
# 1. Upload deployment package
scp squadbox-ubuntu-vm.tar.gz user@your-vm-ip:~/

# 2. Connect to VM
ssh user@your-vm-ip

# 3. Extract and setup
tar -xzf squadbox-ubuntu-vm.tar.gz
cd squadbox-ubuntu-vm

# 4. Run Ubuntu deployment script
chmod +x deploy-ubuntu-vm.sh
./deploy-ubuntu-vm.sh

# 5. Start services
docker-compose -f docker-compose.ubuntu.yml up -d
```

### Option 2: Native Deployment
```bash
# 1. Setup system dependencies
./deploy-ubuntu-vm.sh

# 2. Setup Python environment
./setup-backend-venv.sh

# 3. Run backend natively
./run-backend-native.sh
```

### Option 3: Hybrid Deployment
```bash
# 1. Use Docker for databases
docker-compose -f docker-compose.ubuntu.yml up -d postgres mongodb

# 2. Run backend natively
./setup-backend-venv.sh
./run-backend-native.sh
```

## VM Setup Instructions

### 1. Create Ubuntu VM
- **Provider**: AWS, DigitalOcean, Linode, Vultr, etc.
- **Image**: Ubuntu 22.04 LTS
- **Size**: 4GB RAM, 2 CPU cores minimum
- **Storage**: 20GB+ SSD
- **Network**: Public IP, open ports 80, 443, 8000

### 2. Initial VM Configuration
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip

# Create user (if needed)
sudo adduser squadbox
sudo usermod -aG sudo squadbox
```

### 3. Upload and Deploy
```bash
# Upload deployment package
scp squadbox-ubuntu-vm.tar.gz squadbox@your-vm-ip:~/

# Connect to VM
ssh squadbox@your-vm-ip

# Extract and deploy
tar -xzf squadbox-ubuntu-vm.tar.gz
cd squadbox-ubuntu-vm
chmod +x *.sh
./deploy-ubuntu-vm.sh
```

## Services Configuration

### PostgreSQL Database
- **Host**: localhost (Docker) or localhost (native)
- **Port**: 5432
- **Database**: gdiba2_squadbox
- **User**: gdiba-2tb-hostingcom
- **Password**: xuPxu7-buwxaq-kemryf

### MongoDB Database (backup)
- **Host**: localhost (Docker) or localhost (native)
- **Port**: 27017
- **Database**: gdiba2_squadbox
- **User**: admin
- **Password**: admin123

### FastAPI Backend
- **Host**: 0.0.0.0
- **Port**: 8000
- **Workers**: 4 (Docker) or 1 (native)
- **Database**: PostgreSQL + MongoDB
- **AI**: Ollama integration

### React Frontend
- **Host**: 0.0.0.0
- **Port**: 3000
- **Build**: Vite production build
- **API**: http://localhost:8000/api

### Nginx Reverse Proxy
- **Ports**: 80, 443
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **SSL**: Configured for HTTPS

## Environment Variables

### Core Backend
```bash
BE_HOST=0.0.0.0
BE_PORT=8000
BE_WORKERS=4
BE_RELOAD=true
BE_LOG_LEVEL=INFO
BE_DEBUG=false
```

### Database
```bash
BE_DB_PROVIDER=postgresql
BE_DB_HOST=postgres
BE_DB_PORT=5432
BE_DB_NAME=gdiba2_squadbox
BE_DB_USER=gdiba-2tb-hostingcom
BE_DB_PASSWORD=xuPxu7-buwxaq-kemryf
```

### AI/LLM
```bash
BE_LLM_PROVIDER=ollama
BE_LLM_HOST=ollama
BE_LLM_PORT=11434
BE_LLM_MODEL=tinyllama:latest
BE_LLM_TIMEOUT=30
```

### Security
```bash
BE_SECURITY_CORS_ORIGINS=http://localhost:3000,http://localhost:8000
BE_SECURITY_CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
BE_SECURITY_CORS_HEADERS=*
BE_SECURITY_CORS_CREDENTIALS=true
```

## Monitoring and Maintenance

### Health Checks
- **Frontend**: http://your-vm-ip/
- **Backend**: http://your-vm-ip/api/health
- **API Docs**: http://your-vm-ip/api/docs
- **Database**: PostgreSQL + MongoDB

### Logs
- **Backend**: ./logs/backend.log
- **Frontend**: Docker logs
- **Database**: Docker logs
- **Nginx**: /var/log/nginx/

### Performance
- **Memory**: Monitor with `htop`
- **CPU**: Monitor with `htop`
- **Disk**: Monitor with `df -h`
- **Network**: Monitor with `netstat`

## Troubleshooting

### Docker Issues
```bash
# Check Docker status
docker ps
docker-compose ps

# Check logs
docker-compose logs -f

# Restart services
docker-compose restart
```

### Database Issues
```bash
# Check PostgreSQL
docker exec -it squadbox-ubuntu-vm_postgres_1 psql -U gdiba-2tb-hostingcom -d gdiba2_squadbox

# Check MongoDB
docker exec -it squadbox-ubuntu-vm_mongodb_1 mongosh
```

### Backend Issues
```bash
# Check backend logs
docker-compose logs -f backend

# Test API
curl http://localhost:8000/health
```

## Production Considerations

### Security
- Configure firewall (UFW)
- Set up SSL certificates
- Change default passwords
- Enable fail2ban
- Configure log rotation

### Performance
- Optimize database queries
- Configure connection pooling
- Set up monitoring
- Configure backups
- Set up load balancing

### Monitoring
- Set up Prometheus + Grafana
- Configure log aggregation
- Set up alerting
- Monitor resource usage
- Track API metrics

## Cost Estimation

### VM Costs (Monthly)
- **AWS t3.medium**: ~$30-40
- **DigitalOcean 4GB**: ~$24
- **Linode 4GB**: ~$24
- **Vultr 4GB**: ~$24

### Additional Costs
- **Domain**: ~$10-15/year
- **SSL Certificate**: Free (Let's Encrypt)
- **Monitoring**: Free (self-hosted)
- **Backups**: ~$5-10/month

### Total Monthly Cost
- **VM**: $24-40
- **Domain**: $1-2
- **Backups**: $5-10
- **Total**: ~$30-52/month

---

**Status**: ✅ Ubuntu VM deployment ready
**Database**: gdiba2_squadbox (PostgreSQL + MongoDB backup)
**Backend**: FastAPI + AI Generation + BE_* variables
**Mode**: Full Docker + Native support
**VM**: Ubuntu 22.04+ with full control
