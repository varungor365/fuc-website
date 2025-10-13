# 🎨 Profile Service Complete Implementation Guide

## Overview

The Profile Service (p.fashun.co.in) is a standalone Linktree-style application that shares authentication with the main e-commerce store.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd profile-service
npm install
```

### 2. Configure Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Start Development Server
```bash
npm run dev
# Runs on http://localhost:3001
```

### 4. Test Profile Page
```
http://localhost:3001/varungor365
```

---

## 📁 Project Structure

```
profile-service/
├── src/
│   ├── app/
│   │   ├── [username]/
│   │   │   └── page.tsx          # Public profile page
│   │   ├── api/
│   │   │   └── track-click/
│   │   │       └── route.ts      # Analytics API
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ProfilePage.tsx       # Main profile component
│   │   └── LinkButton.tsx        # Link button component
│   └── lib/
│       └── supabase.ts           # Supabase client
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 🎨 Design Features

### Linktree-Style Layout
- ✅ Full-screen background image
- ✅ Centered content column
- ✅ Circular profile picture
- ✅ Display name and bio
- ✅ Glassmorphism link buttons
- ✅ Social icons row
- ✅ Brand footer

### Visual Effects
- **Glassmorphism**: Semi-transparent buttons with backdrop blur
- **Hover Effects**: Scale and brightness changes
- **Smooth Transitions**: 200ms duration
- **Responsive Design**: Mobile-first approach

---

## 🔧 Customization Options

### Background Image
Users can upload custom background images via dashboard:
```typescript
theme_settings: {
  backgroundImage: 'https://your-image-url.jpg'
}
```

### Color Scheme
```typescript
theme_settings: {
  primaryColor: '#8B5CF6',
  backgroundColor: '#FFFFFF'
}
```

### Link Styling
- Semi-transparent background (`bg-white/20`)
- Backdrop blur (`backdrop-blur-md`)
- Border (`border-white/30`)
- Hover scale (`hover:scale-[1.02]`)

---

## 📊 Analytics Tracking

### Profile Views
Automatically tracked when someone visits the profile:
```typescript
await supabase.from('analytics').insert({
  profile_id: profile.id,
  event_type: 'view',
  timestamp: new Date().toISOString(),
});
```

### Link Clicks
Tracked when user clicks any link:
```typescript
await supabase.from('analytics').insert({
  profile_id: profileId,
  event_type: 'click',
  link_id: linkId,
  timestamp: new Date().toISOString(),
});
```

---

## 🔗 Link Types

### Regular Links
Standard links displayed as buttons:
```typescript
{
  title: 'My Website',
  url: 'https://example.com',
  icon: '🌐',
  is_featured: false
}
```

### Featured Links
Highlighted with special badge:
```typescript
{
  title: 'New Collection',
  url: 'https://fashun.co.in/collection',
  icon: '⭐',
  is_featured: true
}
```

### Social Links
Automatically detected and shown as icons:
- Instagram
- Twitter/X
- LinkedIn
- YouTube
- GitHub

---

## 🎯 SEO Optimization

### Dynamic Metadata
```typescript
export async function generateMetadata({ params }) {
  return {
    title: `${profile.display_name} | Fashun.co.in`,
    description: profile.bio,
    openGraph: {
      title: profile.display_name,
      description: profile.bio,
      images: [profile.profile_image_url],
    },
  };
}
```

### Server-Side Rendering
- Fast initial page load
- SEO-friendly
- Social media preview cards

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd profile-service
vercel --prod

# Add custom domain
vercel domains add p.fashun.co.in
```

### Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_SITE_URL=https://p.fashun.co.in
NEXT_PUBLIC_STORE_URL=https://www.fashun.co.in
```

---

## 🧪 Testing

### Test Profile Page
```bash
# Create test profile in Supabase
INSERT INTO profiles (user_id, username, display_name, bio)
VALUES (
  'test-user-id',
  'testuser',
  'Test User',
  'This is a test profile'
);

# Add test links
INSERT INTO links (profile_id, title, url, position)
VALUES
  ('profile-id', 'Website', 'https://example.com', 0),
  ('profile-id', 'Instagram', 'https://instagram.com/test', 1);

# Visit
http://localhost:3001/testuser
```

---

## 📱 Mobile Optimization

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Features
- Touch-optimized buttons
- Optimized image sizes
- Fast loading
- Smooth scrolling

---

## 🎨 Theme Examples

### Default Theme
```json
{
  "theme": "default",
  "primaryColor": "#8B5CF6",
  "backgroundColor": "#FFFFFF",
  "backgroundImage": "https://images.unsplash.com/photo-1557683316-973673baf926"
}
```

### Dark Theme
```json
{
  "theme": "dark",
  "primaryColor": "#10B981",
  "backgroundColor": "#1F2937",
  "backgroundImage": "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e"
}
```

### Gradient Theme
```json
{
  "theme": "gradient",
  "primaryColor": "#F59E0B",
  "backgroundColor": "#FEF3C7",
  "backgroundImage": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
}
```

---

## 🔐 Security

### Row Level Security
All data access is protected by Supabase RLS policies:
- Public can view profiles
- Users can only edit their own profile
- Analytics are tracked anonymously

### CORS Configuration
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://www.fashun.co.in' },
        ],
      },
    ];
  },
};
```

---

## 📊 Performance Metrics

### Target Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 95+

### Optimization Techniques
- Server-side rendering
- Image optimization
- Code splitting
- Lazy loading
- CDN delivery

---

## 🎁 Advanced Features

### Rich Media Embeds
Detect and embed YouTube/Spotify:
```typescript
if (url.includes('youtube.com')) {
  // Render YouTube player
}
if (url.includes('spotify.com')) {
  // Render Spotify player
}
```

### Contact Card Download
Generate .vcf file:
```typescript
import VCard from 'vcf';

const vcard = new VCard();
vcard.set('fn', profile.display_name);
vcard.set('email', profile.email);
// Download vcard
```

### QR Code Display
Show QR code for easy sharing:
```typescript
<img src={profile.qr_code_url} alt="QR Code" />
```

---

## ✅ Launch Checklist

- [ ] Supabase configured
- [ ] Environment variables set
- [ ] Test profile created
- [ ] Links working
- [ ] Analytics tracking
- [ ] Mobile responsive
- [ ] SEO metadata
- [ ] Domain configured
- [ ] SSL certificate
- [ ] Performance optimized

---

## 🎉 You're Ready!

Your profile service is now live at:
- **Production**: https://p.fashun.co.in/[username]
- **Local**: http://localhost:3001/[username]

**Features Included:**
- ✅ Linktree-style design
- ✅ Custom backgrounds
- ✅ Analytics tracking
- ✅ Social icons
- ✅ Mobile optimized
- ✅ SEO friendly
- ✅ Fast loading

---

**Next Steps**: Build the dashboard for users to manage their profiles!
