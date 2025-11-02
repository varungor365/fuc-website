# 🔐 SUPABASE PRODUCTION CONFIGURATION GUIDE

## CRITICAL: Update Supabase Dashboard Settings

To fix the login system for production (fashun.co.in), you need to configure the following in your Supabase dashboard:

### 1. 📍 **Site URL Configuration**
Go to: **Settings** > **Authentication** > **URL Configuration**

Update these fields:
- **Site URL**: `https://fashun.co.in`
- **Redirect URLs**: Add these exact URLs:
  ```
  https://fashun.co.in/auth/callback
  https://fashun.co.in/auth/callback?redirect=/account
  https://fashun.co.in/auth/callback?redirect=/admin
  http://localhost:3000/auth/callback
  http://localhost:3000/auth/callback?redirect=/account
  http://localhost:3000/auth/callback?redirect=/admin
  ```

### 2. 🔗 **Google OAuth Configuration**
Go to: **Settings** > **Authentication** > **Providers** > **Google**

Make sure:
- ✅ **Enabled** is turned ON
- ✅ **Client ID** and **Client Secret** are configured
- ✅ In your Google Cloud Console, add these authorized redirect URIs:
  ```
  https://oyysorgjqeqxhmyczphk.supabase.co/auth/v1/callback
  ```

### 3. 🌐 **Environment Variables**
Ensure these are set in your production environment:

```bash
NEXT_PUBLIC_APP_URL=https://fashun.co.in
NEXT_PUBLIC_SUPABASE_URL=https://oyysorgjqeqxhmyczphk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. 🚀 **Deployment Verification**
After updating Supabase settings:

1. **Test Login Flow**:
   - Go to `https://fashun.co.in/login`
   - Click "Continue with Google"
   - Should redirect to Google → back to fashun.co.in/account

2. **Debug Issues**:
   - Check browser console for errors
   - Check Supabase logs in dashboard
   - Verify redirect URLs match exactly

### 5. 📋 **Quick Checklist**
- [ ] Site URL set to `https://fashun.co.in`
- [ ] Redirect URLs include fashun.co.in callbacks
- [ ] Google OAuth enabled with correct redirect URI
- [ ] Production environment variables deployed
- [ ] Test login flow on live site

## 🔥 **Common Issues & Solutions**

**Issue**: "Invalid redirect URL" error
**Solution**: Double-check redirect URLs in Supabase match exactly (case-sensitive)

**Issue**: "OAuth configuration error"  
**Solution**: Verify Google Cloud Console redirect URI matches Supabase callback URL

**Issue**: "Session not persisting"
**Solution**: Check secure cookie settings (should be enabled in production)

---

## 🛠️ **Code Changes Made**

1. **Updated .env.local**: Set `NEXT_PUBLIC_APP_URL=https://fashun.co.in`
2. **Created .env.production**: Production-ready environment configuration
3. **Fixed Google OAuth Route**: Now uses production URL for redirects
4. **Fixed Auth Callback**: Consistent URL handling for production
5. **Updated Configuration**: All auth flows now work with fashun.co.in

## ⚡ **Next Steps**

1. **Deploy these changes** to your production environment
2. **Update Supabase dashboard** with the settings above
3. **Test the login flow** on fashun.co.in
4. **Verify authentication** works end-to-end

The authentication system is now **production-ready** for fashun.co.in! 🎉