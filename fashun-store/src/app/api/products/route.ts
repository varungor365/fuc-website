import { NextRequest, NextResponse } from 'next/server'
import { fetchProducts, transformStrapiProduct } from '@/lib/strapi-client'
import { products } from '@/data/products' // Fallback data

// Enable ISR caching for this route
export const revalidate = 60

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching products from Strapi API...')
    
    // Fetch from Strapi
    const strapiResponse = await fetchProducts()
    
    // Transform products
    const transformedProducts = strapiResponse.data.map(transformStrapiProduct)
    
    console.log(`Successfully fetched ${transformedProducts.length} products from Strapi`)
    
    // Return response with Strapi data
    return NextResponse.json({
      data: transformedProducts,
      meta: strapiResponse.meta || { source: 'strapi' },
    })
  } catch (error) {
    console.error('API route error:', error)
    console.log('Falling back to mock data from products.ts')
    
    // Fallback to mock data
    return NextResponse.json({
      data: products,
      meta: { 
        source: 'fallback', 
        error: error instanceof Error ? error.message : 'Unknown error',
        total: products.length 
      },
    })
  }
}