import { NextRequest, NextResponse } from 'next/server';
import { saleorService } from '@/lib/saleor';

// GET /api/saleor/products - Fetch products from Saleor GraphQL
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      first: Number(searchParams.get('first')) || 12,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      collection: searchParams.get('collection') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      isAvailable: searchParams.get('isAvailable') ? searchParams.get('isAvailable') === 'true' : undefined,
      sortBy: {
        field: searchParams.get('sortField') || 'CREATED_AT',
        direction: (searchParams.get('sortDirection') as 'ASC' | 'DESC') || 'DESC'
      }
    };

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    console.log('Fetching Saleor products with params:', cleanParams);
    
    const products = await saleorService.getProducts(cleanParams);
    
    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
      params: cleanParams
    });
  } catch (error: any) {
    console.error('Saleor products API error:', error);
    
    // Return fallback data if Saleor is not available
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch products from Saleor',
      fallback: true,
      data: [
        {
          id: '1',
          name: 'Premium Streetwear Hoodie',
          slug: 'premium-streetwear-hoodie',
          description: 'High-quality streetwear hoodie crafted for ultimate comfort and style.',
          pricing: {
            priceRange: {
              start: {
                gross: {
                  amount: 2499,
                  currency: 'INR'
                }
              }
            }
          },
          thumbnail: {
            url: '/images/products/hoodies/hoodie-1-main.jpg',
            alt: 'Premium Streetwear Hoodie'
          },
          images: [
            {
              id: '1',
              url: '/images/products/hoodies/hoodie-1-main.jpg',
              alt: 'Premium Streetwear Hoodie'
            }
          ],
          category: {
            id: 'hoodies',
            name: 'Hoodies',
            slug: 'hoodies'
          },
          collections: [
            {
              id: 'streetwear',
              name: 'Streetwear Collection',
              slug: 'streetwear'
            }
          ],
          variants: [
            {
              id: 'variant-1',
              name: 'Medium',
              sku: 'HOODIE-M-001',
              pricing: {
                price: {
                  gross: {
                    amount: 2499,
                    currency: 'INR'
                  }
                }
              },
              quantityAvailable: 10
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
            value: 0.5
          },
          rating: 4.5,
          created: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Designer T-Shirt Collection',
          slug: 'designer-t-shirt-collection',
          description: 'Exclusive designer t-shirts with unique prints and premium materials.',
          pricing: {
            priceRange: {
              start: {
                gross: {
                  amount: 1299,
                  currency: 'INR'
                }
              }
            }
          },
          thumbnail: {
            url: '/images/products/t-shirts/tshirt-1-main.jpg',
            alt: 'Designer T-Shirt'
          },
          images: [
            {
              id: '2',
              url: '/images/products/t-shirts/tshirt-1-main.jpg',
              alt: 'Designer T-Shirt'
            }
          ],
          category: {
            id: 't-shirts',
            name: 'T-Shirts',
            slug: 't-shirts'
          },
          collections: [
            {
              id: 'designer',
              name: 'Designer Collection',
              slug: 'designer'
            }
          ],
          variants: [
            {
              id: 'variant-2',
              name: 'Large',
              sku: 'TSHIRT-L-002',
              pricing: {
                price: {
                  gross: {
                    amount: 1299,
                    currency: 'INR'
                  }
                }
              },
              quantityAvailable: 15
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
                  id: 'large',
                  name: 'Large',
                  slug: 'large'
                }
              ]
            }
          ],
          isAvailable: true,
          availableForPurchase: new Date().toISOString(),
          weight: {
            unit: 'kg',
            value: 0.2
          },
          rating: 4.8,
          created: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    }, { status: 200 });
  }
}