# 🏗️ FASHUN.CO - Medusa Backend Setup Guide

## Quick Setup

### 1. Install Medusa CLI
```bash
npm install -g @medusajs/medusa-cli
```

### 2. Create Backend
```bash
cd d:\fuc-website-main
medusa new fashun-medusa-backend
cd fashun-medusa-backend
```

### 3. Install PostgreSQL
Download and install from: https://www.postgresql.org/download/windows/

Create database:
```sql
CREATE DATABASE fashun_medusa;
```

### 4. Configure Environment
Create `.env` file:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/fashun_medusa
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-here
COOKIE_SECRET=your-cookie-secret-here
ADMIN_CORS=http://localhost:7001,http://localhost:7000
STORE_CORS=http://localhost:3000
```

### 5. Run Migrations
```bash
npm run build
medusa migrations run
```

### 6. Seed Database (Optional)
```bash
npm run seed
```

### 7. Start Services
```bash
# Terminal 1: Backend
npm run start

# Terminal 2: Admin
npm run dev:admin
```

## Access Points
- **Backend API**: http://localhost:9000
- **Admin Dashboard**: http://localhost:7001
- **Frontend**: http://localhost:3000

## Default Admin Credentials
```
Email: admin@medusa-test.com
Password: supersecret
```

## Add Razorpay Plugin
```bash
npm install medusa-payment-razorpay
```

Update `medusa-config.js`:
```javascript
const plugins = [
  {
    resolve: `medusa-payment-razorpay`,
    options: {
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    },
  },
];
```

## Production Deployment

### Railway
```bash
railway login
railway init
railway up
```

### Heroku
```bash
heroku create fashun-medusa-backend
git push heroku main
```

### Environment Variables (Production)
```env
DATABASE_URL=your-production-db-url
REDIS_URL=your-production-redis-url
JWT_SECRET=production-jwt-secret
COOKIE_SECRET=production-cookie-secret
ADMIN_CORS=https://admin.fashun.co
STORE_CORS=https://fashun.co
RAZORPAY_ID=rzp_live_xxxxx
RAZORPAY_SECRET=your_live_secret
```

## Troubleshooting

### Port Already in Use
```bash
netstat -ano | findstr :9000
taskkill /PID <PID> /F
```

### Database Connection Error
Check PostgreSQL service:
```bash
Get-Service postgresql*
Start-Service postgresql-x64-14
```

### Migration Fails
```bash
medusa migrations revert
medusa migrations run
```

## Next Steps
1. Create admin user
2. Add products
3. Configure shipping
4. Set up payment providers
5. Test checkout flow
