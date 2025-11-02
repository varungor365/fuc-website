import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const redirect = searchParams.get('redirect') || '/account';

  // Use production URL if available, fallback to origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

  console.log('Auth callback received:', {
    code: code ? 'present' : 'missing',
    error,
    errorDescription,
    origin,
    baseUrl,
    redirect
  });

  // Handle authentication errors from OAuth provider
  if (error) {
    console.error('OAuth provider error:', error, errorDescription);
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`
    );
  }

  // Handle missing code
  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(
      `${baseUrl}/login?error=missing_code`
    );
  }

  try {
    // Create Supabase client for session exchange
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
        persistSession: false, // We'll handle persistence manually
      },
    });

    console.log('Attempting to exchange code for session...');

    // Exchange code for session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Session exchange error details:', {
        message: exchangeError.message,
        status: exchangeError.status,
        details: exchangeError
      });
      
      // More specific error handling
      if (exchangeError.message?.includes('invalid_grant')) {
        return NextResponse.redirect(
          `${baseUrl}/login?error=invalid_grant&message=Authentication code expired, please try again`
        );
      }
      
      return NextResponse.redirect(
        `${baseUrl}/login?error=session_exchange_failed&message=${encodeURIComponent(exchangeError.message || 'Unknown error')}`
      );
    }

    if (!data.session) {
      console.error('No session returned from exchange');
      return NextResponse.redirect(
        `${baseUrl}/login?error=no_session`
      );
    }

    console.log('Session exchanged successfully for user:', data.user?.email);

    // Create response with redirect
    const redirectUrl = new URL(`${baseUrl}${redirect}`);
    redirectUrl.searchParams.set('auth_success', 'true');
    const response = NextResponse.redirect(redirectUrl.toString());

    // Set session cookies manually for better compatibility
    const { access_token, refresh_token } = data.session;
    
    response.cookies.set({
      name: 'sb-access-token',
      value: access_token,
      path: '/',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'lax',
      secure: true, // Always use secure in production
      httpOnly: false,
    });

    if (refresh_token) {
      response.cookies.set({
        name: 'sb-refresh-token',
        value: refresh_token,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: true,
        httpOnly: false,
      });
    }

    // Set authentication flag
    response.cookies.set({
      name: 'sb-authenticated',
      value: 'true',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: true,
      httpOnly: false,
    });

    return response;
  } catch (err) {
    console.error('Callback exception:', err);
    return NextResponse.redirect(
      `${baseUrl}/login?error=callback_exception&message=${encodeURIComponent(err instanceof Error ? err.message : 'Unknown error')}`
    );
  }
}