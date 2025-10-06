# 🚀 API Setup Quick Reference

## One-Page Cheat Sheet

### 🔐 Authentication

| Service | Free Tier | Get API Key | Add to Admin |
|---------|-----------|-------------|--------------|
| **Clerk** | 10K MAU | [clerk.com](https://clerk.com) → Create App → Copy Keys | Auth tab |
| **Auth0** | 7K MAU | [auth0.com](https://auth0.com) → Create App → Settings | Auth tab |
| **Turnstile** | Unlimited | [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile → Add Site | Auth tab |

### 📸 Media & CDN

| Service | Free Tier | Get API Key | Add to Admin |
|---------|-----------|-------------|--------------|
| **ImageKit** | 20GB/month | [imagekit.io](https://imagekit.io) → Developer Options | Media tab |
| **Cloudinary** | 25 credits | [cloudinary.com](https://cloudinary.com) → Dashboard | Media tab |
| **Unsplash** | 50 req/hour | [unsplash.com/developers](https://unsplash.com/developers) → New App | Media tab |

### 🤖 AI Services

| Service | Free Tier | Get API Key | Add to Admin |
|---------|-----------|-------------|--------------|
| **Gemini** | 60 req/min | [ai.google.dev](https://ai.google.dev) → Get API Key | AI tab |
| **Sanity** | 3 users | [sanity.io](https://sanity.io) → New Project → Settings | AI tab |
| **Algolia** | 10K records | [algolia.com](https://algolia.com) → Create App → API Keys | AI tab |

### 📧 Communication

| Service | Free Tier | Get API Key | Add to Admin |
|---------|-----------|-------------|--------------|
| **Resend** | 3K emails/month | [resend.com](https://resend.com) → API Keys | Integrations tab |
| **Crisp** | 2 seats | [crisp.chat](https://crisp.chat) → Settings → Website ID | Integrations tab |
| **Formspree** | 50 forms/month | [formspree.io](https://formspree.io) → New Form → Form ID | Integrations tab |

### 💰 E-Commerce

| Service | Free Tier | Get API Key | Add to Admin |
|---------|-----------|-------------|--------------|
| **Exchange Rates** | 1K req/month | [openexchangerates.org](https://openexchangerates.org) → Sign Up → App ID | Integrations tab |

---

## ⚡ 5-Minute Setup

### Essential Services (Start Here)

```bash
1. Clerk          → Authentication
2. Turnstile      → Bot Protection  
3. ImageKit       → Image Optimization
4. Resend         → Emails
```

### Setup Flow

```
1. Visit service website
   ↓
2. Sign up (free)
   ↓
3. Create project/app
   ↓
4. Copy API keys
   ↓
5. Paste in Admin Settings
   ↓
6. Click Save
   ↓
7. Done! ✨
```

---

## 🎯 Priority Order

### Week 1 (Critical)
- ✅ Clerk - User authentication
- ✅ Turnstile - Bot protection
- ✅ Resend - Order emails

### Week 2 (Important)
- ✅ ImageKit - Image optimization
- ✅ Gemini - AI content
- ✅ Algolia - Fast search

### Week 3 (Nice to Have)
- ✅ Cloudinary - Advanced media
- ✅ Crisp - Live chat
- ✅ Sanity - Blog CMS

### Week 4 (Optional)
- ✅ Unsplash - Stock photos
- ✅ Exchange Rates - Multi-currency
- ✅ Formspree - Contact forms

---

## 📋 Copy-Paste Checklist

```
□ Clerk Publishable Key: pk_test_________________
□ Clerk Secret Key: sk_test_________________
□ Turnstile Site Key: 0x4_________________
□ Turnstile Secret: 0x4_________________
□ ImageKit Public Key: public_________________
□ ImageKit Private Key: private_________________
□ ImageKit URL: https://ik.imagekit.io/_______
□ Gemini API Key: AIza_________________
□ Algolia App ID: _________________
□ Algolia API Key: _________________
□ Resend API Key: re_________________
□ Crisp Website ID: _________________
```

---

## 🧪 Test Commands

```bash
# Test authentication
curl http://localhost:3000/api/auth/test

# Test image optimization
curl http://localhost:3000/api/media/optimize

# Test AI generation
curl http://localhost:3000/api/ai/generate

# Test search
curl http://localhost:3000/api/search?q=shirt

# Test email
curl http://localhost:3000/api/email/test
```

---

## 🔧 Admin Portal Access

```
URL: http://localhost:3000/admin/settings

Tabs:
- General       → Site settings
- Backend       → Medusa URL
- Authentication → Clerk/Auth0/Turnstile
- Payment       → Razorpay/Stripe
- Email         → SendGrid/Resend
- Media & CDN   → ImageKit/Cloudinary/Unsplash
- AI Services   → Gemini/Sanity/Algolia
- Integrations  → Crisp/Exchange/Formspree
```

---

## 💡 Pro Tips

### Save Time
- Use Clerk (easier than Auth0)
- Start with ImageKit (simpler than Cloudinary)
- Skip Sanity if no blog needed
- Skip Unsplash if using own photos

### Save Money
- All services have free tiers
- No credit card required for most
- Upgrade only when needed
- Monitor usage dashboards

### Avoid Issues
- Copy keys carefully (no spaces)
- Use test keys in development
- Switch to production keys before launch
- Keep keys in Admin Settings only

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Re-copy from dashboard, check for spaces |
| Images not loading | Verify ImageKit URL endpoint |
| Search not working | Check Algolia index exists |
| Emails not sending | Verify domain in Resend |
| Chat not showing | Check Crisp Website ID |

---

## 📞 Support Links

- Clerk: [docs.clerk.com](https://docs.clerk.com)
- Turnstile: [developers.cloudflare.com/turnstile](https://developers.cloudflare.com/turnstile)
- ImageKit: [docs.imagekit.io](https://docs.imagekit.io)
- Gemini: [ai.google.dev/docs](https://ai.google.dev/docs)
- Algolia: [algolia.com/doc](https://algolia.com/doc)
- Resend: [resend.com/docs](https://resend.com/docs)

---

**Total Setup Time**: 30 minutes  
**Total Cost**: $0  
**Maintenance**: 5 min/month
