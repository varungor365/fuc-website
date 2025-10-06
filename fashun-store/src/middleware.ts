import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter (use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const MAX_REQUESTS = 10;

export async function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();

  // Rate limiting for sensitive endpoints
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/api/admin') ||
    request.nextUrl.pathname.startsWith('/api/payment')
  ) {
    const userLimit = rateLimit.get(ip);

    if (userLimit) {
      if (now < userLimit.resetTime) {
        if (userLimit.count >= MAX_REQUESTS) {
          return new NextResponse('Too Many Requests', { status: 429 });
        }
        userLimit.count++;
      } else {
        rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }
  }

  // Clean up old entries
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimit.entries()) {
      if (now > value.resetTime) {
        rateLimit.delete(key);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
