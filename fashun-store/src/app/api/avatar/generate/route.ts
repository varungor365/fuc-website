import { NextRequest, NextResponse } from 'next/server';

const READY_PLAYER_ME_API_URL = 'https://api.readyplayer.me/v1';
const API_KEY = 'sk_live_hXPnOoYDFzLvQP-7sQwcY7o3Q38zpE5yPND0';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const style = formData.get('style') as string || 'realistic';
    const gender = formData.get('gender') as string || 'male';

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo is required' },
        { status: 400 }
      );
    }

    // For now, return a demo avatar URL since Ready Player Me integration requires more setup
    // In production, this would call the actual Ready Player Me API
    const demoAvatarUrl = `https://models.readyplayer.me/66f5db2ef7a93b97a8e7c5b4.glb`;
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      avatarUrl: demoAvatarUrl,
      style,
      gender,
      message: 'Avatar generated successfully (demo mode)'
    });

  } catch (error) {
    console.error('Avatar generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate avatar' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Ready Player Me Avatar Generation API',
    apiKey: API_KEY.substring(0, 12) + '...',
    status: 'active'
  });
}