import { NextRequest, NextResponse } from 'next/server';

// GET /api/saleor/collections - Fetch collections from Saleor
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const first = Number(searchParams.get('first')) || 20;

    console.log('Fetching Saleor collections:', { first });
    
    // Using fallback data
    const collections: any[] = [];
    
    return NextResponse.json({
      success: true,
      data: collections,
      total: collections.length
    });
  } catch (error: any) {
    console.error('Saleor collections API error:', error);
    
    // Return fallback collections if Saleor is not available
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch collections from Saleor',
      fallback: true,
      data: [
        {
          id: 'featured',
          name: 'Featured Collection',
          slug: 'featured',
          description: 'Our handpicked selection of the best streetwear pieces',
          seoTitle: 'Featured Streetwear - FASHUN.CO.IN',
          seoDescription: 'Discover our featured collection of premium streetwear and urban fashion.',
          backgroundImage: {
            url: '/images/collections/featured.jpg',
            alt: 'Featured Collection'
          },
          products: {
            totalCount: 20
          }
        },
        {
          id: 'new-arrivals',
          name: 'New Arrivals',
          slug: 'new-arrivals',
          description: 'Latest additions to our streetwear collection',
          seoTitle: 'New Arrivals - FASHUN.CO.IN',
          seoDescription: 'Check out the latest streetwear arrivals and stay ahead of fashion trends.',
          backgroundImage: {
            url: '/images/collections/new-arrivals.jpg',
            alt: 'New Arrivals Collection'
          },
          products: {
            totalCount: 15
          }
        },
        {
          id: 'best-sellers',
          name: 'Best Sellers',
          slug: 'best-sellers',
          description: 'Our most popular streetwear items',
          seoTitle: 'Best Selling Streetwear - FASHUN.CO.IN',
          seoDescription: 'Shop our best-selling streetwear items loved by our community.',
          backgroundImage: {
            url: '/images/collections/best-sellers.jpg',
            alt: 'Best Sellers Collection'
          },
          products: {
            totalCount: 18
          }
        },
        {
          id: 'limited-edition',
          name: 'Limited Edition',
          slug: 'limited-edition',
          description: 'Exclusive limited edition streetwear pieces',
          seoTitle: 'Limited Edition - FASHUN.CO.IN',
          seoDescription: 'Exclusive limited edition streetwear pieces for the discerning fashion enthusiast.',
          backgroundImage: {
            url: '/images/collections/limited-edition.jpg',
            alt: 'Limited Edition Collection'
          },
          products: {
            totalCount: 8
          }
        }
      ]
    }, { status: 200 });
  }
}