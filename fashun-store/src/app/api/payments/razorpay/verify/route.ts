import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret'
});

export async function POST(request: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      order_details 
    } = await request.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'demo_secret')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status === 'captured') {
      // Payment successful - process order
      // Here you would typically:
      // 1. Save order to database
      // 2. Update inventory
      // 3. Send confirmation email
      // 4. Update user's order history

      console.log('Payment successful:', {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: Number(payment.amount) / 100,
        order_details
      });

      return NextResponse.json({
        success: true,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        status: 'captured',
        amount: Number(payment.amount) / 100,
        message: 'Payment verified successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Payment not captured', status: payment.status },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    error: 'Method not allowed'
  }, { status: 405 });
}