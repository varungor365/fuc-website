# FashUn.Co.in Store

Premium streetwear e-commerce platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/fashun-store.git
cd fashun-store

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🏗️ Architecture

### Frontend Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling and validation

### Design System
- **Dark-first theme** with premium streetwear aesthetic
- **Mobile-first responsive design**
- **Smooth animations** and micro-interactions
- **Accessibility compliant** components

### Key Features
- 🎨 **Custom Design Tool** - Fabric.js powered design canvas
- 🤖 **AI Mockup Generation** - Stable Diffusion integration
- 🛒 **Shopping Cart** - Persistent cart with local storage
- 📱 **Mobile Optimized** - Touch-friendly interface
- 🔍 **SEO Optimized** - Meta tags, structured data, sitemap
- 🎭 **Animation Rich** - Framer Motion powered transitions

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   └── providers.tsx      # Context providers
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   ├── ui/              # UI components
│   └── forms/           # Form components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── styles/               # Additional stylesheets
```

## 🎨 Design Tokens

### Colors
```css
/* Primary Colors (Dark Theme) */
--primary-900: #0F0F10  /* Background */
--primary-100: #E8E8E8  /* Text */

/* Accent Colors */
--accent-500: #E4C590   /* Gold accent */
--highlight-500: #C96C8B /* Pink highlights */
```

### Typography
- **Font Family**: Inter (UI), Montserrat (Display)
- **Scale**: Fluid typography with responsive scaling
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checker
```

### Environment Variables
Create `.env.local` file:
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="FashUn.Co.in"

# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# API Keys (for future integrations)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
OPENAI_API_KEY=your-openai-key
```

## 🎯 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Custom Domain Setup
1. Add your domain in Vercel dashboard
2. Update DNS records to point to Vercel
3. Enable automatic HTTPS

## 🔧 Customization

### Brand Colors
Update colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your primary colors */ },
      accent: { /* your accent colors */ },
    }
  }
}
```

### Components
All components are in `src/components/` and use Tailwind CSS classes. Modify them to match your brand.

### Content
Update content in component files and create new pages in the `app/` directory.

## 📊 Performance

### Core Web Vitals Targets
- **LCP**: < 2.5s
- **FID**: < 100ms  
- **CLS**: < 0.1

### Optimization Features
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Efficient bundle size management
- Cache-first service worker (optional)

## 🔒 Security

### Security Headers
Configured in `next.config.js`:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy

### Best Practices
- Environment variables for sensitive data
- Input validation and sanitization
- HTTPS enforcement
- Rate limiting (implement as needed)

## 🎭 Animation Guidelines

### Framer Motion Usage
- Use consistent easing: `[0.22, 1, 0.36, 1]`
- Keep animations under 300ms for interactions
- Use `whileInView` for scroll-triggered animations
- Implement `reduce-motion` support

### Performance Tips
- Use `transform` and `opacity` for animations
- Avoid animating layout properties
- Use `will-change` sparingly
- Implement animation cleanup

## 📱 Mobile-First Approach

### Breakpoints
```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Laptops */
2xl: 1536px /* Large screens */
```

### Touch Targets
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Thumb-friendly navigation

## 🧪 Testing

### Manual Testing Checklist
- [ ] Responsive design across devices
- [ ] Dark mode consistency
- [ ] Animation performance
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Form validation
- [ ] Cart functionality

### Automated Testing (Future)
```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Visual regression tests
npm run test:visual
```

## 🚀 Future Enhancements

### Phase 2 Features
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] User authentication
- [ ] Order tracking
- [ ] Social sharing
- [ ] Advanced filtering

### Phase 3 Features
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Real-time inventory
- [ ] Recommendation engine
- [ ] AR try-on feature

## 📞 Support

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

### Community
- [GitHub Issues](https://github.com/your-username/fashun-store/issues)
- [Discord Community](https://discord.gg/fashunco)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the next generation of streetwear enthusiasts.
