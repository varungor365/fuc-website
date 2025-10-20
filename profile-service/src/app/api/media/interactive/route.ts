import { NextRequest, NextResponse } from 'next/server';
import { InteractiveService } from '@/lib/media';

export async function POST(request: NextRequest) {
  try {
    const { userId, title, embed_type, embed_code, configuration } = await request.json();

    if (!userId || !title || !embed_type || !embed_code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic validation for embed code (in production, use more sophisticated sanitization)
    if (embed_code.length > 10000) {
      return NextResponse.json(
        { error: 'Embed code too long' },
        { status: 400 }
      );
    }

    // Validate embed type
    const allowedTypes = ['calendar', 'form', 'poll', 'widget', 'iframe'];
    if (!allowedTypes.includes(embed_type)) {
      return NextResponse.json(
        { error: 'Invalid embed type' },
        { status: 400 }
      );
    }

    const interactiveService = InteractiveService.getInstance();
    const embed = await interactiveService.createEmbed(
      userId,
      title,
      embed_type,
      embed_code,
      configuration || {}
    );

    if (!embed) {
      return NextResponse.json(
        { error: 'Failed to create interactive embed' },
        { status: 500 }
      );
    }

    return NextResponse.json(embed);

  } catch (error) {
    console.error('Error in interactive embed API:', error);
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

    const interactiveService = InteractiveService.getInstance();
    const embeds = await interactiveService.getUserEmbeds(userId);

    return NextResponse.json(embeds);

  } catch (error) {
    console.error('Error in interactive embeds fetch API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}