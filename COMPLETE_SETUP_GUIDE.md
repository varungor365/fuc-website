# 🚀 FASHUN.CO - Complete Setup & Launch Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Backend Setup (Medusa)](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Admin Configuration](#admin-configuration)
5. [Payment Integration](#payment-integration)
6. [Production Deployment](#production-deployment)

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### One-Command Setup
```powershell
.\setup-medusa.ps1
```

This will:
- Install Medusa CLI
- Create backend project
- Configure database
- Install dependencies
- Setup environment variables

---

## 🏗️ Backend Setup (Medusa)

### 1. Install PostgreSQL
```powershell
# Download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

### 2. Create Database
```sql
CREATE DATABASE fashun_medusa;
```

### 3. Initialize Medusa
```bash
cd d:\fuc-website-main
medusa new fashun-medusa-backend
cd fashun-medusa-backend
```

### 4. Configure Environment
Create `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/fashun_medusa
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
ADMIN_CORS=http://localhost:7001
STORE_CORS=http://localhost:3000
```

### 5. Run Migrations & Seed
```bash
npm run build
medusa migrations run
npm run seed
```

### 6. Start Services
```bash
# Terminal 1: Backend
npm run start

# Terminal 2: Admin
npm run dev:admin
```

**Access Points:**
- Backend API: http://localhost:9000
- Admin Dashboard: http://localhost:7001

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd fashun-store
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_your_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

**Access:** http://localhost:3000

---

## ⚙️ Admin Configuration

### 1. Access Admin Panel
Navigate to: http://localhost:3000/admin/settings

### 2. Configure Settings

#### General Settings
- Site Name: FASHUN.CO
- Site URL: https://fashun.co
- Support Email: support@fashun.co
- Currency: INR

#### Backend Configuration
- Medusa URL: http://localhost:9000 (dev) or https://api.fashun.co (prod)

#### Payment Providers
**Razorpay:**
- Key ID: rzp_test_xxxxx (test) or rzp_live_xxxxx (production)
- Key Secret: Your secret key

**Stripe (Optional):**
- Publishable Key: pk_test_xxxxx
- Secret Key: sk_test_xxxxx

#### Email Configuration
- Provider: SendGrid
- API Key: Your SendGrid API key

#### Integrations
- Google Analytics ID: G-XXXXXXXXXX
- Facebook Pixel: Your pixel ID
- Instagram Token: Your access token
- OpenRouter API Key: For AI features
- Lummi API Key: For image services

### 3. Save Settings
Click "Save Settings" - this will:
- Update `.env.local` file
- Reload frontend automatically
- Apply changes immediately

---

## 💳 Payment Integration (Razorpay)

### 1. Create Razorpay Account
Visit: https://razorpay.com/

### 2. Get API Keys
Dashboard → Settings → API Keys

### 3. Configure in Admin
Admin Panel → Settings → Payment → Razorpay
- Add Key ID
- Add Key Secret
- Save

### 4. Test Payment
1. Add product to cart
2. Go to checkout
3. Fill details
4. Click "Pay Now"
5. Use test card: 4111 1111 1111 1111

### 5. Production Setup
- Switch to live keys
- Enable webhooks
- Configure payment methods

---

## 🚀 Production Deployment

### Frontend (Vercel)

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Deploy
```bash
cd fashun-store
vercel --prod
```

#### 3. Configure Environment Variables
In Vercel Dashboard:
```
NEXT_PUBLIC_MEDUSA_URL=https://api.fashun.co
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxx
NEXT_PUBLIC_SITE_URL=https://fashun.co
```

### Backend (Railway)

#### 1. Install Railway CLI
```bash
npm i -g @railway/cli
```

#### 2. Deploy
```bash
cd fashun-medusa-backend
railway login
railway init
railway up
```

#### 3. Configure Environment
In Railway Dashboard:
```
DATABASE_URL=your-postgres-url
REDIS_URL=your-redis-url
JWT_SECRET=production-secret
COOKIE_SECRET=production-secret
ADMIN_CORS=https://admin.fashun.co
STORE_CORS=https://fashun.co
```

### Database (Railway PostgreSQL)
```bash
railway add postgresql
```

### Domain Configuration
1. Add custom domain in Vercel
2. Update DNS records
3. Enable SSL

---

## 🔄 Auto-Sync Features

### Admin → Frontend/Backend Sync
When admin changes settings:
1. Settings saved to `config/settings.json`
2. `.env.local` updated automatically
3. Frontend reloads with new config
4. Backend picks up changes on restart

### Real-Time Updates
- Product changes reflect immediately
- Price updates sync automatically
- Inventory updates in real-time
- Order status updates instantly

---

## 📊 Testing Checklist

### Before Launch
- [ ] All pages load correctly
- [ ] Products display properly
- [ ] Cart functionality works
- [ ] Checkout flow completes
- [ ] Payment processing successful
- [ ] Order confirmation emails sent
- [ ] Admin panel accessible
- [ ] Settings changes apply
- [ ] Mobile responsive
- [ ] Performance optimized

### Test Accounts
**Admin:**
- Email: admin@medusa-test.com
- Password: supersecret

**Test Payment:**
- Card: 4111 1111 1111 1111
- CVV: 123
- Expiry: Any future date

---

## 🆘 Troubleshooting

### Backend Not Starting
```bash
# Check PostgreSQL
Get-Service postgresql*
Start-Service postgresql-x64-14

# Check port
netstat -ano | findstr :9000
taskkill /PID <PID> /F
```

### Frontend Build Fails
```bash
# Clear cache
rm -rf .next
npm run build
```

### Payment Not Working
1. Check Razorpay keys in admin
2. Verify `.env.local` updated
3. Check browser console for errors
4. Test with Razorpay test mode

### Settings Not Saving
1. Check file permissions
2. Verify `config` directory exists
3. Check browser console
4. Restart development server

---

## 📱 Launch Checklist

### Pre-Launch
- [ ] Medusa backend deployed
- [ ] Frontend deployed to Vercel
- [ ] Database configured
- [ ] Payment gateway in live mode
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Admin settings configured
- [ ] Products uploaded
- [ ] Shipping options set
- [ ] Tax rates configured

### Launch Day
- [ ] Final testing
- [ ] Backup database
- [ ] Monitor error logs
- [ ] Test payment flow
- [ ] Verify email notifications
- [ ] Check mobile experience
- [ ] Monitor performance

### Post-Launch
- [ ] Monitor analytics
- [ ] Track conversions
- [ ] Respond to support queries
- [ ] Fix critical bugs
- [ ] Gather user feedback

---

## 🎉 You're Ready to Launch!

Run the deployment script:
```powershell
.\deploy-production.ps1
```

This will:
1. Run pre-deployment checks
2. Build frontend
3. Run tests
4. Deploy to Vercel
5. Deploy backend to Railway
6. Verify deployment
7. Show live URLs

**Live URLs:**
- Website: https://fashun.co
- Admin: https://admin.fashun.co
- API: https://api.fashun.co

---

## 📞 Support

- **Documentation**: Check all `.md` files in project root
- **Issues**: Create GitHub issue
- **Email**: dev@fashun.co
- **Medusa Docs**: https://docs.medusajs.com

---

**Last Updated**: 2025
**Version**: 2.0.0
**Status**: Production Ready ✅
