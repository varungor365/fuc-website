import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BYTEZ_API_KEY = '6eebd9e3131d9feb9215cf2e6818b394';

export async function POST(request: NextRequest) {
  try {
    const { userPhoto, tshirtDesign } = await request.json();

    try {
      const response = await fetch('https://api.bytez.com/v1/image/edit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BYTEZ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: userPhoto,
          prompt: 'Replace the shirt with this custom design',
          mask: tshirtDesign,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          image: data.output || userPhoto,
        });
      }
    } catch (apiError) {
      console.log('Bytez API unavailable, using fallback');
    }

    return NextResponse.json({
      success: true,
      image: userPhoto,
      message: 'Preview mode - AI processing unavailable'
    });
  } catch (error) {
    console.error('Virtual try-on error:', error);
    return NextResponse.json(
      { success: false, error: 'Processing failed' },
      { status: 500 }
    );
  }
}
