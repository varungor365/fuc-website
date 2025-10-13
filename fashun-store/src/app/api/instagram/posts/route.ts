import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Instagram token not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}&limit=12`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram posts');
    }

    const data = await response.json();
    return NextResponse.json({ posts: data.data || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts', posts: [] }, { status: 500 });
  }
}
