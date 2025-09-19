// Recent activities API endpoint for social proof
import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration - in production this would come from real analytics
const generateRecentActivities = () => {
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad',
    'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal'
  ]
  
  const products = [
    'Urban Explorer Hoodie',
    'Street Rebel Tee',
    'Oversized Crew Neck',
    'Graphic Print Hoodie',
    'Minimalist Logo Tee',
    'Vintage Wash Hoodie',
    'Bold Statement Tee',
    'Comfort Fit Joggers',
    'Premium Cotton Hoodie',
    'Limited Edition Tee'
  ]
  
  const firstNames = [
    'Arjun', 'Priya', 'Rohan', 'Sneha', 'Karan', 'Ananya', 'Vikram', 'Ishika',
    'Aditya', 'Riya', 'Sahil', 'Kavya', 'Nikhil', 'Tanvi', 'Rahul', 'Shreya',
    'Aman', 'Divya', 'Akash', 'Pooja', 'Varun', 'Nisha', 'Harsh', 'Meera'
  ]

  const actionTypes = [
    'purchased', 'added to cart', 'signed up', 'subscribed to newsletter'
  ]

  const activities = []
  
  for (let i = 0; i < 10; i++) {
    const randomMinutesAgo = Math.floor(Math.random() * 120) // Within last 2 hours
    const timestamp = new Date(Date.now() - (randomMinutesAgo * 60 * 1000))
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const product = products[Math.floor(Math.random() * products.length)]
    const action = actionTypes[Math.floor(Math.random() * actionTypes.length)]
    
    let message = ''
    if (action === 'purchased') {
      message = `${firstName} from ${city} just bought ${product}`
    } else if (action === 'added to cart') {
      message = `${firstName} from ${city} added ${product} to cart`
    } else if (action === 'signed up') {
      message = `${firstName} from ${city} just signed up`
    } else if (action === 'subscribed to newsletter') {
      message = `${firstName} from ${city} subscribed to our newsletter`
    }

    activities.push({
      id: `activity-${i}-${Date.now()}`,
      message,
      timestamp: timestamp.toISOString(),
      location: city,
      firstName,
      productName: product,
      action,
      minutesAgo: randomMinutesAgo
    })
  }

  // Sort by most recent first
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') // 'purchase', 'signup', 'newsletter', etc.

    let activities = generateRecentActivities()

    // Filter by type if specified
    if (type) {
      activities = activities.filter(activity => 
        activity.action.includes(type) || activity.message.toLowerCase().includes(type.toLowerCase())
      )
    }

    // Limit results
    activities = activities.slice(0, limit)

    // In production, you would fetch real data from your analytics database
    // Example query for real data:
    /*
    const realActivities = await fetchFromDatabase(`
      SELECT 
        customers.first_name,
        customers.city,
        orders.created_at,
        products.name as product_name,
        'purchase' as action_type
      FROM orders 
      JOIN customers ON orders.customer_id = customers.id
      JOIN order_items ON orders.id = order_items.order_id
      JOIN products ON order_items.product_id = products.id
      WHERE orders.created_at > NOW() - INTERVAL 2 HOUR
      ORDER BY orders.created_at DESC
      LIMIT ${limit}
    `)
    */

    return NextResponse.json({
      success: true,
      activities,
      count: activities.length,
      generated_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Recent activities API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch recent activities',
        activities: [] 
      },
      { status: 500 }
    )
  }
}

// POST endpoint to track custom activities
export async function POST(request: NextRequest) {
  try {
    const { 
      action, 
      customerName, 
      location, 
      productName, 
      customerId,
      metadata 
    } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // In production, you would save this to your database
    const activity = {
      id: `custom-${Date.now()}`,
      action,
      customerName: customerName || 'Anonymous',
      location: location || 'Unknown',
      productName,
      customerId,
      metadata,
      timestamp: new Date().toISOString()
    }

    // Log the activity (in production, save to database)
    console.log('Custom activity tracked:', activity)

    // You could also trigger real-time updates to connected clients here
    // using WebSockets, Server-Sent Events, or a real-time service like Pusher

    return NextResponse.json({
      success: true,
      message: 'Activity tracked successfully',
      activity
    })

  } catch (error) {
    console.error('Track activity error:', error)
    return NextResponse.json(
      { error: 'Failed to track activity' },
      { status: 500 }
    )
  }
}
