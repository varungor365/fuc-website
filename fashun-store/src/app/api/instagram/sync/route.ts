import { NextRequest, NextResponse } from 'next/server';
import InstagramService, { instagramUtils } from '@/lib/services/InstagramService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, hashtags, limit } = body;

    const instagramService = new InstagramService();

    switch (action) {
      case 'sync':
        // Full sync of branded content
        const syncResult = await instagramService.syncInstagramContent();
        return NextResponse.json({
          success: true,
          message: `Successfully synced ${syncResult.synced} posts from Instagram`,
          data: syncResult
        });

      case 'fetch_hashtag':
        // Fetch specific hashtag content
        const hashtagContent = await instagramService.fetchHashtagMedia(
          hashtags?.[0] || 'fucfashion',
          limit || 25
        );
        return NextResponse.json({
          success: true,
          data: hashtagContent
        });

      case 'fetch_branded':
        // Fetch all branded hashtags
        const brandedContent = await instagramService.fetchBrandedContent(hashtags);
        return NextResponse.json({
          success: true,
          data: brandedContent
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: sync, fetch_hashtag, or fetch_branded' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Instagram sync error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync Instagram content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hashtag = searchParams.get('hashtag') || 'fucfashion';
    const limit = parseInt(searchParams.get('limit') || '25');

    const instagramService = new InstagramService();
    const content = await instagramService.fetchHashtagMedia(hashtag, limit);

    return NextResponse.json({
      success: true,
      hashtag,
      data: content
    });

  } catch (error) {
    console.error('Instagram fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Instagram content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Validate and process individual Instagram posts
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_url, auto_approve = false } = body;

    if (!instagramUtils.isValidInstagramUrl(post_url)) {
      return NextResponse.json(
        { error: 'Invalid Instagram URL format' },
        { status: 400 }
      );
    }

    const instagramService = new InstagramService();
    
    // Get embed code for the post
    const embedCode = await instagramService.getEmbedCode(post_url);
    
    if (!embedCode) {
      return NextResponse.json(
        { error: 'Could not retrieve Instagram post data' },
        { status: 404 }
      );
    }

    // TODO: Create UGC entry in Strapi
    const ugcData = {
      external_url: post_url,
      social_platform: 'instagram',
      embed_code: embedCode,
      is_approved: auto_approve,
      moderation_status: auto_approve ? 'approved' : 'pending',
      submission_date: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Instagram post processed successfully',
      data: ugcData
    });

  } catch (error) {
    console.error('Instagram post processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process Instagram post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
