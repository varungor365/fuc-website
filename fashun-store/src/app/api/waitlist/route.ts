import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.log('📧 Waitlist signup attempt:', email);
    
    // Prepare waitlist data
    const waitlistData = {
      email: email.toLowerCase().trim(),
      source: 'launch_countdown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      referrer: request.headers.get('referer') || 'direct',
      metadata: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        signup_date: new Date().toISOString()
      }
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([waitlistData])
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        console.log('⚠️ Duplicate email:', email);
        return NextResponse.json({ 
          success: true, 
          message: 'You are already on the waitlist!',
          duplicate: true
        });
      }
      
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ Email saved to Supabase successfully!', data);

    // Get total count
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined the waitlist!',
      stored: true,
      totalSignups: count || 0,
      storage: 'Supabase Database'
    });

  } catch (error) {
    console.error('❌ Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    );
  }
}

// Get waitlist count and optionally all emails (for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeEmails = searchParams.get('emails') === 'true';

    // Get total count
    const { count, error: countError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error getting count:', countError);
      return NextResponse.json({ error: 'Failed to get waitlist count' }, { status: 500 });
    }

    const response: any = {
      count: count || 0,
      message: `${count || 0} people on the waitlist`
    };

    // If emails requested (admin only), include the list
    if (includeEmails) {
      const { data: emails, error: emailsError } = await supabase
        .from('waitlist')
        .select('email, created_at, source, referrer')
        .order('created_at', { ascending: false });

      if (emailsError) {
        console.error('❌ Error getting emails:', emailsError);
      } else {
        response.emails = emails;
      }
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Waitlist GET error:', error);
    return NextResponse.json({ error: 'Failed to get waitlist data' }, { status: 500 });
  }
}
