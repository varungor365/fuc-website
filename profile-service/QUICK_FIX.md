# Quick Fix - Vercel Build Error

## Problem
```
Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL
```

## Solution (3 Steps)

### 1. Set Environment Variables in Vercel
Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key-here
NEXT_PUBLIC_SITE_URL = https://p.fashun.co.in
NEXT_PUBLIC_STORE_URL = https://www.fashun.co.in
```

### 2. Configure Build Settings
In Vercel project settings:
- **Root Directory**: `profile-service`
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3. Redeploy
Click "Redeploy" in Vercel dashboard or run:
```bash
cd profile-service
vercel --prod
```

## Get Supabase Credentials

1. Go to https://supabase.com
2. Select your project (or create one)
3. Go to **Settings → API**
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## Test Locally First

```bash
cd profile-service
npm install
npm run build
npm start
```

Visit http://localhost:3000 to verify it works.

## Still Having Issues?

Check:
- ✅ All environment variables are set in Vercel
- ✅ Root directory is set to `profile-service`
- ✅ Supabase project is active
- ✅ No typos in environment variable names

## Files Changed
- ✅ `src/lib/supabase.ts` - Added fallback values
- ✅ `src/app/users/page.tsx` - Made dynamic
- ✅ `src/app/settings/page.tsx` - Made dynamic
- ✅ `.env.production` - Created with placeholders

## Need Help?
See `VERCEL_DEPLOYMENT_FIX.md` for detailed instructions.
