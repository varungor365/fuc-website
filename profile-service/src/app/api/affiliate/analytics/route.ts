/**
 * Affiliate Analytics API Route
 * GET /api/affiliate/analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { AffiliateAnalyticsService } from '@/lib/affiliate';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`📊 [Affiliate Analytics] Fetching analytics for user: ${userId}`);

    // Get affiliate ID from user ID
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (affiliateError || !affiliate) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      );
    }

    const analyticsService = AffiliateAnalyticsService.getInstance();
    const analytics = await analyticsService.getPerformanceAnalytics(affiliate.id, days);

    if (!analytics) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('❌ [Affiliate Analytics] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}