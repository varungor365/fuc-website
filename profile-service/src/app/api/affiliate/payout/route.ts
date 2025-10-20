/**
 * Affiliate Payout API Route
 * POST /api/affiliate/payout
 */

import { NextRequest, NextResponse } from 'next/server';
import { AffiliateService } from '@/lib/affiliate';

export async function POST(request: NextRequest) {
  try {
    const { 
      affiliateId, 
      amount, 
      paymentMethod, 
      paymentDetails 
    } = await request.json();

    if (!affiliateId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Affiliate ID, amount, and payment method are required' },
        { status: 400 }
      );
    }

    if (amount < 50) {
      return NextResponse.json(
        { error: 'Minimum payout amount is $50' },
        { status: 400 }
      );
    }

    console.log(`💸 [Affiliate Payout] Processing payout request: $${amount}`);

    const affiliateService = AffiliateService.getInstance();
    const success = await affiliateService.requestPayout(
      affiliateId,
      amount,
      paymentMethod,
      paymentDetails
    );

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Payout request submitted successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to process payout request' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ [Affiliate Payout] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}