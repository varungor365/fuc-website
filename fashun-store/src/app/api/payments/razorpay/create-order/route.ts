import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret'
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt, customer } = await request.json();

    // Validate required fields
    if (!amount || !receipt) {
      return NextResponse.json(
        { error: 'Amount and receipt are required' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt,
      payment_capture: 1, // Auto capture
      notes: {
        customer_name: customer?.name || '',
        customer_email: customer?.email || '',
        customer_phone: customer?.phone || ''
      }
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_key'
    });

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    error: 'Method not allowed'
  }, { status: 405 });
}