# Squadbox Deployment Guide

## 🚀 Backend Deployment (Render)

### Prerequisites
- Render account
- GitHub repository connected to Render

### Steps
1. **Connect Repository**: Link your GitHub repo to Render
2. **Create Web Service**: 
   - Build Command: `pip install -r backend/requirements-production.txt`
   - Start Command: `cd backend && python -m uvicorn app:app --host 0.0.0.0 --port $PORT`
3. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://...
   MONGODB_URI=mongodb://...
   OPENAI_API_KEY=your_openai_key
   SECRET_KEY=your_secret_key
   ENVIRONMENT=production
   ```
4. **Deploy**: Render will automatically deploy on git push

## 🎯 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Steps
1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables**:
   ```
   VITE_API_URL=https://squadbox-backend.onrender.com
   VITE_APP_NAME=Squadbox
   VITE_APP_VERSION=1.0.0
   ```
4. **Deploy**: Vercel will automatically deploy on git push

## 🔧 Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app:app --reload
```

### Frontend
```bash
npm install
npm run dev
```

## 📝 Production Checklist

### Backend (Render)
- [ ] Database connections configured
- [ ] Environment variables set
- [ ] CORS configured for frontend domain
- [ ] Health endpoints working
- [ ] SSL/HTTPS enabled

### Frontend (Vercel)
- [ ] API URL points to production backend
- [ ] Build optimization enabled
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)
- [ ] Analytics configured (optional)

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS includes frontend domain
2. **API Connection**: Verify VITE_API_URL in frontend
3. **Database**: Check database connection strings
4. **Build Failures**: Check Node.js version compatibility

### Support
- Backend logs: Render dashboard
- Frontend logs: Vercel dashboard
- Database: Render database dashboard
