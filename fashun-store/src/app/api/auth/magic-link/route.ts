import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    
    // Store token in database (implement with your DB)
    // await db.magicLinks.create({ email, token, expiry });
    
    const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify?token=${token}`;
    
    // Send email with magic link
    await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Your Magic Link to Sign In',
        html: `
          <h2>Sign in to FASHUN.CO</h2>
          <p>Click the link below to sign in:</p>
          <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 8px;">
            Sign In
          </a>
          <p>This link expires in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      })
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send magic link' }, { status: 500 });
  }
}
