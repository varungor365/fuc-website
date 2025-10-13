# FASHUN.CO - Quick Fix Guide

## ✅ Issues Fixed

### 1. Backend Dependencies
- Fixed styled-components version conflict (changed from 6.1.13 to 5.3.3)
- Installed all backend dependencies with `--legacy-peer-deps`

### 2. AI Service Dependencies
- Removed problematic canvas package (requires Visual Studio on Windows)
- Using only sharp and jimp for image processing

### 3. Frontend Configuration
- Removed noisy Honeybadger console logs
- All dependencies installed and ready

## 🚀 How to Start the Platform

### Option 1: Automated Script (Recommended)
```powershell
.\fix-and-start.ps1
```

This script will:
- Check and clean ports (1337, 3000, 3001)
- Start all three services in separate windows
- Perform health checks
- Display access URLs

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd fashun-backend
npm run develop
```

**Terminal 2 - AI Service:**
```bash
cd ai-mockup-service
npm start
```

**Terminal 3 - Frontend:**
```bash
cd fashun-store
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Strapi CMS**: http://localhost:1337/admin
- **AI Service Health**: http://localhost:3001/health

## 🔑 Default Credentials

**Strapi Admin** (First time setup):
- Create your admin account on first visit to http://localhost:1337/admin

**Frontend Admin**:
- Email: admin@fashun.co
- Password: admin123

## 🐛 Common Issues & Solutions

### Issue: Port Already in Use
**Solution:**
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Kill process on port 1337
Get-Process -Id (Get-NetTCPConnection -LocalPort 1337).OwningProcess | Stop-Process -Force

# Kill process on port 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

### Issue: Honeybadger Warning
**Status:** ✅ Fixed - This is just an informational message, not an error

### Issue: Admin Dashboard Not Loading
**Solution:**
1. Ensure backend is running on port 1337
2. Check browser console for errors
3. The dashboard uses mock data, so it should work even without Strapi

### Issue: Frontend Build Errors
**Solution:**
```bash
cd fashun-store
rm -rf .next
npm run build
npm run dev
```

### Issue: Module Not Found
**Solution:**
```bash
# Reinstall dependencies
cd fashun-store
npm install

cd ../fashun-backend
npm install --legacy-peer-deps

cd ../ai-mockup-service
npm install
```

## 📊 Service Status Check

### Check if services are running:
```powershell
# Check ports
Test-NetConnection -ComputerName localhost -Port 3000
Test-NetConnection -ComputerName localhost -Port 1337
Test-NetConnection -ComputerName localhost -Port 3001
```

### Health Check URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:1337/_health
- AI Service: http://localhost:3001/health

## 🔧 Environment Variables

### Frontend (.env.local)
Key variables are already set. Optional services:
- Stripe keys (for payments)
- Saleor API (for e-commerce backend)
- OpenAI/Anthropic (for AI features)

### Backend (.env)
Already configured with SQLite database.

## 📝 Notes

1. **Node Version**: You're using Node v22.20.0. Strapi recommends Node 18-20, but it works with warnings.

2. **Database**: Using SQLite for development (file: fashun-backend/.tmp/data.db)

3. **Images**: Product images are referenced from /public/images/ directory

4. **Mock Data**: Admin dashboard uses mock data from API routes

## 🎯 Next Steps

1. Start the platform using `.\fix-and-start.ps1`
2. Visit http://localhost:3000 to see the frontend
3. Visit http://localhost:3000/admin to see the admin dashboard
4. Visit http://localhost:1337/admin to set up Strapi (first time only)

## 💡 Tips

- Keep all three terminal windows open while developing
- Frontend has hot reload - changes appear automatically
- Backend requires restart for most changes
- Check browser console for frontend errors
- Check terminal output for backend errors

## 🆘 Still Having Issues?

1. Check all three services are running
2. Clear browser cache and cookies
3. Check firewall isn't blocking ports
4. Ensure no antivirus is interfering
5. Try restarting your computer

---

**Platform Status**: ✅ Ready to Run
**Last Updated**: 2025-01-06
