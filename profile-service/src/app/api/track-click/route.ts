import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { linkId, profileId } = await request.json();

    await supabase.from('analytics').insert({
      profile_id: profileId,
      event_type: 'click',
      link_id: linkId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
