# 🚀 Supabase Setup Guide - Complete Walkthrough

## Step 1: Create Supabase Project (5 minutes)

### 1.1 Sign Up
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

### 1.2 Create New Project
1. Click "New Project"
2. **Project Name**: `fashun-ecosystem`
3. **Database Password**: Generate strong password (save it!)
4. **Region**: Choose closest to India (Singapore recommended)
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

### 1.3 Get API Keys
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJxxx...`
   - **service_role key**: `eyJxxx...` (keep secret!)

---

## Step 2: Configure Authentication (10 minutes)

### 2.1 Enable Magic Link
1. Go to Authentication → Providers
2. **Email** is enabled by default
3. Configure email templates:
   - Go to Authentication → Email Templates
   - Customize "Magic Link" template
   - Add your branding

### 2.2 Enable Social Logins

#### Google OAuth
1. Go to Authentication → Providers → Google
2. Enable Google provider
3. Follow instructions to create OAuth app:
   - Visit [Google Cloud Console](https://console.cloud.google.com)
   - Create new project "Fashun Auth"
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase

#### Instagram (Optional)
1. Go to Authentication → Providers → Instagram
2. Follow Meta Developer setup
3. Add redirect URI from Supabase

### 2.3 Configure Site URL
1. Go to Authentication → URL Configuration
2. **Site URL**: `https://www.fashun.co.in`
3. **Redirect URLs**: Add both:
   - `https://www.fashun.co.in/**`
   - `https://p.fashun.co.in/**`

---

## Step 3: Create Database Schema (15 minutes)

### 3.1 Run SQL Script
1. Go to SQL Editor
2. Click "New query"
3. Copy and paste the complete schema (see below)
4. Click "Run"

### 3.2 Complete Database Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  profile_image_url TEXT,
  theme_settings JSONB DEFAULT '{"theme": "default", "primaryColor": "#8B5CF6", "backgroundColor": "#FFFFFF"}',
  points INTEGER DEFAULT 0,
  qr_code_url TEXT,
  preferred_notification_channel TEXT DEFAULT 'email',
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$')
);

-- Links Table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT url_format CHECK (url ~ '^https?://')
);

-- Analytics Table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click')),
  link_id UUID REFERENCES links(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source_ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  order_number TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipments Table
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  tracking_id TEXT UNIQUE NOT NULL,
  carrier_name TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'in_transit', 'out_for_delivery', 'delivered')),
  estimated_delivery DATE,
  tracking_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges Table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  criteria JSONB
);

-- User Badges Table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create Indexes for Performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_links_profile_id ON links(profile_id);
CREATE INDEX idx_links_position ON links(profile_id, position);
CREATE INDEX idx_analytics_profile_id ON analytics(profile_id);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_shipments_tracking_id ON shipments(tracking_id);

-- Create Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Links
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Links are viewable by everyone"
  ON links FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own links"
  ON links FOR ALL
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Analytics
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON analytics FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics"
  ON analytics FOR INSERT
  WITH CHECK (true);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Shipments
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shipments for their orders"
  ON shipments FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- User Badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all badges"
  ON user_badges FOR SELECT
  USING (true);

-- Insert Default Badges
INSERT INTO badges (name, description, icon_url, criteria) VALUES
  ('Early Adopter', 'One of the first 100 users', '/badges/early-adopter.svg', '{"type": "user_count", "threshold": 100}'),
  ('Social Butterfly', 'Added 10+ social links', '/badges/social-butterfly.svg', '{"type": "link_count", "threshold": 10}'),
  ('Trendsetter', 'Profile viewed 1000+ times', '/badges/trendsetter.svg', '{"type": "view_count", "threshold": 1000}'),
  ('Fashionista', 'Made 5+ purchases', '/badges/fashionista.svg', '{"type": "order_count", "threshold": 5}'),
  ('VIP', 'Spent ₹10,000+', '/badges/vip.svg', '{"type": "total_spent", "threshold": 10000}');
```

---

## Step 4: Configure Storage (5 minutes)

### 4.1 Create Storage Buckets
1. Go to Storage
2. Create new bucket: `profile-images`
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/*`
3. Create new bucket: `qr-codes`
   - Public: Yes
   - File size limit: 1MB

### 4.2 Set Storage Policies
```sql
-- Profile Images: Users can upload their own
CREATE POLICY "Users can upload own profile image"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Profile images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

-- QR Codes: Public read, system write
CREATE POLICY "QR codes are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'qr-codes');
```

---

## Step 5: Create Database Functions (10 minutes)

### 5.1 Auto-Generate Username Function
```sql
CREATE OR REPLACE FUNCTION generate_username()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate username from email if not provided
  IF NEW.username IS NULL THEN
    NEW.username := LOWER(SPLIT_PART(
      (SELECT email FROM auth.users WHERE id = NEW.user_id),
      '@', 1
    )) || '_' || SUBSTRING(NEW.id::text, 1, 6);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_username_trigger
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION generate_username();
```

### 5.2 Track Link Clicks Function
```sql
CREATE OR REPLACE FUNCTION increment_link_clicks()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_type = 'click' AND NEW.link_id IS NOT NULL THEN
    UPDATE links SET clicks = clicks + 1 WHERE id = NEW.link_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_link_clicks
  AFTER INSERT ON analytics
  FOR EACH ROW
  EXECUTE FUNCTION increment_link_clicks();
```

---

## Step 6: Environment Variables Setup

### 6.1 For Main Store (fashun-store/.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Site URLs
NEXT_PUBLIC_SITE_URL=https://www.fashun.co.in
NEXT_PUBLIC_PROFILE_URL=https://p.fashun.co.in

# Twilio (for notifications)
TWILIO_ACCOUNT_SID=ACxxx...
TWILIO_AUTH_TOKEN=xxx...
TWILIO_PHONE_NUMBER=+1xxx...
TWILIO_WHATSAPP_NUMBER=whatsapp:+1xxx...

# Shipping API
SHIPPING_API_URL=https://api.yourshipping.com
SHIPPING_API_KEY=xxx...
```

### 6.2 For Profile Service (profile-service/.env.local)
```env
# Supabase (same as main store)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Site URLs
NEXT_PUBLIC_SITE_URL=https://p.fashun.co.in
NEXT_PUBLIC_STORE_URL=https://www.fashun.co.in
```

---

## Step 7: Test Authentication

### 7.1 Test Magic Link
1. Create test file: `test-auth.html`
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <input type="email" id="email" placeholder="Enter email">
  <button onclick="sendMagicLink()">Send Magic Link</button>
  
  <script>
    const supabase = supabase.createClient(
      'YOUR_SUPABASE_URL',
      'YOUR_ANON_KEY'
    );
    
    async function sendMagicLink() {
      const email = document.getElementById('email').value;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://www.fashun.co.in'
        }
      });
      
      if (error) alert('Error: ' + error.message);
      else alert('Check your email!');
    }
  </script>
</body>
</html>
```

2. Open in browser and test

---

## Step 8: Admin Access Setup

### 8.1 Create Admin Role
```sql
-- Add admin column to profiles
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Make your account admin (replace with your user_id)
UPDATE profiles SET is_admin = TRUE 
WHERE user_id = 'YOUR_USER_ID_HERE';
```

### 8.2 Admin Access URLs
- **Main Store Admin**: `https://www.fashun.co.in/admin`
- **Profile Dashboard**: `https://p.fashun.co.in/dashboard`

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API keys copied and saved
- [ ] Authentication providers enabled
- [ ] Database schema created successfully
- [ ] Storage buckets configured
- [ ] Database functions created
- [ ] Environment variables set
- [ ] Test authentication works
- [ ] Admin access configured

---

## 🚨 Troubleshooting

### "relation does not exist" error
- Make sure you ran the complete SQL schema
- Check SQL Editor for any errors

### Authentication not working
- Verify Site URL and Redirect URLs are correct
- Check that email templates are enabled
- Ensure API keys are correct

### RLS blocking queries
- Check RLS policies are created
- Verify user is authenticated
- Use service_role key for admin operations

---

## 📞 Next Steps

1. ✅ Complete this Supabase setup
2. 📱 Build Profile Service (see `PROFILE_SERVICE_GUIDE.md`)
3. 🛒 Integrate with E-commerce (see `ECOMMERCE_INTEGRATION_GUIDE.md`)
4. 🚀 Deploy both applications

---

**Estimated Setup Time**: 45 minutes  
**Difficulty**: Intermediate  
**Cost**: $0 (Supabase free tier)
