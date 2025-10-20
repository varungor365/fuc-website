/**
 * Affiliate Dashboard API Route
 * GET /api/affiliate/dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { AffiliateService } from '@/lib/affiliate';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`🤝 [Affiliate API] Fetching dashboard for user: ${userId}`);

    const affiliateService = AffiliateService.getInstance();
    const dashboardData = await affiliateService.getAffiliateDashboard(userId);

    if (!dashboardData) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('❌ [Affiliate API] Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, programId } = await request.json();

    if (!userId || !programId) {
      return NextResponse.json(
        { error: 'User ID and Program ID are required' },
        { status: 400 }
      );
    }

    console.log(`🤝 [Affiliate API] Creating affiliate for user: ${userId}`);

    const affiliateService = AffiliateService.getInstance();
    const affiliateId = await affiliateService.createAffiliate(userId, programId);

    if (!affiliateId) {
      return NextResponse.json(
        { error: 'Failed to create affiliate' },
        { status: 500 }
      );
    }

    // Fetch the newly created affiliate data
    const dashboardData = await affiliateService.getAffiliateDashboard(userId);

    return NextResponse.json({
      success: true,
      affiliateId,
      dashboard: dashboardData
    });

  } catch (error) {
    console.error('❌ [Affiliate API] Creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}