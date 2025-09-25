import { NextRequest, NextResponse } from 'next/server';
import { generateQRCode } from '@/lib/qrcode';

// Mock user database - in production, use your Strapi backend
const mockUsers = {
  'john_doe': {
    id: 'john_doe',
    username: 'john_doe',
    displayName: 'John Doe',
    bio: 'Streetwear enthusiast from NYC',
    avatar: '/placeholder-avatar.jpg',
    links: [
      { platform: 'instagram', url: 'https://instagram.com/johndoe', handle: '@johndoe' },
      { platform: 'twitter', url: 'https://twitter.com/johndoe', handle: '@johndoe' }
    ],
    styles: ['streetwear', 'urban', 'casual'],
    joinDate: '2024-01-15'
  },
  'demo_user': {
    id: 'demo_user', 
    username: 'demo_user',
    displayName: 'Demo User',
    bio: 'Fashion lover exploring FASHUN.CO styles',
    avatar: '/placeholder-avatar.jpg',
    links: [
      { platform: 'instagram', url: 'https://instagram.com/demouser', handle: '@demouser' }
    ],
    styles: ['modern', 'minimalist'],
    joinDate: '2024-02-01'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user from mock database (replace with Strapi query)
    const user = mockUsers[userId as keyof typeof mockUsers];
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate QR code for this profile
    const profileUrl = `https://fashun.co.in/profile/${userId}`;
    const qrCodeDataUrl = await generateQRCode(profileUrl, {
      width: 200,
      margin: 2
    });

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        profileUrl,
        qrCode: qrCodeDataUrl
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}