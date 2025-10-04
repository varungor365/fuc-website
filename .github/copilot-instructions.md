# FASHUN.CO Platform - AI Coding Agent Instructions

This platform is a premium streetwear e-commerce system with advanced AI features. Understanding the multi-service architecture and specialized patterns is essential for effective development.

## Platform Architecture

### Service Structure
- **`fashun-store/`**: Next.js 14 frontend (TypeScript, Tailwind, Glassmorphism UI)
- **`fashun-backend/`**: Strapi CMS backend with custom admin APIs
- **`ai-mockup-service/`**: Node.js AI service for design generation
- **`fashun-cms/`**: Legacy CMS (being migrated)

### Startup & Development
Use the PowerShell automation script for development:
```powershell
# Start all services with testing
.\start-platform.ps1 -Test

# Skip AI service for faster startup
.\start-platform.ps1 -SkipAI
```

Services run on: Frontend (3000), Strapi (1337), AI Service (3001)

## Critical Backend Patterns

### Strapi Custom APIs
The backend uses Strapi with **extensive custom admin endpoints** in `src/api/admin-*` directories:
- **Admin Dashboard**: `/admin-dashboard/stats`, `/admin-dashboard/sales-analytics`
- **Admin Orders**: Custom order management beyond default Strapi
- **Admin Products**: Enhanced product APIs with AI integration
- **Admin Customers**: Customer analytics and management

When adding admin features, create custom controllers in `src/api/admin-{feature}/` following the existing pattern with middleware for admin authentication.

### Data Flow Pattern
```
Frontend Admin → Strapi Admin APIs → Database
Frontend Store → Strapi Content APIs → Database
AI Service ← → Frontend (direct API calls)
```

## Frontend Architecture

### Glassmorphism Design System
All admin dashboard components use sophisticated glassmorphism:
```typescript
// Standard glass container
className="bg-primary-900/75 backdrop-blur-md border border-white/10"

// Card variations
className="bg-white/5 backdrop-blur-sm border border-white/20"
```

Typography: **Montserrat** (headings), **Inter** (body text)

### Next.js 14 App Router Structure
```
app/
├── (admin)/           # Admin dashboard routes
├── (store)/           # Customer store routes  
├── providers.tsx      # Global state providers
└── globals.css        # Glassmorphism utilities
```

## AI Integration Patterns

### AI Service Communication
The AI service handles design generation and mockups:
```javascript
// Frontend to AI service pattern
const response = await fetch('http://localhost:3001/api/generate-mockup', {
  method: 'POST',
  body: formData // Include design files
});
```

### AI Feature Labels
Never use "AI" in user-facing text. Use elegant alternatives:
- "Intelligent Insights" (not AI Analytics)
- "Smart Recommendations" (not AI Recommendations)  
- "Design Assistant" (not AI Designer)

## Testing & Quality

### Comprehensive Test Suite
The platform includes multiple test types:
```bash
npm run test              # Run all tests
npm run test:unit         # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:performance  # Performance tests
npm run test:security     # Security tests
```

### Dependencies & Stack
Key technologies requiring specific patterns:
- **Fabric.js**: Canvas-based design tools
- **Stripe**: Payment processing with webhooks
- **Sharp**: Image processing
- **Framer Motion**: Smooth animations
- **Zustand**: Lightweight state management

## Database & Content

### Strapi Schema Extensions
Products, orders, and customers have custom fields for AI features and streetwear-specific attributes. Check `src/api/*/content-types/` for schema definitions.

### File Uploads
Uses Cloudinary for production, local storage for development. All image processing goes through Sharp for optimization.

## Security & Performance

### Admin Authentication
All admin APIs use `middlewares: ['api::admin-dashboard.admin-auth']` pattern. Never bypass this for admin endpoints.

### Performance Optimizations
- Next.js Server Components by default
- Lazy loading for heavy admin components
- Image optimization with Sharp
- Rate limiting on API endpoints

When implementing new features, follow these established patterns for consistency and maintainability.