import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    // Fetch order from Strapi
    const response = await fetch(`${process.env.STRAPI_URL}/api/orders/${orderId}?populate=*`, {
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

    // Transform the order data for frontend consumption
    const transformedOrder = {
      id: order.id,
      status: order.attributes.status,
      tracking_timeline: order.attributes.tracking_timeline || [],
      estimated_delivery: order.attributes.estimated_delivery,
      actual_delivery: order.attributes.actual_delivery,
      trackingNumber: order.attributes.trackingNumber,
      shipping_carrier: order.attributes.shipping_carrier || 'fedex',
      priority: order.attributes.priority || 'standard',
      items: order.attributes.items || [],
      total: order.attributes.total,
      subtotal: order.attributes.subtotal,
      tax: order.attributes.tax,
      shipping: order.attributes.shipping,
      customerEmail: order.attributes.customerEmail,
      shippingAddress: order.attributes.shippingAddress,
      billingAddress: order.attributes.billingAddress,
      current_location: order.attributes.current_location,
      delivery_attempts: order.attributes.delivery_attempts || 0,
      signature_required: order.attributes.signature_required || false,
      external_tracking_url: order.attributes.external_tracking_url,
      notes: order.attributes.notes,
      customer_notifications: order.attributes.customer_notifications || [],
      createdAt: order.attributes.createdAt,
      updatedAt: order.attributes.updatedAt,
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const body = await request.json();

    // Update order in Strapi
    const response = await fetch(`${process.env.STRAPI_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: body
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.data.attributes);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
