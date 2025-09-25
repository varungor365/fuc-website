import { NextRequest, NextResponse } from 'next/server';
import { createQuickMockup, createMockup, MockupOptions } from '@/lib/mockup';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const template = searchParams.get('template') || 'tshirt-front';

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Generate quick mockup using default positions
    const mockupBuffer = await createQuickMockup(userId, template);

    // Return the image
    return new NextResponse(mockupBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('QR Code mockup generation error:', error);
    return NextResponse.json({ error: 'Failed to create QR code mockup' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, template, qrPosition, qrStyle } = body;

    if (!userId || !template || !qrPosition) {
      return NextResponse.json(
        { error: 'userId, template, and qrPosition are required' },
        { status: 400 }
      );
    }

    const profileUrl = `https://fashun.co.in/profile/${userId}`;

    const mockupOptions: MockupOptions = {
      template,
      qrPosition,
      qrStyle
    };

    // Generate custom mockup
    const mockupBuffer = await createMockup(profileUrl, mockupOptions);

    // Return as JSON with base64 data
    const base64Image = `data:image/png;base64,${mockupBuffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      mockup: base64Image,
      metadata: {
        userId,
        template,
        qrPosition,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Custom mockup generation error:', error);
    return NextResponse.json({ error: 'Failed to create custom mockup' }, { status: 500 });
  }
}