import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { generateQRCode } from '@/lib/qrcode';
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

    const { options = {} } = await request.json();
    const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile/${user.username}`;

    // Generate QR code
    const qrDataUrl = await generateQRCode(profileUrl, options);

    // Save QR code to database
    const existingQR = db.prepare('SELECT id FROM qr_codes WHERE user_id = ?')
      .get(payload.userId);

    if (existingQR) {
      db.prepare(`
        UPDATE qr_codes 
        SET qr_data_url = ?, profile_url = ?, generated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(qrDataUrl, profileUrl, payload.userId);
    } else {
      db.prepare(`
        INSERT INTO qr_codes (user_id, qr_data_url, profile_url)
        VALUES (?, ?, ?)
      `).run(payload.userId, qrDataUrl, profileUrl);
    }

    return NextResponse.json({
      qrCode: qrDataUrl,
      profileUrl
    });

  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
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

    // Get existing QR code
    const qrCode = db.prepare(`
      SELECT qr_data_url, profile_url, generated_at
      FROM qr_codes WHERE user_id = ?
    `).get(payload.userId) as any;

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json({
      qrCode: qrCode.qr_data_url,
      profileUrl: qrCode.profile_url,
      generatedAt: qrCode.generated_at
    });

  } catch (error) {
    console.error('Get QR code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}