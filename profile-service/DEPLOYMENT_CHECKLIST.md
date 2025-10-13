# 🚀 Profile Service - Deployment Checklist

## Pre-Deployment

### 1. Supabase Setup
- [ ] Create Supabase project at https://supabase.com
- [ ] Run database schema from `fashun-store/SUPABASE_SETUP.sql`
- [ ] Copy Project URL from Settings → API
- [ ] Copy anon/public key from Settings → API
- [ ] Copy service_role key from Settings → API
- [ ] Configure authentication providers (if needed)
- [ ] Set up redirect URLs in Supabase dashboard

### 2. Local Testing
- [ ] Run `npm install` in profile-service directory
- [ ] Create `.env.local` with your Supabase credentials
- [ ] Run `npm run build` to test build
- [ ] Run `npm start` to test production build
- [ ] Test `/settings` page at http://localhost:3000/settings
- [ ] Test `/users` page at http://localhost:3000/users
- [ ] Verify no console errors
- [ ] Test authentication flow

### 3. Vercel Account Setup
- [ ] Create/login to Vercel account at https://vercel.com
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel CLI: `vercel login`
- [ ] Link project: `vercel link` (in profile-service directory)

## Deployment Steps

### Step 1: Configure Vercel Project Settings

Go to Vercel Dashboard → Your Project → Settings

#### General Settings
- [ ] Set **Root Directory** to `profile-service`
- [ ] Set **Framework Preset** to Next.js
- [ ] Set **Node.js Version** to 18.x or higher

#### Build & Development Settings
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

#### Environment Variables
Add these in Settings → Environment Variables:

**Production Environment:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key-here`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key-here`
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://p.fashun.co.in`
- [ ] `NEXT_PUBLIC_STORE_URL` = `https://www.fashun.co.in`

**Preview Environment (Optional):**
- [ ] Same variables as production (or use different Supabase project)

**Development Environment (Optional):**
- [ ] Same variables as production (or use different Supabase project)

### Step 2: Deploy

Choose one method:

#### Method A: Using Vercel Dashboard
- [ ] Go to Deployments tab
- [ ] Click "Redeploy" or "Deploy"
- [ ] Wait for build to complete

#### Method B: Using Vercel CLI
```bash
cd profile-service
vercel --prod
```

#### Method C: Using Deployment Script
```bash
cd profile-service
.\deploy-vercel.ps1
```

### Step 3: Monitor Deployment
- [ ] Watch build logs in Vercel dashboard
- [ ] Check for any errors or warnings
- [ ] Wait for "Deployment Ready" status
- [ ] Note the deployment URL

## Post-Deployment Verification

### 1. Basic Functionality
- [ ] Visit deployment URL
- [ ] Check homepage loads
- [ ] Verify no 404 errors
- [ ] Check browser console for errors

### 2. Page Testing
- [ ] Visit `/settings` page
- [ ] Visit `/users` page
- [ ] Verify pages load without errors
- [ ] Check data loads from Supabase

### 3. Authentication Testing
- [ ] Test login flow
- [ ] Test signup flow
- [ ] Test logout
- [ ] Verify session persistence
- [ ] Test protected routes

### 4. Database Testing
- [ ] Create a test profile
- [ ] Update profile settings
- [ ] Add/edit links
- [ ] Verify data persists
- [ ] Check profile views increment

### 5. Performance Testing
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Verify images load properly
- [ ] Test on mobile device
- [ ] Check responsive design

## Troubleshooting

### Build Fails
- [ ] Check environment variables are set correctly
- [ ] Verify root directory is `profile-service`
- [ ] Check build logs for specific errors
- [ ] Test build locally: `npm run build`
- [ ] Verify all dependencies are in package.json

### Runtime Errors
- [ ] Check browser console for errors
- [ ] Verify Supabase credentials are correct
- [ ] Check Supabase project is active
- [ ] Verify database tables exist
- [ ] Check API rate limits

### Authentication Issues
- [ ] Verify redirect URLs in Supabase
- [ ] Check JWT secrets are set
- [ ] Verify auth providers are enabled
- [ ] Test with different browsers
- [ ] Clear cookies and try again

### Database Connection Issues
- [ ] Verify Supabase URL is correct
- [ ] Check API keys are valid
- [ ] Verify database is accessible
- [ ] Check RLS policies in Supabase
- [ ] Test connection with Supabase client

## Monitoring & Maintenance

### Daily
- [ ] Check Vercel analytics
- [ ] Monitor error logs
- [ ] Check uptime status

### Weekly
- [ ] Review performance metrics
- [ ] Check for dependency updates
- [ ] Review user feedback
- [ ] Monitor database usage

### Monthly
- [ ] Update dependencies
- [ ] Review security alerts
- [ ] Optimize performance
- [ ] Backup database

## Rollback Plan

If deployment fails:
1. [ ] Go to Vercel Dashboard → Deployments
2. [ ] Find last working deployment
3. [ ] Click "..." menu → "Promote to Production"
4. [ ] Verify rollback successful
5. [ ] Fix issues locally
6. [ ] Test thoroughly
7. [ ] Redeploy

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Project Documentation**: See `VERCEL_DEPLOYMENT_FIX.md`
- **Quick Reference**: See `QUICK_FIX.md`

## Success Criteria

Deployment is successful when:
- ✅ Build completes without errors
- ✅ All pages load correctly
- ✅ Authentication works
- ✅ Database operations work
- ✅ No console errors
- ✅ Performance is acceptable
- ✅ Mobile responsive works

## Notes

- Keep Supabase credentials secure
- Never commit `.env.local` to git
- Use environment variables for all secrets
- Monitor Vercel usage limits
- Set up custom domain (optional)
- Configure SSL certificate (automatic with Vercel)

---

**Last Updated**: 2025
**Status**: Ready for Deployment
**Version**: 1.0.0
