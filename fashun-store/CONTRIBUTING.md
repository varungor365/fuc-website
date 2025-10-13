# Contributing to FASHUN.CO Platform

Welcome to the FASHUN.CO development environment! This guide will help you set up your local development environment and avoid common build failures.

## Prerequisites

### Node.js Version
This project requires **Node.js 20.x**. We recommend using the exact version specified in `.nvmrc`.

```bash
# If you have nvm installed
nvm use

# Or install the correct version (Node 20)
nvm install 20
nvm use 20
```

### Required Software
- **Node.js 18+** - JavaScript runtime
- **npm 8+** - Package manager (comes with Node.js)
- **Git** - Version control
- **Docker** (optional) - For services like Redis, PostgreSQL

## Quick Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd fashun-store
npm install
```

### 2. Environment Configuration
Copy the example environment file and configure it:

```bash
# Copy the example file
cp .env.example .env.local

# Edit the file with your configuration
# The platform is lenient in development - most variables are optional
# At minimum, these are automatically provided as defaults:
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-min-32-chars-long!
DATABASE_URL=file:./dev.db
```

### 3. Create Public Assets
The platform needs basic public assets. Create these files or use the provided templates:

```bash
# Create public directory structure (if not exists)
mkdir -p public/images/products/hoodies

# Copy or create basic assets
# - public/favicon.ico (browser icon)
# - public/apple-touch-icon.png (iOS icon)
# - public/manifest.json (PWA manifest - already provided)
```

For development, you can use placeholder images or the configured remote CDN domains.

### 4. Start Development
```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
```

## Environment Variables

### Required for Development
```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars-long

# Database (use SQLite for simple setup)
DATABASE_URL=file:./dev.db

# Stripe (use test keys)
STRIPE_SECRET_KEY=sk_test_your_test_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Security
JWT_SECRET=your-jwt-secret-min-32-chars
ENCRYPTION_KEY=your-encryption-key-32-chars
```

### Optional Services
```bash
# ConfigCat Feature Flags
NEXT_PUBLIC_CONFIGCAT_SDK_KEY=your-configcat-sdk-key

# Honeybadger Error Tracking
NEXT_PUBLIC_HONEYBADGER_API_KEY=your-honeybadger-api-key

# Cloud Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name

# Additional Image Hosts
NEXT_PUBLIC_IMAGE_HOSTS=cdn.example.com,images.example.com
```

## Common Issues and Fixes

### 1. ESLint Configuration Error
**Error**: `Failed to load config "@typescript-eslint/recommended"`

**Fix**: Update `.eslintrc.json`:
```json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"]
}
```

### 2. Environment Schema Validation Failed
**Error**: `Environment configuration validation failed`

**Fix**: The app is lenient in development mode. Ensure you have `.env.local` with basic variables:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. TypeScript JSX Fragment Errors
**Error**: `Expression expected` on JSX fragments

**Fix**: Files with JSX should use `.tsx` extension, and fragments should use `<React.Fragment>`:
```tsx
// Good
return <React.Fragment>{children}</React.Fragment>;

// Avoid in typed HOCs
return <>{children}</>;
```

### 4. Next.js Image Domain Error
**Error**: `Image hostname not configured`

**Fix**: Add your image domains to `next.config.js` or use the `NEXT_PUBLIC_IMAGE_HOSTS` environment variable:
```bash
NEXT_PUBLIC_IMAGE_HOSTS=your-cdn.com,another-domain.com
```

### 5. ConfigCat SDK Key Warning
**Warning**: Using hardcoded SDK key

**Fix**: Set your ConfigCat SDK key in environment:
```bash
NEXT_PUBLIC_CONFIGCAT_SDK_KEY=your-configcat-sdk-key
```

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run dev:debug        # Start with debugging enabled

# Building
npm run build            # Build for production
npm run build:analyze    # Build with bundle analyzer

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # Run TypeScript checks

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed database with sample data
```

## Project Structure

```
fashun-store/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── admin/          # Admin dashboard components
│   │   ├── ui/             # Reusable UI components
│   │   └── error/          # Error boundaries
│   ├── lib/                # Utility libraries
│   │   ├── configcat.ts    # Feature flags
│   │   ├── honeybadger.ts  # Error tracking
│   │   └── environment.ts  # Environment config
│   ├── hooks/              # Custom React hooks
│   └── data/               # Mock data and types
├── public/                 # Static assets
├── .env.example           # Environment template
└── .nvmrc                 # Node version specification
```

## Architecture Overview

### Services
- **Frontend**: Next.js 14 with App Router
- **Backend**: Strapi CMS with custom admin APIs
- **Database**: PostgreSQL (production) / SQLite (development)
- **Payments**: Stripe integration
- **Feature Flags**: ConfigCat
- **Error Tracking**: Honeybadger
- **Styling**: Tailwind CSS with glassmorphism theme

### Key Integrations
- **ConfigCat**: Feature flag management
- **Honeybadger**: Error tracking and monitoring
- **Stripe**: Payment processing
- **NextAuth**: Authentication
- **Prisma**: Database ORM

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all required environment variables are set in your deployment platform:
- Database connection strings
- API keys for third-party services
- Security secrets (JWT, encryption keys)
- Service configurations

## Getting Help

### Common Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [ConfigCat Docs](https://configcat.com/docs/)
- [Honeybadger Docs](https://docs.honeybadger.io/)

### Troubleshooting
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure Node.js version matches `.nvmrc`
4. Clear Next.js cache: `rm -rf .next`
5. Reinstall dependencies: `rm -rf node_modules && npm install`

### Development Tips
- Use TypeScript strict mode for better code quality
- Follow the established component patterns
- Test features with different feature flag states
- Monitor errors in development with Honeybadger
- Use the admin dashboard for content management

---

For questions or issues, please check existing GitHub issues or create a new one with detailed reproduction steps.