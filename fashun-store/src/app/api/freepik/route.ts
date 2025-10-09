/**
 * Freepik API Route Handler
 * Server-side endpoint for Freepik API requests
 */

import { NextRequest, NextResponse } from 'next/server';

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY || 'FPSX231f0a23b48d96bd0d59894cfe7d8117';
const FREEPIK_BASE_URL = 'https://api.freepik.com/v1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const order = searchParams.get('order') || 'relevance';
    const type = searchParams.get('type') || 'photo';
    const orientation = searchParams.get('orientation');
    const premium = searchParams.get('premium') || 'false';

    if (!term) {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    // Build Freepik API URL with proper filters structure
    const freepikUrl = new URL(`${FREEPIK_BASE_URL}/resources`);
    freepikUrl.searchParams.append('term', term);
    freepikUrl.searchParams.append('page', page);
    freepikUrl.searchParams.append('limit', limit);
    freepikUrl.searchParams.append('order', order);
    freepikUrl.searchParams.append('filters[type]', type);
    freepikUrl.searchParams.append('filters[premium]', premium);
    
    // Fix: Freepik API expects orientation as array format
    if (orientation) {
      freepikUrl.searchParams.append('filters[orientation][]', orientation);
    }

    const response = await fetch(freepikUrl.toString(), {
      method: 'GET',
      headers: {
        'x-freepik-api-key': FREEPIK_API_KEY,
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Log the error for debugging
      const errorText = await response.text();
      console.error('Freepik API Error:', response.status, errorText);
      
      // Return fallback data
      return NextResponse.json({
        data: [],
        meta: {
          per_page: parseInt(limit),
          total: 0,
          last_page: 1,
          current_page: parseInt(page),
          clean_search: true
        },
        fallback: true,
        error: `Freepik API error: ${response.status}`
      });
    }

    const data = await response.json();
    
    // Add fallback URLs for each resource
    const processedData = {
      ...data,
      data: data.data.map((resource: any) => ({
        ...resource,
        fallbackUrl: `https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&q=${encodeURIComponent(term)}`
      }))
    };

    return NextResponse.json(processedData);

  } catch (error) {
    console.error('Server error in Freepik API route:', error);
    
    // Return fallback response
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term') || 'fashion';
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const fallbackData = Array.from({ length: limit }, (_, i) => ({
      id: `fallback-${i}`,
      title: `${term} image ${i + 1}`,
      url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=800&h=600&fit=crop&q=${encodeURIComponent(term)}`,
      preview: {
        url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=400&h=300&fit=crop&q=${encodeURIComponent(term)}`,
        width: 400,
        height: 300
      },
      thumbnails: {
        small: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=200&h=150&fit=crop&q=${encodeURIComponent(term)}`,
        medium: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=400&h=300&fit=crop&q=${encodeURIComponent(term)}`,
        large: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=800&h=600&fit=crop&q=${encodeURIComponent(term)}`
      },
      type: 'photo',
      tags: [term, 'fashion', 'style'],
      premium: false,
      fallback: true
    }));

    return NextResponse.json({
      data: fallbackData,
      meta: {
        per_page: limit,
        total: limit,
        last_page: 1,
        current_page: 1,
        clean_search: true
      },
      fallback: true,
      error: 'Freepik API unavailable, using fallback images'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'fashion-images':
        return await handleFashionImages(params);
      case 'image-gallery':
        return await handleImageGallery(params);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('POST error in Freepik API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleFashionImages({ category = 'streetwear', limit = 10 }) {
  const searchTerms = {
    streetwear: 'urban streetwear fashion clothing',
    tshirts: 't-shirt mockup template fashion',
    hoodies: 'hoodie sweatshirt urban fashion',
    jackets: 'jacket bomber fashion outerwear',
    accessories: 'fashion accessories cap bag',
    model: 'fashion model portrait lifestyle',
    lifestyle: 'young person lifestyle urban'
  };

  const term = searchTerms[category as keyof typeof searchTerms] || category;
  
  // Use the GET handler internally
  const url = new URL('http://localhost:3001/api/freepik');
  url.searchParams.append('term', term);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('type', 'photo');
  url.searchParams.append('orientation', 'vertical');
  url.searchParams.append('premium', 'false');

  const mockRequest = new NextRequest(url);
  return await GET(mockRequest);
}

async function handleImageGallery({ searchTerm, count = 6 }) {
  const url = new URL('http://localhost:3001/api/freepik');
  url.searchParams.append('term', searchTerm);
  url.searchParams.append('limit', count.toString());
  url.searchParams.append('type', 'photo');
  url.searchParams.append('premium', 'false');

  const mockRequest = new NextRequest(url);
  return await GET(mockRequest);
}