# FashUn.Co Supabase Integration

This document outlines the complete Supabase integration for the FashUn.Co platform, including database setup, authentication, and real-time features.

## 🚀 Quick Start

### 1. Environment Setup
Your `.env.local` file should contain:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://sjgcvozzuobmlejsokzi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZ2N2b3p6dW9ibWxlanNva3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTE4ODIsImV4cCI6MjA3NDM2Nzg4Mn0.SHYkBliiE6B3yZB8rz0E4PtruG1WJtK7msRHpE9mKhQ
```

### 2. Database Schema Setup
1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/sjgcvozzuobmlejsokzi
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create all tables, policies, and sample data

### 3. Authentication Configuration
The platform uses Supabase Auth with the following features:
- Email/Password authentication
- Row Level Security (RLS)
- User profiles with extended metadata

## 📊 Database Schema

### Core Tables

#### Products
```sql
- id (UUID, Primary Key)
- name (VARCHAR, Product name)
- description (TEXT, Product description)
- price (DECIMAL, Product price)
- image (TEXT, Image URL)
- category (VARCHAR, Product category)
- brand (VARCHAR, Brand name)
- sizes (TEXT[], Available sizes)
- colors (TEXT[], Available colors)
- stock (INTEGER, Stock quantity)
- featured (BOOLEAN, Featured product flag)
- created_at, updated_at (TIMESTAMP)
```

#### User Profiles
```sql
- id (UUID, References auth.users)
- full_name (VARCHAR, User's full name)
- avatar_url (TEXT, Profile picture URL)
- phone (VARCHAR, Phone number)
- date_of_birth (DATE, Date of birth)
- created_at, updated_at (TIMESTAMP)
```

#### Orders
```sql
- id (UUID, Primary Key)
- user_id (UUID, References auth.users)
- total (DECIMAL, Order total)
- status (VARCHAR, Order status)
- shipping_address (JSONB, Shipping details)
- created_at, updated_at (TIMESTAMP)
```

#### Order Items
```sql
- id (UUID, Primary Key)
- order_id (UUID, References orders)
- product_id (UUID, References products)
- quantity (INTEGER, Item quantity)
- price (DECIMAL, Item price)
- size (VARCHAR, Selected size)
- color (VARCHAR, Selected color)
```

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with the following policies:

- **Products**: Public read access, authenticated write access
- **User Profiles**: Users can only access their own profiles
- **Orders**: Users can only access their own orders
- **Reviews**: Public read, users can only edit their own
- **Wishlist**: Users can only access their own wishlist

### Authentication Flow
```typescript
// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
})

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign Out
await supabase.auth.signOut()
```

## 🛠 API Usage Examples

### Products Service
```typescript
import { ProductService } from '@/services/productService'

// Get all products
const products = await ProductService.getAllProducts()

// Get featured products
const featured = await ProductService.getFeaturedProducts()

// Get products by category
const hoodies = await ProductService.getProductsByCategory('Hoodies')

// Search products
const results = await ProductService.searchProducts('hoodie')
```

### Authentication Hook
```typescript
import { useAuth } from '@/components/auth/AuthProvider'

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {user ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={() => signIn(email, password)}>Sign In</button>
      )}
    </div>
  )
}
```

## 🎨 UI Components

### Authentication Forms
- `AuthProvider`: Global authentication context
- `AuthForm`: Login/signup form component
- `Header`: Navigation with auth status
- Auth page at `/auth`

### Product Components
- `ProductService`: Database operations
- Product pages use Supabase data
- Real-time inventory updates

## 🚀 Deployment Considerations

### Environment Variables
Ensure these are set in your production environment:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # For server-side operations
```

### Database Migrations
- Use Supabase CLI for version control
- Apply schema changes through SQL Editor
- Test migrations in staging environment

### Performance Optimization
- Indexes are created for frequently queried columns
- Use Supabase's built-in caching
- Implement proper pagination for large datasets

## 🔄 Real-time Features

### Live Product Updates
```typescript
// Subscribe to product changes
supabase
  .channel('products')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'products'
  }, (payload) => {
    // Handle real-time updates
  })
  .subscribe()
```

### Order Status Updates
```typescript
// Subscribe to order status changes
supabase
  .channel(`orders:user_id=eq.${userId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders'
  }, (payload) => {
    // Update UI with new order status
  })
  .subscribe()
```

## 📈 Analytics & Monitoring

### Built-in Analytics
- User registration metrics
- Product view tracking
- Order conversion rates
- Real-time user activity

### Custom Events
```typescript
// Track custom events
await supabase.from('analytics_events').insert({
  event_name: 'product_view',
  user_id: user?.id,
  metadata: { product_id: productId }
})
```

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Check if user is authenticated
   - Verify policy conditions
   - Use service role key for admin operations

2. **Environment Variables**
   - Ensure all required env vars are set
   - Restart development server after changes
   - Check variable names match exactly

3. **Database Connections**
   - Verify Supabase project URL
   - Check API key permissions
   - Monitor connection limits

### Debug Tools
- Supabase Dashboard > Logs
- Network tab in browser dev tools
- Supabase CLI for local development

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

This integration provides a complete backend solution for the FashUn.Co platform with authentication, database operations, real-time features, and security built-in.