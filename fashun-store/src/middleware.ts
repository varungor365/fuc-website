import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create Supabase client with custom storage adapter to read cookies properly
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: false,
      persistSession: true,
      storage: {
        getItem: (key) => {
          return req.cookies.get(key)?.value || null;
        },
        setItem: (key, value) => {
          res.cookies.set({
            name: key,
            value: value,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
          });
        },
        removeItem: (key) => {
          res.cookies.delete(key);
        },
      },
    },
  });
  
  let session: any = null;
  
  // Try to get session - Supabase will automatically read cookies via storage adapter
  try {
    const { data: { session: userSession }, error } = await supabase.auth.getSession();
    if (!error && userSession) {
      session = userSession;
    }
  } catch (error) {
    console.error('Session error in middleware:', error);
  }
  
  // Protect admin routes, but exclude the login page itself
  if (req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login')) {
    if (!session) {
      // Redirect to login if not authenticated
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // Protect account routes
  if (req.nextUrl.pathname.startsWith('/account') && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
  ],
};