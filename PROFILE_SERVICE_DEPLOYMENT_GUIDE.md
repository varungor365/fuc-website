# 🚀 Profile Service Deployment Guide

## Overview

This guide explains how to deploy the Fashun Profile Service (p.fashun.co.in) to Vercel. The profile service is a separate Next.js application that handles user profile pages and link-in-bio functionality.

## Current Status

✅ **Build Successful**: The profile service builds without errors
✅ **Local Testing**: Service runs correctly on localhost:3001
✅ **API Routes**: Track click functionality working
✅ **Components**: All profile components implemented
✅ **Database Integration**: Supabase integration configured

## Prerequisites

1. Vercel account
2. Supabase project with configured database
3. Domain configured (p.fashun.co.in)
4. Environment variables set up

## Deployment Steps

### 1. Prepare the Project

```bash
# Navigate to the profile service directory
cd profile-service

# Install dependencies
npm install

# Test the build locally
npm run build
```

### 2. Configure Environment Variables

Create a `.env.local` file in the `profile-service` directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://p.fashun.co.in
NEXT_PUBLIC_STORE_URL=https://www.fashun.co.in
```

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy the profile service
vercel --prod
```

#### Option B: Deploy via GitHub Integration

1. Push the profile-service code to a GitHub repository
2. Connect the repository to Vercel
3. Set the root directory to `profile-service`
4. Configure environment variables in Vercel dashboard
5. Deploy

### 4. Configure Custom Domain

In the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Domains"
3. Add `p.fashun.co.in`
4. Configure DNS records as instructed by Vercel

### 5. Environment Variables in Vercel

Set the following environment variables in your Vercel project settings:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Profile service URL | ✅ |
| `NEXT_PUBLIC_STORE_URL` | Main store URL | ✅ |

## Supabase Database Setup

Ensure your Supabase database has the required tables:

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  profile_image_url TEXT,
  theme_settings JSONB DEFAULT '{"theme": "default", "colors": {}}',
  points INTEGER DEFAULT 0,
  qr_code_url TEXT,
  preferred_notification_channel TEXT DEFAULT 'email',
  phone_number TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Links Table
```sql
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  is_featured BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Analytics Table
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  link_id UUID REFERENCES links(id) ON DELETE SET NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);
```

## Testing the Deployment

After deployment, test the following URLs:

1. **Homepage**: https://p.fashun.co.in
2. **Sample Profile**: https://p.fashun.co.in/demo-user
3. **API Endpoint**: https://p.fashun.co.in/api/track-click

## Troubleshooting

### Common Issues

1. **404 Errors**
   - Check if the custom domain is properly configured
   - Verify Vercel deployment completed successfully
   - Ensure DNS records are correctly set

2. **Database Connection Issues**
   - Verify Supabase credentials are correct
   - Check if the Supabase project is accessible
   - Ensure database tables are created

3. **Environment Variables Not Loading**
   - Confirm variables are set in Vercel dashboard
   - Check for typos in variable names
   - Redeploy after updating environment variables

### Monitoring

1. **Vercel Analytics**: Monitor traffic and performance
2. **Supabase Logs**: Check database query performance
3. **Error Tracking**: Set up error monitoring with Sentry or similar

## Maintenance

### Updates

To update the profile service:

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Deploy to production
vercel --prod
```

### Scaling

The profile service is designed to handle high traffic:
- Serverless functions scale automatically
- Database queries are optimized
- Caching strategies can be implemented as needed

## Security Considerations

1. **Rate Limiting**: Implement API rate limiting
2. **Input Validation**: Validate all user inputs
3. **Authentication**: Secure admin endpoints
4. **Data Privacy**: Follow GDPR/privacy regulations

## Support

For deployment issues, contact:
- **Technical Lead**: [Your Name]
- **Support Email**: [support@fashun.co.in]

---

*Last Updated: October 10, 2025*