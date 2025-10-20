import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get this from auth/session
    const userId = request.nextUrl.searchParams.get('userId') || 'demo-user';
    const days = parseInt(request.nextUrl.searchParams.get('days') || '30');

    const analyticsService = AnalyticsService.getInstance();
    const analytics = await analyticsService.getAnalytics(userId, days);

    if (!analytics) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Error in analytics dashboard API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}