# 🚀 Profile Service Vercel Deployment Guide

## Overview

This guide explains how to properly deploy the Fashun Profile Service (p.fashun.co.in) to Vercel with the correct configuration.

## Current Issue

The error logs show that Vercel is trying to deploy the profile service but using the wrong build configuration:

```
Running "install" command: `cd fashun-store && npm install`...
sh: line 1: cd: fashun-store: No such file or directory
```

This happens because:
1. Vercel is configured to use the root [vercel.json](file:///d:/fuc-website-main/vercel.json) which is set up for the main store
2. The profile service needs its own Vercel project configuration
3. The root directory for p.fashun.co.in should be [./profile-service](file:///d:/fuc-website-main/profile-service), not [./fashun-store](file:///d:/fuc-website-main/fashun-store)

## Solution

### Option 1: Separate Vercel Projects (Recommended)

Create two separate Vercel projects:
1. One for www.fashun.co.in (main store)
2. One for p.fashun.co.in (profile service)

#### For www.fashun.co.in:
- **Project Name**: fashun-main-store
- **Root Directory**: [./fashun-store](file:///d:/fuc-website-main/fashun-store)
- **Build Command**: `npm run build`
- **Install Command**: `npm install`

#### For p.fashun.co.in:
- **Project Name**: fashun-profile-service
- **Root Directory**: [./profile-service](file:///d:/fuc-website-main/profile-service)
- **Build Command**: `npm run build`
- **Install Command**: `npm install`

### Option 2: Monorepo Configuration

If you prefer to keep both services in one Vercel project, use the following configuration:

1. **Root Directory**: `./` (project root)
2. **Build Command**: Use the smart build script we created
3. **Install Command**: Use the smart install script

## Step-by-Step Deployment

### 1. Create Vercel Project for Profile Service

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select the repository containing the code
4. Set the following configuration:
   - **Project Name**: `fashun-profile-service`
   - **Root Directory**: `profile-service`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next`

### 2. Configure Environment Variables

In the Vercel dashboard, go to your project settings and add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=https://p.fashun.co.in
NEXT_PUBLIC_STORE_URL=https://www.fashun.co.in
```

### 3. Configure Custom Domain

1. In your project settings, go to "Domains"
2. Add domain: `p.fashun.co.in`
3. Follow Vercel's instructions to configure DNS records

### 4. Deploy

1. Push your changes to the repository
2. Vercel will automatically deploy the profile service
3. Monitor the build logs for any issues

## Testing the Deployment

After deployment, test these URLs:

1. **Homepage**: https://p.fashun.co.in
2. **Sample Profile**: https://p.fashun.co.in/demo-user
3. **API Endpoint**: https://p.fashun.co.in/api/track-click

## Troubleshooting

### Common Issues

1. **404 Errors**
   - Verify the custom domain is properly configured
   - Check that DNS records are correctly set
   - Ensure the root directory is set to [./profile-service](file:///d:/fuc-website-main/profile-service)

2. **Build Failures**
   - Check that all dependencies are properly installed
   - Verify environment variables are set correctly
   - Ensure the build command is `npm run build`

3. **Environment Variables Not Loading**
   - Confirm variables are set in Vercel dashboard
   - Check for typos in variable names
   - Redeploy after updating environment variables

## Files Created for Deployment

1. **[profile-service/vercel.json](file:///d:/fuc-website-main/profile-service/vercel.json)** - Vercel configuration for profile service
2. **[profile-service/.vercelignore](file:///d:/fuc-website-main/profile-service/.vercelignore)** - Files to ignore during deployment
3. **[vercel.json](file:///d:/fuc-website-main/vercel.json)** - Updated root configuration with build script
4. **[vercel-build.bat](file:///d:/fuc-website-main/vercel-build.bat)** - Smart build script for both services
5. **[build-profile-service.bat](file:///d:/fuc-website-main/build-profile-service.bat)** - Dedicated profile service build script

## Verification

To verify the profile service builds correctly:

```bash
# Test main store build
cd fashun-store
npm run build

# Test profile service build
cd ../profile-service
npm run build
```

Both should complete successfully without errors.

## Support

For deployment issues, contact:
- **Technical Lead**: [Your Name]
- **Support Email**: [support@fashun.co.in]

---

*Last Updated: October 10, 2025*