import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Get user profile
    const user = db.prepare(`
      SELECT id, username, display_name, bio, avatar_url, theme
      FROM users WHERE username = ?
    `).get(username) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get user's links
    const links = db.prepare(`
      SELECT id, title, url, icon, order_index
      FROM links 
      WHERE user_id = ? AND is_active = 1 
      ORDER BY order_index ASC
    `).all(user.id);

    return NextResponse.json({
      profile: {
        username: user.username,
        displayName: user.display_name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        theme: user.theme
      },
      links
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify user owns this profile
    const user = db.prepare('SELECT id FROM users WHERE username = ? AND id = ?')
      .get(username, payload.userId) as any;

    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { displayName, bio, theme } = await request.json();

    // Update profile
    db.prepare(`
      UPDATE users 
      SET display_name = ?, bio = ?, theme = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(displayName, bio, theme, user.id);

    return NextResponse.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}