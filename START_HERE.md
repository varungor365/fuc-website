# 🚀 FASHUN.CO - Quick Start Guide

## ✅ Step 1: Prerequisites Check

Make sure you have:
- ✅ Node.js 18+ installed
- ✅ npm or yarn installed
- ✅ Git installed

## 📦 Step 2: Install Dependencies

Open PowerShell in the project root and run:

```powershell
# Install frontend dependencies
cd fashun-store
npm install

# Install backend dependencies
cd ..\fashun-backend
npm install

# Install AI service dependencies
cd ..\ai-mockup-service
npm install
```

## 🔧 Step 3: Environment Setup

The `.env.local` file has been created in `fashun-store/` with default values.

**You can start immediately with these defaults!**

Optional: Update these values later:
- Razorpay keys (for payment testing)
- Supabase credentials (for authentication)
- OpenRouter API key (for AI features)

## 🎯 Step 4: Start the Platform

### Option A: One-Command Start (Recommended)
```powershell
.\start-platform.ps1
```

### Option B: Manual Start (3 separate terminals)

**Terminal 1 - Backend:**
```powershell
cd fashun-backend
npm run develop
```

**Terminal 2 - AI Service:**
```powershell
cd ai-mockup-service
npm start
```

**Terminal 3 - Frontend:**
```powershell
cd fashun-store
npm run dev
```

## 🌐 Step 5: Access the Platform

Once all services are running:

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Strapi CMS**: http://localhost:1337/admin
- **AI Service**: http://localhost:3001

## 🔑 Default Credentials

**Strapi Admin** (create on first visit):
- Email: admin@fashun.co
- Password: (you'll set this)

## 🎨 What You'll See

1. **Homepage** - Modern glassmorphism design with product showcase
2. **Shop** - Browse products with advanced filtering
3. **Product Pages** - Interactive galleries and size guides
4. **Cart** - Smart shopping cart with recommendations
5. **Admin** - Complete dashboard for managing products

## 🐛 Troubleshooting

### Port Already in Use?
```powershell
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 1337
npx kill-port 1337
```

### Dependencies Issues?
```powershell
# Clear cache and reinstall
cd fashun-store
rm -rf node_modules package-lock.json
npm install
```

### Build Errors?
```powershell
# Clear Next.js cache
cd fashun-store
rm -rf .next
npm run dev
```

## 📚 Next Steps

1. ✅ Explore the homepage and product pages
2. ✅ Test the shopping cart functionality
3. ✅ Access the Strapi admin to add products
4. ✅ Customize the design in `fashun-store/src/`
5. ✅ Read the full documentation in README.md

## 🎯 Key Features to Test

- 🛍️ Add products to cart
- ❤️ Add items to wishlist
- 🔍 Search and filter products
- 📱 Test mobile responsiveness
- 🎨 Explore glassmorphism UI
- ⚡ Check 60fps animations

## 💡 Pro Tips

1. **Hot Reload**: Changes in `fashun-store/src/` auto-refresh
2. **Strapi Admin**: Add products via http://localhost:1337/admin
3. **Mock Data**: Sample products are pre-loaded
4. **TypeScript**: Full type safety throughout the codebase

## 🆘 Need Help?

- Check `FASHUN_TROUBLESHOOTING_GUIDE.txt`
- Review `README.md` for detailed documentation
- Check GitHub Issues: https://github.com/varungor365/fuc-website/issues

---

**Ready to build something amazing? Let's go! 🚀**
