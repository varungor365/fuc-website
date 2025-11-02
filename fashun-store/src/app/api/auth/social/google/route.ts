import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const redirect = searchParams.get('redirect') || '/account';
  
  // Use production URL if available, fallback to origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
  
  console.log('Google OAuth initiated:', { baseUrl, redirect });

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: false,
    }
  });

  try {
    // Initiate Google OAuth flow with explicit configuration
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account', // Changed from 'consent' to be less aggressive
        },
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error('Google OAuth initialization error:', error);
      return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error.message)}`);
    }

    if (data.url) {
      console.log('Redirecting to Google OAuth URL');
      return NextResponse.redirect(data.url);
    }

    // Fallback if no redirect URL
    console.error('No OAuth URL returned from Supabase');
    return NextResponse.redirect(`${baseUrl}/login?error=no_redirect_url`);
    
  } catch (error) {
    console.error('Google OAuth exception:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_exception&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`);
  }
}
