import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { createMockup, MockupOptions } from '@/lib/mockup';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user username
    const user = db.prepare('SELECT username FROM users WHERE id = ?')
      .get(payload.userId) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { template, qrPosition, qrStyle } = await request.json();

    // Validate mockup options
    if (!template || !qrPosition) {
      return NextResponse.json(
        { error: 'Template and QR position are required' },
        { status: 400 }
      );
    }

    const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile/${user.username}`;

    const mockupOptions: MockupOptions = {
      template,
      qrPosition,
      qrStyle
    };

    // Generate mockup
    const mockupBuffer = await createMockup(profileUrl, mockupOptions);

    // Convert buffer to base64 data URL
    const mockupDataUrl = `data:image/png;base64,${mockupBuffer.toString('base64')}`;

    // Save mockup to database
    db.prepare(`
      INSERT INTO mockups (user_id, mockup_image_url, template_used, qr_position)
      VALUES (?, ?, ?, ?)
    `).run(payload.userId, mockupDataUrl, template, JSON.stringify(qrPosition));

    return NextResponse.json({
      mockup: mockupDataUrl,
      template,
      profileUrl
    });

  } catch (error) {
    console.error('Mockup generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate mockup' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user's mockups
    const mockups = db.prepare(`
      SELECT id, mockup_image_url, template_used, qr_position, created_at
      FROM mockups 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(payload.userId);

    return NextResponse.json({ mockups });

  } catch (error) {
    console.error('Get mockups error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}