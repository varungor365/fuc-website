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

  // Handle authentication errors
  if (error) {
    console.error('Auth error:', error, errorDescription);
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(error)}`
    );
  }

  // Handle missing code
  if (!code) {
    return NextResponse.redirect(
      `${baseUrl}/login?error=missing_code`
    );
  }

  try {
    // Create response object first
    const response = NextResponse.redirect(`${baseUrl}${redirect}`);

    // Create Supabase client with proper cookie handling
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
        persistSession: true,
        storage: {
          getItem: (key) => {
            return request.cookies.get(key)?.value || null;
          },
          setItem: (key, value) => {
            response.cookies.set({
              name: key,
              value: value,
              path: '/',
              maxAge: 60 * 60 * 24 * 7, // 7 days
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: false, // Must be accessible by client-side JavaScript
            });
          },
          removeItem: (key) => {
            response.cookies.delete(key);
          },
        },
      },
    });

    // Exchange code for session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Session exchange error:', exchangeError);
      return NextResponse.redirect(
        `${baseUrl}/login?error=session_exchange_failed`
      );
    }

    if (!data.session) {
      return NextResponse.redirect(
        `${baseUrl}/login?error=no_session`
      );
    }

    console.log('Session exchanged successfully for user:', data.user?.email);

    // Set additional cookies for better client-side detection
    response.cookies.set({
      name: 'sb-authenticated',
      value: 'true',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
    });

    // Add success parameter to redirect URL to trigger client-side session refresh
    const redirectUrl = new URL(`${baseUrl}${redirect}`);
    redirectUrl.searchParams.set('auth_success', 'true');
    
    return NextResponse.redirect(redirectUrl.toString());
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(
      `${baseUrl}/login?error=callback_exception`
    );
  }
}