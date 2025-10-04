import { NextRequest, NextResponse } from 'next/server'

// Helper function to generate mock time series data
function generateTimeSeriesData(days: number, baseValue: number, variance: number = 0.3) {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Add some realistic variation
    const multiplier = 1 + (Math.random() - 0.5) * variance
    const value = Math.round(baseValue * multiplier * 100) / 100
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, value)
    })
  }
  
  return data
}

// Helper function to generate revenue timeline with weekday patterns
function generateRevenueTimeline(days: number) {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Higher revenue on weekends and lower on weekdays
    const dayOfWeek = date.getDay()
    let baseValue = 800
    
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      baseValue = 1200
    } else if (dayOfWeek === 1 || dayOfWeek === 2) { // Monday/Tuesday
      baseValue = 600
    }
    
    // Add random variation
    const multiplier = 1 + (Math.random() - 0.5) * 0.4
    const value = Math.round(baseValue * multiplier * 100) / 100
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(100, value)
    })
  }
  
  return data
}

// Helper function to generate order timeline
function generateOrderTimeline(days: number) {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Base number of orders per day
    const baseOrders = Math.floor(Math.random() * 20) + 10
    const baseRevenue = Math.floor(Math.random() * 2000) + 800
    
    data.push({
      date: date.toISOString().split('T')[0],
      orders: baseOrders,
      revenue: baseRevenue
    })
  }
  
  return data
}

// Helper function to generate customer timeline
function generateCustomerTimeline(days: number) {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    const newCustomers = Math.floor(Math.random() * 15) + 2
    const returningCustomers = Math.floor(Math.random() * 25) + 5
    
    data.push({
      date: date.toISOString().split('T')[0],
      new: newCustomers,
      returning: returningCustomers
    })
  }
  
  return data
}

// GET - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const dateRange = searchParams.get('dateRange') || '30' // days
    const metric = searchParams.get('metric') || 'all'
    const days = parseInt(dateRange)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Generate mock analytics data
    const analyticsData = {
      revenue: {
        current: 24567.89 + Math.floor(Math.random() * 5000),
        previous: 21234.56 + Math.floor(Math.random() * 3000),
        change: Math.round((Math.random() * 30 - 5) * 10) / 10, // -5% to +25%
        timeline: generateRevenueTimeline(days),
        breakdown: {
          online: 18450.67,
          inStore: 6117.22
        }
      },
      orders: {
        total: 432 + Math.floor(Math.random() * 100),
        completed: 387 + Math.floor(Math.random() * 50),
        pending: 28 + Math.floor(Math.random() * 20),
        cancelled: 17 + Math.floor(Math.random() * 10),
        refunded: 8 + Math.floor(Math.random() * 5),
        timeline: generateOrderTimeline(days),
        averageValue: 56.79 + Math.random() * 20,
        conversionRate: 3.42 + Math.random() * 2
      },
      customers: {
        total: 1247 + Math.floor(Math.random() * 300),
        new: 89 + Math.floor(Math.random() * 50),
        returning: 158 + Math.floor(Math.random() * 80),
        churnRate: 12.3 + Math.random() * 5,
        timeline: generateCustomerTimeline(days),
        ltv: 234.56 + Math.random() * 100, // Lifetime value
        retention: {
          day1: 85.2,
          day7: 68.4,
          day30: 42.1,
          day90: 28.7
        }
      },
      products: {
        totalViews: 12547 + Math.floor(Math.random() * 5000),
        topProducts: [
          { 
            id: '1', 
            name: 'Premium Streetwear Hoodie', 
            views: 1247 + Math.floor(Math.random() * 500), 
            revenue: 8934.56 + Math.random() * 2000, 
            image: '/api/placeholder/60/60',
            conversionRate: 4.2 + Math.random() * 2
          },
          { 
            id: '2', 
            name: 'Limited Edition Graphic Tee', 
            views: 987 + Math.floor(Math.random() * 300), 
            revenue: 4567.89 + Math.random() * 1000, 
            image: '/api/placeholder/60/60',
            conversionRate: 3.8 + Math.random() * 2
          },
          { 
            id: '3', 
            name: 'Designer Denim Jacket', 
            views: 876 + Math.floor(Math.random() * 200), 
            revenue: 6789.34 + Math.random() * 1500, 
            image: '/api/placeholder/60/60',
            conversionRate: 5.1 + Math.random() * 2
          },
          { 
            id: '4', 
            name: 'Urban Cargo Pants', 
            views: 654 + Math.floor(Math.random() * 150), 
            revenue: 3456.78 + Math.random() * 800, 
            image: '/api/placeholder/60/60',
            conversionRate: 2.9 + Math.random() * 2
          },
          { 
            id: '5', 
            name: 'Street Classic Sneakers', 
            views: 543 + Math.floor(Math.random() * 100), 
            revenue: 5432.10 + Math.random() * 1200, 
            image: '/api/placeholder/60/60',
            conversionRate: 6.2 + Math.random() * 2
          }
        ],
        categoryBreakdown: [
          { category: 'Hoodies', sales: 156 + Math.floor(Math.random() * 50), revenue: 14234.56 + Math.random() * 3000 },
          { category: 'T-Shirts', sales: 243 + Math.floor(Math.random() * 80), revenue: 8976.34 + Math.random() * 2000 },
          { category: 'Jackets', sales: 87 + Math.floor(Math.random() * 30), revenue: 12456.78 + Math.random() * 2500 },
          { category: 'Pants', sales: 134 + Math.floor(Math.random() * 40), revenue: 7654.32 + Math.random() * 1500 },
          { category: 'Shoes', sales: 98 + Math.floor(Math.random() * 35), revenue: 9876.54 + Math.random() * 2000 }
        ]
      },
      traffic: {
        totalVisits: 15678 + Math.floor(Math.random() * 5000),
        uniqueVisitors: 8934 + Math.floor(Math.random() * 2000),
        bounceRate: 34.5 + Math.random() * 10,
        avgSessionDuration: 245 + Math.floor(Math.random() * 100), // seconds
        pageViews: 45234 + Math.floor(Math.random() * 10000),
        sources: [
          { source: 'Organic Search', visitors: 4523 + Math.floor(Math.random() * 1000), percentage: 50.6 + Math.random() * 5 },
          { source: 'Direct', visitors: 2134 + Math.floor(Math.random() * 500), percentage: 23.9 + Math.random() * 3 },
          { source: 'Social Media', visitors: 1456 + Math.floor(Math.random() * 400), percentage: 16.3 + Math.random() * 3 },
          { source: 'Email', visitors: 567 + Math.floor(Math.random() * 200), percentage: 6.3 + Math.random() * 2 },
          { source: 'Referral', visitors: 254 + Math.floor(Math.random() * 100), percentage: 2.9 + Math.random() * 1 }
        ],
        devices: {
          mobile: 65.4 + Math.random() * 5,
          desktop: 28.2 + Math.random() * 5,
          tablet: 6.4 + Math.random() * 2
        },
        browsers: {
          chrome: 68.2,
          safari: 18.4,
          firefox: 8.1,
          edge: 4.3,
          other: 1.0
        }
      },
      conversion: {
        rate: 3.42 + Math.random() * 2,
        funnel: [
          { step: 'Visitors', visitors: 8934 + Math.floor(Math.random() * 2000), percentage: 100 },
          { step: 'Product Views', visitors: 6234 + Math.floor(Math.random() * 1000), percentage: 69.8 + Math.random() * 5 },
          { step: 'Add to Cart', visitors: 1456 + Math.floor(Math.random() * 300), percentage: 23.4 + Math.random() * 5 },
          { step: 'Checkout Started', visitors: 567 + Math.floor(Math.random() * 100), percentage: 38.9 + Math.random() * 8 },
          { step: 'Purchase Completed', visitors: 305 + Math.floor(Math.random() * 50), percentage: 53.8 + Math.random() * 10 }
        ],
        abandonmentReasons: [
          { reason: 'High shipping cost', percentage: 32.1 },
          { reason: 'Required registration', percentage: 24.7 },
          { reason: 'Long checkout process', percentage: 18.5 },
          { reason: 'Payment issues', percentage: 12.8 },
          { reason: 'Price comparison', percentage: 11.9 }
        ]
      },
      performance: {
        pageLoadTime: 2.3 + Math.random() * 1,
        serverResponseTime: 180 + Math.floor(Math.random() * 100),
        coreWebVitals: {
          lcp: 1.8 + Math.random() * 0.5, // Largest Contentful Paint
          fid: 45 + Math.random() * 20, // First Input Delay (ms)
          cls: 0.08 + Math.random() * 0.05 // Cumulative Layout Shift
        },
        uptime: 99.94 + Math.random() * 0.05,
        errorRate: 0.12 + Math.random() * 0.08
      },
      marketing: {
        campaigns: [
          { name: 'Winter Sale 2024', clicks: 12450, conversions: 423, spend: 2340.50, roi: 4.2 },
          { name: 'New Year Collection', clicks: 8930, conversions: 267, spend: 1890.25, roi: 3.1 },
          { name: 'Social Media Push', clicks: 5670, conversions: 189, spend: 1245.75, roi: 2.8 }
        ],
        socialMetrics: {
          instagram: { followers: 24567, engagement: 4.2, posts: 45 },
          facebook: { followers: 18234, engagement: 2.8, posts: 32 },
          twitter: { followers: 9876, engagement: 3.1, posts: 78 },
          tiktok: { followers: 15432, engagement: 6.7, posts: 23 }
        }
      }
    }
    
    // Filter data based on metric parameter
    if (metric !== 'all') {
      return NextResponse.json({
        success: true,
        data: {
          [metric]: analyticsData[metric as keyof typeof analyticsData],
          dateRange: days,
          generatedAt: new Date().toISOString()
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...analyticsData,
        dateRange: days,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

// POST - Generate custom analytics report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      metrics = ['revenue', 'orders', 'customers'],
      dateRange = { start: '2024-01-01', end: '2024-01-31' },
      filters = {},
      format = 'json'
    } = body
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const reportData = {
      reportId: `report_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      dateRange,
      metrics,
      filters,
      summary: {
        totalRevenue: 45623.78,
        totalOrders: 789,
        averageOrderValue: 57.83,
        customerGrowth: 12.4,
        conversionRate: 3.67
      },
      data: {
        // This would contain the actual filtered data based on the request
        daily: generateTimeSeriesData(31, 1500),
        weekly: generateTimeSeriesData(4, 10500),
        monthly: generateTimeSeriesData(1, 45623.78)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: reportData,
      message: 'Custom analytics report generated successfully'
    })
  } catch (error) {
    console.error('Error generating analytics report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate analytics report' },
      { status: 500 }
    )
  }
}

// PUT - Update analytics settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      dashboardConfig = {},
      alertSettings = {},
      reportSchedule = {}
    } = body
    
    // In a real application, these would be saved to a database
    const updatedSettings = {
      dashboardConfig: {
        defaultDateRange: dashboardConfig.defaultDateRange || '30',
        refreshInterval: dashboardConfig.refreshInterval || 300, // seconds
        defaultMetrics: dashboardConfig.defaultMetrics || ['revenue', 'orders', 'customers'],
        ...dashboardConfig
      },
      alertSettings: {
        enabled: alertSettings.enabled !== false,
        thresholds: {
          revenueDropPercent: alertSettings.thresholds?.revenueDropPercent || 10,
          orderVolumeDropPercent: alertSettings.thresholds?.orderVolumeDropPercent || 15,
          conversionRateDropPercent: alertSettings.thresholds?.conversionRateDropPercent || 20,
          ...alertSettings.thresholds
        },
        notifications: {
          email: alertSettings.notifications?.email !== false,
          slack: alertSettings.notifications?.slack || false,
          sms: alertSettings.notifications?.sms || false,
          ...alertSettings.notifications
        },
        ...alertSettings
      },
      reportSchedule: {
        daily: reportSchedule.daily || false,
        weekly: reportSchedule.weekly || true,
        monthly: reportSchedule.monthly || true,
        recipients: reportSchedule.recipients || [],
        ...reportSchedule
      },
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Analytics settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating analytics settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update analytics settings' },
      { status: 500 }
    )
  }
}