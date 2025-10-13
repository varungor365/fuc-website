import { NextRequest, NextResponse } from 'next/server';

// Mock AI recommendation data
const mockRecommendations = [
  {
    id: '1',
    title: 'AI-Recommended Urban Hoodie',
    price: 2999,
    originalPrice: 3999,
    image: 'https://source.unsplash.com/400x500/?hoodie,streetwear,urban',
    confidence: 95,
    reason: 'Based on your style preferences and recent purchases',
    tags: ['ai-recommended', 'trending', 'perfect-match']
  },
  {
    id: '2',
    title: 'Smart Style T-Shirt',
    price: 1299,
    originalPrice: 1699,
    image: 'https://source.unsplash.com/400x500/?tshirt,fashion,casual',
    confidence: 88,
    reason: 'Customers with similar taste also loved this',
    tags: ['ai-curated', 'popular']
  },
  {
    id: '3',
    title: 'Tech-Savvy Jacket',
    price: 4999,
    originalPrice: 6499,
    image: 'https://source.unsplash.com/400x500/?jacket,tech,modern',
    confidence: 92,
    reason: 'Perfect for your lifestyle and climate',
    tags: ['weather-optimized', 'lifestyle-match']
  }
];

export async function POST(request: NextRequest) {
  try {
    const { userId, preferences, limit = 10 } = await request.json();

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, this would call actual AI services like:
    // - OpenAI for natural language processing
    // - Custom ML models for recommendation
    // - User behavior analysis
    // - Style matching algorithms

    const recommendations = mockRecommendations
      .slice(0, limit)
      .map(item => ({
        ...item,
        // Add some randomization to simulate AI processing
        confidence: Math.max(75, item.confidence + Math.random() * 10 - 5),
        image: `${item.image}&sig=${Math.random()}` // Ensure unique images
      }));

    return NextResponse.json({
      success: true,
      recommendations,
      metadata: {
        userId,
        processedAt: new Date().toISOString(),
        algorithm: 'collaborative-filtering-v2',
        confidence: 'high'
      }
    });

  } catch (error) {
    console.error('AI Recommendations error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate recommendations',
        recommendations: mockRecommendations.slice(0, 3) // Fallback data
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return sample recommendations without user-specific data
  return NextResponse.json({
    success: true,
    recommendations: mockRecommendations,
    metadata: {
      algorithm: 'trending-products',
      confidence: 'medium'
    }
  });
}