import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Cron job to revalidate product pages
 * Runs every hour via Vercel Cron
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || process.env.REVALIDATE_SECRET;
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Revalidate all product-related cache tags
    const tags = [
      'products',
      'collections',
      'cart',
      'inventory',
    ];

    for (const tag of tags) {
      revalidateTag(tag);
    }

    console.log('Product cache revalidated:', tags);

    return NextResponse.json({
      success: true,
      message: 'Product cache revalidated',
      tags,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Product revalidation cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to revalidate cache',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
