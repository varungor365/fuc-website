# 🔧 Build Fix Guide

## Quick Fix for Build Issues

---

## Common Build Errors & Solutions

### Error 1: Missing Dependencies

**Symptom**:
```
Module not found: Can't resolve '@supabase/auth-helpers-nextjs'
```

**Solution**:
```bash
cd fashun-store
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
npm install @medusajs/medusa-js
npm install p5 three
npm install --save-dev @types/three
```

### Error 2: TypeScript Errors

**Symptom**:
```
Type error: Cannot find module '@/lib/...'
```

**Solution**:
```bash
# Ensure tsconfig.json exists with correct paths
# Already created in fashun-store/tsconfig.json
```

### Error 3: Environment Variables

**Symptom**:
```
Error: NEXT_PUBLIC_SUPABASE_URL is not defined
```

**Solution**:
```bash
# Create .env.local file
cp .env.example .env.local

# Add minimum required variables:
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
```

---

## Step-by-Step Build Process

### 1. Clean Install

```bash
cd d:\fuc-website-main\fashun-store

# Remove old dependencies
rd /s /q node_modules
del package-lock.json

# Fresh install
npm install
```

### 2. Install Missing Packages

```bash
npm install @supabase/auth-helpers-nextjs@latest
npm install @medusajs/medusa-js@latest
npm install p5@latest
npm install three@latest
npm install --save-dev @types/three
```

### 3. Create Environment File

```bash
# Copy example
copy .env.example .env.local

# Edit .env.local with placeholders if no real keys
```

### 4. Try Build

```bash
npm run build
```

---

## If Build Still Fails

### Option 1: Build Without Strict Type Checking

```bash
# Temporarily disable strict mode
# Edit tsconfig.json: "strict": false
npm run build
```

### Option 2: Skip Type Checking

```bash
# Add to next.config.js:
typescript: {
  ignoreBuildErrors: true,
}

npm run build
```

### Option 3: Build Individual Components

```bash
# Test specific pages
npm run dev
# Then visit each page manually to check for errors
```

---

## Development Mode (Always Works)

```bash
# Development mode is more forgiving
npm run dev

# Visit:
# http://localhost:3000 - Main site
# http://localhost:3000/admin/dashboard - Admin
# http://localhost:3000/products - Products
# http://localhost:3000/studio - Creator Studio
```

---

## Production Build Checklist

- [ ] All dependencies installed
- [ ] .env.local file exists
- [ ] TypeScript config correct
- [ ] No import errors
- [ ] All pages compile
- [ ] Build completes

---

## Quick Test Commands

```bash
# Test dev server
npm run dev

# Test build
npm run build

# Test production
npm run start

# Test health
npm run test:health
```

---

## Expected Build Output

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size
┌ ○ /                                    5 kB
├ ○ /admin/dashboard                     8 kB
├ ○ /admin/orders                        12 kB
└ ○ /products                            6 kB

✓ Build completed in 45s
```

---

## Still Having Issues?

### Check These Files Exist:
- `fashun-store/package.json` ✅
- `fashun-store/tsconfig.json` ✅
- `fashun-store/next.config.js` ✅
- `fashun-store/.env.local` ⚠️ (create if missing)
- `fashun-store/src/app/layout.tsx` ✅

### Verify Node Version:
```bash
node --version
# Should be v18 or higher
```

### Clear Next.js Cache:
```bash
rd /s /q .next
npm run build
```

---

**Status**: Development mode works perfectly. Production build requires environment variables and all dependencies installed.
