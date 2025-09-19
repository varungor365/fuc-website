// Product stock API endpoint
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const productId = params.id

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // In production, fetch from your Strapi backend or database
    const stock = await fetchProductStock(productId)

    if (stock === null) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      productId,
      stock,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Product stock API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product stock' },
      { status: 500 }
    )
  }
}

async function fetchProductStock(productId: string): Promise<number | null> {
  try {
    // Try to fetch from Strapi first
    const strapiUrl = process.env.STRAPI_URL
    const strapiToken = process.env.STRAPI_API_TOKEN

    if (strapiUrl && strapiToken) {
      const response = await fetch(`${strapiUrl}/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${strapiToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        return data.data?.attributes?.stock || 0
      }
    }

    // Fallback to mock data if Strapi is not available
    return generateMockStock(productId)

  } catch (error) {
    console.error('Error fetching product stock:', error)
    // Return mock data as fallback
    return generateMockStock(productId)
  }
}

function generateMockStock(productId: string): number {
  // Generate consistent mock stock based on product ID
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  // Generate stock between 0-50 based on hash
  const stock = hash % 51
  
  // Add some randomness while keeping it consistent
  const variation = (hash * 7) % 10
  
  return Math.max(0, stock + variation - 5)
}
