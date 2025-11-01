# Server Configuration & Performance Optimization Guide

## 🚀 CRITICAL: HTTPS Redirect Configuration

### For Nginx (Recommended)
Create or update `/etc/nginx/sites-available/fashun.co`:

```nginx
# Redirect all HTTP traffic to HTTPS (301 Permanent)
server {
    listen 80;
    listen [::]:80;
    server_name fashun.co www.fashun.co fashun.co.in www.fashun.co.in;
    
    # 301 Permanent Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name fashun.co www.fashun.co;
    
    # SSL Certificate Configuration
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # HSTS (Force HTTPS for 2 years)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # Performance: Enable HTTP/2 Server Push
    http2_push_preload on;
    
    # Performance: Enable Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
    
    # Performance: Enable Brotli Compression (if available)
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
    
    # Performance: Browser Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Proxy to Next.js Application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Special handling for Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

### Test and Reload Nginx
```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

---

## ⚡ CRITICAL: TTFB Optimization (Target: <600ms)

### Current Issue
- **Current TTFB**: 1.5s - 4.1s
- **Target**: <600ms
- **Impact**: Slow server response blocks entire page load

### Solutions

#### 1. Redis Caching (HIGHEST IMPACT)
Install and configure Redis for session/data caching:

```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis
sudo systemctl enable redis
```

Update your Next.js app to use Redis caching:

```typescript
// lib/redis.ts
import { Redis } from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Cache wrapper function
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch fresh data
  const data = await fetcher();
  
  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));
  
  return data;
}
```

#### 2. Database Query Optimization (Supabase)

**Check Slow Queries**:
```sql
-- Find slow queries in Supabase
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;
```

**Add Indexes** (Example):
```sql
-- Index on frequently queried columns
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || description));
```

#### 3. Enable Supabase Connection Pooling

Add to your Supabase connection string:
```env
# Use pooler connection for better performance
DATABASE_URL=postgresql://[user]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres
```

#### 4. Optimize Next.js Data Fetching

Update your data fetching to use ISR (Incremental Static Regeneration):

```typescript
// Example: Product listing page
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductsPage() {
  // This will be cached and revalidated every 60 seconds
  const products = await fetch('https://api.fashun.co/products', {
    next: { revalidate: 60 }
  });
  
  return <ProductGrid products={products} />;
}
```

#### 5. Add Edge Caching with CDN

**Cloudflare (Recommended)**:
1. Sign up at cloudflare.com
2. Add your domain
3. Enable "Caching" → "Cache Level: Standard"
4. Enable "Speed" → "Auto Minify" (HTML, CSS, JS)
5. Enable "Speed" → "Brotli Compression"
6. Set Cache Rules:
   - Static assets (`*.css`, `*.js`, `*.jpg`, etc.): Cache for 1 year
   - HTML pages: Cache for 5 minutes with revalidation

#### 6. Optimize Medusa Backend

```bash
# In fashun-backend directory
cd fashun-backend

# Enable Redis for session storage
npm install @medusajs/cache-redis

# Update medusa-config.js
module.exports = {
  plugins: [
    {
      resolve: `@medusajs/cache-redis`,
      options: {
        redisUrl: process.env.REDIS_URL,
        ttl: 3600, // 1 hour
      },
    },
  ],
};
```

---

## 📊 Performance Monitoring Setup

### Install Performance Monitoring

```bash
# In fashun-store directory
npm install @vercel/speed-insights @vercel/analytics
```

### Add Real User Monitoring

```typescript
// Already added in layout.tsx:
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';

// ✅ Already implemented!
```

---

## 🔍 Broken Links Audit Tool

### Install Linkinator
```bash
npm install -g linkinator
```

### Run Full Site Crawl
```bash
# Crawl the live site
linkinator https://fashun.co --recurse --format=json > broken-links-report.json

# Or crawl locally
linkinator http://localhost:3000 --recurse --format=csv > local-broken-links.csv
```

### Fix Broken Links Script
```typescript
// scripts/fix-broken-links.ts
import fs from 'fs';
import path from 'path';

interface BrokenLink {
  url: string;
  status: number;
  parent: string;
}

async function fixBrokenLinks() {
  // Read the linkinator report
  const report = JSON.parse(fs.readFileSync('broken-links-report.json', 'utf-8'));
  
  const brokenLinks: BrokenLink[] = report.links
    .filter((link: any) => link.state === 'BROKEN')
    .map((link: any) => ({
      url: link.url,
      status: link.status,
      parent: link.parent
    }));
  
  console.log(`Found ${brokenLinks.length} broken links:`);
  brokenLinks.forEach(link => {
    console.log(`❌ ${link.url} (${link.status}) found on ${link.parent}`);
  });
  
  // Generate fix suggestions
  console.log('\nFix suggestions:');
  brokenLinks.forEach(link => {
    if (link.status === 404) {
      console.log(`- Update or remove link to ${link.url} on ${link.parent}`);
    } else if (link.status === 0) {
      console.log(`- Check external link: ${link.url}`);
    }
  });
}

fixBrokenLinks();
```

---

## 🎯 Performance Checklist

### Immediate Actions (Do Now)
- [x] ✅ Add viewport meta tag
- [x] ✅ Enable WebP/AVIF images in next.config.js
- [x] ✅ Enable Gzip/Brotli compression
- [ ] ⏳ Configure HTTPS redirect in Nginx
- [ ] ⏳ Install and configure Redis
- [ ] ⏳ Add database indexes
- [ ] ⏳ Run broken links audit

### Short-Term (Next 48 Hours)
- [ ] Set up Cloudflare CDN
- [ ] Optimize database queries
- [ ] Enable Supabase connection pooling
- [ ] Add Redis caching to API routes
- [ ] Compress all images

### Long-Term (Next Week)
- [ ] Set up monitoring (Datadog, New Relic, or Sentry)
- [ ] Implement service worker for offline support
- [ ] Add edge caching rules
- [ ] Optimize bundle size (<200KB)
- [ ] Achieve Lighthouse score 95+

---

## 📈 Expected Results

### Before Optimization
- ❌ TTFB: 1.5s - 4.1s
- ❌ LCP: 4.1s
- ❌ TBT: High
- ❌ CLS: 0.51
- ❌ Performance Score: F

### After Optimization (Target)
- ✅ TTFB: <600ms (75% improvement)
- ✅ LCP: <2.5s (40% improvement)
- ✅ TBT: <200ms (Smooth interactions)
- ✅ CLS: <0.1 (No layout shifts)
- ✅ Performance Score: A (95+)

---

## 🚨 Priority Order

1. **CRITICAL**: HTTPS redirect (Security & SEO)
2. **CRITICAL**: Redis caching (TTFB reduction)
3. **HIGH**: Database indexing (Query speed)
4. **HIGH**: CDN setup (Global performance)
5. **MEDIUM**: Broken links audit (SEO & UX)
6. **MEDIUM**: Image optimization (Already configured, needs content update)

---

## 📞 Need Help?

If you encounter issues during implementation:
1. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Check Redis status: `redis-cli ping` (should return "PONG")
3. Monitor server resources: `htop` or `top`
4. Check application logs: `pm2 logs` or `docker logs`

**This guide covers ALL server-side optimizations needed to achieve 95+ performance scores!**
