/**
 * Affiliate Referral Tracking API Route
 * GET /api/affiliate/track
 */

import { NextRequest, NextResponse } from 'next/server';
import { AffiliateService } from '@/lib/affiliate';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || 'direct';

    if (!ref) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    console.log(`👆 [Affiliate Track] Tracking referral: ${ref}`);

    const affiliateService = AffiliateService.getInstance();
    const success = await affiliateService.trackReferral(ref, {
      ip,
      userAgent,
      referrer,
      landingPage: searchParams.get('landing') || '/'
    });

    if (success) {
      // Set referral cookie for conversion tracking
      const response = NextResponse.json({ success: true, referralCode: ref });
      response.cookies.set('fashun_ref', ref, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('❌ [Affiliate Track] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      referralCode, 
      conversionType, 
      orderId, 
      orderValue, 
      userId 
    } = await request.json();

    if (!referralCode || !conversionType) {
      return NextResponse.json(
        { error: 'Referral code and conversion type are required' },
        { status: 400 }
      );
    }

    console.log(`💰 [Affiliate Track] Processing conversion: ${conversionType} for ${referralCode}`);

    const affiliateService = AffiliateService.getInstance();
    const success = await affiliateService.processConversion(
      referralCode,
      conversionType,
      orderId,
      orderValue,
      userId
    );

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Conversion tracked successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to process conversion' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ [Affiliate Track] Conversion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}