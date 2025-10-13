# 🚀 FASHUN.CO - Complete Tech Stack

## 📋 Overview
Enterprise-grade, open-source e-commerce platform with modern authentication, analytics, and automation.

---

## 🛒 E-commerce & Backend

### Medusa (Primary E-commerce Engine)
**Purpose**: Product, order, and customer management
```bash
npm install -g @medusajs/medusa-cli
medusa new fashun-medusa-backend
```

**Features**:
- Multi-region support
- Advanced inventory management
- Payment provider integration
- Order processing workflows
- Customer management
- Discount & promotion engine

**Configuration**:
```javascript
// medusa-config.js
module.exports = {
  projectConfig: {
    database_url: process.env.DATABASE_URL,
    redis_url: process.env.REDIS_URL,
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
  },
  plugins: [
    {
      resolve: `medusa-payment-razorpay`,
      options: {
        key_id: process.env.RAZORPAY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      },
    },
  ],
};
```

### Strapi (Headless CMS)
**Purpose**: Content management (blog, brand stories, lookbooks)
```bash
npx create-strapi-app fashun-cms --quickstart
```

**Use Cases**:
- Blog posts
- Brand stories
- Lookbooks
- Press releases
- FAQ content
- Landing pages

**Integration**:
```typescript
// lib/strapi-client.ts
import axios from 'axios';

export const strapiClient = axios.create({
  baseURL: process.env.STRAPI_URL || 'http://localhost:1337',
});

export const getBlogPosts = async () => {
  const { data } = await strapiClient.get('/api/blog-posts?populate=*');
  return data.data;
};
```

### Meilisearch (Search Engine)
**Purpose**: Lightning-fast product search
```bash
curl -L https://install.meilisearch.com | sh
./meilisearch --master-key="MASTER_KEY"
```

**Features**:
- Typo-tolerant search
- Instant results
- Faceted search
- Filters & sorting
- Synonyms support

**Integration**:
```typescript
// lib/meilisearch-client.ts
import { MeiliSearch } from 'meilisearch';

export const searchClient = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY,
});

export const searchProducts = async (query: string) => {
  const index = searchClient.index('products');
  return await index.search(query, {
    limit: 20,
    attributesToHighlight: ['title', 'description'],
  });
};
```

### PostgreSQL (Database)
**Purpose**: Primary data storage
```bash
# Install
choco install postgresql

# Create database
createdb fashun_medusa
```

**Schema**:
- Customers
- Products
- Orders
- Inventory
- Addresses
- Payment sessions

### Redis (Cache & Jobs)
**Purpose**: Caching and background job processing
```bash
# Install
choco install redis

# Start
redis-server
```

**Use Cases**:
- Session storage
- Cart caching
- Job queues
- Rate limiting
- Real-time features

---

## 📊 Marketing & Analytics

### Umami Analytics
**Purpose**: Privacy-focused website analytics
```bash
docker run -d \
  --name umami \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@localhost:5432/umami \
  ghcr.io/umami-software/umami:postgresql-latest
```

**Integration**:
```typescript
// components/Analytics.tsx
export function UmamiAnalytics() {
  return (
    <script
      async
      defer
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
      src={process.env.NEXT_PUBLIC_UMAMI_URL}
    />
  );
}
```

### n8n.io (Workflow Automation)
**Purpose**: Marketing automation and service integration
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**Workflows**:
- Abandoned cart emails
- Order confirmation
- Customer welcome series
- Inventory alerts
- Social media posting
- Analytics reporting

**Example Workflow**:
```json
{
  "name": "Abandoned Cart Recovery",
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "name": "Cart Abandoned"
    },
    {
      "type": "n8n-nodes-base.wait",
      "parameters": { "amount": 1, "unit": "hours" }
    },
    {
      "type": "n8n-nodes-base.sendEmail",
      "parameters": {
        "subject": "You left something behind!",
        "template": "abandoned-cart"
      }
    }
  ]
}
```

### Listmonk (Email Marketing)
**Purpose**: Newsletter and email campaigns
```bash
docker run -d \
  --name listmonk \
  -p 9000:9000 \
  listmonk/listmonk:latest
```

**Features**:
- Newsletter management
- Subscriber segmentation
- Campaign analytics
- Template editor
- A/B testing

---

## 🔧 Operations & Development

### Docker (Containerization)
**Purpose**: Consistent development and production environments

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: fashun_medusa
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  meilisearch:
    image: getmeili/meilisearch:latest
    environment:
      MEILI_MASTER_KEY: ${MEILISEARCH_KEY}
    ports:
      - "7700:7700"
    volumes:
      - meilisearch_data:/meili_data

  medusa:
    build: ./fashun-medusa-backend
    depends_on:
      - postgres
      - redis
    ports:
      - "9000:9000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/fashun_medusa
      REDIS_URL: redis://redis:6379

  frontend:
    build: ./fashun-store
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_MEDUSA_URL: http://medusa:9000

volumes:
  postgres_data:
  meilisearch_data:
```

### PM2 (Process Manager)
**Purpose**: Keep Node.js applications running
```bash
npm install -g pm2

# Start Medusa
pm2 start npm --name "medusa" -- run start

# Start with auto-restart
pm2 startup
pm2 save
```

**ecosystem.config.js**:
```javascript
module.exports = {
  apps: [
    {
      name: 'medusa-backend',
      script: 'npm',
      args: 'run start',
      cwd: './fashun-medusa-backend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'run start',
      cwd: './fashun-store',
      instances: 2,
      exec_mode: 'cluster',
    },
  ],
};
```

### Nginx (Reverse Proxy)
**Purpose**: Route traffic and handle SSL

**/etc/nginx/sites-available/fashun.co**:
```nginx
upstream medusa_backend {
    server localhost:9000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name fashun.co www.fashun.co;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fashun.co www.fashun.co;

    ssl_certificate /etc/letsencrypt/live/fashun.co/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fashun.co/privkey.pem;

    location /api/ {
        proxy_pass http://medusa_backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Certbot (SSL Certificates)
**Purpose**: Free SSL/TLS certificates
```bash
# Install
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d fashun.co -d www.fashun.co

# Auto-renewal
sudo certbot renew --dry-run
```

### Uptime Kuma (Monitoring)
**Purpose**: Site uptime monitoring and status page
```bash
docker run -d \
  --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1
```

**Monitors**:
- Frontend availability
- Backend API health
- Database connectivity
- Payment gateway status
- Search engine status

### Sentry (Error Monitoring)
**Purpose**: Real-time error tracking
```bash
npm install @sentry/nextjs
```

**Configuration**:
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

---

## 🔐 Authentication Stack

### Passwordless Options
- Magic Links (Email-based)
- WebAuthn/Passkeys (Biometric)
- Social Login (Google, Apple)

### Security Tools
- Have I Been Pwned (Password breach check)
- Bot protection (Cloudflare Turnstile)
- Rate limiting (Redis-based)

---

## 📦 Complete Installation Script

```bash
#!/bin/bash

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server

# Install Meilisearch
curl -L https://install.meilisearch.com | sh

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# Install PM2
npm install -g pm2

# Install Nginx
sudo apt install nginx

# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Clone repository
git clone https://github.com/varungor365/fuc-website.git
cd fuc-website

# Setup Medusa
cd fashun-medusa-backend
npm install
npm run build
medusa migrations run
npm run seed

# Setup Frontend
cd ../fashun-store
npm install
npm run build

# Start services
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Setup SSL
sudo certbot --nginx -d fashun.co -d www.fashun.co

echo "✅ Installation complete!"
```

---

## 🌐 Production Architecture

```
Internet
    ↓
Cloudflare (CDN + DDoS Protection)
    ↓
Nginx (Reverse Proxy + SSL)
    ↓
    ├─→ Next.js Frontend (Port 3000)
    │   └─→ Vercel Edge Network
    │
    └─→ Medusa Backend (Port 9000)
        ├─→ PostgreSQL (Port 5432)
        ├─→ Redis (Port 6379)
        └─→ Meilisearch (Port 7700)

Monitoring:
    ├─→ Sentry (Errors)
    ├─→ Umami (Analytics)
    └─→ Uptime Kuma (Status)

Automation:
    └─→ n8n (Workflows)
```

---

## 📊 Performance Targets

- **Page Load**: < 2s
- **API Response**: < 200ms
- **Search Results**: < 50ms
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%

---

## 🔄 Deployment Workflow

```bash
# 1. Build
npm run build

# 2. Test
npm run test

# 3. Deploy Backend
cd fashun-medusa-backend
pm2 restart medusa-backend

# 4. Deploy Frontend
cd fashun-store
vercel --prod

# 5. Verify
curl https://fashun.co/api/health
```

---

## 📞 Support & Resources

- **Medusa**: https://docs.medusajs.com
- **Strapi**: https://docs.strapi.io
- **Meilisearch**: https://docs.meilisearch.com
- **n8n**: https://docs.n8n.io
- **Listmonk**: https://listmonk.app/docs

---

**Last Updated**: 2025
**Version**: 2.0.0
**Status**: Production Ready ✅
