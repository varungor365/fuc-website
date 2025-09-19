import { NextRequest, NextResponse } from 'next/server';
import AISearchService from '@/lib/ai-search';
import strapiService from '@/lib/strapi';

// Initialize search service
const searchService = new AISearchService();
let isInitialized = false;

async function initializeSearchService() {
  if (!isInitialized) {
    try {
      // Get products from Strapi or use fallback data
      let products = [];
      try {
        const response = await strapiService.getProducts({ pagination: { page: 1, pageSize: 100 } });
        products = strapiService.transformProducts(response);
      } catch (error) {
        console.warn('Using fallback products for search:', error);
        // Use fallback products if Strapi is unavailable
        products = [
          {
            id: 1,
            name: 'Oversized Graphic Hoodie',
            description: 'Comfortable oversized hoodie with unique graphic design',
            category: 'hoodies',
            price: 2999,
            colors: ['black', 'white', 'grey'],
            materials: ['cotton'],
            tags: ['streetwear', 'casual', 'graphic'],
            variants: [
              { size: 'S', color: 'Black', stock: 10 },
              { size: 'M', color: 'Black', stock: 15 },
              { size: 'L', color: 'Black', stock: 12 }
            ],
            inStock: true,
            popularity: 95,
            createdAt: '2024-01-01'
          },
          {
            id: 2,
            name: 'Minimalist T-Shirt',
            description: 'Clean, minimalist design t-shirt made from premium cotton',
            category: 'tshirts',
            price: 1299,
            colors: ['white', 'black', 'navy'],
            materials: ['cotton'],
            tags: ['basic', 'minimal', 'essential'],
            variants: [
              { size: 'S', color: 'White', stock: 20 },
              { size: 'M', color: 'White', stock: 25 }
            ],
            inStock: true,
            popularity: 88,
            createdAt: '2024-01-02'
          }
        ];
      }
      
      await searchService.initialize(products);
      isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize search service:', error);
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    await initializeSearchService();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean);
    const colors = searchParams.get('colors')?.split(',').filter(Boolean);
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'relevance';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json({ 
        error: 'Query parameter is required' 
      }, { status: 400 });
    }

    const filters: any = {};

    if (category) {
      filters.category = [category];
    }

    if (minPrice || maxPrice) {
      filters.priceRange = [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : Infinity
      ];
    }

    if (sizes?.length) {
      filters.sizes = sizes;
    }

    if (colors?.length) {
      filters.colors = colors;
    }

    if (inStock !== null) {
      filters.inStock = inStock === 'true';
    }

    const results = await searchService.search({
      query,
      filters,
      sort: sort as any,
      limit
    });

    return NextResponse.json({
      success: true,
      ...results
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Search service temporarily unavailable',
        results: [],
        suggestions: [],
        totalCount: 0,
        appliedFilters: {}
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeSearchService();

    const body = await request.json();
    const { query, filters = {}, sort = 'relevance', limit = 20 } = body;

    if (!query) {
      return NextResponse.json({ 
        error: 'Query is required' 
      }, { status: 400 });
    }

    const results = await searchService.search({
      query,
      filters,
      sort,
      limit
    });

    return NextResponse.json({
      success: true,
      ...results
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Search service temporarily unavailable' 
      },
      { status: 500 }
    );
  }
}