import { NextRequest, NextResponse } from 'next/server';
import { MediaService } from '@/lib/media';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const userId = formData.get('userId') as string;

    if (!file || !title || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mp3', 'audio/wav', 'audio/mpeg',
      'application/pdf', 'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 50MB allowed.' },
        { status: 400 }
      );
    }

    const mediaService = MediaService.getInstance();
    const mediaItem = await mediaService.uploadMedia(
      userId,
      file,
      title,
      description
    );

    if (!mediaItem) {
      return NextResponse.json(
        { error: 'Failed to upload media' },
        { status: 500 }
      );
    }

    return NextResponse.json(mediaItem);

  } catch (error) {
    console.error('Error in media upload API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const mediaService = MediaService.getInstance();
    const mediaItems = await mediaService.getUserMedia(userId);

    return NextResponse.json(mediaItems);

  } catch (error) {
    console.error('Error in media fetch API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}