import { NextRequest, NextResponse } from 'next/server';
import { saleorClient } from '@/lib/saleor';

// GET /api/saleor/categories - Fetch categories from Saleor
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const first = Number(searchParams.get('first')) || 20;

    console.log('Fetching Saleor categories:', { first });
    
    // Placeholder - categories query not implemented yet
    const categories: any[] = [];
    
    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length
    });
  } catch (error: any) {
    console.error('Saleor categories API error:', error);
    
    // Return fallback categories if Saleor is not available
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch categories from Saleor',
      fallback: true,
      data: [
        {
          id: 'hoodies',
          name: 'Hoodies',
          slug: 'hoodies',
          description: 'Premium streetwear hoodies for all seasons',
          seoTitle: 'Premium Hoodies - FASHUN.CO.IN',
          seoDescription: 'Shop premium quality hoodies with unique designs and comfortable fits.',
          backgroundImage: {
            url: '/images/categories/hoodies.jpg',
            alt: 'Hoodies Category'
          },
          parent: null,
          children: {
            edges: []
          },
          products: {
            totalCount: 15
          }
        },
        {
          id: 't-shirts',
          name: 'T-Shirts',
          slug: 't-shirts',
          description: 'Designer t-shirts with exclusive prints',
          seoTitle: 'Designer T-Shirts - FASHUN.CO.IN',
          seoDescription: 'Discover our collection of designer t-shirts with unique prints and premium materials.',
          backgroundImage: {
            url: '/images/categories/t-shirts.jpg',
            alt: 'T-Shirts Category'
          },
          parent: null,
          children: {
            edges: []
          },
          products: {
            totalCount: 25
          }
        },
        {
          id: 'jackets',
          name: 'Jackets',
          slug: 'jackets',
          description: 'Stylish jackets for urban fashion',
          seoTitle: 'Premium Jackets - FASHUN.CO.IN',
          seoDescription: 'Premium jackets and outerwear for the modern streetwear enthusiast.',
          backgroundImage: {
            url: '/images/categories/jackets.jpg',
            alt: 'Jackets Category'
          },
          parent: null,
          children: {
            edges: []
          },
          products: {
            totalCount: 12
          }
        },
        {
          id: 'accessories',
          name: 'Accessories',
          slug: 'accessories',
          description: 'Complete your look with premium accessories',
          seoTitle: 'Fashion Accessories - FASHUN.CO.IN',
          seoDescription: 'Premium accessories to complete your streetwear look.',
          backgroundImage: {
            url: '/images/categories/accessories.jpg',
            alt: 'Accessories Category'
          },
          parent: null,
          children: {
            edges: []
          },
          products: {
            totalCount: 8
          }
        }
      ]
    }, { status: 200 });
  }
}