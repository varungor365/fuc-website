# Themed QR Code Customizer Implementation Guide

## Overview
This implementation provides a complete QR code customization system for the FASHUN phygital platform, allowing users to create custom-styled QR codes that link to their digital profiles and get printed on their physical products.

## Architecture

### Frontend Components
- **QRCodeCustomizer.tsx**: Main customization interface with live preview
- **QRCodeManager.tsx**: Dashboard component for managing QR codes and viewing orders
- **Profile Integration**: QR customizer access from user profiles

### Backend Integration
- **Supabase Schema**: Database tables for storing QR settings and order tracking
- **Edge Functions**: Webhook for handling phygital orders and print-on-demand integration
- **Storage**: Supabase storage bucket for high-resolution QR code files

## Installation & Setup

### 1. Install Dependencies
```bash
cd profile-service
npm install qr-code-styling react-colorful
```

### 2. Database Setup
Execute the following SQL files in your Supabase SQL editor:

1. **supabase-qr-schema.sql** - Adds QR settings columns to profiles table
2. **supabase-orders-schema.sql** - Creates orders and phygital_orders tables

```sql
-- Key tables created:
-- profiles.qr_settings (JSONB) - Stores user's QR customization settings
-- profiles.custom_qr_url (TEXT) - URL to generated high-res QR code
-- orders - Main order table with phygital flag
-- phygital_orders - Tracks QR code usage in orders
```

### 3. Storage Bucket Setup
In Supabase dashboard, create a storage bucket:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('qr-codes', 'qr-codes', true);
```

### 4. Edge Function Deployment (Optional)
Deploy the order processing webhook:
```bash
supabase functions deploy handle-phygital-orders
```

## Usage Flow

### 1. QR Code Customization
- Users access `/qr-customizer` from their profile
- Live preview updates as they adjust colors, styles, and upload logos
- Settings saved to `profiles.qr_settings` as JSONB

### 2. High-Resolution Generation
- "Save for Print" generates 2000x2000px QR code
- Uploaded to Supabase storage
- URL saved to `profiles.custom_qr_url`

### 3. Phygital Order Processing
- When users purchase phygital items, system checks for `custom_qr_url`
- If custom QR exists, sends that URL to print-on-demand provider
- Otherwise, generates default QR code with profile link

### 4. Print-on-Demand Integration
The webhook (`handle-phygital-orders`) processes orders:
```typescript
// Retrieves custom QR code
const { data: profile } = await supabase
  .from('profiles')
  .select('custom_qr_url, qr_settings, username')
  .eq('username', order.customer_username)
  .single()

// Sends to print provider (Printful, Gooten, etc.)
const printPayload = {
  order_id: order.order_id,
  qr_code_url: profile.custom_qr_url,
  // ... other order details
}
```

## Customization Options

### Colors
- **Dot Color**: Color of QR code dots
- **Background**: Solid color or gradient background
- **Corners**: Color of corner squares and dots

### Styles
- **Dot Types**: square, dots, rounded, extra-rounded, classy, classy-rounded
- **Corner Types**: square, extra-rounded, dot
- **Background Types**: solid, gradient

### Logo Upload
- Users can upload profile pictures or custom logos
- Positioned in center of QR code
- Supports PNG, JPG formats

## File Structure
```
profile-service/
├── src/
│   ├── components/
│   │   ├── QRCodeCustomizer.tsx      # Main customizer interface
│   │   └── QRCodeManager.tsx         # Dashboard management
│   └── app/
│       ├── qr-customizer/
│       │   └── page.tsx              # QR customizer page
│       └── [username]/
│           └── page.tsx              # Profile with QR integration
├── supabase/
│   └── functions/
│       └── handle-phygital-orders/
│           └── index.ts              # Order processing webhook
├── supabase-qr-schema.sql            # QR settings schema
├── supabase-orders-schema.sql        # Orders tracking schema
└── package.json                      # Dependencies
```

## API Endpoints

### Supabase Functions
- **update_profile_qr_settings()**: Updates user's QR settings
- **create_phygital_order()**: Creates order with QR code integration

### Client-Side Usage
```typescript
// Save QR settings
const { data, error } = await supabase.rpc('update_profile_qr_settings', {
  profile_id: user.id,
  settings: qrSettings,
  qr_url: generatedQrUrl
});

// Create phygital order
const { data, error } = await supabase.rpc('create_phygital_order', {
  p_product_id: 'cyber-punk-hoodie',
  p_product_name: 'Cyber Punk Hoodie',
  p_size: 'M',
  p_color: 'black',
  p_quantity: 1,
  p_price: 3299,
  p_shipping_address: addressJson
});
```

## Integration with Print-on-Demand

### Printful Integration Example
```typescript
const printfulPayload = {
  recipient: order.shipping_address,
  items: [{
    sync_variant_id: getPrintfulVariantId(product_id, size, color),
    quantity: order.quantity,
    files: customQrUrl ? [{
      type: 'front',
      url: customQrUrl,
      options: [{
        id: 'template_type',
        value: 'native'
      }]
    }] : []
  }]
};
```

### Other Providers
The system is designed to work with any print-on-demand provider that accepts:
- Custom image overlays/prints
- Product variant mapping
- Webhook order processing

## Security & Performance

### Row Level Security
- Users can only access their own QR settings
- Orders are isolated by user ID
- Custom QR URLs are publicly accessible but unguessable

### Performance Optimizations
- QR settings stored as JSONB for fast queries
- Indexes on frequently queried columns
- CDN-served QR code images via Supabase storage

### Rate Limiting
Consider implementing rate limits on:
- QR code generation (prevent abuse)
- File uploads (storage protection)
- Order creation (prevent spam orders)

## Testing

### Manual Testing
1. Create user profile
2. Access QR customizer via profile
3. Modify colors and styles
4. Upload logo image
5. Save for print
6. Verify database updates
7. Create phygital order
8. Check webhook processing

### Automated Testing
```typescript
// Test QR settings save
test('saves QR settings to profile', async () => {
  const settings = { dotsOptions: { color: '#ff0000' } };
  const result = await supabase.rpc('update_profile_qr_settings', {
    profile_id: testUserId,
    settings
  });
  expect(result.error).toBeNull();
});
```

## Production Deployment

### Environment Variables
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PRINTFUL_API_KEY=your_printful_key  # If using Printful
```

### Deployment Checklist
- [ ] Execute database schema updates
- [ ] Create storage bucket with proper policies
- [ ] Deploy edge functions
- [ ] Configure webhook URLs in order system
- [ ] Set up print-on-demand provider integration
- [ ] Test end-to-end flow
- [ ] Monitor error rates and performance

## Future Enhancements

### Planned Features
1. **QR Analytics**: Track scans, locations, devices
2. **Batch QR Generation**: Create multiple QR codes at once
3. **Advanced Styling**: Patterns, shapes, animations
4. **Social Integration**: Share QR codes on social media
5. **White Label**: Custom branding for QR codes

### Technical Improvements
1. **Client-Side Generation**: Reduce server load
2. **Vector Formats**: SVG support for better scaling
3. **Template System**: Pre-designed QR templates
4. **A/B Testing**: Test different QR styles for conversion
5. **Integration APIs**: Third-party QR generation services

This implementation provides a complete, production-ready QR code customization system that seamlessly integrates with the existing phygital commerce platform.