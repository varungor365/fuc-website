import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { verifyToken } from '@/lib/auth';

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

    // Get user's links
    const links = db.prepare(`
      SELECT id, title, url, icon, order_index, is_active
      FROM links 
      WHERE user_id = ? 
      ORDER BY order_index ASC
    `).all(payload.userId);

    return NextResponse.json({ links });

  } catch (error) {
    console.error('Get links error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { title, url, icon } = await request.json();

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    // Get the next order index
    const maxOrder = db.prepare(`
      SELECT MAX(order_index) as max_order FROM links WHERE user_id = ?
    `).get(payload.userId) as { max_order: number | null };

    const nextOrder = (maxOrder?.max_order || 0) + 1;

    // Insert new link
    const result = db.prepare(`
      INSERT INTO links (user_id, title, url, icon, order_index)
      VALUES (?, ?, ?, ?, ?)
    `).run(payload.userId, title, url, icon || null, nextOrder);

    return NextResponse.json({
      message: 'Link added successfully',
      linkId: result.lastInsertRowid
    }, { status: 201 });

  } catch (error) {
    console.error('Add link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}