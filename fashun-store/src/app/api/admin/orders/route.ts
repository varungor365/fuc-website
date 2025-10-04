import { NextRequest, NextResponse } from 'next/server'

// Mock database - In production, replace with actual database
let orders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'cust_1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      avatar: '/api/placeholder/40/40'
    },
    items: [
      {
        id: 'item_1',
        productId: 'prod_1',
        productName: 'Premium Streetwear Hoodie',
        productSku: 'HOOD-001',
        variantName: 'Large Black',
        quantity: 2,
        price: 89.99,
        image: '/api/placeholder/60/60'
      }
    ],
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    paymentId: 'pay_1234567890',
    shippingMethod: 'Express Shipping',
    trackingNumber: 'TRK123456789',
    trackingUrl: 'https://tracking.example.com/TRK123456789',
    total: 199.97,
    subtotal: 179.98,
    shipping: 15.99,
    tax: 14.00,
    discount: 10.00,
    currency: 'USD',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    shippingAddress: {
      name: 'John Doe',
      street1: '123 Main St',
      street2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1-555-0123'
    },
    billingAddress: {
      name: 'John Doe',
      street1: '123 Main St',
      street2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    notes: 'Customer requested gift wrapping',
    tags: ['vip', 'gift'],
    source: 'online',
    refunds: [],
    fulfillments: []
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      id: 'cust_2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-0456'
    },
    items: [
      {
        id: 'item_2',
        productId: 'prod_2',
        productName: 'Limited Edition Graphic Tee',
        productSku: 'TEE-002',
        quantity: 1,
        price: 49.99,
        image: '/api/placeholder/60/60'
      }
    ],
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'paypal',
    paymentId: 'pay_0987654321',
    shippingMethod: 'Standard Shipping',
    trackingNumber: 'TRK987654321',
    trackingUrl: 'https://tracking.example.com/TRK987654321',
    total: 59.98,
    subtotal: 49.99,
    shipping: 9.99,
    tax: 4.00,
    discount: 4.00,
    currency: 'USD',
    createdAt: '2024-01-19T15:45:00Z',
    updatedAt: '2024-01-20T09:20:00Z',
    shippingAddress: {
      name: 'Jane Smith',
      street1: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    billingAddress: {
      name: 'Jane Smith',
      street1: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    tags: ['returning-customer'],
    source: 'mobile',
    refunds: [],
    fulfillments: [
      {
        id: 'fulfill_1',
        status: 'shipped',
        trackingNumber: 'TRK987654321',
        createdAt: '2024-01-20T09:20:00Z',
        items: [{ id: 'item_2', quantity: 1 }]
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      id: 'cust_3',
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    items: [
      {
        id: 'item_3',
        productId: 'prod_3',
        productName: 'Designer Denim Jacket',
        productSku: 'JACK-003',
        quantity: 1,
        price: 159.99,
        image: '/api/placeholder/60/60'
      }
    ],
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'bank_transfer',
    shippingMethod: 'Standard Shipping',
    total: 169.98,
    subtotal: 159.99,
    shipping: 9.99,
    tax: 12.80,
    discount: 12.80,
    currency: 'USD',
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    shippingAddress: {
      name: 'Mike Johnson',
      street1: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    billingAddress: {
      name: 'Mike Johnson',
      street1: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    tags: ['new-customer'],
    source: 'desktop',
    refunds: [],
    fulfillments: []
  }
]

// Helper function to generate order numbers
function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `ORD-${year}-${timestamp}`
}

// Helper function to calculate order totals
function calculateOrderTotals(items: any[], shipping: number = 0, tax: number = 0, discount: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal + shipping + tax - discount
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}

// GET - Fetch all orders with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    
    // Filter orders
    let filteredOrders = [...orders]
    
    // Status filter
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }
    
    // Payment status filter
    if (paymentStatus && paymentStatus !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus)
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredOrders = filteredOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchLower))
      )
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt)
        if (dateFrom && orderDate < new Date(dateFrom)) return false
        if (dateTo && orderDate > new Date(dateTo)) return false
        return true
      })
    }
    
    // Sorting
    filteredOrders.sort((a, b) => {
      let aVal: any, bVal: any
      
      switch (sortBy) {
        case 'customer':
          aVal = a.customer.name
          bVal = b.customer.name
          break
        case 'total':
          aVal = a.total
          bVal = b.total
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        case 'updatedAt':
          aVal = new Date(a.updatedAt)
          bVal = new Date(b.updatedAt)
          break
        default:
          aVal = new Date(a.createdAt)
          bVal = new Date(b.createdAt)
          break
      }
      
      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      }
    })
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)
    
    // Calculate statistics
    const stats = {
      total: filteredOrders.length,
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      processing: filteredOrders.filter(o => o.status === 'processing').length,
      shipped: filteredOrders.filter(o => o.status === 'shipped').length,
      delivered: filteredOrders.filter(o => o.status === 'delivered').length,
      cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
      totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: filteredOrders.length > 0 
        ? filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length 
        : 0
    }
    
    // Calculate totals
    const totalOrders = filteredOrders.length
    const totalPages = Math.ceil(totalOrders / limit)
    
    return NextResponse.json({
      success: true,
      data: {
        orders: paginatedOrders,
        stats,
        pagination: {
          page,
          limit,
          total: totalOrders,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: {
          status,
          paymentStatus,
          search,
          sortBy,
          sortOrder,
          dateRange: { from: dateFrom, to: dateTo }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['customer', 'items', 'shippingAddress']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }
    
    // Calculate totals
    const { subtotal, total } = calculateOrderTotals(
      body.items,
      body.shipping || 0,
      body.tax || 0,
      body.discount || 0
    )
    
    // Generate new order
    const newOrder = {
      id: (orders.length + 1).toString(),
      orderNumber: body.orderNumber || generateOrderNumber(),
      customer: body.customer,
      items: body.items,
      status: body.status || 'pending',
      paymentStatus: body.paymentStatus || 'pending',
      paymentMethod: body.paymentMethod || 'credit_card',
      paymentId: body.paymentId,
      shippingMethod: body.shippingMethod || 'Standard Shipping',
      trackingNumber: body.trackingNumber,
      trackingUrl: body.trackingUrl,
      total,
      subtotal,
      shipping: body.shipping || 0,
      tax: body.tax || 0,
      discount: body.discount || 0,
      currency: body.currency || 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: body.shippingAddress,
      billingAddress: body.billingAddress || body.shippingAddress,
      notes: body.notes || '',
      tags: body.tags || [],
      source: body.source || 'admin',
      refunds: [],
      fulfillments: []
    }
    
    // Add to orders array
    orders.push(newOrder)
    
    return NextResponse.json({
      success: true,
      data: { order: newOrder },
      message: 'Order created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// PUT - Update order
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const orderIndex = orders.findIndex(order => order.id === id)
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Recalculate totals if items changed
    let updatedOrder = { ...orders[orderIndex], ...body }
    
    if (body.items || body.shipping !== undefined || body.tax !== undefined || body.discount !== undefined) {
      const { subtotal, total } = calculateOrderTotals(
        updatedOrder.items,
        updatedOrder.shipping,
        updatedOrder.tax,
        updatedOrder.discount
      )
      updatedOrder.subtotal = subtotal
      updatedOrder.total = total
    }
    
    updatedOrder.updatedAt = new Date().toISOString()
    
    orders[orderIndex] = updatedOrder
    
    return NextResponse.json({
      success: true,
      data: { order: updatedOrder },
      message: 'Order updated successfully'
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

// DELETE - Delete order(s)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')?.split(',') || []
    
    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No order IDs provided' },
        { status: 400 }
      )
    }
    
    // Filter out orders with matching IDs
    const deletedOrders = orders.filter(order => ids.includes(order.id))
    orders = orders.filter(order => !ids.includes(order.id))
    
    if (deletedOrders.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No orders found with provided IDs' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: { 
        deletedCount: deletedOrders.length,
        deletedOrders: deletedOrders.map(o => ({ id: o.id, orderNumber: o.orderNumber }))
      },
      message: `${deletedOrders.length} order(s) deleted successfully`
    })
  } catch (error) {
    console.error('Error deleting orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete orders' },
      { status: 500 }
    )
  }
}