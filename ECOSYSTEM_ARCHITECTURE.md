# 🏗️ Fashun.co.in Complete Ecosystem Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │  PostgreSQL  │  │   Storage    │      │
│  │  (Unified)   │  │   Database   │  │  (Images/QR) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
    ┌───────────▼──────────┐    ┌──────────▼──────────┐
    │  www.fashun.co.in    │    │   p.fashun.co.in    │
    │  E-commerce Store    │    │   Profile Service   │
    │  (Main Application)  │    │  (Link-in-Bio App)  │
    └──────────────────────┘    └─────────────────────┘
```

## 🎯 Two Decoupled Applications

### 1. Main E-commerce Store (www.fashun.co.in)
- Product catalog and shopping
- Cart and checkout
- Order management
- Order tracking page
- Admin dashboard

### 2. Profile Service (p.fashun.co.in)
- User profile pages (Linktree-style)
- Link management dashboard
- Analytics and insights
- QR code generation
- Theme customization

## 🔐 Unified Authentication (Supabase)

Both applications share the same user database and authentication system.

---

## 📊 Database Schema

### Core Tables

```sql
-- Users (managed by Supabase Auth)
-- auth.users table (built-in)

-- User Profiles
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

-- Social Links
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'view' or 'click'
  link_id UUID REFERENCES links(id) ON DELETE SET NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  source_ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  order_number TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Shipments
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  tracking_id TEXT UNIQUE NOT NULL,
  carrier_name TEXT,
  status TEXT DEFAULT 'processing',
  estimated_delivery DATE,
  tracking_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Badges (Gamification)
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria JSONB
);

-- User Badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);
```

---

## 🚀 Implementation Roadmap

### Phase 1: Supabase Setup (Day 1)

**File**: `scripts/setup-supabase.sql`

```sql
-- Run this in Supabase SQL Editor
-- Creates all tables, indexes, and RLS policies
```

**File**: `SUPABASE_SETUP_GUIDE.md`
- Step-by-step Supabase project creation
- Environment variable configuration
- Authentication provider setup

### Phase 2: Profile Service (p.fashun.co.in) (Days 2-4)

**Directory Structure**:
```
profile-service/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── links/
│   │   │   ├── themes/
│   │   │   └── analytics/
│   │   └── [username]/
│   │       └── page.tsx
│   ├── components/
│   │   ├── LinkCard.tsx
│   │   ├── ThemeEditor.tsx
│   │   └── AnalyticsChart.tsx
│   └── lib/
│       ├── supabase.ts
│       └── qr-generator.ts
└── package.json
```

### Phase 3: E-commerce Integration (Days 5-6)

**Files to Create**:
- `fashun-store/src/app/track/[tracking_id]/page.tsx`
- `fashun-store/src/app/api/webhooks/order-created/route.ts`
- `fashun-store/src/lib/notifications.ts`

### Phase 4: Automation & Polish (Day 7)

**Supabase Functions**:
- `generate-qr-code` - Triggered on username creation
- `award-badges` - Triggered on user actions
- `send-notifications` - Multi-channel messaging

---

## 🔑 Environment Variables

### Both Applications Share:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Twilio (Notifications)
TWILIO_ACCOUNT_SID=ACxxx...
TWILIO_AUTH_TOKEN=xxx...
TWILIO_PHONE_NUMBER=+1xxx...
TWILIO_WHATSAPP_NUMBER=whatsapp:+1xxx...

# Shipping API (Your Service)
SHIPPING_API_URL=https://api.yourshipping.com
SHIPPING_API_KEY=xxx...
```

### E-commerce Store Only:
```env
NEXT_PUBLIC_SITE_URL=https://www.fashun.co.in
NEXT_PUBLIC_PROFILE_URL=https://p.fashun.co.in
```

### Profile Service Only:
```env
NEXT_PUBLIC_SITE_URL=https://p.fashun.co.in
NEXT_PUBLIC_STORE_URL=https://www.fashun.co.in
```

---

## 🔄 User Flow Examples

### New User Journey
1. User visits www.fashun.co.in
2. Signs up via magic link (Supabase Auth)
3. Profile automatically created in `profiles` table
4. User can shop on main site
5. User visits p.fashun.co.in/dashboard
6. Same login works (unified auth)
7. User creates their link-in-bio page
8. QR code auto-generated and stored

### Order Tracking Flow
1. User completes purchase on www.fashun.co.in
2. Webhook triggers `create-shipment` function
3. Tracking ID generated (FN-12345678)
4. Shipment record created in database
5. Multi-channel notification sent (SMS/WhatsApp/Email)
6. User clicks tracking link
7. Redirected to www.fashun.co.in/track/FN-12345678
8. Real-time status displayed

---

## 📱 Multi-Channel Notifications

### Notification Service (`lib/notifications.ts`)

```typescript
export async function sendOrderNotification(
  orderId: string,
  trackingId: string,
  userPreference: 'email' | 'sms' | 'whatsapp'
) {
  const message = `Great news! Your Fashun.co.in order has shipped. Track it here: https://www.fashun.co.in/track/${trackingId}`;
  
  switch (userPreference) {
    case 'sms':
      await sendSMS(phoneNumber, message);
      break;
    case 'whatsapp':
      await sendWhatsApp(phoneNumber, message);
      break;
    default:
      await sendEmail(email, 'Order Shipped', message);
  }
}
```

---

## 🎨 Profile Service Features

### Public Profile Page (p.fashun.co.in/[username])

**Features**:
- ✅ Customizable themes (10+ pre-designed)
- ✅ Social links with icons
- ✅ Rich media embeds (YouTube, Spotify)
- ✅ "Shop This Look" section
- ✅ Featured/spotlight link
- ✅ Contact card download (.vcf)
- ✅ Badge display (gamification)
- ✅ View counter
- ✅ Click analytics
- ✅ QR code display
- ✅ Mobile-optimized

### Dashboard Features

**Profile Editor**:
- Upload profile picture
- Edit display name and bio
- Change username (updates QR code)
- Set notification preferences

**Link Manager**:
- Add/edit/delete links
- Drag-and-drop reordering
- Platform detection (auto-icons)
- Link validation (404 checker)
- Featured link toggle

**Theme Customizer**:
- Pre-designed themes
- Custom color picker
- Background image upload
- Font selection
- Preview mode

**Analytics**:
- Total profile views
- Link click counts
- Traffic sources
- Top performing links
- Time-based charts

---

## 🔐 Security & RLS Policies

### Row Level Security (Supabase)

```sql
-- Profiles: Users can only edit their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Links: Users can only manage their own
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view links"
  ON links FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own links"
  ON links FOR ALL
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );
```

---

## 🚢 Deployment Strategy

### Main Store (www.fashun.co.in)
- **Platform**: Vercel
- **Domain**: www.fashun.co.in
- **Build Command**: `cd fashun-store && npm run build`

### Profile Service (p.fashun.co.in)
- **Platform**: Vercel (separate project)
- **Domain**: p.fashun.co.in
- **Build Command**: `cd profile-service && npm run build`

### DNS Configuration
```
A     @           -> Vercel IP (main store)
CNAME www         -> cname.vercel-dns.com
CNAME p           -> cname.vercel-dns.com (profile service)
```

---

## 📋 Implementation Checklist

### Stage 1: Backend Setup
- [ ] Create Supabase project
- [ ] Run database schema SQL
- [ ] Enable authentication providers
- [ ] Configure storage buckets
- [ ] Set up RLS policies
- [ ] Create database functions

### Stage 2: Profile Service
- [ ] Initialize Next.js project
- [ ] Integrate Supabase client
- [ ] Build authentication pages
- [ ] Create dashboard layout
- [ ] Implement profile editor
- [ ] Build link manager
- [ ] Create theme customizer
- [ ] Add analytics page
- [ ] Build public profile page
- [ ] Implement QR code generation

### Stage 3: E-commerce Integration
- [ ] Create tracking page
- [ ] Build order webhook handler
- [ ] Implement shipment creation
- [ ] Integrate Twilio notifications
- [ ] Add multi-channel support
- [ ] Test end-to-end flow

### Stage 4: Automation
- [ ] Set up QR code auto-generation
- [ ] Implement badge system
- [ ] Create notification triggers
- [ ] Add analytics tracking
- [ ] Performance optimization
- [ ] Mobile responsiveness testing

---

## 🎯 Success Metrics

- ✅ Single sign-on works across both apps
- ✅ QR codes are permanent and never break
- ✅ Order tracking is real-time
- ✅ Notifications deliver within 30 seconds
- ✅ Profile pages load in <1 second
- ✅ 100% mobile responsive
- ✅ Zero downtime deployments

---

## 📞 Admin Access

### Main Store Admin
- URL: `https://www.fashun.co.in/admin`
- Protected by Supabase Auth
- Role-based access control

### Profile Service Admin
- URL: `https://p.fashun.co.in/dashboard`
- User-specific dashboard
- No separate admin needed

---

**Next Steps**: Begin with `SUPABASE_SETUP_GUIDE.md` for detailed implementation instructions.
