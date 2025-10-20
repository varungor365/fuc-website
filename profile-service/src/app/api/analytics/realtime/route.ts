import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get this from auth/session
    const userId = request.nextUrl.searchParams.get('userId') || 'demo-user';

    const analyticsService = AnalyticsService.getInstance();
    const realtimeStats = await analyticsService.getRealtimeStats(userId);

    if (!realtimeStats) {
      return NextResponse.json(
        { error: 'Failed to fetch realtime stats' },
        { status: 500 }
      );
    }

    return NextResponse.json(realtimeStats);

  } catch (error) {
    console.error('Error in analytics realtime API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}