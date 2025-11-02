import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const redirect = searchParams.get('redirect') || '/account';
  
  // Use production URL if available, fallback to origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    }
  });

  try {
    // Initiate Google OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(`${baseUrl}/login?error=${error.message}`);
    }

    if (data.url) {
      return NextResponse.redirect(data.url);
    }

    // Fallback if no redirect URL
    return NextResponse.redirect(`${baseUrl}/login?error=no_redirect_url`);
    
  } catch (error) {
    console.error('Google OAuth exception:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_exception`);
  }
}
