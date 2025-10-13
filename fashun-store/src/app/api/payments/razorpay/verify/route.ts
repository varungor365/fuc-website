import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createRazorpayInstance, RazorpayErrorHandler, validateWebhookSignature, getPaymentStatus } from '@/config/razorpay';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      order_details 
    } = requestBody;

    // Enhanced input validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required payment parameters',
          code: 'MISSING_PARAMETERS',
          required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
        },
        { status: 400 }
      );
    }

    // Validate parameter formats
    if (!/^order_[A-Za-z0-9]+$/.test(razorpay_order_id)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid order ID format',
          code: 'INVALID_ORDER_ID'
        },
        { status: 400 }
      );
    }

    if (!/^pay_[A-Za-z0-9]+$/.test(razorpay_payment_id)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid payment ID format',
          code: 'INVALID_PAYMENT_ID'
        },
        { status: 400 }
      );
    }

    // Create Razorpay instance
    const razorpay = createRazorpayInstance();
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error('Razorpay key secret not configured');
    }

    // Verify signature using timing-safe comparison
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    const isValidSignature = crypto.timingSafeEqual(
      Buffer.from(razorpay_signature),
      Buffer.from(expectedSignature)
    );

    if (!isValidSignature) {
      // Log suspicious signature verification failure
      console.warn('Payment signature verification failed:', {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        timestamp: new Date().toISOString(),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      });

      return NextResponse.json(
        { 
          success: false,
          error: 'Payment signature verification failed',
          code: 'SIGNATURE_VERIFICATION_FAILED'
        },
        { status: 400 }
      );
    }

    // Fetch payment details from Razorpay with error handling
    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (fetchError) {
      const errorInfo = RazorpayErrorHandler.handleError(fetchError);
      
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch payment details',
          code: errorInfo.code,
          message: errorInfo.userMessage
        },
        { status: errorInfo.statusCode }
      );
    }

    // Get payment status information
    const statusInfo = getPaymentStatus(payment.status);

    if (statusInfo.isSuccess) {
      // Payment successful - log and process
      const paymentData = {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: Number(payment.amount) / 100,
        currency: payment.currency,
        method: payment.method,
        bank: payment.bank,
        wallet: payment.wallet,
        vpa: payment.vpa,
        email: payment.email,
        contact: payment.contact,
        created_at: payment.created_at,
        order_details,
        verified_at: new Date().toISOString()
      };

      console.info('Payment verified successfully:', paymentData);

      // Here you would typically:
      // 1. Save order to database
      // 2. Update inventory
      // 3. Send confirmation email
      // 4. Update user's order history
      // 5. Trigger fulfillment process

      return NextResponse.json({
        success: true,
        payment: {
          id: razorpay_payment_id,
          order_id: razorpay_order_id,
          status: payment.status,
          amount: paymentData.amount,
          currency: payment.currency,
          method: payment.method,
          created_at: payment.created_at
        },
        message: statusInfo.userMessage,
        next_steps: [
          'Order confirmation email sent',
          'Processing for fulfillment',
          'Track your order in account dashboard'
        ]
      });

    } else if (statusInfo.isPending) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment is still being processed',
          code: 'PAYMENT_PENDING',
          status: payment.status,
          message: statusInfo.userMessage,
          retry_after: 30 // seconds
        },
        { status: 202 } // Accepted but processing
      );

    } else {
      // Payment failed
      console.warn('Payment verification failed:', {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        status: payment.status,
        error_code: payment.error_code,
        error_description: payment.error_description,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json(
        { 
          success: false,
          error: statusInfo.userMessage,
          code: 'PAYMENT_FAILED',
          status: payment.status,
          details: {
            error_code: payment.error_code,
            error_description: payment.error_description,
            failure_reason: payment.error_reason
          }
        },
        { status: 402 }
      );
    }

  } catch (error) {
    // Use enhanced error handler
    const errorInfo = RazorpayErrorHandler.logError(
      error,
      'PAYMENT_VERIFICATION',
      {
        endpoint: 'verify',
        timestamp: new Date().toISOString()
      }
    );

    return NextResponse.json(
      {
        success: false,
        error: errorInfo.userMessage,
        code: errorInfo.code,
        retry_possible: errorInfo.shouldRetry
      },
      { status: errorInfo.statusCode }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    error: 'Method not allowed'
  }, { status: 405 });
}