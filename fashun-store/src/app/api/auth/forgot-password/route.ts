import { NextRequest, NextResponse } from 'next/server';
import { medusaClient } from '@/lib/medusa-client';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    await medusaClient.customers.generatePasswordToken({ email });

    return NextResponse.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to send password reset email' },
      { status: 500 }
    );
  }
}
