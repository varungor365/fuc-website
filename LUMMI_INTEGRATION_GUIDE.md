# 🎨 Lummi AI Image Integration Guide

## Overview
Lummi provides high-quality AI-generated images perfect for e-commerce product displays, banners, and marketing materials.

## API Credentials
- **API Key:** `lummi-1bc82d8fc0f41b797d8c217dce23b989b598d9a30c36d94e12f23a2abec4978e`
- **Rate Limit:** 10 requests/minute (upgradeable to 100 req/min)
- **Documentation:** https://docs.lummi.ai

## Quick Start

### 1. Access Lummi Admin Panel
Navigate to: **https://fashun.co.in/admin/lummi**

### 2. Search for Images
- Enter search terms like "fashion model", "streetwear", "hoodie"
- Click "Search" or use quick search buttons
- Browse results in grid view

### 3. Use Images
- Hover over any image
- Click "Copy URL" to get the image link
- Use the URL in your products or content
- Attribution is automatically included

## Integration Methods

### Method 1: Direct URL Usage
Copy image URLs from admin panel and use directly:

```typescript
<Image 
  src="https://lummi.ai/images/abc123.jpg"
  alt="Product image"
  width={800}
  height={1000}
/>
```

### Method 2: Programmatic Search
Use the Lummi library in your code:

```typescript
import { searchLummiImages } from '@/lib/lummi';

const images = await searchLummiImages({
  query: 'streetwear fashion',
  perPage: 20,
  orientation: 'portrait'
});
```

### Method 3: Component Usage
Use the pre-built component with attribution:

```typescript
import { LummiAttribution } from '@/lib/lummi';

<div>
  <Image src={image.url} alt={image.alt} />
  <LummiAttribution image={image} />
</div>
```

## API Functions

### searchLummiImages()
Search for images with filters:

```typescript
const images = await searchLummiImages({
  query: 'fashion',           // Required: search term
  page: 1,                    // Optional: page number
  perPage: 20,                // Optional: results per page
  orientation: 'portrait',    // Optional: landscape, portrait, square
  color: '#FF0000'           // Optional: dominant color
});
```

### getLummiImage()
Get a specific image by ID:

```typescript
const image = await getLummiImage('image-id-123');
```

### getLummiCollections()
Get curated collections:

```typescript
const collections = await getLummiCollections();
```

## Attribution Requirements

**IMPORTANT:** You MUST include attribution when using Lummi images.

### Automatic Attribution
The `LummiAttribution` component handles this automatically:

```typescript
<LummiAttribution image={image} />
```

### Manual Attribution
If not using the component, include:

```html
<div class="text-xs text-gray-500">
  Photo by <a href="{image.user.attributionUrl}">{image.user.name}</a>
  on <a href="{image.attributionUrl}">Lummi</a>
</div>
```

## Best Practices

### 1. Search Terms
Use specific, descriptive terms:
- ✅ "urban streetwear model"
- ✅ "black hoodie lifestyle"
- ❌ "clothes"
- ❌ "fashion"

### 2. Image Selection
- Choose high-resolution images (1000px+)
- Match your brand aesthetic
- Consider mobile display
- Test loading times

### 3. Rate Limiting
- Current limit: 10 requests/minute
- Cache search results
- Use pagination wisely
- Upgrade if needed: [Apply here](https://lummi.ai/upgrade)

### 4. Performance
```typescript
// Cache results
const cachedImages = localStorage.getItem('lummi_cache');

// Lazy load images
<Image loading="lazy" src={image.url} />

// Use thumbnails for previews
<Image src={image.thumbnailUrl} />
```

## Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_LUMMI_API_KEY=lummi-1bc82d8fc0f41b797d8c217dce23b989b598d9a30c36d94e12f23a2abec4978e
```

## Common Use Cases

### 1. Product Images
```typescript
// Search for product-specific images
const productImages = await searchLummiImages({
  query: `${productCategory} ${productStyle}`,
  orientation: 'portrait',
  perPage: 10
});
```

### 2. Hero Banners
```typescript
// Get landscape images for banners
const banners = await searchLummiImages({
  query: 'fashion lifestyle',
  orientation: 'landscape',
  perPage: 5
});
```

### 3. Category Pages
```typescript
// Get category-specific images
const categoryImages = await searchLummiImages({
  query: `${categoryName} collection`,
  perPage: 12
});
```

## Troubleshooting

### Issue: "API Key Invalid"
**Solution:** Check that your API key is correctly set in environment variables.

### Issue: "Rate Limit Exceeded"
**Solution:** 
- Wait 1 minute before next request
- Implement caching
- Apply for higher limits

### Issue: "No Results Found"
**Solution:**
- Try broader search terms
- Check spelling
- Use English terms
- Try synonyms

### Issue: "Images Not Loading"
**Solution:**
- Verify URL is correct
- Check network connection
- Ensure attribution is included
- Use hotlinked URLs only

## API Response Example

```json
{
  "images": [
    {
      "id": "abc123",
      "url": "https://lummi.ai/images/abc123.jpg",
      "thumbnailUrl": "https://lummi.ai/thumbnails/abc123.jpg",
      "width": 1920,
      "height": 1080,
      "alt": "Fashion model in streetwear",
      "attributionUrl": "https://lummi.ai/photos/abc123",
      "user": {
        "name": "Lummi AI",
        "url": "https://lummi.ai/users/lummi",
        "attributionUrl": "https://lummi.ai/users/lummi"
      }
    }
  ]
}
```

## Upgrade Options

### Current Plan: Free
- 10 requests/minute
- Full image library access
- Commercial use allowed

### Pro Plan: 100 req/min
Apply here: https://lummi.ai/upgrade

Fill out the form with:
- Your website: fashun.co.in
- Use case: E-commerce product images
- Expected usage: High-traffic fashion website

## Support

### Lummi Support
- Email: support@lummi.ai
- Documentation: https://docs.lummi.ai
- Status: https://status.lummi.ai

### Implementation Help
- Check `/admin/lummi` for live examples
- Review `/lib/lummi.ts` for code reference
- Test in development before production

## Quick Reference

| Feature | Endpoint | Method |
|---------|----------|--------|
| Search Images | `/v1/search` | GET |
| Get Image | `/v1/images/:id` | GET |
| Collections | `/v1/collections` | GET |

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Search term |
| page | number | No | Page number (default: 1) |
| per_page | number | No | Results per page (default: 20) |
| orientation | string | No | landscape, portrait, square |
| color | string | No | Hex color code |

## Examples in Your Codebase

### Admin Panel
Location: `/admin/lummi`
- Search interface
- Image preview
- Copy URL functionality
- Attribution display

### Library Functions
Location: `/lib/lummi.ts`
- API integration
- Type definitions
- Helper functions
- Attribution component

### Usage Example
Location: `/components/home/InstagramFeed.tsx`
- Can be adapted to use Lummi images
- Replace Instagram API calls
- Add Lummi attribution

## Next Steps

1. ✅ API integrated and ready
2. ✅ Admin panel created
3. ✅ Documentation complete
4. 🔄 Start using images in products
5. 🔄 Replace placeholder images
6. 🔄 Test attribution display
7. 🔄 Monitor rate limits
8. 🔄 Apply for upgrade if needed

---

**Ready to use!** Visit https://fashun.co.in/admin/lummi to start searching for images.
