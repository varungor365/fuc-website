# 🔐 FASHUN.CO Admin Portal Access Guide

## Admin Portal URL
**Production:** https://fashun.co.in/admin
**Local:** http://localhost:3000/admin

## Admin Pages Available

### 📊 Dashboard
- **URL:** `/admin/dashboard`
- Overview of sales, orders, and analytics

### 📦 Products Management
- **URL:** `/admin/products`
- Add, edit, delete products
- Manage inventory and pricing

### 📝 Orders Management
- **URL:** `/admin/orders`
- View and process customer orders
- Update order status

### 📈 Analytics
- **URL:** `/admin/analytics`
- Sales reports and insights
- Customer behavior analytics

### 🔑 API Keys Management
- **URL:** `/admin/api-keys`
- Manage third-party API integrations
- Configure payment gateways

### 📸 Instagram Integration
- **URL:** `/admin/instagram`
- Connect Instagram account
- Display real-time posts on website

### 🐛 Error Monitoring
- **URL:** `/admin/error-monitoring`
- Track and fix website errors

### 🌐 Website Checker
- **URL:** `/admin/website-checker`
- Monitor website health and performance

## How to Access Admin

### Step 1: Navigate to Admin URL
Open your browser and go to:
```
https://fashun.co.in/admin
```

### Step 2: Login (If Authentication is Enabled)
Currently, the admin portal is accessible without authentication in development.

**For Production:** You should add authentication. Recommended options:
- NextAuth.js
- Clerk
- Auth0
- Custom JWT authentication

### Step 3: Navigate to Desired Section
Use the sidebar menu to access different admin features.

## Instagram Integration Setup

### Step 1: Get Instagram Access Token
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Instagram Basic Display" product
4. Go to Basic Display > User Token Generator
5. Generate token with permissions:
   - `instagram_graph_user_profile`
   - `instagram_graph_user_media`
6. Copy the Access Token

### Step 2: Configure in Admin
1. Go to `/admin/instagram`
2. Paste your Access Token
3. Click "Save Token"
4. Click "Fetch Posts" to test

### Step 3: Add to Environment Variables (Optional)
For production, add to `.env.local`:
```env
INSTAGRAM_ACCESS_TOKEN=your_token_here
```

## Security Recommendations

### 1. Add Authentication
Protect admin routes with authentication:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check authentication
    const token = request.cookies.get('admin_token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}
```

### 2. Use Environment Variables
Never commit API keys. Use `.env.local`:
```env
ADMIN_PASSWORD=your_secure_password
INSTAGRAM_ACCESS_TOKEN=your_token
STRIPE_SECRET_KEY=your_key
```

### 3. Enable HTTPS
Always use HTTPS in production (Vercel does this automatically).

### 4. Rate Limiting
Add rate limiting to prevent abuse:
```typescript
// Use packages like 'express-rate-limit' or implement custom logic
```

## Quick Access Links

- **Main Admin:** https://fashun.co.in/admin
- **Products:** https://fashun.co.in/admin/products
- **Orders:** https://fashun.co.in/admin/orders
- **Instagram:** https://fashun.co.in/admin/instagram
- **Analytics:** https://fashun.co.in/admin/analytics

## Support

For admin access issues:
- Email: dev@fashun.co.in
- Check browser console for errors
- Verify you're using the correct URL
- Clear browser cache and cookies

## Default Credentials (Development Only)

**⚠️ WARNING:** These are for development only. Change in production!

```
Username: admin@fashun.co
Password: admin123
```

**Remember to implement proper authentication before going live!**
