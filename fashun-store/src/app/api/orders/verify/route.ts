import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { orderId, email } = await request.json();

    if (!orderId || !email) {
      return NextResponse.json(
        { error: 'Order ID and email are required' },
        { status: 400 }
      );
    }

    // Fetch order from Strapi
    const response = await fetch(`${process.env.STRAPI_URL}/api/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const data = await response.json();
    const order = data.data;

    // Verify email matches
    if (order.attributes.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match our records' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
