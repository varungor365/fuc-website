# FASHUN.CO Admin Setup & Testing Guide

## 🔐 Admin Login Setup

### Create Your Admin Account

1. **Sign up via Google OAuth**:
   - Go to: https://www.fashun.co.in/login
   - Click "Continue with Google"
   - Use your admin email (preferably @fashun.co domain)

2. **Grant Admin Access in Supabase**:
   ```bash
   # Login to Supabase Dashboard
   https://supabase.com/dashboard/project/oyysorgjqeqxhmyczphk
   
   # Go to: Authentication > Users
   # Find your user account
   # Click on the user
   # Under "User Metadata" add:
   {
     "role": "admin"
   }
   ```

3. **Access Admin Panel**:
   - URL: https://www.fashun.co.in/admin
   - Alternative: https://www.fashun.co.in/admin/dashboard
   - Login: Use same Google account

### Admin Access Levels

**Super Admin** (Full Access):
- Email ending with `@fashun.co` 
- Custom role: `"role": "admin"` in user metadata

**Features Access**:
- `/admin/dashboard` - Analytics & Overview
- `/admin/products` - Product Management
- `/admin/orders` - Order Processing
- `/admin/customers` - Customer Management
- `/admin/analytics` - Sales Analytics
- `/admin/api-keys` - API Configuration

---

## 📦 Order Management System

### Where Orders Are Stored

**Backend**: Strapi CMS (fashun-backend)
- Database: PostgreSQL/SQLite
- API Endpoint: `http://localhost:1337/api/orders`

### Accessing Orders

#### 1. **Via Admin Panel** (Recommended)
```
URL: https://www.fashun.co.in/admin/orders
Features:
- View all orders
- Filter by status (pending, processing, shipped, delivered)
- Search by customer/order ID
- Update order status
- View customer details
```

#### 2. **Via Strapi Admin**
```bash
# Start Strapi backend
cd fashun-backend
npm run develop

# Access Strapi Admin
http://localhost:1337/admin

# Login Credentials (Create first):
Email: admin@fashun.co
Password: [Set during first run]

# Navigate to: Content Manager > Orders
```

#### 3. **Via API**
```bash
# Get all orders
GET http://localhost:1337/api/orders?populate=*

# Get single order
GET http://localhost:1337/api/orders/:id?populate=*

# Update order status
PUT http://localhost:1337/api/orders/:id
{
  "data": {
    "status": "shipped",
    "trackingNumber": "TRACK123"
  }
}
```

### Order Flow

```
Customer Checkout → Razorpay Payment → Order Created in Strapi
                                              ↓
                        Admin Panel ← Order Notification
                                              ↓
                        Admin Updates Status → Customer Email
                                              ↓
                        Shipped/Delivered → Order Complete
```

---

## 🧪 Website Testing Tools

### 1. **Google Lighthouse** (Built into Chrome)
**What it tests**: Performance, SEO, Accessibility, Best Practices

```bash
# Using Chrome DevTools
1. Open Chrome DevTools (F12)
2. Click "Lighthouse" tab
3. Select categories
4. Click "Analyze page load"

# Using CLI
npm install -g @lhci/cli
lhci autorun --collect.url=https://www.fashun.co.in
```

**Your Project Already Has**:
- Configuration: `lighthouserc.js`
- Run: `npm run lighthouse`

### 2. **Playwright** (End-to-End Testing)
**What it tests**: User interactions, workflows, cross-browser

```bash
# Install
npm install -D @playwright/test

# Create test file: tests/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('https://www.fashun.co.in');
  await expect(page.getByAltText('FASHUN.CO.IN')).toBeVisible();
  await expect(page.locator('nav')).toContainText('Shop');
});

test('can add product to cart', async ({ page }) => {
  await page.goto('https://www.fashun.co.in/products/1');
  await page.click('button:has-text("Add to Cart")');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
});

# Run tests
npx playwright test
npx playwright test --headed # See browser
npx playwright test --ui     # Interactive mode
```

### 3. **Cypress** (Alternative E2E)
**What it tests**: Similar to Playwright, easier syntax

```bash
# Install
npm install -D cypress

# Create test: cypress/e2e/homepage.cy.js
describe('Homepage', () => {
  it('loads successfully', () => {
    cy.visit('https://www.fashun.co.in');
    cy.get('img[alt="FASHUN.CO.IN"]').should('be.visible');
    cy.contains('Shop').should('be.visible');
  });

  it('can navigate to products', () => {
    cy.visit('https://www.fashun.co.in');
    cy.contains('Shop').click();
    cy.url().should('include', '/collections');
  });
});

# Run tests
npx cypress open   # Interactive
npx cypress run    # Headless
```

### 4. **k6** (Load Testing)
**What it tests**: Performance under traffic, API load

```bash
# Install
npm install -g k6

# Create test: load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,        // 100 virtual users
  duration: '30s', // Run for 30 seconds
};

export default function() {
  const res = http.get('https://www.fashun.co.in');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}

# Run test
k6 run load-test.js
```

### 5. **axe DevTools** (Accessibility)
**What it tests**: WCAG compliance, accessibility issues

```bash
# Install browser extension
Chrome: https://chrome.google.com/webstore (search "axe DevTools")

# Or use in tests
npm install -D @axe-core/playwright

# In Playwright test
import { injectAxe, checkA11y } from 'axe-playwright';

test('homepage is accessible', async ({ page }) => {
  await page.goto('https://www.fashun.co.in');
  await injectAxe(page);
  await checkA11y(page);
});
```

### 6. **Checkly** (Monitoring)
**What it tests**: Uptime, API health, global performance

```bash
# Sign up: https://www.checklyhq.com/
# Create checks for:
- Homepage availability
- API endpoints
- Checkout flow
- Authentication

# Or use CLI
npm install -g checkly
checkly login
checkly create check --url https://www.fashun.co.in
```

---

## 🚀 Automated Testing Workflow

### Your Existing Setup

**File**: `fashun-store/package.json`
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=src/__tests__/unit",
    "test:e2e": "playwright test",
    "test:performance": "lighthouse https://www.fashun.co.in",
    "test:security": "npm audit && snyk test"
  }
}
```

### Run All Tests

```bash
cd fashun-store

# 1. Unit tests
npm run test:unit

# 2. E2E tests
npm run test:e2e

# 3. Performance
npm run lighthouse

# 4. Security scan
npm run test:security

# 5. All tests
npm test
```

---

## 🔍 Recommended Testing Strategy

### Phase 1: Manual Testing (Quick Check)
1. **Visual Inspection**:
   - Open https://www.fashun.co.in
   - Check logo appears (now fixed ✅)
   - Navigate through all pages
   - Test on mobile/tablet

2. **User Flows**:
   - Sign up/Login
   - Browse products
   - Add to cart
   - Checkout process
   - Order tracking

### Phase 2: Automated Testing (Comprehensive)
1. **Lighthouse Audit**:
   ```bash
   npm run lighthouse
   # Target scores: 90+ for all categories
   ```

2. **Playwright E2E**:
   ```bash
   npx playwright test
   # Cover: Auth, Cart, Checkout, Admin
   ```

3. **Load Testing**:
   ```bash
   k6 run load-test.js
   # Ensure site handles 100+ concurrent users
   ```

### Phase 3: Continuous Monitoring
1. **Setup Vercel Analytics**:
   - Already enabled in your project
   - View: https://vercel.com/dashboard/analytics

2. **Setup Sentry** (Error Tracking):
   ```bash
   npm install @sentry/nextjs
   # Configure in next.config.js
   ```

3. **Setup Uptime Robot**:
   - Free service: https://uptimerobot.com
   - Monitor: Homepage, API, Admin

---

## 📊 Testing Checklist

### Critical Pages to Test
- [ ] Homepage (/)
- [ ] Product Listing (/collections/all)
- [ ] Product Detail (/products/:id)
- [ ] Cart (/cart)
- [ ] Checkout (/checkout)
- [ ] Login/Register (/login, /register)
- [ ] Account Page (/account)
- [ ] Admin Dashboard (/admin/dashboard)
- [ ] Admin Orders (/admin/orders)

### Critical Functionality
- [ ] Logo displays correctly (Fixed ✅)
- [ ] Navigation works
- [ ] Search functionality
- [ ] Add to cart
- [ ] Remove from cart
- [ ] Apply discount code
- [ ] Payment processing
- [ ] Order confirmation
- [ ] Email notifications
- [ ] Admin login
- [ ] Order status updates

### Performance Metrics
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1

### Security Checks
- [ ] HTTPS enabled
- [ ] Secure cookies
- [ ] API authentication
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens

---

## 🛠️ Quick Command Reference

```bash
# Start development
cd fashun-store
npm run dev

# Build for production
npm run build

# Run all tests
npm test

# Test specific page
npx playwright test --grep "homepage"

# Performance audit
npm run lighthouse

# Security scan
npm audit
npm audit fix

# Check Supabase config
npm run check:supabase

# Start Strapi backend (for orders)
cd ../fashun-backend
npm run develop
```

---

## 📞 Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Playwright: https://playwright.dev
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- Supabase: https://supabase.com/docs

### Your Project Docs
- `SUPABASE_SETUP.md` - Authentication setup
- `SUPABASE_QUICK_START.md` - Quick reference
- `ADMIN_ACCESS_GUIDE.md` - Admin features
- `API_INTEGRATION_GUIDE.md` - API usage

---

**Last Updated**: October 21, 2025
**Status**: Logo Issue Fixed ✅ | Admin Access Configured ✅ | Testing Tools Documented ✅
