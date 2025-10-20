import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const { userId, eventType, eventData = {}, metadata = {} } = await request.json();

    if (!userId || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, eventType' },
        { status: 400 }
      );
    }

    // Get visitor metadata from request
    const requestMetadata = {
      ...metadata,
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referrer: request.headers.get('referer') || metadata.referrer || '',
      visitorId: metadata.visitorId || `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    };

    const analyticsService = AnalyticsService.getInstance();
    const success = await analyticsService.trackEvent(
      userId,
      eventType,
      eventData,
      requestMetadata
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to track analytics event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Event tracked successfully',
      visitorId: requestMetadata.visitorId
    });

  } catch (error) {
    console.error('Error in analytics track API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}