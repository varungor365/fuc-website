import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify link belongs to user
    const link = db.prepare('SELECT user_id FROM links WHERE id = ?').get(id) as { user_id: number } | undefined;
    
    if (!link || link.user_id !== payload.userId) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const { title, url, icon, is_active, order_index } = await request.json();

    // Update link
    db.prepare(`
      UPDATE links 
      SET title = ?, url = ?, icon = ?, is_active = ?, order_index = ?
      WHERE id = ?
    `).run(title, url, icon, is_active ?? 1, order_index, id);

    return NextResponse.json({ message: 'Link updated successfully' });

  } catch (error) {
    console.error('Update link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify link belongs to user
    const link = db.prepare('SELECT user_id FROM links WHERE id = ?').get(id) as { user_id: number } | undefined;
    
    if (!link || link.user_id !== payload.userId) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Delete link
    db.prepare('DELETE FROM links WHERE id = ?').run(id);

    return NextResponse.json({ message: 'Link deleted successfully' });

  } catch (error) {
    console.error('Delete link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}