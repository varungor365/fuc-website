import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { linkId, profileId } = await request.json();
    
    if (!linkId || !profileId) {
      return NextResponse.json(
        { error: 'Missing linkId or profileId' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Insert analytics record
    const { error: analyticsError } = await supabase
      .from('analytics')
      .insert({
        profile_id: profileId,
        event_type: 'click',
        link_id: linkId,
        timestamp: new Date().toISOString(),
        metadata: {
          user_agent: request.headers.get('user-agent'),
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        }
      });

    if (analyticsError) {
      console.error('Analytics error:', analyticsError);
      return NextResponse.json(
        { error: 'Failed to track click' },
        { status: 500 }
      );
    }

    // Update link click count
    const { error: linkError } = await supabase
      .from('links')
      .update({ clicks: supabase.sql`clicks + 1` })
      .eq('id', linkId);

    if (linkError) {
      console.error('Link update error:', linkError);
      // Don't fail the request if click count update fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track click error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}