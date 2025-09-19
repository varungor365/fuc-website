import { NextRequest, NextResponse } from 'next/server';
import AISearchService from '@/lib/ai-search';

const searchService = new AISearchService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: []
      });
    }

    const suggestions = await searchService.getAutoCompleteSuggestions(query);

    return NextResponse.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Autocomplete API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        suggestions: [] 
      },
      { status: 500 }
    );
  }
}