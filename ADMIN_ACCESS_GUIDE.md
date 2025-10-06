# 🔐 Admin Access Guide - Fashun.co.in

## Admin Portal URLs

### Main E-commerce Store
```
Production: https://www.fashun.co.in/admin
Local Dev:  http://localhost:3000/admin
```

### Profile Service Dashboard
```
Production: https://p.fashun.co.in/dashboard
Local Dev:  http://localhost:3001/dashboard
```

---

## 🚀 Accessing Admin Panel

### Method 1: Direct URL
1. Navigate to `https://www.fashun.co.in/admin`
2. Login with your admin credentials
3. Access all settings and configurations

### Method 2: From Homepage
1. Go to `https://www.fashun.co.in`
2. Click user menu (top right)
3. Select "Admin Dashboard" (only visible to admins)

---

## 🔑 Admin Credentials Setup

### Initial Setup (First Time)

1. **Create Admin User in Supabase**
```sql
-- Run in Supabase SQL Editor
-- Replace 'your-email@example.com' with your email

-- First, sign up normally through the website
-- Then run this to make yourself admin:

UPDATE profiles 
SET is_admin = TRUE 
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'
);
```

2. **Verify Admin Access**
```sql
-- Check if you're admin
SELECT p.*, u.email 
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE p.is_admin = TRUE;
```

---

## 📋 Admin Panel Features

### Settings Tab (www.fashun.co.in/admin/settings)

**Available Tabs:**
1. **General** - Site name, URL, currency
2. **Backend** - Medusa configuration
3. **Authentication** - Clerk/Auth0/Turnstile
4. **Payment** - Razorpay/Stripe keys
5. **Email** - SendGrid/Resend
6. **Media & CDN** - ImageKit/Cloudinary/Unsplash
7. **AI Services** - Gemini/Sanity/Algolia
8. **Integrations** - Crisp/Exchange Rates/Formspree

### Products Management
- Add/Edit/Delete products
- Manage inventory
- Set pricing
- Upload images

### Orders Management
- View all orders
- Update order status
- Generate tracking IDs
- Send notifications

### Customers Management
- View customer list
- Customer details
- Order history
- Analytics

---

## 🛡️ Security Best Practices

### Protect Admin Routes

**File**: `fashun-store/src/middleware.ts`
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

### Check Admin Status

**File**: `fashun-store/src/lib/auth.ts`
```typescript
import { supabase } from './supabase';

export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', userId)
    .single();
  
  return data?.is_admin || false;
}
```

---

## 🌐 Domain Configuration

### DNS Settings for fashun.co.in

```
Type    Name    Value                           TTL
A       @       <Your-Server-IP>                3600
A       www     <Your-Server-IP>                3600
CNAME   p       cname.vercel-dns.com            3600
```

### Vercel Deployment

**Main Store (www.fashun.co.in)**
```bash
cd fashun-store
vercel --prod
# Add domain: www.fashun.co.in
```

**Profile Service (p.fashun.co.in)**
```bash
cd profile-service
vercel --prod
# Add domain: p.fashun.co.in
```

---

## 🔧 Troubleshooting Admin Access

### Issue: "Access Denied" Error

**Solution 1: Check Admin Status**
```sql
SELECT * FROM profiles WHERE user_id = 'your-user-id';
```

**Solution 2: Grant Admin Access**
```sql
UPDATE profiles SET is_admin = TRUE WHERE user_id = 'your-user-id';
```

### Issue: Can't Find Admin Link

**Solution**: Manually navigate to:
- `https://www.fashun.co.in/admin`
- Or add admin link to navigation

### Issue: Settings Not Saving

**Solution**: Check browser console for errors
```javascript
// Test API endpoint
fetch('/api/admin/settings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: true })
})
.then(r => r.json())
.then(console.log);
```

---

## 📱 Mobile Admin Access

### Responsive Design
- Admin panel is fully mobile-responsive
- Access from any device
- Touch-optimized controls

### Mobile URL
```
https://www.fashun.co.in/admin
```

---

## 👥 Multiple Admin Users

### Add More Admins

```sql
-- Add admin role to existing user
UPDATE profiles 
SET is_admin = TRUE 
WHERE user_id = 'user-id-here';

-- Or by email
UPDATE profiles 
SET is_admin = TRUE 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@fashun.co.in'
);
```

### Remove Admin Access

```sql
UPDATE profiles 
SET is_admin = FALSE 
WHERE user_id = 'user-id-here';
```

---

## 🎯 Quick Access Checklist

- [ ] Admin account created in Supabase
- [ ] `is_admin` flag set to TRUE
- [ ] Can access `/admin` route
- [ ] All API keys configured
- [ ] Settings save successfully
- [ ] Products can be managed
- [ ] Orders are visible
- [ ] Domain configured correctly

---

## 📞 Admin Support

### Common Admin Tasks

**1. Update Site Settings**
```
URL: /admin/settings
Tab: General
```

**2. Configure Payment**
```
URL: /admin/settings
Tab: Payment
```

**3. Manage Products**
```
URL: /admin/products
```

**4. View Orders**
```
URL: /admin/orders
```

**5. Customer Analytics**
```
URL: /admin/analytics
```

---

## 🔐 Password Reset for Admin

### If You Forget Admin Password

1. Go to login page
2. Click "Forgot Password"
3. Enter admin email
4. Check email for reset link
5. Set new password
6. Login to admin panel

### Or Reset via Supabase

1. Go to Supabase Dashboard
2. Authentication → Users
3. Find your user
4. Click "Send password reset email"

---

## ✅ Admin Access Verification

### Test Admin Access

```bash
# 1. Check if admin route is accessible
curl https://www.fashun.co.in/admin

# 2. Test settings API
curl -X POST https://www.fashun.co.in/api/admin/settings \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# 3. Verify authentication
curl https://www.fashun.co.in/api/auth/me
```

---

## 🎉 You're All Set!

Your admin panel is now accessible at:
- **Main Admin**: https://www.fashun.co.in/admin
- **Profile Dashboard**: https://p.fashun.co.in/dashboard

**Default Admin Features:**
- ✅ Full settings control
- ✅ Product management
- ✅ Order processing
- ✅ Customer analytics
- ✅ API configuration
- ✅ Real-time updates

---

**Need Help?** Check the troubleshooting section or contact support.
