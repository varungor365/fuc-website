# 🔧 FASHUN.CO PLATFORM - DEPENDENCY INSTALLATION GUIDE

## 📋 PREREQUISITES CHECKLIST

### 1. **Node.js & npm Installation**
- **Required Version**: Node.js 18.x to 20.x (Latest LTS recommended)
- **Download**: https://nodejs.org/en/download/
- **Verify Installation**:
  ```bash
  node --version  # Should show v18.x.x or v20.x.x
  npm --version   # Should show 8.x.x or higher
  ```

### 2. **Git Installation** (If not already installed)
- **Download**: https://git-scm.com/download/windows
- **Verify**: `git --version`

### 3. **Python** (Required for some native dependencies)
- **Required Version**: Python 3.8+ 
- **Download**: https://www.python.org/downloads/
- **Verify**: `python --version`

---

## 🚀 AUTOMATED INSTALLATION

### **Option 1: Run the PowerShell Installation Script**

```powershell
# Navigate to project root
cd d:\fuc-website-main

# Run the installation script
.\install-dependencies.ps1
```

### **Option 2: Manual Installation Steps**

#### **Step 1: Install Node.js Backend Dependencies**
```bash
cd fashun-backend
npm install
```

#### **Step 2: Install Next.js Frontend Dependencies**
```bash
cd ../fashun-store
npm install
```

#### **Step 3: Install AI Service Dependencies**
```bash
cd ../ai-mockup-service
npm install
```

---

## 📦 COMPLETE DEPENDENCY LIST

### **🎯 Strapi Backend (fashun-backend/)**
```json
{
  "core": [
    "@strapi/strapi@^4.25.23",
    "@strapi/plugin-users-permissions@^4.25.23",
    "@strapi/plugin-graphql@^5.24.1",
    "better-sqlite3@^12.4.1"
  ],
  "security": [
    "cors@^2.8.5",
    "helmet@^8.1.0",
    "express-rate-limit@^8.1.0",
    "xss@^1.0.15",
    "validator@^13.15.15"
  ],
  "performance": [
    "compression@^1.8.1",
    "express-slow-down@^3.0.0",
    "node-cache@^5.1.2",
    "sharp@^0.34.4"
  ],
  "ui": [
    "react@^18.3.1",
    "react-dom@^18.3.1",
    "react-router-dom@^5.3.4",
    "styled-components@^6.1.13"
  ]
}
```

### **🌐 Next.js Frontend (fashun-store/)**
```json
{
  "core": [
    "next@^14.2.8",
    "react@^18.2.0",
    "react-dom@^18.2.0",
    "typescript@^5.2.2"
  ],
  "ui_framework": [
    "tailwindcss@^3.3.5",
    "framer-motion@^11.5.4",
    "@headlessui/react@^1.7.17",
    "@heroicons/react@^2.0.18",
    "lucide-react@^0.445.0"
  ],
  "ai_features": [
    "@google/generative-ai@^0.24.1",
    "fuse.js@^7.1.0"
  ],
  "ecommerce": [
    "stripe@^14.9.0",
    "razorpay@^2.9.6",
    "axios@^1.12.2",
    "zustand@^4.4.7"
  ],
  "design_tools": [
    "fabric@^5.3.0",
    "konva@^9.2.0",
    "react-konva@^18.2.10",
    "sharp@^0.32.6"
  ],
  "charts_analytics": [
    "chart.js@^4.5.0",
    "react-chartjs-2@^5.3.0",
    "date-fns@^4.1.0"
  ],
  "pwa_seo": [
    "next-pwa@^5.6.0",
    "next-seo@^6.4.0",
    "next-sitemap@^4.2.3",
    "@vercel/analytics@^1.5.0",
    "@vercel/speed-insights@^1.2.0"
  ],
  "database": [
    "@supabase/supabase-js@^2.57.4"
  ],
  "ui_components": [
    "embla-carousel-react@^8.0.0",
    "swiper@^11.0.0",
    "react-hot-toast@^2.4.1"
  ]
}
```

### **🤖 AI Mockup Service (ai-mockup-service/)**
```json
{
  "core": [
    "express@^4.21.1",
    "cors@^2.8.5",
    "multer@^1.4.5-lts.1",
    "axios@^1.7.7",
    "dotenv@^16.4.5"
  ],
  "image_processing": [
    "canvas@^3.2.0",
    "sharp@^0.33.5",
    "jimp@^1.6.0"
  ],
  "utilities": [
    "uuid@^10.0.0"
  ]
}
```

---

## ⚡ QUICK START COMMANDS

### **1. Install All Dependencies (One Command)**
```bash
# From project root
npm run install-all
```

### **2. Start Development Environment**
```bash
# Start all services
.\start-platform.ps1
```

### **3. Individual Service Commands**
```bash
# Backend only
cd fashun-backend && npm run dev

# Frontend only  
cd fashun-store && npm run dev

# AI Service only
cd ai-mockup-service && npm run dev
```

---

## 🔍 TROUBLESHOOTING

### **Common Issues & Solutions**

#### **Issue 1: Node.js Version Mismatch**
```bash
# Check current version
node --version

# If wrong version, use nvm (Node Version Manager)
nvm install 20.9.0
nvm use 20.9.0
```

#### **Issue 2: Python Build Tools Missing**
```bash
# Windows
npm install --global windows-build-tools

# Or install Visual Studio Build Tools
```

#### **Issue 3: Canvas/Sharp Native Dependencies**
```bash
# Clear npm cache
npm cache clean --force

# Rebuild native dependencies
npm rebuild

# Or delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Issue 4: Permission Errors**
```bash
# Run as Administrator (Windows)
# Or fix npm permissions
npm config set registry https://registry.npmjs.org/
```

---

## 📊 DEPENDENCY VERIFICATION

### **Health Check Commands**
```bash
# Check all installations
npm run health-check

# Verify specific services
cd fashun-backend && npm run build
cd fashun-store && npm run build  
cd ai-mockup-service && npm test
```

### **Expected Output**
```
✅ Node.js: v20.9.0
✅ npm: v10.1.0
✅ Backend Dependencies: 25 installed
✅ Frontend Dependencies: 67 installed  
✅ AI Service Dependencies: 12 installed
✅ All Services: Ready to start
```

---

## 🎯 FINAL VERIFICATION

After installation, run these commands to verify everything works:

```bash
# 1. Start the platform
.\start-platform.ps1

# 2. Check service health
curl http://localhost:1337/admin    # Strapi Backend
curl http://localhost:3000          # Next.js Frontend  
curl http://localhost:3001/health   # AI Service

# 3. Run tests
npm run test:all
```

---

## 📞 SUPPORT

If you encounter any issues:

1. **Check Node.js Version**: Must be 18.x to 20.x
2. **Clear Cache**: `npm cache clean --force`
3. **Reinstall**: Delete `node_modules` and run `npm install`
4. **Check Logs**: Look for specific error messages
5. **Native Dependencies**: Ensure Python and build tools are installed

**🚀 Once all dependencies are installed, your FASHUN.CO platform will be ready to launch!**