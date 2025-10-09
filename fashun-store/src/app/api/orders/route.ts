import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (replace with database in production)
let orders: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let filteredOrders = orders;
    
    if (customerId) {
      filteredOrders = filteredOrders.filter(order => order.customerId === customerId);
    }
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    return NextResponse.json({
      orders: paginatedOrders,
      total: filteredOrders.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOrders.length / limit)
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      designId,
      customerId,
      customerEmail,
      customerName,
      productType,
      size,
      color,
      quantity = 1,
      designUrl,
      designPrompt,
      shippingAddress,
      contactNumber
    } = await request.json();

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Calculate pricing (mock pricing logic)
    const basePrice = {
      tshirt: 25.99,
      hoodie: 45.99,
      tank: 19.99,
      sweatshirt: 39.99
    };
    
    const unitPrice = basePrice[productType as keyof typeof basePrice] || 25.99;
    const subtotal = unitPrice * quantity;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = quantity > 2 ? 0 : 5.99; // Free shipping for 3+ items
    const total = subtotal + tax + shipping;

    const newOrder = {
      id: orderId,
      designId,
      customerId,
      customerEmail,
      customerName,
      productDetails: {
        type: productType,
        size,
        color,
        quantity,
        designUrl,
        designPrompt
      },
      pricing: {
        unitPrice,
        subtotal,
        tax,
        shipping,
        total
      },
      shippingAddress,
      contactNumber,
      status: 'pending_payment',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      trackingNumber: null,
      notes: []
    };

    orders.push(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, trackingNumber, notes } = await request.json();
    
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (status) updateData.status = status;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) {
      updateData.notes = [
        ...orders[orderIndex].notes,
        {
          message: notes,
          timestamp: new Date().toISOString(),
          type: 'update'
        }
      ];
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updateData
    };

    return NextResponse.json({
      success: true,
      order: orders[orderIndex],
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}