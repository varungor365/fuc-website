import { Product } from '@/data/products'

// Configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

/**
 * Basic fetch wrapper for Strapi API calls
 * Uses native fetch API with proper error handling
 */
async function fetchFromStrapi(endpoint: string, options = {}) {
  const url = `${STRAPI_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  }

  try {
    const response = await fetch(url, { 
      ...options, 
      headers: { ...headers, ...(options as any).headers }
    })
    
    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Strapi fetch error:', error)
    throw error
  }
}

/**
 * Transform Strapi v4 response format to our Product interface
 * Handles both single item and array responses
 */
function transformStrapiProduct(strapiData: any): Product {
  // Strapi v4 format: { id, attributes: {...} }
  const attrs = strapiData.attributes || strapiData
  const id = strapiData.id || attrs.id

  return {
    id: String(id),
    name: attrs.name || '',
    description: attrs.description || '',
    price: attrs.price || 0,
    originalPrice: attrs.originalPrice || undefined,
    images: transformStrapiImages(attrs.images),
    category: attrs.category || '',
    subcategory: attrs.subcategory || undefined,
    sizes: attrs.sizes?.map((s: any) => s.name || s) || [],
    colors: attrs.colors?.map((c: any) => c.name || c) || [],
    tags: attrs.tags || [],
    isNew: attrs.isNew || false,
    isFeatured: attrs.isFeatured || attrs.isBestseller || false,
    isLimited: attrs.isLimited || false,
    inStock: attrs.inStock !== false,
    stockCount: attrs.stockCount || 0,
    sku: attrs.sku || `FASH-${id}`,
    material: attrs.material || undefined,
    fit: attrs.fit || undefined,
    rating: attrs.rating || 0,
    reviewCount: attrs.reviewsCount || attrs.reviews || 0,
    reviews: attrs.reviewsCount || attrs.reviews || 0,
    features: attrs.features || [],
  }
}

/**
 * Transform Strapi media format to image URLs array
 */
function transformStrapiImages(images: any): string[] {
  if (!images) return []
  
  // Handle both populated and unpopulated media fields
  const imageData = images.data || images
  if (!Array.isArray(imageData)) return []
  
  return imageData.map((img: any) => {
    const url = img.attributes?.url || img.url
    if (!url) return ''
    
    // Return full URL if already absolute, otherwise prepend Strapi URL
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
  }).filter(Boolean)
}

/**
 * Fetch all products from Strapi
 */
export async function fetchProducts(params?: {
  page?: number
  pageSize?: number
  sort?: string
  filters?: Record<string, any>
}) {
  const searchParams = new URLSearchParams()
  
  if (params?.page) searchParams.set('pagination[page]', String(params.page))
  if (params?.pageSize) searchParams.set('pagination[pageSize]', String(params.pageSize))
  if (params?.sort) searchParams.set('sort', params.sort)
  
  // Add populate for images
  searchParams.set('populate', 'images')
  
  const queryString = searchParams.toString()
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`
  
  return await fetchFromStrapi(endpoint)
}

/**
 * Fetch single product by ID from Strapi
 */
export async function fetchProductById(id: string | number) {
  const endpoint = `/api/products/${id}?populate=images`
  return await fetchFromStrapi(endpoint)
}

/**
 * Fetch products by category
 */
export async function fetchProductsByCategory(category: string, params?: {
  page?: number
  pageSize?: number
}) {
  const searchParams = new URLSearchParams()
  searchParams.set('filters[category][$eq]', category)
  searchParams.set('populate', 'images')
  
  if (params?.page) searchParams.set('pagination[page]', String(params.page))
  if (params?.pageSize) searchParams.set('pagination[pageSize]', String(params.pageSize))
  
  const endpoint = `/api/products?${searchParams.toString()}`
  return await fetchFromStrapi(endpoint)
}

/**
 * Search products by query string
 */
export async function searchProducts(query: string, params?: {
  page?: number
  pageSize?: number
}) {
  const searchParams = new URLSearchParams()
  
  // Search in name, description, brand, and tags
  searchParams.set('filters[$or][0][name][$containsi]', query)
  searchParams.set('filters[$or][1][description][$containsi]', query)
  searchParams.set('filters[$or][2][brand][$containsi]', query)
  searchParams.set('populate', 'images')
  
  if (params?.page) searchParams.set('pagination[page]', String(params.page))
  if (params?.pageSize) searchParams.set('pagination[pageSize]', String(params.pageSize))
  
  const endpoint = `/api/products?${searchParams.toString()}`
  return await fetchFromStrapi(endpoint)
}

// Export transformation functions for use in API routes
export { transformStrapiProduct, transformStrapiImages }