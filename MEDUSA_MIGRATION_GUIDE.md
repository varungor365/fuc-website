# 🚀 FASHUN.CO - MEDUSA MIGRATION GUIDE

## 📋 Overview
Migrate from Strapi CMS to Medusa - a modern, open-source e-commerce platform built for scalability and customization.

---

## 🎯 Why Medusa?

### Advantages Over Strapi
- ✅ **Built for E-commerce** - Native cart, checkout, payment flows
- ✅ **Multi-region Support** - Currency, tax, shipping per region
- ✅ **Advanced Inventory** - Stock management, variants, locations
- ✅ **Payment Ready** - Stripe, Razorpay, PayPal out-of-box
- ✅ **Headless Architecture** - REST & GraphQL APIs
- ✅ **Admin Dashboard** - Modern UI for product management
- ✅ **Plugin Ecosystem** - Email, analytics, search plugins

---

## 🏗️ Architecture Comparison

### Current (Strapi)
```
Frontend (Next.js) → Strapi CMS → SQLite/PostgreSQL
```

### New (Medusa)
```
Frontend (Next.js) → Medusa Backend → PostgreSQL
                  ↓
            Medusa Admin Dashboard
```

---

## ⚡ Quick Start

### 1. Install Medusa CLI
```bash
npm install -g @medusajs/medusa-cli
```

### 2. Create Medusa Backend
```bash
cd fuc-website-main
medusa new fashun-medusa-backend
cd fashun-medusa-backend
```

### 3. Configure Database
```bash
# Install PostgreSQL (required for Medusa)
# Update .env file
DATABASE_URL=postgresql://user:password@localhost:5432/fashun_medusa
```

### 4. Start Medusa
```bash
npm run seed  # Seed with demo data
npm run start # Start backend (port 9000)
```

### 5. Start Admin Dashboard
```bash
npm run dev:admin # Admin UI (port 7001)
```

---

## 📦 Installation Steps

### Step 1: Setup PostgreSQL
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/

# Create database
psql -U postgres
CREATE DATABASE fashun_medusa;
\q
```

### Step 2: Initialize Medusa Project
```bash
cd d:\fuc-website-main
medusa new fashun-medusa-backend --seed

# Choose:
# - PostgreSQL as database
# - Stripe for payments (can add Razorpay later)
```

### Step 3: Configure Environment
```env
# fashun-medusa-backend/.env

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/fashun_medusa

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Cookie Secret
COOKIE_SECRET=your-super-secret-cookie-key

# Admin CORS
ADMIN_CORS=http://localhost:7001,http://localhost:7000

# Store CORS
STORE_CORS=http://localhost:3000,http://localhost:8000

# Stripe (for payments)
STRIPE_API_KEY=sk_test_your_stripe_key

# Razorpay (add later)
RAZORPAY_ID=your_razorpay_id
RAZORPAY_SECRET=your_razorpay_secret
```

### Step 4: Run Migrations
```bash
cd fashun-medusa-backend
npm run build
medusa migrations run
npm run seed # Optional: seed demo products
```

### Step 5: Start Services
```bash
# Terminal 1: Backend
npm run start

# Terminal 2: Admin
npm run dev:admin
```

---

## 🔄 Data Migration from Strapi

### Export Strapi Data
```javascript
// scripts/export-strapi-data.js
const axios = require('axios');
const fs = require('fs');

async function exportStrapiData() {
  const products = await axios.get('http://localhost:1337/api/products?populate=*');
  const categories = await axios.get('http://localhost:1337/api/categories?populate=*');
  const orders = await axios.get('http://localhost:1337/api/orders?populate=*');
  
  fs.writeFileSync('strapi-export.json', JSON.stringify({
    products: products.data.data,
    categories: categories.data.data,
    orders: orders.data.data
  }, null, 2));
  
  console.log('✅ Strapi data exported');
}

exportStrapiData();
```

### Import to Medusa
```javascript
// scripts/import-to-medusa.js
const axios = require('axios');
const fs = require('fs');

const MEDUSA_URL = 'http://localhost:9000';
const ADMIN_API_KEY = 'your_admin_api_key';

async function importToMedusa() {
  const data = JSON.parse(fs.readFileSync('strapi-export.json'));
  
  // Import Categories
  for (const cat of data.categories) {
    await axios.post(`${MEDUSA_URL}/admin/product-categories`, {
      name: cat.attributes.name,
      handle: cat.attributes.slug,
      description: cat.attributes.description
    }, {
      headers: { 'x-medusa-access-token': ADMIN_API_KEY }
    });
  }
  
  // Import Products
  for (const prod of data.products) {
    await axios.post(`${MEDUSA_URL}/admin/products`, {
      title: prod.attributes.name,
      handle: prod.attributes.slug,
      description: prod.attributes.description,
      status: 'published',
      variants: [{
        title: 'Default',
        prices: [{
          amount: prod.attributes.price * 100, // Convert to cents
          currency_code: 'inr'
        }],
        inventory_quantity: prod.attributes.stock || 100
      }]
    }, {
      headers: { 'x-medusa-access-token': ADMIN_API_KEY }
    });
  }
  
  console.log('✅ Data imported to Medusa');
}

importToMedusa();
```

---

## 🔌 Frontend Integration

### Install Medusa JS Client
```bash
cd fashun-store
npm install @medusajs/medusa-js
```

### Create Medusa Client
```typescript
// fashun-store/src/lib/medusa-client.ts
import Medusa from "@medusajs/medusa-js"

export const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
  maxRetries: 3,
})
```

### Product Service
```typescript
// fashun-store/src/services/medusa-product.service.ts
import { medusaClient } from '@/lib/medusa-client';

export const MedusaProductService = {
  async getProducts(params = {}) {
    const { products } = await medusaClient.products.list(params);
    return products;
  },

  async getProduct(id: string) {
    const { product } = await medusaClient.products.retrieve(id);
    return product;
  },

  async searchProducts(query: string) {
    const { products } = await medusaClient.products.search({ q: query });
    return products;
  }
};
```

### Cart Service
```typescript
// fashun-store/src/services/medusa-cart.service.ts
import { medusaClient } from '@/lib/medusa-client';

export const MedusaCartService = {
  async createCart() {
    const { cart } = await medusaClient.carts.create();
    return cart;
  },

  async addItem(cartId: string, variantId: string, quantity: number) {
    const { cart } = await medusaClient.carts.lineItems.create(cartId, {
      variant_id: variantId,
      quantity
    });
    return cart;
  },

  async updateItem(cartId: string, lineId: string, quantity: number) {
    const { cart } = await medusaClient.carts.lineItems.update(cartId, lineId, {
      quantity
    });
    return cart;
  },

  async removeItem(cartId: string, lineId: string) {
    const { cart } = await medusaClient.carts.lineItems.delete(cartId, lineId);
    return cart;
  },

  async getCart(cartId: string) {
    const { cart } = await medusaClient.carts.retrieve(cartId);
    return cart;
  }
};
```

### Checkout Service
```typescript
// fashun-store/src/services/medusa-checkout.service.ts
import { medusaClient } from '@/lib/medusa-client';

export const MedusaCheckoutService = {
  async addShippingAddress(cartId: string, address: any) {
    const { cart } = await medusaClient.carts.update(cartId, {
      shipping_address: address
    });
    return cart;
  },

  async addShippingMethod(cartId: string, optionId: string) {
    const { cart } = await medusaClient.carts.addShippingMethod(cartId, {
      option_id: optionId
    });
    return cart;
  },

  async completeCart(cartId: string) {
    const { type, data } = await medusaClient.carts.complete(cartId);
    return { type, order: data };
  },

  async createPaymentSession(cartId: string) {
    const { cart } = await medusaClient.carts.createPaymentSessions(cartId);
    return cart;
  }
};
```

---

## 💳 Payment Integration

### Razorpay Plugin
```bash
cd fashun-medusa-backend
npm install medusa-payment-razorpay
```

### Configure Razorpay
```javascript
// fashun-medusa-backend/medusa-config.js
module.exports = {
  plugins: [
    {
      resolve: `medusa-payment-razorpay`,
      options: {
        key_id: process.env.RAZORPAY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
        razorpay_account: process.env.RAZORPAY_ACCOUNT,
        automatic_expiry_period: 30,
        manual_expiry_period: 20,
        refund_speed: "normal",
        webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET,
      },
    },
  ],
};
```

---

## 🎨 Admin Dashboard Customization

### Custom Widget
```tsx
// fashun-medusa-backend/src/admin/widgets/sales-overview.tsx
import { WidgetConfig } from "@medusajs/admin"

const SalesOverview = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
      {/* Your custom dashboard widget */}
    </div>
  )
}

export const config: WidgetConfig = {
  zone: "product.details.before",
}

export default SalesOverview
```

---

## 🚀 Deployment

### Update PowerShell Script
```powershell
# start-platform.ps1
Write-Host "🚀 Starting FASHUN.CO Platform with Medusa..." -ForegroundColor Cyan

# Start PostgreSQL (if not running)
Start-Service postgresql-x64-14

# Start Medusa Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd fashun-medusa-backend; npm run start"

# Start Medusa Admin
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd fashun-medusa-backend; npm run dev:admin"

# Start AI Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai-mockup-service; npm start"

# Start Next.js Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd fashun-store; npm run dev"

Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Medusa API: http://localhost:9000" -ForegroundColor Yellow
Write-Host "Admin: http://localhost:7001" -ForegroundColor Yellow
```

---

## 📊 Feature Mapping

| Strapi Feature | Medusa Equivalent |
|----------------|-------------------|
| Products | Products API |
| Categories | Product Categories |
| Orders | Orders API |
| Customers | Customers API |
| Media Library | File Service |
| Roles & Permissions | User Roles |
| Webhooks | Event Bus |
| API Tokens | API Keys |

---

## 🔧 Advanced Features

### Multi-Currency Support
```javascript
// medusa-config.js
module.exports = {
  projectConfig: {
    currencies: ["inr", "usd", "eur"],
  },
};
```

### Tax Configuration
```javascript
// Add tax rates per region
await medusa.admin.taxRates.create({
  code: "GST",
  name: "GST 18%",
  rate: 18,
  region_id: "reg_india"
});
```

### Discount Codes
```javascript
// Create festive discount
await medusa.admin.discounts.create({
  code: "DIWALI40",
  rule: {
    type: "percentage",
    value: 40,
    allocation: "total"
  },
  regions: ["reg_india"],
  starts_at: "2025-10-01",
  ends_at: "2025-11-15"
});
```

---

## 📝 Migration Checklist

- [ ] Install PostgreSQL
- [ ] Create Medusa project
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Export Strapi data
- [ ] Import data to Medusa
- [ ] Update frontend API calls
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Configure payment providers
- [ ] Setup admin dashboard
- [ ] Configure shipping options
- [ ] Setup tax rates
- [ ] Test order processing
- [ ] Update deployment scripts
- [ ] Deploy to production

---

## 🆘 Troubleshooting

### PostgreSQL Connection Error
```bash
# Check if PostgreSQL is running
Get-Service postgresql*

# Start PostgreSQL
Start-Service postgresql-x64-14
```

### Port Already in Use
```bash
# Kill process on port 9000
netstat -ano | findstr :9000
taskkill /PID <PID> /F
```

### Migration Fails
```bash
# Reset database
medusa migrations revert
medusa migrations run
```

---

## 📚 Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [Medusa GitHub](https://github.com/medusajs/medusa)
- [Medusa Discord](https://discord.gg/medusajs)
- [Next.js Starter](https://github.com/medusajs/nextjs-starter-medusa)

---

## 🎯 Next Steps

1. **Week 1**: Setup Medusa backend + PostgreSQL
2. **Week 2**: Migrate products & categories
3. **Week 3**: Update frontend integration
4. **Week 4**: Test & deploy

---

**🚀 Ready to migrate to Medusa for enterprise-grade e-commerce!**
