import { NextRequest, NextResponse } from 'next/server';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || 'KJWWcdUA07x2yLwj7s8KnYb5w6OfkRMxY9HCxpsVAJZY8uEisULVeXIy';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'fashion';
    const per_page = searchParams.get('per_page') || '15';
    const orientation = searchParams.get('orientation') || 'landscape';

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${per_page}&orientation=${orientation}`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      photos: data.photos || [],
      total_results: data.total_results || 0,
      page: data.page || 1,
      per_page: data.per_page || 15,
      next_page: data.next_page || null
    });

  } catch (error: any) {
    console.error('Pexels API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch from Pexels API',
      photos: []
    }, { status: 500 });
  }
}