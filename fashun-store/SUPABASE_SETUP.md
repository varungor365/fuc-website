# Supabase Setup Guide for FashUn.Co.in

## 🚀 Quick Setup Checklist

- [ ] Create Supabase account
- [ ] Create new project
- [ ] Get API credentials
- [ ] Configure environment variables
- [ ] Set up authentication providers
- [ ] Create database tables (optional)
- [ ] Configure Row Level Security (RLS)
- [ ] Test authentication flow

---

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

---

## Step 2: Create New Project

1. Click "New Project"
2. Fill in project details:
   - **Name**: `fashun-store` (or any name you prefer)
   - **Database Password**: Create a strong password and SAVE IT
   - **Region**: Choose closest to your users (e.g., `ap-south-1` for India)
   - **Pricing Plan**: Start with Free tier
3. Click "Create new project"
4. Wait 2-3 minutes for project to be ready

---

## Step 3: Get API Credentials

### Project URL and API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (long string)
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (different long string)

### ⚠️ Important Security Notes:
- ✅ **anon key**: Safe to use in frontend (public)
- ❌ **service_role key**: NEVER expose in frontend - server-side only!

---

## Step 4: Configure Environment Variables

Update your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://oyysorgjqeqxhmyczphk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eXNvcmdqcWVxeGhteWN6cGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjU4OTgsImV4cCI6MjA3NDQwMTg5OH0.s1qVEpeS3SIqHbuh4NJxpXzw7kYacpoAHYMV5QIZvCE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eXNvcmdqcWVxeGhteWN6cGhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODgyNTg5OCwiZXhwIjoyMDc0NDAxODk4fQ.jql_y2-LcUlK_KEzV2UnHMb9kPJiPRWbc11f7OWAxek

# App URL (update for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace:
- `xxxxxxxxxxxxx` with your actual project reference ID
- Both keys with the actual keys from Supabase dashboard

---

## Step 5: Set Up Authentication Providers

### Enable Email/Password Authentication (Default)

1. Go to **Authentication** → **Providers**
2. **Email** is enabled by default
3. Configure settings:
   - ✅ Enable email confirmations (recommended for production)
   - ⚠️ Disable for development (faster testing)

### Enable Google OAuth

1. In **Authentication** → **Providers**, click **Google**
2. Toggle "Enable Sign in with Google"

#### Get Google OAuth Credentials:

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search "Google+ API" and enable it
4. Create OAuth Credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `FashUn Store`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (development)
     - `https://fashun.co.in` (production)
   - **Authorized redirect URIs**:
     - `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
     - (Replace with your Supabase project URL)
5. Copy **Client ID** and **Client Secret**
6. Back in Supabase, paste them into Google provider settings
7. Click **Save**

### Enable Apple OAuth (Optional)

1. In **Authentication** → **Providers**, click **Apple**
2. Follow Supabase's guide: https://supabase.com/docs/guides/auth/social-login/auth-apple

---

## Step 6: Configure Site URL and Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set:
   - **Site URL**: `http://localhost:3000` (development) or `https://fashun.co.in` (production)
   - **Redirect URLs**: Add these allowed URLs:
     ```
     http://localhost:3000/**
     https://fashun.co.in/**
     https://*.vercel.app/**  (if using Vercel)
     ```

---

## Step 7: Create Database Tables (Optional)

If you're storing user profiles or cart data in Supabase:

### Users/Profiles Table

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Cart Table (Optional)

```sql
-- Create cart table
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own cart"
    ON public.carts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
    ON public.carts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart"
    ON public.carts FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

---

## Step 8: Test Authentication

### Test in Development

1. Start your dev server:
   ```bash
   cd fashun-store
   npm run dev
   ```

2. Navigate to: http://localhost:3000/login

3. Test Google Login:
   - Click "Sign in with Google"
   - Should redirect to Google OAuth
   - After authorization, should redirect back to `/account`

4. Test Email/Password:
   - Fill in email and password
   - Should create account and redirect

### Check Supabase Dashboard

1. Go to **Authentication** → **Users**
2. You should see your test user listed
3. Click on user to see details

---

## Step 9: Production Setup

### Update Environment Variables for Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6...
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6...
   NEXT_PUBLIC_SITE_URL = https://fashun.co.in
   ```

### Update Supabase URLs

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Update **Site URL** to: `https://fashun.co.in`
3. Update Google OAuth redirect URIs to use production URL

---

## 🔧 Configuration Files Check

### Current Setup Status:

✅ **Package Installed**: `@supabase/supabase-js@2.75.0`  
✅ **Client File**: `src/lib/supabase-client.ts` (exists)  
⚠️ **Environment Variables**: Need actual values from Supabase  
✅ **Auth Routes**: Google OAuth route created  
✅ **Middleware**: Updated for modern Supabase client  

### Files That Use Supabase:

1. `src/lib/supabase-client.ts` - Main client
2. `src/app/auth/callback/route.ts` - OAuth callback
3. `src/app/api/auth/social/google/route.ts` - Google login
4. `src/app/api/auth/social/apple/route.ts` - Apple login
5. `src/middleware.ts` - Session checking

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key"
**Solution**: Double-check that you copied the full API key from Supabase dashboard

### Issue: "Redirect URL not whitelisted"
**Solution**: Add your URL to **Authentication** → **URL Configuration** → **Redirect URLs**

### Issue: "Session not persisting"
**Solution**: 
- Check cookies are enabled in browser
- Ensure `NEXT_PUBLIC_SITE_URL` matches your actual URL
- Clear browser cookies and try again

### Issue: "Google OAuth returns error"
**Solution**:
- Verify Google OAuth credentials are correct
- Check redirect URI matches exactly: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
- Ensure Google+ API is enabled in Google Cloud Console

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Auth Helpers**: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- **Social Login**: https://supabase.com/docs/guides/auth/social-login
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security

---

## ✅ Setup Completion Checklist

Before deploying to production:

- [ ] Supabase project created
- [ ] Environment variables added to `.env.local`
- [ ] Google OAuth configured and tested
- [ ] Authentication tested in development
- [ ] Database tables created (if needed)
- [ ] Row Level Security policies added
- [ ] Environment variables added to Vercel
- [ ] Production URLs updated in Supabase
- [ ] Authentication tested in production

---

## 🎯 Next Steps After Setup

1. **Create User Profile Page**: Display user info at `/account`
2. **Add Sign Out Button**: Implement `supabase.auth.signOut()`
3. **Protected Routes**: Use middleware to protect admin/account pages
4. **User Data Sync**: Sync cart/wishlist with Supabase
5. **Email Templates**: Customize auth emails in Supabase dashboard

---

**Need Help?** Check the troubleshooting section or Supabase Discord: https://discord.supabase.com
