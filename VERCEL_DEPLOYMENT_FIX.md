# Vercel Deployment Fix - Profile Service

## Issue
The build was failing with error: `Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL`

This occurred because:
1. Supabase client was initialized at build time with placeholder values
2. Pages `/settings` and `/users` were being statically generated during build
3. Environment variables weren't properly configured for build-time

## Solutions Applied

### 1. Updated Supabase Client (`profile-service/src/lib/supabase.ts`)
- Added fallback values for environment variables
- Added validation warnings for development
- Configured client to not persist sessions during build

### 2. Made Pages Dynamic
- Added `export const dynamic = 'force-dynamic'` to `/users/page.tsx`
- Added `export const dynamic = 'force-dynamic'` to `/settings/page.tsx`
- This prevents static generation during build time

### 3. Created Production Environment File
- Created `.env.production` with placeholder values
- These will be overridden by Vercel environment variables

## Vercel Configuration Steps

### Step 1: Set Environment Variables in Vercel
Go to your Vercel project settings and add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://p.fashun.co.in
NEXT_PUBLIC_STORE_URL=https://www.fashun.co.in
```

### Step 2: Configure Build Settings
In Vercel project settings:
- **Root Directory**: `profile-service`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 3: Deploy
```bash
cd profile-service
vercel --prod
```

## Alternative: Deploy from Root

If deploying from the root directory, update `vercel.json`:

```json
{
  "buildCommand": "cd profile-service && npm install && npm run build",
  "outputDirectory": "profile-service/.next",
  "installCommand": "cd profile-service && npm install",
  "framework": "nextjs"
}
```

## Testing Locally

Test the build locally before deploying:

```bash
cd profile-service
npm run build
npm start
```

## Supabase Setup

If you haven't set up Supabase yet:

1. Create a Supabase project at https://supabase.com
2. Run the schema from `fashun-store/SUPABASE_SETUP.sql`
3. Get your project URL and keys from Settings > API
4. Update environment variables in Vercel

## Verification

After deployment:
1. Check build logs for any warnings
2. Visit `/settings` and `/users` pages
3. Verify Supabase connection works
4. Check browser console for any errors

## Troubleshooting

### Build still fails
- Verify all environment variables are set in Vercel
- Check that root directory is set to `profile-service`
- Ensure `.env.production` exists with placeholder values

### Pages show errors at runtime
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify database tables exist

### Authentication issues
- Ensure Supabase auth is configured
- Check redirect URLs in Supabase settings
- Verify JWT secrets are set

## Files Modified

1. `profile-service/src/lib/supabase.ts` - Added fallbacks and validation
2. `profile-service/src/app/users/page.tsx` - Made dynamic
3. `profile-service/src/app/settings/page.tsx` - Made dynamic
4. `profile-service/.env.production` - Created with placeholders

## Next Steps

1. Set up Supabase project if not done
2. Configure environment variables in Vercel
3. Deploy to Vercel
4. Test all functionality
5. Monitor for any runtime errors
