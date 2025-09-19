// User profile API endpoint
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    username: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = params

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Fetch customer profile from Strapi
    const customer = await fetchCustomerProfile(username)
    
    if (!customer) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check privacy settings
    if (!customer.privacySettings.profilePublic) {
      return NextResponse.json(
        { error: 'Profile is private' },
        { status: 403 }
      )
    }

    // Fetch user's designs if public
    let designs: any[] = []
    if (customer.privacySettings.creationsPublic) {
      designs = await fetchUserDesigns(customer.id)
    }

    // Fetch user's orders if public
    let orders: any[] = []
    if (customer.privacySettings.wardrobePublic) {
      orders = await fetchUserOrders(customer.id)
    }

    // Remove sensitive information
    const publicProfile = {
      id: customer.id,
      username: customer.username,
      firstName: customer.firstName,
      lastName: customer.lastName,
      bio: customer.bio,
      location: customer.location,
      avatar: customer.avatar,
      loyaltyPoints: customer.loyaltyPoints,
      loyaltyTier: customer.loyaltyTier,
      orderCount: customer.orderCount,
      totalSpent: customer.totalSpent,
      badges: customer.badges,
      socialLinks: customer.socialLinks,
      privacySettings: customer.privacySettings,
      memberSince: customer.createdAt
    }

    return NextResponse.json({
      success: true,
      customer: publicProfile,
      designs,
      orders: orders.map((order: any) => ({
        id: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items?.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          product: {
            id: item.product?.id,
            name: item.product?.name,
            images: item.product?.images?.slice(0, 1) // Only first image for privacy
          }
        })) || []
      }))
    })

  } catch (error) {
    console.error('User profile API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

async function fetchCustomerProfile(username: string) {
  try {
    const strapiUrl = process.env.STRAPI_URL
    const strapiToken = process.env.STRAPI_API_TOKEN

    if (!strapiUrl || !strapiToken) {
      throw new Error('Strapi configuration missing')
    }

    const response = await fetch(
      `${strapiUrl}/api/customers?filters[username][$eq]=${username}&populate=avatar`,
      {
        headers: {
          'Authorization': `Bearer ${strapiToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch customer from Strapi')
    }

    const data = await response.json()
    
    if (data.data && data.data.length > 0) {
      return {
        id: data.data[0].id,
        ...data.data[0].attributes,
        createdAt: data.data[0].attributes.createdAt
      }
    }

    return null

  } catch (error) {
    console.error('Error fetching customer profile:', error)
    // Return mock data for development
    return generateMockCustomer(username)
  }
}

async function fetchUserDesigns(customerId: string) {
  try {
    // In production, this would fetch from a designs table
    // For now, return mock data based on customer's saved designs
    return generateMockDesigns(customerId)
  } catch (error) {
    console.error('Error fetching user designs:', error)
    return []
  }
}

async function fetchUserOrders(customerId: string) {
  try {
    const strapiUrl = process.env.STRAPI_URL
    const strapiToken = process.env.STRAPI_API_TOKEN

    if (!strapiUrl || !strapiToken) {
      return generateMockOrders(customerId)
    }

    const response = await fetch(
      `${strapiUrl}/api/orders?filters[customer][id][$eq]=${customerId}&populate=items.product.images&sort=createdAt:desc&pagination[limit]=20`,
      {
        headers: {
          'Authorization': `Bearer ${strapiToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch orders from Strapi')
    }

    const data = await response.json()
    return data.data.map((order: any) => ({
      id: order.id,
      ...order.attributes
    }))

  } catch (error) {
    console.error('Error fetching user orders:', error)
    return generateMockOrders(customerId)
  }
}

// Mock data generators for development
function generateMockCustomer(username: string) {
  const mockCustomers: Record<string, any> = {
    'arjun_streetwear': {
      id: '1',
      username: 'arjun_streetwear',
      firstName: 'Arjun',
      lastName: 'Kumar',
      bio: 'Streetwear enthusiast and designer. Creating unique pieces that blend Indian culture with urban fashion.',
      location: 'Mumbai, India',
      loyaltyPoints: 2450,
      loyaltyTier: 'Gold',
      orderCount: 12,
      totalSpent: 24500,
      badges: ['first_purchase', 'designer', 'trendsetter'],
      socialLinks: {
        instagram: 'arjun_streetwear',
        twitter: 'arjun_designs'
      },
      privacySettings: {
        profilePublic: true,
        wardrobePublic: true,
        creationsPublic: true
      },
      createdAt: '2024-01-15T10:30:00Z'
    },
    'priya_minimal': {
      id: '2',
      username: 'priya_minimal',
      firstName: 'Priya',
      lastName: 'Sharma',
      bio: 'Minimalist fashion lover. Less is more.',
      location: 'Delhi, India',
      loyaltyPoints: 1200,
      loyaltyTier: 'Silver',
      orderCount: 6,
      totalSpent: 12000,
      badges: ['first_purchase', 'loyal_customer'],
      socialLinks: {
        instagram: 'priya_minimal'
      },
      privacySettings: {
        profilePublic: true,
        wardrobePublic: false,
        creationsPublic: true
      },
      createdAt: '2024-03-20T14:45:00Z'
    }
  }

  return mockCustomers[username] || null
}

function generateMockDesigns(customerId: string) {
  const designs = [
    {
      id: '1',
      name: 'Urban Mandala',
      thumbnail: '/images/designs/urban-mandala.jpg',
      createdAt: '2024-11-15T10:30:00Z',
      isPublic: true,
      likes: 24,
      category: 'Graphic'
    },
    {
      id: '2',
      name: 'Street Typography',
      thumbnail: '/images/designs/street-typography.jpg',
      createdAt: '2024-11-10T16:20:00Z',
      isPublic: true,
      likes: 31,
      category: 'Typography'
    },
    {
      id: '3',
      name: 'Minimal Lines',
      thumbnail: '/images/designs/minimal-lines.jpg',
      createdAt: '2024-11-05T09:15:00Z',
      isPublic: true,
      likes: 18,
      category: 'Minimal'
    }
  ]

  return designs
}

function generateMockOrders(customerId: string) {
  const orders = [
    {
      id: '1',
      status: 'delivered',
      total: 2999,
      createdAt: '2024-11-20T12:00:00Z',
      items: [
        {
          id: '1',
          quantity: 1,
          product: {
            id: '1',
            name: 'Urban Explorer Hoodie',
            images: [{ url: '/images/products/hoodie-1.jpg' }]
          }
        }
      ]
    },
    {
      id: '2',
      status: 'shipped',
      total: 4599,
      createdAt: '2024-11-18T15:30:00Z',
      items: [
        {
          id: '2',
          quantity: 2,
          product: {
            id: '2',
            name: 'Street Rebel Tee',
            images: [{ url: '/images/products/tee-1.jpg' }]
          }
        }
      ]
    }
  ]

  return orders
}
