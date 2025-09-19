import { NextRequest, NextResponse } from 'next/server'

interface ReturnItem {
  id: string
  userId: string
  orderId: string
  productId: string
  productName: string
  productImage: string
  size: string
  color: string
  quantity: number
  price: number
  reason: string
  description: string
  status: 'pending' | 'approved' | 'picked_up' | 'received' | 'processed' | 'refunded'
  initiatedDate: string
  estimatedRefundDate?: string
  trackingNumber?: string
  refundAmount?: number
  images: string[]
  statusHistory: {
    status: string
    date: string
    message: string
  }[]
}

// Mock database for returns
let returns: ReturnItem[] = [
  {
    id: 'RET001',
    userId: 'user-123',
    orderId: 'ORD123456',
    productId: '1',
    productName: 'Oversized Black Hoodie',
    productImage: '/api/placeholder/300/300',
    size: 'L',
    color: 'Black',
    quantity: 1,
    price: 2999,
    reason: 'Size too large',
    description: 'The hoodie is too large for me, need to exchange for medium size.',
    status: 'approved',
    initiatedDate: '2025-09-15',
    estimatedRefundDate: '2025-09-25',
    trackingNumber: 'RET123456789',
    refundAmount: 2999,
    images: [],
    statusHistory: [
      { status: 'pending', date: '2025-09-15', message: 'Return request submitted' },
      { status: 'approved', date: '2025-09-16', message: 'Return approved by customer service' }
    ]
  }
]

// GET /api/returns - Get all returns for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const userReturns = returns.filter(returnItem => returnItem.userId === userId)

    return NextResponse.json({
      success: true,
      data: userReturns,
      total: userReturns.length
    })
  } catch (error) {
    console.error('Error fetching returns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch returns' },
      { status: 500 }
    )
  }
}

// POST /api/returns - Create a new return request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      userId,
      orderId,
      productId,
      productName,
      productImage,
      size,
      color,
      quantity,
      price,
      reason,
      description,
      images
    } = body

    // Validate required fields
    if (!userId || !orderId || !productId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate new return ID
    const returnId = `RET${Date.now()}`
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Calculate estimated refund date (7 days from now)
    const estimatedRefundDate = new Date()
    estimatedRefundDate.setDate(estimatedRefundDate.getDate() + 7)

    const newReturn = {
      id: returnId,
      userId,
      orderId,
      productId,
      productName,
      productImage,
      size,
      color,
      quantity: quantity || 1,
      price,
      reason,
      description: description || '',
      status: 'pending' as const,
      initiatedDate: currentDate,
      estimatedRefundDate: estimatedRefundDate.toISOString().split('T')[0],
      trackingNumber: undefined,
      refundAmount: undefined,
      images: images || [],
      statusHistory: [
        {
          status: 'pending',
          date: currentDate,
          message: 'Return request submitted successfully'
        }
      ]
    }

    returns.push(newReturn)

    return NextResponse.json({
      success: true,
      data: newReturn,
      message: 'Return request created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating return:', error)
    return NextResponse.json(
      { error: 'Failed to create return request' },
      { status: 500 }
    )
  }
}