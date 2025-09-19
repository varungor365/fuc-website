import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'
import strapiService from '@/lib/strapi'

// Helper function to get product data from Strapi
async function getProduct(id: string) {
  try {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) return null;
    
    const response = await strapiService.getProduct(productId);
    if (!response.data) return null;
    
    return strapiService.transformProduct(response.data);
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Return fallback product during build if Strapi is unavailable
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      return getFallbackProduct(id);
    }
    
    return null;
  }
}

// Generate static params for all products
export async function generateStaticParams() {
  try {
    const response = await strapiService.getProducts({
      pagination: { page: 1, pageSize: 100 },
      populate: ['slug']
    });
    
    return response.data?.map((product: any) => ({
      id: product.attributes.slug || product.id.toString(),
    })) || [];
  } catch (error) {
    console.error('Error generating static params:', error);
    
    // Return fallback product IDs when Strapi is unavailable
    return [
      { id: 'oversized-graphic-hoodie' },
      { id: 'minimalist-t-shirt' },
      { id: 'classic-denim-jacket' },
      { id: 'distressed-denim-jeans' },
      { id: 'platform-sneakers' },
      { id: 'designer-leather-jacket' },
      { id: 'vintage-band-tee' },
      { id: 'streetwear-joggers' }
    ];
  }
}

const sizeGuide = {
  hoodies: [
    { size: 'S', chest: '44"', length: '25"', sleeve: '22"' },
    { size: 'M', chest: '46"', length: '26"', sleeve: '23"' },
    { size: 'L', chest: '48"', length: '27"', sleeve: '24"' },
    { size: 'XL', chest: '50"', length: '28"', sleeve: '25"' },
    { size: 'XXL', chest: '52"', length: '29"', sleeve: '26"' }
  ],
  tshirts: [
    { size: 'S', chest: '38"', length: '26"', sleeve: '8"' },
    { size: 'M', chest: '40"', length: '27"', sleeve: '8.5"' },
    { size: 'L', chest: '42"', length: '28"', sleeve: '9"' },
    { size: 'XL', chest: '44"', length: '29"', sleeve: '9.5"' },
    { size: 'XXL', chest: '46"', length: '30"', sleeve: '10"' }
  ],
  default: [
    { size: 'S', chest: '38-40"', length: '26-27"' },
    { size: 'M', chest: '40-42"', length: '27-28"' },
    { size: 'L', chest: '42-44"', length: '28-29"' },
    { size: 'XL', chest: '44-46"', length: '29-30"' },
    { size: 'XXL', chest: '46-48"', length: '30-31"' }
  ]
}

// Server component for data fetching
export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Try to fetch by slug first, then by ID
  let product = await getProduct(id);
  
  if (!product) {
    // Try fetching by slug
    try {
      const response = await strapiService.getProductBySlug(id);
      if (response.data?.[0]) {
        product = strapiService.transformProduct(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      
      // Use fallback product data if Strapi is unavailable during build
      if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
        product = getFallbackProduct(id);
      }
    }
  }

  // Handle product not found
  if (!product) {
    notFound()
  }

  // Get related products from same category
  let relatedProducts: any[] = [];
  try {
    const response = await strapiService.getProductsByCategory(product.categorySlug, {
      pagination: { page: 1, pageSize: 4 },
      filters: { id: { $ne: product.id } }
    });
    relatedProducts = strapiService.transformProducts(response).map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.images?.[0]?.url
    }));
  } catch (error) {
    console.error('Error fetching related products:', error);
    // Use empty array as fallback for related products
    relatedProducts = [];
  }

  // Pass data to client component for interactivity
  return (
    <ProductClient 
      product={product} 
      sizeGuide={sizeGuide} 
      relatedProducts={relatedProducts} 
    />
  )
}

// Fallback product data for when Strapi is unavailable
function getFallbackProduct(id: string) {
  const fallbackProducts = {
    'oversized-graphic-hoodie': {
      id: 1,
      name: 'Oversized Graphic Hoodie',
      slug: 'oversized-graphic-hoodie',
      description: 'Comfortable oversized hoodie with unique graphic design perfect for street style.',
      price: 2999,
      discountedPrice: null,
      categorySlug: 'hoodies',
      category: 'Hoodies',
      variants: [
        { id: '1-s', size: 'S', color: 'Black', stock: 10, sku: 'OGH-BLK-S' },
        { id: '1-m', size: 'M', color: 'Black', stock: 15, sku: 'OGH-BLK-M' },
        { id: '1-l', size: 'L', color: 'Black', stock: 12, sku: 'OGH-BLK-L' }
      ],
      images: [
        { url: '/api/placeholder/600/800', alt: 'Oversized Graphic Hoodie - Black' }
      ],
      inStock: true,
      isPopular: true,
      createdAt: new Date().toISOString()
    },
    'minimalist-t-shirt': {
      id: 2,
      name: 'Minimalist T-Shirt',
      slug: 'minimalist-t-shirt',
      description: 'Clean, minimalist design t-shirt made from premium cotton.',
      price: 1299,
      discountedPrice: null,
      categorySlug: 'tshirts',
      category: 'T-Shirts',
      variants: [
        { id: '2-s', size: 'S', color: 'White', stock: 20, sku: 'MT-WHT-S' },
        { id: '2-m', size: 'M', color: 'White', stock: 25, sku: 'MT-WHT-M' }
      ],
      images: [
        { url: '/api/placeholder/600/800', alt: 'Minimalist T-Shirt - White' }
      ],
      inStock: true,
      isPopular: false,
      createdAt: new Date().toISOString()
    },
    'classic-denim-jacket': {
      id: 3,
      name: 'Classic Denim Jacket',
      slug: 'classic-denim-jacket',
      description: 'Timeless denim jacket with modern fit and premium materials.',
      price: 3999,
      discountedPrice: null,
      categorySlug: 'jackets',
      category: 'Jackets',
      variants: [
        { id: '3-m', size: 'M', color: 'Blue', stock: 8, sku: 'CDJ-BLU-M' },
        { id: '3-l', size: 'L', color: 'Blue', stock: 10, sku: 'CDJ-BLU-L' }
      ],
      images: [
        { url: '/api/placeholder/600/800', alt: 'Classic Denim Jacket - Blue' }
      ],
      inStock: true,
      isPopular: true,
      createdAt: new Date().toISOString()
    }
  };

  return fallbackProducts[id as keyof typeof fallbackProducts] || null;
}
