# Squadbox AI App Builder

> Build production-grade apps with AI in minutes, not months.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com)

## 🚀 **What is Squadbox?**

Squadbox is an AI-powered app builder that uses specialized AI bots to generate production-ready applications. Our AI squad works together to transform your ideas into fully functional apps with authentication, database integration, and one-click deployment.

### **🤖 AI Squad Members**
- **Builder Bot** - Generates React components and UI
- **Deployer Bot** - Handles deployment and infrastructure
- **Security Bot** - Ensures secure authentication and data protection
- **Designer Bot** - Creates beautiful, responsive interfaces
- **Manager Bot** - Manages project structure and dependencies
- **Logic Bot** - Implements business logic and API endpoints

## ✨ **Features**

### **🎯 Core Features**
- ✅ **AI Code Generation** - Generate production-ready code with AI
- ✅ **Template System** - 10+ pre-built app templates
- ✅ **Authentication** - Secure JWT-based user management
- ✅ **Database Integration** - MongoDB Atlas support
- ✅ **One-Click Deploy** - Deploy to Vercel, Spaceship, or any cloud provider
- ✅ **MMRY Compression** - Proprietary compression for faster builds
- ✅ **Real-time Collaboration** - Team development features

### **🛠️ Technical Features**
- ✅ **Modern React** with hooks and context
- ✅ **FastAPI Backend** with async support
- ✅ **MongoDB Integration** with connection pooling
- ✅ **JWT Authentication** with refresh tokens
- ✅ **Responsive Design** with Mantine UI
- ✅ **Dark Theme** with customizable colors
- ✅ **TypeScript Support** for type safety

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (MongoDB)     │
│   Port: 5173    │    │   Port: 8000    │    │   Atlas Cloud   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Spaceship     │    │   AI Services   │
│   Static Host   │    │   Python Host   │    │   OpenAI/Ollama  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.11+ and pip
- MongoDB Atlas account (free tier)

### **1. Clone Repository**
```bash
git clone https://github.com/T1MM0/squadbox.co.uk.git
cd squadbox.co.uk
```

### **2. Install Dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
pip install -r requirements.txt
```

### **3. Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Update with your values
nano .env
```

### **4. Start Development**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
source venv/bin/activate
python -m uvicorn app:app --reload
```

### **5. Access Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📦 **Installation**

### **Frontend Setup**
```bash
# Install Node.js dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Backend Setup**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start development server
python -m uvicorn app:app --reload
```

### **Database Setup**
```bash
# MongoDB Atlas (Recommended)
# 1. Create free cluster at https://cloud.mongodb.com
# 2. Get connection string
# 3. Update MONGODB_URI in .env

# Local MongoDB (Alternative)
# 1. Install MongoDB locally
# 2. Start MongoDB service
# 3. Update MONGODB_URI to localhost
```

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Mantine UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client

### **Backend**
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Motor** - Async MongoDB driver
- **PyJWT** - JWT token handling
- **Passlib** - Password hashing

### **Database**
- **MongoDB Atlas** - Cloud database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation

### **AI & ML**
- **OpenAI API** - GPT models
- **Ollama** - Local AI models
- **Custom AI Pipeline** - Code generation

### **Deployment**
- **Vercel** - Frontend hosting
- **Spaceship** - Backend hosting
- **MongoDB Atlas** - Database hosting

## 📚 **Documentation**

### **Deployment Guides**
- [Vercel Deployment](VERCEL_DEPLOYMENT.md) - Deploy to Vercel
- [Spaceship Deployment](SPACESHIP_DEPLOYMENT.md) - Deploy to Spaceship
- [Production Setup](PRODUCTION_LOGIN_DATABASE_SETUP.md) - Production configuration

### **API Documentation**
- [API Endpoints](docs/API.md) - Complete API reference
- [Authentication](docs/AUTH.md) - Authentication system
- [Database Schema](docs/DATABASE.md) - Database structure

### **Development**
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Code Style](docs/CODE_STYLE.md) - Coding standards
- [Testing](docs/TESTING.md) - Testing guidelines

## 🎯 **Use Cases**

### **For Developers**
- **Rapid Prototyping** - Build MVPs in hours
- **Code Generation** - AI-assisted development
- **Template Library** - Pre-built app templates
- **Deployment Automation** - One-click deployment

### **For Businesses**
- **SaaS Applications** - Build SaaS products quickly
- **Internal Tools** - Create custom business tools
- **Client Projects** - Deliver projects faster
- **Proof of Concepts** - Validate ideas quickly

### **For Teams**
- **Collaborative Development** - Team-based development
- **Code Sharing** - Share templates and components
- **Version Control** - Git integration
- **CI/CD Pipeline** - Automated deployment

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/squadbox.co.uk.git
cd squadbox.co.uk

# Create feature branch
git checkout -b feature/amazing-feature

# Make your changes
# ... code changes ...

# Commit changes
git commit -m "Add amazing feature"

# Push to fork
git push origin feature/amazing-feature

# Create Pull Request
```

### **Code Style**
- **ESLint** for JavaScript/React
- **Prettier** for code formatting
- **Black** for Python formatting
- **TypeScript** for type safety

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **OpenAI** for AI capabilities
- **Mantine** for UI components
- **FastAPI** for backend framework
- **MongoDB** for database
- **Vercel** for hosting

## 📞 **Support**

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/T1MM0/squadbox.co.uk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/T1MM0/squadbox.co.uk/discussions)
- **Email**: support@squadbox.co.uk

## 🌟 **Star History**

[![Star History Chart](https://api.star-history.com/svg?repos=T1MM0/squadbox.co.uk&type=Date)](https://star-history.com/#T1MM0/squadbox.co.uk&Date)

---

**Built with ❤️ by the Squadbox Team**

[Website](https://squadbox.co.uk) • [Beta](https://beta.squadbox.co.uk) • [Docs](docs/) • [Support](https://github.com/T1MM0/squadbox.co.uk/issues)