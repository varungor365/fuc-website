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

  // Handle authentication errors
  if (error) {
    console.error('Auth error:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}`
    );
  }

  // Handle missing code
  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=missing_code`
    );
  }

  try {
    const response = NextResponse.redirect(`${origin}${redirect}`);

    // Create Supabase client with cookie support
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
              httpOnly: false, // Needs to be accessible by client-side JavaScript
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
        `${origin}/login?error=session_exchange_failed`
      );
    }

    if (!data.session) {
      return NextResponse.redirect(
        `${origin}/login?error=no_session`
      );
    }

    // Cookies are already set by the storage adapter above
    return response;
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(
      `${origin}/login?error=callback_exception`
    );
  }
}