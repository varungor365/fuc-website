import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayInstance, RazorpayErrorHandler } from '@/config/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt, customer } = await request.json();

    // Enhanced input validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { 
          error: 'Invalid amount',
          message: 'Amount must be a positive number',
          code: 'INVALID_AMOUNT'
        },
        { status: 400 }
      );
    }

    if (!receipt || typeof receipt !== 'string') {
      return NextResponse.json(
        { 
          error: 'Invalid receipt',
          message: 'Receipt ID is required and must be a string',
          code: 'INVALID_RECEIPT'
        },
        { status: 400 }
      );
    }

    // Validate currency
    const validCurrencies = ['INR', 'USD', 'EUR', 'GBP'];
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json(
        { 
          error: 'Invalid currency',
          message: `Currency must be one of: ${validCurrencies.join(', ')}`,
          code: 'INVALID_CURRENCY'
        },
        { status: 400 }
      );
    }

    // Amount limits (in base currency)
    const minAmount = currency === 'INR' ? 1 : 0.01; // ₹1 or $0.01
    const maxAmount = currency === 'INR' ? 500000 : 10000; // ₹5,00,000 or $10,000

    if (amount < minAmount || amount > maxAmount) {
      return NextResponse.json(
        { 
          error: 'Amount out of range',
          message: `Amount must be between ${minAmount} and ${maxAmount} ${currency}`,
          code: 'AMOUNT_OUT_OF_RANGE'
        },
        { status: 400 }
      );
    }

    // Create Razorpay instance with error handling
    const razorpay = createRazorpayInstance();

    // Create Razorpay order with enhanced error handling
    const orderData = {
      amount: Math.round(amount * (currency === 'INR' ? 100 : 10000)), // Paise for INR, cents for others
      currency,
      receipt: receipt.substring(0, 40), // Razorpay receipt limit
      payment_capture: 1,
      notes: {
        customer_name: customer?.name?.substring(0, 50) || '',
        customer_email: customer?.email?.substring(0, 50) || '',
        customer_phone: customer?.phone?.substring(0, 15) || '',
        created_at: new Date().toISOString(),
        platform: 'fashun-store'
      }
    };

    const order = await razorpay.orders.create(orderData);

    // Log successful order creation
    console.info('Razorpay order created successfully:', {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      customer_email: customer?.email
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      },
      razorpay_key: process.env.RAZORPAY_KEY_ID,
      amount_display: amount,
      currency_symbol: currency === 'INR' ? '₹' : '$'
    });

  } catch (error) {
    // Use enhanced error handler
    const errorInfo = RazorpayErrorHandler.logError(
      error,
      'ORDER_CREATION',
      {
        endpoint: 'create-order',
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

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'Use POST to create payment orders'
    },
    { status: 405 }
  );
}