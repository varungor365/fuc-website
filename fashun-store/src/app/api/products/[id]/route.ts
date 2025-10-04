import { NextRequest, NextResponse } from 'next/server'
import { fetchProductById, transformStrapiProduct } from '@/lib/strapi-client'
import { products } from '@/data/products'

// Enable ISR caching for individual products (5 minutes)
export const revalidate = 300

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  
  try {
    console.log(`Fetching product ${id} from Strapi API...`)
    
    // Fetch from Strapi
    const strapiResponse = await fetchProductById(id)
    
    if (!strapiResponse.data) {
      // Product not found in Strapi, try fallback
      const mockProduct = products.find(p => p.id === id)
      if (mockProduct) {
        console.log(`Product ${id} not found in Strapi, using fallback data`)
        return NextResponse.json({
          data: mockProduct,
          meta: { source: 'fallback' }
        })
      }
      
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Transform product
    const product = transformStrapiProduct(strapiResponse.data)
    
    console.log(`Successfully fetched product ${id} from Strapi`)
    
    return NextResponse.json({ 
      data: product,
      meta: { source: 'strapi' }
    })
  } catch (error) {
    console.error(`API route error for product ${id}:`, error)
    
    // Fallback to mock data
    const mockProduct = products.find(p => p.id === id)
    if (mockProduct) {
      console.log(`Using fallback data for product ${id}`)
      return NextResponse.json({
        data: mockProduct,
        meta: { 
          source: 'fallback',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Product not found',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 404 }
    )
  }
}