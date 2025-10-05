import { NextRequest, NextResponse } from 'next/server';
import { saleorService } from '@/lib/saleor';

// GET /api/saleor/products/single - Fetch a single product from Saleor
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({
        success: false,
        error: 'Product ID or slug is required'
      }, { status: 400 });
    }

    console.log('Fetching Saleor product:', { id, slug });
    
    const product = await saleorService.getProduct(id || undefined, slug || undefined);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('Saleor single product API error:', error);
    
    // Return fallback data if Saleor is not available
    const searchParams = request.nextUrl.searchParams;
    const fallbackId = searchParams.get('id') || '1';
    const fallbackSlug = searchParams.get('slug') || 'premium-streetwear-product';
    
    const fallbackProduct = {
      id: fallbackId,
      name: 'Premium Streetwear Product',
      slug: fallbackSlug,
      description: 'High-quality streetwear product crafted for ultimate comfort and style. This is fallback data while Saleor is offline.',
      pricing: {
        priceRange: {
          start: {
            gross: {
              amount: 1999,
              currency: 'INR'
            }
          }
        }
      },
      thumbnail: {
        url: '/images/products/hoodies/hoodie-1-main.jpg',
        alt: 'Premium Streetwear Product'
      },
      images: [
        {
          id: '1',
          url: '/images/products/hoodies/hoodie-1-main.jpg',
          alt: 'Premium Streetwear Product'
        }
      ],
      category: {
        id: 'streetwear',
        name: 'Streetwear',
        slug: 'streetwear'
      },
      collections: [
        {
          id: 'featured',
          name: 'Featured Collection',
          slug: 'featured'
        }
      ],
      variants: [
        {
          id: 'variant-1',
          name: 'Medium',
          sku: 'PRODUCT-M-001',
          pricing: {
            price: {
              gross: {
                amount: 1999,
                currency: 'INR'
              }
            }
          },
          quantityAvailable: 5
        }
      ],
      attributes: [
        {
          attribute: {
            id: 'size',
            name: 'Size',
            slug: 'size'
          },
          values: [
            {
              id: 'medium',
              name: 'Medium',
              slug: 'medium'
            }
          ]
        }
      ],
      isAvailable: true,
      availableForPurchase: new Date().toISOString(),
      weight: {
        unit: 'kg',
        value: 0.3
      },
      rating: 4.6,
      created: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch product from Saleor',
      fallback: true,
      data: fallbackProduct
    }, { status: 200 });
  }
}