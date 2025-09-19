import { NextResponse } from 'next/server'

// Enhanced campaign content types with template management
interface CampaignTemplate {
  id: number
  name: string
  type: 'email' | 'social' | 'banner' | 'sms'
  category: 'product_launch' | 'sale' | 'seasonal' | 'retention' | 'acquisition'
  subject?: string
  content: string
  variables: string[]
  thumbnail: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  usage: number
  performance: {
    openRate?: number
    clickRate?: number
    conversionRate?: number
    engagement?: number
  }
}

interface Campaign {
  id: number
  name: string
  type: 'email' | 'social' | 'banner' | 'sms'
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'
  templateId: number
  audience: {
    segments: string[]
    totalRecipients: number
    filters: any[]
  }
  schedule: {
    startDate: string
    endDate?: string
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly'
    timezone: string
  }
  content: {
    subject?: string
    body: string
    images: string[]
    cta: {
      text: string
      url: string
    }[]
  }
  analytics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
    revenue: number
  }
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface ContentAsset {
  id: number
  name: string
  type: 'image' | 'video' | 'gif' | 'template'
  category: string
  url: string
  thumbnail: string
  size: number
  dimensions?: {
    width: number
    height: number
  }
  tags: string[]
  usageCount: number
  createdAt: string
}

// Mock campaign templates
const mockTemplates: CampaignTemplate[] = [
  {
    id: 1,
    name: 'New Product Launch Email',
    type: 'email',
    category: 'product_launch',
    subject: 'Introducing {{productName}} - Limited Time Offer!',
    content: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1>🎉 New Arrival: {{productName}}</h1>
        <img src="{{productImage}}" alt="{{productName}}" style="width: 100%; max-width: 400px;">
        <p>We're excited to introduce our latest addition to the FASHUN collection!</p>
        <p>{{productDescription}}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{productUrl}}" style="background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
            Shop Now - {{discount}}% OFF
          </a>
        </div>
        <p><small>Valid until {{expiryDate}}. Terms apply.</small></p>
      </div>
    `,
    variables: ['productName', 'productImage', 'productDescription', 'productUrl', 'discount', 'expiryDate'],
    thumbnail: '/api/placeholder/300/200',
    isActive: true,
    createdAt: '2024-12-01',
    updatedAt: '2024-12-15',
    usage: 25,
    performance: {
      openRate: 28.5,
      clickRate: 5.2,
      conversionRate: 2.1
    }
  },
  {
    id: 2,
    name: 'Flash Sale Social Post',
    type: 'social',
    category: 'sale',
    content: `
      🔥 FLASH SALE ALERT! 🔥
      
      {{saleTitle}}
      
      ⚡ {{discount}}% OFF everything
      ⏰ Only {{duration}} left!
      🛍️ Shop now: {{storeUrl}}
      
      #FASHUN #FlashSale #StreetFashion #LimitedTime
      
      {{productImage}}
    `,
    variables: ['saleTitle', 'discount', 'duration', 'storeUrl', 'productImage'],
    thumbnail: '/api/placeholder/300/200',
    isActive: true,
    createdAt: '2024-12-05',
    updatedAt: '2024-12-14',
    usage: 18,
    performance: {
      engagement: 8.7,
      clickRate: 3.4,
      conversionRate: 1.8
    }
  },
  {
    id: 3,
    name: 'Seasonal Collection Banner',
    type: 'banner',
    category: 'seasonal',
    content: `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; position: relative;">
        <h2 style="font-size: 2.5em; margin: 0;">{{seasonTitle}}</h2>
        <p style="font-size: 1.2em; margin: 10px 0;">{{seasonDescription}}</p>
        <button style="background: white; color: #667eea; border: none; padding: 15px 30px; font-size: 1.1em; border-radius: 25px; cursor: pointer;">
          Shop {{seasonName}} Collection
        </button>
        <img src="{{seasonImage}}" style="position: absolute; right: 20px; top: 20px; width: 200px; opacity: 0.3;">
      </div>
    `,
    variables: ['seasonTitle', 'seasonDescription', 'seasonName', 'seasonImage'],
    thumbnail: '/api/placeholder/300/200',
    isActive: true,
    createdAt: '2024-11-15',
    updatedAt: '2024-12-10',
    usage: 12,
    performance: {
      clickRate: 6.8,
      conversionRate: 3.2
    }
  },
  {
    id: 4,
    name: 'Customer Retention SMS',
    type: 'sms',
    category: 'retention',
    content: 'Hi {{customerName}}! We miss you at FASHUN. Enjoy {{discount}}% off your next order with code {{promoCode}}. Valid until {{expiryDate}}. Shop: {{storeUrl}}',
    variables: ['customerName', 'discount', 'promoCode', 'expiryDate', 'storeUrl'],
    thumbnail: '/api/placeholder/300/200',
    isActive: true,
    createdAt: '2024-11-20',
    updatedAt: '2024-12-12',
    usage: 35,
    performance: {
      clickRate: 12.3,
      conversionRate: 4.7
    }
  }
]

// Mock campaigns
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'Winter Collection Launch',
    type: 'email',
    status: 'active',
    templateId: 1,
    audience: {
      segments: ['VIP Customers', 'Email Subscribers'],
      totalRecipients: 15420,
      filters: [
        { field: 'engagement', operator: 'high' },
        { field: 'location', operator: 'includes', value: ['Mumbai', 'Delhi', 'Bangalore'] }
      ]
    },
    schedule: {
      startDate: '2024-12-15T10:00:00Z',
      endDate: '2024-12-25T23:59:59Z',
      frequency: 'once',
      timezone: 'Asia/Kolkata'
    },
    content: {
      subject: 'Introducing Winter Essentials - 30% OFF Limited Time!',
      body: 'Populated from template with winter collection variables',
      images: ['/api/placeholder/400/300', '/api/placeholder/300/300'],
      cta: [
        { text: 'Shop Winter Collection', url: '/collections/winter' },
        { text: 'View All Offers', url: '/sale' }
      ]
    },
    analytics: {
      sent: 15420,
      delivered: 15156,
      opened: 4320,
      clicked: 648,
      converted: 189,
      revenue: 94500
    },
    createdAt: '2024-12-10',
    updatedAt: '2024-12-15',
    createdBy: 'marketing@fashun.co.in'
  },
  {
    id: 2,
    name: 'Black Friday Social Blitz',
    type: 'social',
    status: 'completed',
    templateId: 2,
    audience: {
      segments: ['Instagram Followers', 'Facebook Fans'],
      totalRecipients: 45600,
      filters: [
        { field: 'platform', operator: 'includes', value: ['instagram', 'facebook'] },
        { field: 'age', operator: 'between', value: [18, 35] }
      ]
    },
    schedule: {
      startDate: '2024-11-29T00:00:00Z',
      endDate: '2024-11-29T23:59:59Z',
      frequency: 'once',
      timezone: 'Asia/Kolkata'
    },
    content: {
      body: 'BLACK FRIDAY MEGA SALE! 50% OFF everything for 24 hours only!',
      images: ['/api/placeholder/600/600'],
      cta: [
        { text: 'Shop Now', url: '/black-friday' }
      ]
    },
    analytics: {
      sent: 45600,
      delivered: 45600,
      opened: 0, // Not applicable for social
      clicked: 3648,
      converted: 547,
      revenue: 273500
    },
    createdAt: '2024-11-25',
    updatedAt: '2024-11-30',
    createdBy: 'social@fashun.co.in'
  }
]

// Mock content assets
const mockAssets: ContentAsset[] = [
  {
    id: 1,
    name: 'Winter Collection Hero Image',
    type: 'image',
    category: 'product',
    url: '/api/placeholder/1200/600',
    thumbnail: '/api/placeholder/300/150',
    size: 245760,
    dimensions: { width: 1200, height: 600 },
    tags: ['winter', 'collection', 'hero', 'fashion'],
    usageCount: 15,
    createdAt: '2024-12-01'
  },
  {
    id: 2,
    name: 'Black Friday Animated Banner',
    type: 'gif',
    category: 'promotional',
    url: '/api/placeholder/800/400',
    thumbnail: '/api/placeholder/300/150',
    size: 512000,
    dimensions: { width: 800, height: 400 },
    tags: ['black friday', 'sale', 'animated', 'banner'],
    usageCount: 8,
    createdAt: '2024-11-20'
  },
  {
    id: 3,
    name: 'Product Showcase Video',
    type: 'video',
    category: 'product',
    url: '/api/placeholder/video/1920/1080',
    thumbnail: '/api/placeholder/300/169',
    size: 15728640,
    dimensions: { width: 1920, height: 1080 },
    tags: ['product', 'showcase', 'video', 'demo'],
    usageCount: 22,
    createdAt: '2024-11-15'
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const endpoint = searchParams.get('endpoint')

  try {
    if (endpoint === 'templates') {
      const templateType = searchParams.get('templateType')
      const category = searchParams.get('category')
      
      let templates = mockTemplates
      
      if (templateType) {
        templates = templates.filter(t => t.type === templateType)
      }
      
      if (category) {
        templates = templates.filter(t => t.category === category)
      }
      
      return NextResponse.json({
        success: true,
        data: {
          templates,
          categories: ['product_launch', 'sale', 'seasonal', 'retention', 'acquisition'],
          types: ['email', 'social', 'banner', 'sms']
        }
      })
    }

    if (endpoint === 'campaigns') {
      const status = searchParams.get('status')
      const campaignType = searchParams.get('campaignType')
      
      let campaigns = mockCampaigns
      
      if (status) {
        campaigns = campaigns.filter(c => c.status === status)
      }
      
      if (campaignType) {
        campaigns = campaigns.filter(c => c.type === campaignType)
      }
      
      return NextResponse.json({
        success: true,
        data: {
          campaigns,
          summary: {
            totalCampaigns: mockCampaigns.length,
            activeCampaigns: mockCampaigns.filter(c => c.status === 'active').length,
            totalSent: mockCampaigns.reduce((sum, c) => sum + c.analytics.sent, 0),
            totalRevenue: mockCampaigns.reduce((sum, c) => sum + c.analytics.revenue, 0),
            avgOpenRate: mockCampaigns
              .filter(c => c.type === 'email')
              .reduce((sum, c, _, arr) => sum + (c.analytics.opened / c.analytics.sent * 100) / arr.length, 0),
            avgClickRate: mockCampaigns
              .reduce((sum, c, _, arr) => sum + (c.analytics.clicked / c.analytics.sent * 100) / arr.length, 0)
          }
        }
      })
    }

    if (endpoint === 'assets') {
      const assetType = searchParams.get('assetType')
      const assetCategory = searchParams.get('assetCategory')
      
      let assets = mockAssets
      
      if (assetType) {
        assets = assets.filter(a => a.type === assetType)
      }
      
      if (assetCategory) {
        assets = assets.filter(a => a.category === assetCategory)
      }
      
      return NextResponse.json({
        success: true,
        data: {
          assets,
          categories: ['product', 'promotional', 'seasonal', 'brand'],
          types: ['image', 'video', 'gif', 'template'],
          totalStorage: mockAssets.reduce((sum, a) => sum + a.size, 0)
        }
      })
    }

    if (endpoint === 'analytics') {
      const period = searchParams.get('period') || '30d'
      
      return NextResponse.json({
        success: true,
        data: {
          campaignPerformance: {
            email: {
              sent: 45680,
              delivered: 44523,
              opened: 12147,
              clicked: 1823,
              converted: 456,
              revenue: 228000,
              openRate: 27.3,
              clickRate: 4.1,
              conversionRate: 1.0
            },
            social: {
              posts: 24,
              reach: 156000,
              engagement: 13560,
              clicks: 3420,
              converted: 342,
              revenue: 171000,
              engagementRate: 8.7,
              clickRate: 2.2,
              conversionRate: 0.22
            },
            sms: {
              sent: 12450,
              delivered: 12203,
              clicked: 1464,
              converted: 293,
              revenue: 146500,
              deliveryRate: 98.0,
              clickRate: 12.0,
              conversionRate: 2.4
            }
          },
          topPerformingTemplates: [
            { id: 1, name: 'New Product Launch Email', conversions: 456, revenue: 228000 },
            { id: 4, name: 'Customer Retention SMS', conversions: 293, revenue: 146500 },
            { id: 2, name: 'Flash Sale Social Post', conversions: 342, revenue: 171000 }
          ],
          recentCampaigns: mockCampaigns.slice(0, 5),
          contentUsage: {
            mostUsed: mockAssets.sort((a, b) => b.usageCount - a.usageCount).slice(0, 5),
            recentlyAdded: mockAssets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
          }
        }
      })
    }

    // Default dashboard data
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalCampaigns: mockCampaigns.length,
          activeCampaigns: mockCampaigns.filter(c => c.status === 'active').length,
          totalTemplates: mockTemplates.length,
          totalAssets: mockAssets.length,
          totalRevenue: mockCampaigns.reduce((sum, c) => sum + c.analytics.revenue, 0),
          avgPerformance: {
            openRate: 27.3,
            clickRate: 5.8,
            conversionRate: 2.1
          }
        },
        recentCampaigns: mockCampaigns.slice(0, 3),
        topTemplates: mockTemplates.sort((a, b) => b.usage - a.usage).slice(0, 3),
        quickStats: {
          emailsSent: mockCampaigns.filter(c => c.type === 'email').reduce((sum, c) => sum + c.analytics.sent, 0),
          socialPosts: mockCampaigns.filter(c => c.type === 'social').length,
          smsSent: mockCampaigns.filter(c => c.type === 'sms').reduce((sum, c) => sum + c.analytics.sent, 0),
          totalConversions: mockCampaigns.reduce((sum, c) => sum + c.analytics.converted, 0)
        }
      }
    })

  } catch (error) {
    console.error('Marketing campaigns API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch marketing data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()

    if (type === 'campaign') {
      const newCampaign: Campaign = {
        id: mockCampaigns.length + 1,
        name: data.name,
        type: data.type,
        status: 'draft',
        templateId: data.templateId,
        audience: data.audience,
        schedule: data.schedule,
        content: data.content,
        analytics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          revenue: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: data.createdBy || 'admin@fashun.co.in'
      }

      mockCampaigns.push(newCampaign)

      return NextResponse.json({
        success: true,
        data: newCampaign,
        message: 'Campaign created successfully'
      })
    }

    if (type === 'template') {
      const newTemplate: CampaignTemplate = {
        id: mockTemplates.length + 1,
        name: data.name,
        type: data.type,
        category: data.category,
        subject: data.subject,
        content: data.content,
        variables: data.variables || [],
        thumbnail: data.thumbnail || '/api/placeholder/300/200',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usage: 0,
        performance: {}
      }

      mockTemplates.push(newTemplate)

      return NextResponse.json({
        success: true,
        data: newTemplate,
        message: 'Template created successfully'
      })
    }

    if (type === 'asset') {
      const newAsset: ContentAsset = {
        id: mockAssets.length + 1,
        name: data.name,
        type: data.type,
        category: data.category,
        url: data.url,
        thumbnail: data.thumbnail,
        size: data.size || 0,
        dimensions: data.dimensions,
        tags: data.tags || [],
        usageCount: 0,
        createdAt: new Date().toISOString()
      }

      mockAssets.push(newAsset)

      return NextResponse.json({
        success: true,
        data: newAsset,
        message: 'Asset uploaded successfully'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Marketing campaigns POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { type, id, updates } = await request.json()

    if (type === 'campaign') {
      const campaignIndex = mockCampaigns.findIndex(c => c.id === id)
      if (campaignIndex !== -1) {
        mockCampaigns[campaignIndex] = {
          ...mockCampaigns[campaignIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }

        return NextResponse.json({
          success: true,
          data: mockCampaigns[campaignIndex],
          message: 'Campaign updated successfully'
        })
      }
    }

    if (type === 'template') {
      const templateIndex = mockTemplates.findIndex(t => t.id === id)
      if (templateIndex !== -1) {
        mockTemplates[templateIndex] = {
          ...mockTemplates[templateIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }

        return NextResponse.json({
          success: true,
          data: mockTemplates[templateIndex],
          message: 'Template updated successfully'
        })
      }
    }

    return NextResponse.json(
      { success: false, error: 'Item not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Marketing campaigns PATCH error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
      { status: 500 }
    )
  }
}