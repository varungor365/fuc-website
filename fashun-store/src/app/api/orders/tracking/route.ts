import { NextRequest, NextResponse } from 'next/server'

export interface OrderTracking {
  id: string
  orderId: string
  userId: string
  status: 'order_placed' | 'payment_confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned'
  currentLocation: string
  estimatedDelivery: string
  trackingNumber: string
  courier: string
  courierLogo?: string
  timeline: TrackingEvent[]
  liveUpdates: boolean
  notifications: OrderNotification[]
}

export interface TrackingEvent {
  id: string
  status: string
  title: string
  description: string
  location: string
  timestamp: string
  isCompleted: boolean
  isCurrent: boolean
  icon?: string
}

export interface OrderNotification {
  id: string
  type: 'sms' | 'email' | 'push' | 'whatsapp'
  title: string
  message: string
  sentAt: string
  isRead: boolean
}

export interface CourierInfo {
  name: string
  trackingUrl: string
  phone: string
  estimatedTime: string
  vehicleType: 'bike' | 'van' | 'truck'
  courierRating: number
}

// Mock database
const mockOrderTracking: OrderTracking[] = [
  {
    id: 'track-1',
    orderId: 'ORD-001',
    userId: 'user1',
    status: 'out_for_delivery',
    currentLocation: 'Andheri West Distribution Center, Mumbai',
    estimatedDelivery: '2025-01-16T18:00:00Z',
    trackingNumber: 'FUC123456789',
    courier: 'Delhivery',
    courierLogo: '/api/placeholder/100/40',
    liveUpdates: true,
    timeline: [
      {
        id: 'event-1',
        status: 'order_placed',
        title: 'Order Placed',
        description: 'Your order has been successfully placed',
        location: 'FASHUN.CO.IN',
        timestamp: '2025-01-14T10:30:00Z',
        isCompleted: true,
        isCurrent: false
      },
      {
        id: 'event-2',
        status: 'payment_confirmed',
        title: 'Payment Confirmed',
        description: 'Payment of ₹2,699 received successfully',
        location: 'Payment Gateway',
        timestamp: '2025-01-14T10:32:00Z',
        isCompleted: true,
        isCurrent: false
      },
      {
        id: 'event-3',
        status: 'processing',
        title: 'Order Processing',
        description: 'Your order is being prepared at our warehouse',
        location: 'Mumbai Warehouse',
        timestamp: '2025-01-14T14:00:00Z',
        isCompleted: true,
        isCurrent: false
      },
      {
        id: 'event-4',
        status: 'packed',
        title: 'Order Packed',
        description: 'Your items have been carefully packed and quality checked',
        location: 'Mumbai Warehouse',
        timestamp: '2025-01-15T09:15:00Z',
        isCompleted: true,
        isCurrent: false
      },
      {
        id: 'event-5',
        status: 'shipped',
        title: 'Order Shipped',
        description: 'Your package is on its way to the delivery hub',
        location: 'Mumbai Warehouse',
        timestamp: '2025-01-15T16:30:00Z',
        isCompleted: true,
        isCurrent: false
      },
      {
        id: 'event-6',
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Your package is out for delivery and will arrive today',
        location: 'Andheri West Distribution Center',
        timestamp: '2025-01-16T08:00:00Z',
        isCompleted: false,
        isCurrent: true
      },
      {
        id: 'event-7',
        status: 'delivered',
        title: 'Delivered',
        description: 'Your package will be delivered to your address',
        location: 'Your Address',
        timestamp: '',
        isCompleted: false,
        isCurrent: false
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        type: 'sms',
        title: 'Order Shipped',
        message: 'Your FASHUN order ORD-001 has been shipped. Track: FUC123456789',
        sentAt: '2025-01-15T16:35:00Z',
        isRead: true
      },
      {
        id: 'notif-2',
        type: 'whatsapp',
        title: 'Out for Delivery',
        message: 'Good news! Your package is out for delivery and will arrive today between 3-6 PM',
        sentAt: '2025-01-16T08:05:00Z',
        isRead: false
      }
    ]
  }
]

const mockCourierInfo: { [key: string]: CourierInfo } = {
  'FUC123456789': {
    name: 'Raj Kumar',
    trackingUrl: 'https://delhivery.com/track',
    phone: '+91 98765 43210',
    estimatedTime: '3:00 PM - 6:00 PM',
    vehicleType: 'bike',
    courierRating: 4.8
  }
}

// GET /api/orders/tracking?orderId=xxx&trackingNumber=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const trackingNumber = searchParams.get('trackingNumber')
    const userId = searchParams.get('userId')

    if (!orderId && !trackingNumber) {
      return NextResponse.json(
        { error: 'Order ID or tracking number is required' },
        { status: 400 }
      )
    }

    // Find tracking information
    let tracking = mockOrderTracking.find(t => 
      (orderId && t.orderId === orderId) || 
      (trackingNumber && t.trackingNumber === trackingNumber)
    )

    if (!tracking) {
      return NextResponse.json(
        { error: 'Order tracking information not found' },
        { status: 404 }
      )
    }

    // Check user permission
    if (userId && tracking.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to view this order' },
        { status: 403 }
      )
    }

    // Get courier information
    const courierInfo = mockCourierInfo[tracking.trackingNumber]

    // Calculate delivery progress
    const completedEvents = tracking.timeline.filter(event => event.isCompleted).length
    const totalEvents = tracking.timeline.length
    const progressPercentage = (completedEvents / totalEvents) * 100

    // Get next expected event
    const nextEvent = tracking.timeline.find(event => !event.isCompleted && !event.isCurrent)

    // Calculate estimated time remaining
    const now = new Date()
    const estimatedDelivery = new Date(tracking.estimatedDelivery)
    const timeRemaining = estimatedDelivery.getTime() - now.getTime()
    const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)))

    return NextResponse.json({
      tracking,
      courierInfo,
      progress: {
        percentage: progressPercentage,
        completedSteps: completedEvents,
        totalSteps: totalEvents,
        currentStep: tracking.timeline.find(event => event.isCurrent)?.title || 'Processing'
      },
      delivery: {
        estimatedHours: hoursRemaining,
        nextEvent,
        isDelayed: timeRemaining < 0 && tracking.status !== 'delivered',
        canReschedule: ['shipped', 'out_for_delivery'].includes(tracking.status)
      },
      notifications: tracking.notifications.sort((a, b) => 
        new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      )
    })
  } catch (error) {
    console.error('Error fetching order tracking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    )
  }
}

// POST /api/orders/tracking - Update tracking information (for admin/courier use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      trackingNumber,
      status,
      location,
      description,
      estimatedDelivery,
      courierInfo,
      sendNotification = true
    } = body

    if (!trackingNumber || !status) {
      return NextResponse.json(
        { error: 'Tracking number and status are required' },
        { status: 400 }
      )
    }

    // Find tracking record
    const trackingIndex = mockOrderTracking.findIndex(t => t.trackingNumber === trackingNumber)
    
    if (trackingIndex === -1) {
      return NextResponse.json(
        { error: 'Tracking record not found' },
        { status: 404 }
      )
    }

    const tracking = mockOrderTracking[trackingIndex]

    // Update tracking status
    tracking.status = status
    if (location) tracking.currentLocation = location
    if (estimatedDelivery) tracking.estimatedDelivery = estimatedDelivery

    // Update timeline
    const currentEventIndex = tracking.timeline.findIndex(event => event.status === status)
    if (currentEventIndex !== -1) {
      tracking.timeline[currentEventIndex].isCompleted = true
      tracking.timeline[currentEventIndex].timestamp = new Date().toISOString()
      if (description) {
        tracking.timeline[currentEventIndex].description = description
      }

      // Update current event marker
      tracking.timeline.forEach((event, index) => {
        event.isCurrent = index === currentEventIndex
      })
    }

    // Update courier info
    if (courierInfo && mockCourierInfo[trackingNumber]) {
      Object.assign(mockCourierInfo[trackingNumber], courierInfo)
    }

    // Send notification
    if (sendNotification) {
      const notification: OrderNotification = {
        id: `notif-${Date.now()}`,
        type: 'push',
        title: `Order ${status.replace('_', ' ').toUpperCase()}`,
        message: description || `Your order status has been updated to ${status.replace('_', ' ')}`,
        sentAt: new Date().toISOString(),
        isRead: false
      }
      tracking.notifications.unshift(notification)
    }

    mockOrderTracking[trackingIndex] = tracking

    return NextResponse.json({
      message: 'Tracking information updated successfully',
      tracking,
      notification: sendNotification ? tracking.notifications[0] : null
    })
  } catch (error) {
    console.error('Error updating tracking:', error)
    return NextResponse.json(
      { error: 'Failed to update tracking information' },
      { status: 500 }
    )
  }
}

// PATCH /api/orders/tracking - Reschedule delivery
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { trackingNumber, userId, newDeliveryDate, reason } = body

    if (!trackingNumber || !userId || !newDeliveryDate) {
      return NextResponse.json(
        { error: 'Tracking number, user ID, and new delivery date are required' },
        { status: 400 }
      )
    }

    // Find tracking record
    const tracking = mockOrderTracking.find(t => 
      t.trackingNumber === trackingNumber && t.userId === userId
    )

    if (!tracking) {
      return NextResponse.json(
        { error: 'Order not found or unauthorized' },
        { status: 404 }
      )
    }

    // Check if rescheduling is allowed
    if (!['shipped', 'out_for_delivery'].includes(tracking.status)) {
      return NextResponse.json(
        { error: 'Order cannot be rescheduled at this stage' },
        { status: 400 }
      )
    }

    // Update delivery date
    tracking.estimatedDelivery = newDeliveryDate

    // Add reschedule event to timeline
    const rescheduleEvent: TrackingEvent = {
      id: `event-reschedule-${Date.now()}`,
      status: 'rescheduled',
      title: 'Delivery Rescheduled',
      description: `Delivery rescheduled to ${new Date(newDeliveryDate).toLocaleDateString()}${reason ? ` - Reason: ${reason}` : ''}`,
      location: tracking.currentLocation,
      timestamp: new Date().toISOString(),
      isCompleted: true,
      isCurrent: false
    }

    // Insert reschedule event before the delivery event
    const deliveryEventIndex = tracking.timeline.findIndex(event => event.status === 'delivered')
    if (deliveryEventIndex !== -1) {
      tracking.timeline.splice(deliveryEventIndex, 0, rescheduleEvent)
    }

    // Add notification
    const notification: OrderNotification = {
      id: `notif-reschedule-${Date.now()}`,
      type: 'sms',
      title: 'Delivery Rescheduled',
      message: `Your delivery has been rescheduled to ${new Date(newDeliveryDate).toLocaleDateString()}`,
      sentAt: new Date().toISOString(),
      isRead: false
    }
    tracking.notifications.unshift(notification)

    return NextResponse.json({
      message: 'Delivery rescheduled successfully',
      newDeliveryDate,
      notification
    })
  } catch (error) {
    console.error('Error rescheduling delivery:', error)
    return NextResponse.json(
      { error: 'Failed to reschedule delivery' },
      { status: 500 }
    )
  }
}