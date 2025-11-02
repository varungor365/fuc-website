import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const redirectTo = searchParams.get('redirect') || '/account';
  
  // Use production URL if available, fallback to origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${baseUrl}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      console.error('Apple auth error:', error);
      return NextResponse.redirect(
        `${baseUrl}/login?error=apple_auth_failed`
      );
    }

    return NextResponse.redirect(data.url);
  } catch (error) {
    console.error('Apple auth exception:', error);
    return NextResponse.redirect(
      `${baseUrl}/login?error=apple_auth_exception`
    );
  }
}