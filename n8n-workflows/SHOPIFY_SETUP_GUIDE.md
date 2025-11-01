# SHOPIFY HEADLESS + N8N SETUP GUIDE

Complete guide for integrating Shopify with fashun.co.in and automating everything with n8n.

## 🏗️ Architecture Overview

```
Shopify Store (Backend)
    ↓
Shopify Storefront API (GraphQL)
    ↓
Next.js Frontend (fashun.co.in)
    ↓
n8n Automation Workflows
    ↓
Supabase Database + Analytics
```

---

## 📋 Step 1: Shopify Setup

### Create Shopify Store
1. Go to [shopify.com](https://www.shopify.com)
2. Sign up for a store (use `fashun-india.myshopify.com`)
3. Complete basic store setup

### Create Custom App
1. Shopify Admin → **Settings** → **Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app**
4. Name: `FASHUN Headless`
5. Configure scopes:

**Admin API Access Scopes:**
```
✅ read_products, write_products
✅ read_orders, write_orders
✅ read_customers, write_customers
✅ read_inventory, write_inventory
✅ read_draft_orders, write_draft_orders
✅ read_price_rules, write_price_rules
✅ read_discounts, write_discounts
✅ read_fulfillments, write_fulfillments
✅ read_shipping, write_shipping
✅ read_analytics
```

**Storefront API Access:**
```
✅ Read products, variants, and collections
✅ Read and modify checkouts
✅ Read and modify customer details
✅ Read customer tags
```

6. **Install app** → Copy **Admin API access token**
7. **Storefront API** tab → Copy **Storefront access token**

### Configure Webhooks
Shopify Admin → **Settings** → **Notifications** → **Webhooks**

Create webhooks for:
```
Event                           → Webhook URL
----------------------------------------
orders/create                   → https://fashun.co.in/api/shopify/webhooks
orders/updated                  → https://fashun.co.in/api/shopify/webhooks
orders/fulfilled                → https://fashun.co.in/api/shopify/webhooks
orders/cancelled                → https://fashun.co.in/api/shopify/webhooks
products/create                 → https://fashun.co.in/api/shopify/webhooks
products/update                 → https://fashun.co.in/api/shopify/webhooks
products/delete                 → https://fashun.co.in/api/shopify/webhooks
inventory_levels/update         → https://fashun.co.in/api/shopify/webhooks
customers/create                → https://fashun.co.in/api/shopify/webhooks
customers/update                → https://fashun.co.in/api/shopify/webhooks
checkouts/create                → https://fashun.co.in/api/shopify/webhooks
checkouts/update                → https://fashun.co.in/api/shopify/webhooks
```

Format: **JSON**
API version: **2024-10**

---

## 📋 Step 2: Environment Variables

Add to `fashun-store/.env.local`:

```env
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=fashun-india.myshify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxx
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_API_VERSION=2024-10
SHOPIFY_WEBHOOK_SECRET=xxxxx
SHOPIFY_LOCATION_ID=xxxxx

# n8n Webhooks
N8N_WEBHOOK_URL=https://n8n.fashun.co.in/webhook
N8N_ORDER_WEBHOOK=https://n8n.fashun.co.in/webhook/shopify-order-created
N8N_INVENTORY_WEBHOOK=https://n8n.fashun.co.in/webhook/shopify-inventory-update
N8N_PRODUCT_WEBHOOK=https://n8n.fashun.co.in/webhook/shopify-product-sync

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Notifications
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_NUMBER=+14155238886
SENDGRID_API_KEY=SG.xxx
TELEGRAM_BOT_TOKEN=xxx:xxx
TELEGRAM_ADMIN_CHAT_ID=-xxx

# OpenAI (for AI features)
OPENAI_API_KEY=sk-xxx

# Payment (if using Razorpay alongside Shopify)
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
```

---

## 📋 Step 3: Supabase Database Setup

Run these SQL migrations in Supabase SQL Editor:

```sql
-- Orders table (synced from Shopify)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_order_id TEXT UNIQUE NOT NULL,
  order_number INTEGER NOT NULL,
  email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  financial_status TEXT,
  fulfillment_status TEXT,
  shipping_address JSONB,
  order_items JSONB,
  order_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (synced from Shopify)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_product_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  vendor TEXT,
  product_type TEXT,
  description TEXT,
  images JSONB,
  variants JSONB,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  product_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_item_id TEXT UNIQUE NOT NULL,
  location_id TEXT,
  available INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table (synced from Shopify)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_customer_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  customer_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abandoned carts (for recovery)
CREATE TABLE abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_checkout_id TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  cart_items JSONB,
  cart_value DECIMAL(10, 2),
  recovery_sent_at TIMESTAMP WITH TIME ZONE,
  recovered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discount codes generated by n8n
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT, -- 'percentage' or 'fixed_amount'
  discount_value DECIMAL(10, 2),
  expires_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  max_uses INTEGER,
  customer_email TEXT,
  created_by TEXT DEFAULT 'n8n',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to decrement inventory
CREATE OR REPLACE FUNCTION decrement_inventory(order_items JSONB)
RETURNS void AS $$
DECLARE
  item JSONB;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(order_items)
  LOOP
    UPDATE inventory
    SET available = available - (item->>'quantity')::INTEGER,
        updated_at = NOW()
    WHERE inventory_item_id = item->>'inventory_item_id';
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to get abandoned carts
CREATE OR REPLACE FUNCTION get_abandoned_carts(hours_since INTEGER DEFAULT 1)
RETURNS TABLE (
  id UUID,
  email TEXT,
  phone TEXT,
  cart_items JSONB,
  cart_value DECIMAL,
  hours_abandoned INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ac.id,
    ac.email,
    ac.phone,
    ac.cart_items,
    ac.cart_value,
    EXTRACT(EPOCH FROM (NOW() - ac.created_at))/3600 AS hours_abandoned
  FROM abandoned_carts ac
  WHERE 
    ac.recovered = false
    AND ac.recovery_sent_at IS NULL
    AND ac.created_at < NOW() - (hours_since || ' hours')::INTERVAL
  ORDER BY ac.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX idx_orders_shopify_id ON orders(shopify_order_id);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_products_handle ON products(handle);
CREATE INDEX idx_inventory_item_id ON inventory(inventory_item_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_abandoned_carts_recovered ON abandoned_carts(recovered);
```

---

## 📋 Step 4: n8n Setup

### Option A: Self-Hosted (Recommended for production)

```bash
# Install Docker
# Then run n8n
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_HOST=n8n.fashun.co.in \
  -e WEBHOOK_URL=https://n8n.fashun.co.in/ \
  -e N8N_PROTOCOL=https \
  -e N8N_PORT=5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Option B: n8n Cloud (Easiest)

1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for an account
3. Create a new instance
4. Your webhook URL: `https://yourinstance.app.n8n.cloud/webhook/`

### Import Workflows

1. Open n8n interface
2. Click **Workflows** → **Import from File**
3. Import all JSON files from `n8n-workflows/` folder:
   - `01-order-confirmation-automation.json`
   - `02-abandoned-cart-recovery.json`
   - `03-shopify-order-processing.json`
   - (import all other workflows)

### Configure Credentials

**Shopify:**
- Type: `Shopify`
- Shop name: `fashun-india`
- Access Token: [Your Admin API token]
- API Version: `2024-10`

**Supabase:**
- Type: `HTTP Request` with Header Auth
- Header Name: `apikey`
- Header Value: [Your Supabase anon key]

**Twilio:**
- Account SID: [Your Twilio SID]
- Auth Token: [Your Twilio token]

**SendGrid/Gmail:**
- API Key: [Your SendGrid key]
- Or configure SMTP for Gmail

**Telegram:**
- Bot Token: [Your Telegram bot token]

**OpenAI:**
- API Key: [Your OpenAI key]

### Activate Workflows

1. Open each workflow
2. Click **Active** toggle
3. Test with sample data
4. Monitor **Executions** tab

---

## 📋 Step 5: Test Integration

### Test Order Flow
1. Go to your Shopify store
2. Create a test order (use Shopify Payments test mode)
3. Check n8n executions (should trigger order workflow)
4. Verify:
   - ✅ Order saved in Supabase
   - ✅ Confirmation email received
   - ✅ WhatsApp message sent
   - ✅ Inventory updated
   - ✅ Admin notification sent

### Test Product Sync
1. Create a product in Shopify
2. Check n8n executions
3. Verify product appears in Supabase `products` table
4. Check website (should appear in collections)

### Test Abandoned Cart
1. Add items to cart in your store
2. Don't complete checkout
3. Wait 1 hour
4. Check n8n (should trigger recovery workflow)
5. Verify recovery email received

---

## 📋 Step 6: Deploy to Production

### Deploy Frontend (Vercel)

```bash
cd fashun-store

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
# All the vars from .env.local
```

### Deploy n8n (DigitalOcean/AWS)

```bash
# Use Docker Compose for production
# Create docker-compose.yml

version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.fashun.co.in
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.fashun.co.in/
      - GENERIC_TIMEZONE=Asia/Kolkata
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

### Setup Domain & SSL

```bash
# Point n8n.fashun.co.in to your server IP
# Setup nginx reverse proxy
# Get SSL with Let's Encrypt

sudo certbot --nginx -d n8n.fashun.co.in
```

---

## 📊 Monitoring & Analytics

### n8n Dashboard
- Track workflow executions
- Monitor error rates
- Set up error notifications (Telegram/Email)

### Shopify Analytics
- Track sales
- Monitor inventory
- Analyze customer behavior

### Supabase Dashboard
- Monitor database queries
- Track API usage
- Set up real-time subscriptions

---

## 🎯 Success Metrics

Track these KPIs:
- ✅ Order processing time (target: < 30 seconds)
- ✅ Cart recovery rate (target: 15-25%)
- ✅ Review collection rate (target: 30%+)
- ✅ Customer support response time (target: < 5 minutes)
- ✅ Inventory accuracy (target: 99.9%)
- ✅ Workflow success rate (target: 98%+)

---

## 🚨 Troubleshooting

### Webhooks not firing
- Check Shopify webhook URL is correct
- Verify webhook secret matches
- Check n8n webhook is active
- Test with Shopify webhook test feature

### Orders not syncing
- Check n8n execution logs
- Verify Supabase credentials
- Check API rate limits
- Test Supabase connection

### Emails not sending
- Verify SendGrid API key
- Check email templates are valid
- Test with a simple test email
- Check spam folders

---

## 📚 Resources

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Shopify Admin API Docs](https://shopify.dev/docs/api/admin-rest)
- [n8n Documentation](https://docs.n8n.io)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Ready to launch! 🚀**
