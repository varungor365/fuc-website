import { NextRequest, NextResponse } from 'next/server'

// Mock data for development - replace with real database queries
const mockDashboardData = {
  revenue: {
    today: 45000,
    yesterday: 38000,
    week: 280000,
    month: 1200000,
    trend: [32000, 35000, 42000, 38000, 51000, 48000, 45000],
    percentageChange: 18.4
  },
  orders: {
    total: 156,
    pending: 23,
    processing: 45,
    completed: 82,
    cancelled: 6,
    avgValue: 2890
  },
  customers: {
    total: 1247,
    new: 18,
    active: 892,
    ltv: 12450
  },
  products: {
    total: 89,
    lowStock: 12,
    outOfStock: 3,
    topSelling: [
      {
        id: 'hoodie-001',
        name: 'Essential Oversized Hoodie',
        image: '/images/products/hoodies/hoodie-1-main.jpg',
        unitsSold: 45,
        revenue: 35955
      },
      {
        id: 'tshirt-001',
        name: 'Urban Graphic Tee',
        image: '/images/products/t-shirts/tshirt-1-main.jpg',
        unitsSold: 38,
        revenue: 11382
      },
      {
        id: 'hoodie-002',
        name: 'Graffiti Print Hoodie',
        image: '/images/products/hoodies/hoodie-2-main.jpg',
        unitsSold: 32,
        revenue: 28768
      },
      {
        id: 'tshirt-002',
        name: 'Anime Character Tee',
        image: '/images/products/t-shirts/tshirt-2-main.jpg',
        unitsSold: 29,
        revenue: 10141
      }
    ]
  },
  traffic: {
    activeUsers: 127,
    pageViews: 2456,
    topPages: [
      { page: '/collections/hoodies', views: 456 },
      { page: '/products/hoodie-001', views: 389 },
      { page: '/', views: 356 },
      { page: '/collections/tshirts', views: 234 },
      { page: '/products/tshirt-001', views: 189 }
    ],
    bounceRate: 42.3
  },
  ai: {
    recommendations: 89,
    visualSearch: 23,
    chatbot: 67,
    sizeRec: 34
  },
  systemHealth: {
    services: [
      { name: 'Strapi CMS', status: 'up' as const, responseTime: 145 },
      { name: 'OpenAI API', status: 'up' as const, responseTime: 892 },
      { name: 'Razorpay API', status: 'up' as const, responseTime: 234 },
      { name: 'Stripe API', status: 'up' as const, responseTime: 178 },
      { name: 'Cloudinary', status: 'up' as const, responseTime: 98 }
    ],
    avgResponseTime: 309,
    errorCount: 3
  },
  recentActivity: {
    orders: [
      { id: 'ORD-2024-001', customerName: 'Rahul Sharma', amount: 2999, status: 'completed', time: '2 min ago' },
      { id: 'ORD-2024-002', customerName: 'Priya Patel', amount: 1599, status: 'processing', time: '5 min ago' },
      { id: 'ORD-2024-003', customerName: 'Amit Kumar', amount: 3499, status: 'pending', time: '12 min ago' },
      { id: 'ORD-2024-004', customerName: 'Sneha Singh', amount: 899, status: 'completed', time: '18 min ago' },
      { id: 'ORD-2024-005', customerName: 'Vikram Gupta', amount: 2299, status: 'completed', time: '25 min ago' }
    ],
    signups: [
      { name: 'Arjun Mehta', email: 'arjun@example.com', time: '1 hour ago' },
      { name: 'Kavya Nair', email: 'kavya@example.com', time: '2 hours ago' },
      { name: 'Rohit Jain', email: 'rohit@example.com', time: '3 hours ago' }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    // In production, replace this with actual database queries
    // Example queries you would implement:
    
    // const today = new Date().toISOString().split('T')[0]
    // const revenue = await db.orders.aggregate({
    //   where: { status: 'completed', createdAt: { gte: today } },
    //   _sum: { total: true }
    // })
    
    // const orders = await db.orders.groupBy({
    //   by: ['status'],
    //   _count: { id: true }
    // })
    
    // For now, return mock data
    return NextResponse.json(mockDashboardData)
    
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

// Helper function to check admin authentication
function isAdminAuthenticated(request: NextRequest): boolean {
  // In production, implement proper admin authentication
  // Check JWT token, session, etc.
  const authHeader = request.headers.get('authorization')
  return authHeader === 'Bearer admin-token' // Replace with real auth check
}

// POST endpoint for refreshing data
export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Implement cache refresh logic here
    // await refreshDashboardCache()
    
    return NextResponse.json({ message: 'Dashboard data refreshed' })
    
  } catch (error) {
    console.error('Dashboard refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh dashboard data' },
      { status: 500 }
    )
  }
}