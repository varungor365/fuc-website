import { NextRequest, NextResponse } from 'next/server'

// Types for Affiliate System
interface AffiliateProfile {
  id: string
  userId: string
  affiliateCode: string
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  type: 'affiliate' | 'influencer' | 'brand_ambassador'
  commissionRate: number
  socialMedia: {
    instagram?: string
    youtube?: string
    tiktok?: string
    twitter?: string
    followers?: number
  }
  personalInfo: {
    name: string
    email: string
    phone: string
    address: string
    bankDetails: {
      accountNumber: string
      ifscCode: string
      accountHolder: string
    }
  }
  performance: {
    totalSales: number
    totalCommission: number
    clickCount: number
    conversionRate: number
    signups: number
  }
  createdAt: string
  approvedAt?: string
}

interface Commission {
  id: string
  affiliateId: string
  orderId: string
  customerEmail: string
  productId: string
  productName: string
  orderValue: number
  commissionRate: number
  commissionAmount: number
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  createdAt: string
  paidAt?: string
}

interface Payout {
  id: string
  affiliateId: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  paymentMethod: 'bank_transfer' | 'upi' | 'paypal'
  transactionId?: string
  requestedAt: string
  processedAt?: string
  failureReason?: string
}

interface PromotionalContent {
  id: string
  title: string
  type: 'banner' | 'social_post' | 'email_template' | 'video_script'
  content: {
    imageUrl?: string
    videoUrl?: string
    description: string
    hashtags?: string[]
    copyText: string
  }
  targetAudience: string
  campaignId?: string
  isActive: boolean
  createdAt: string
}

interface ReferralClick {
  id: string
  affiliateId: string
  affiliateCode: string
  ipAddress: string
  userAgent: string
  referrerUrl: string
  landingPage: string
  timestamp: string
  converted: boolean
  orderId?: string
}

// Mock Database
const mockAffiliates: AffiliateProfile[] = [
  {
    id: 'aff-1',
    userId: 'user-123',
    affiliateCode: 'FASHUN_VARUN',
    status: 'active',
    type: 'influencer',
    commissionRate: 15,
    socialMedia: {
      instagram: '@varun_fashion',
      youtube: 'VarunStyleHub',
      followers: 50000
    },
    personalInfo: {
      name: 'Varun Gor',
      email: 'varun@example.com',
      phone: '+91 98765 43210',
      address: 'Mumbai, Maharashtra',
      bankDetails: {
        accountNumber: '****7890',
        ifscCode: 'HDFC0001234',
        accountHolder: 'Varun Gor'
      }
    },
    performance: {
      totalSales: 125000,
      totalCommission: 18750,
      clickCount: 2500,
      conversionRate: 5.2,
      signups: 130
    },
    createdAt: '2024-01-15T10:00:00Z',
    approvedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 'aff-2',
    userId: 'user-456',
    affiliateCode: 'FASHUN_STYLE',
    status: 'active',
    type: 'brand_ambassador',
    commissionRate: 20,
    socialMedia: {
      instagram: '@style_guru_india',
      tiktok: '@styleguru',
      followers: 85000
    },
    personalInfo: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 87654 32109',
      address: 'Delhi, India',
      bankDetails: {
        accountNumber: '****5678',
        ifscCode: 'ICICI0001234',
        accountHolder: 'Priya Sharma'
      }
    },
    performance: {
      totalSales: 89000,
      totalCommission: 17800,
      clickCount: 1800,
      conversionRate: 6.1,
      signups: 110
    },
    createdAt: '2024-02-01T10:00:00Z',
    approvedAt: '2024-02-03T09:15:00Z'
  }
]

const mockCommissions: Commission[] = [
  {
    id: 'comm-1',
    affiliateId: 'aff-1',
    orderId: 'ORD-001',
    customerEmail: 'customer@example.com',
    productId: 'prod-1',
    productName: 'Premium Hoodie',
    orderValue: 2999,
    commissionRate: 15,
    commissionAmount: 449.85,
    status: 'approved',
    createdAt: '2025-01-15T14:30:00Z'
  },
  {
    id: 'comm-2',
    affiliateId: 'aff-1',
    orderId: 'ORD-002',
    customerEmail: 'customer2@example.com',
    productId: 'prod-2',
    productName: 'Designer T-Shirt',
    orderValue: 1499,
    commissionRate: 15,
    commissionAmount: 224.85,
    status: 'pending',
    createdAt: '2025-01-16T10:15:00Z'
  },
  {
    id: 'comm-3',
    affiliateId: 'aff-2',
    orderId: 'ORD-003',
    customerEmail: 'customer3@example.com',
    productId: 'prod-3',
    productName: 'Casual Polo',
    orderValue: 1999,
    commissionRate: 20,
    commissionAmount: 399.80,
    status: 'approved',
    createdAt: '2025-01-16T16:45:00Z'
  }
]

const mockPayouts: Payout[] = [
  {
    id: 'payout-1',
    affiliateId: 'aff-1',
    amount: 12500,
    status: 'completed',
    paymentMethod: 'bank_transfer',
    transactionId: 'TXN123456789',
    requestedAt: '2025-01-10T10:00:00Z',
    processedAt: '2025-01-12T14:30:00Z'
  },
  {
    id: 'payout-2',
    affiliateId: 'aff-2',
    amount: 8900,
    status: 'processing',
    paymentMethod: 'upi',
    requestedAt: '2025-01-15T09:00:00Z'
  }
]

const mockPromotionalContent: PromotionalContent[] = [
  {
    id: 'promo-1',
    title: 'Winter Collection Launch',
    type: 'social_post',
    content: {
      imageUrl: '/api/placeholder/1080/1080',
      description: 'Discover the hottest winter trends with FASHUN.CO.IN',
      hashtags: ['#FASHUN', '#WinterFashion', '#Style2025'],
      copyText: '🔥 Get ready to slay this winter! Use my code FASHUN_VARUN for 15% off on the entire winter collection! ❄️ #FASHUN #WinterVibes'
    },
    targetAudience: 'Fashion enthusiasts aged 18-35',
    isActive: true,
    createdAt: '2025-01-10T12:00:00Z'
  },
  {
    id: 'promo-2',
    title: 'Hoodie Collection Banner',
    type: 'banner',
    content: {
      imageUrl: '/api/placeholder/1200/600',
      description: 'Premium hoodies for every occasion',
      copyText: 'Premium Hoodies Starting at ₹1,999 - Use Code: FASHUN_STYLE'
    },
    targetAudience: 'Young adults interested in streetwear',
    isActive: true,
    createdAt: '2025-01-12T15:30:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const affiliateId = searchParams.get('affiliateId')
    const action = searchParams.get('action')

    if (!affiliateId) {
      return NextResponse.json({ error: 'Affiliate ID is required' }, { status: 400 })
    }

    // Find affiliate
    const affiliate = mockAffiliates.find(a => a.id === affiliateId)
    if (!affiliate) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
    }

    switch (action) {
      case 'dashboard':
        const recentCommissions = mockCommissions
          .filter(c => c.affiliateId === affiliateId)
          .slice(0, 5)
        
        const totalEarnings = mockCommissions
          .filter(c => c.affiliateId === affiliateId && c.status === 'approved')
          .reduce((sum, c) => sum + c.commissionAmount, 0)
        
        const pendingEarnings = mockCommissions
          .filter(c => c.affiliateId === affiliateId && c.status === 'pending')
          .reduce((sum, c) => sum + c.commissionAmount, 0)

        const recentClicks = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          clicks: Math.floor(Math.random() * 50) + 10,
          conversions: Math.floor(Math.random() * 5) + 1
        })).reverse()

        return NextResponse.json({
          success: true,
          data: {
            affiliate,
            earnings: {
              total: totalEarnings,
              pending: pendingEarnings,
              thisMonth: totalEarnings * 0.3, // Mock this month earnings
              lastPayout: mockPayouts.find(p => p.affiliateId === affiliateId && p.status === 'completed')
            },
            recentCommissions,
            clicksData: recentClicks,
            promotionalContent: mockPromotionalContent.filter(p => p.isActive)
          }
        })

      case 'commissions':
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status')
        
        let commissions = mockCommissions.filter(c => c.affiliateId === affiliateId)
        if (status) {
          commissions = commissions.filter(c => c.status === status)
        }
        
        const startIndex = (page - 1) * limit
        const paginatedCommissions = commissions.slice(startIndex, startIndex + limit)
        
        return NextResponse.json({
          success: true,
          data: {
            commissions: paginatedCommissions,
            total: commissions.length,
            page,
            totalPages: Math.ceil(commissions.length / limit)
          }
        })

      case 'payouts':
        const payouts = mockPayouts.filter(p => p.affiliateId === affiliateId)
        return NextResponse.json({
          success: true,
          data: { payouts }
        })

      case 'promotional-content':
        return NextResponse.json({
          success: true,
          data: { content: mockPromotionalContent.filter(p => p.isActive) }
        })

      case 'analytics':
        const analytics = {
          clicks: {
            total: affiliate.performance.clickCount,
            thisMonth: Math.floor(affiliate.performance.clickCount * 0.3),
            growth: '+12.5%'
          },
          conversions: {
            total: affiliate.performance.signups,
            rate: affiliate.performance.conversionRate,
            growth: '+8.3%'
          },
          earnings: {
            total: affiliate.performance.totalCommission,
            thisMonth: affiliate.performance.totalCommission * 0.3,
            growth: '+15.7%'
          },
          topProducts: [
            { name: 'Premium Hoodie', sales: 45, commission: 6750 },
            { name: 'Designer T-Shirt', sales: 32, commission: 4800 },
            { name: 'Casual Polo', sales: 28, commission: 4200 }
          ]
        }
        
        return NextResponse.json({
          success: true,
          data: analytics
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Affiliate API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, affiliateId } = body

    switch (action) {
      case 'register':
        const { personalInfo, socialMedia, type } = body
        
        // Generate affiliate code
        const newAffiliateCode = `FASHUN_${personalInfo.name.toUpperCase().replace(/\s+/g, '_')}`
        
        const newAffiliate: AffiliateProfile = {
          id: `aff-${Date.now()}`,
          userId: body.userId || `user-${Date.now()}`,
          affiliateCode: newAffiliateCode,
          status: 'pending',
          type: type || 'affiliate',
          commissionRate: type === 'influencer' ? 15 : type === 'brand_ambassador' ? 20 : 10,
          socialMedia,
          personalInfo,
          performance: {
            totalSales: 0,
            totalCommission: 0,
            clickCount: 0,
            conversionRate: 0,
            signups: 0
          },
          createdAt: new Date().toISOString()
        }
        
        // In real app, save to database
        mockAffiliates.push(newAffiliate)
        
        return NextResponse.json({
          success: true,
          message: 'Application submitted successfully! We will review and get back to you within 2-3 business days.',
          data: { affiliateCode: newAffiliateCode, applicationId: newAffiliate.id }
        })

      case 'request-payout':
        const { amount, paymentMethod } = body
        
        if (!affiliateId) {
          return NextResponse.json({ error: 'Affiliate ID is required' }, { status: 400 })
        }
        
        // Check available balance
        const approvedCommissions = mockCommissions
          .filter(c => c.affiliateId === affiliateId && c.status === 'approved')
          .reduce((sum, c) => sum + c.commissionAmount, 0)
        
        const paidCommissions = mockPayouts
          .filter(p => p.affiliateId === affiliateId && p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0)
        
        const availableBalance = approvedCommissions - paidCommissions
        
        if (amount > availableBalance) {
          return NextResponse.json({ 
            error: 'Insufficient balance',
            availableBalance 
          }, { status: 400 })
        }
        
        const newPayout: Payout = {
          id: `payout-${Date.now()}`,
          affiliateId,
          amount,
          status: 'pending',
          paymentMethod,
          requestedAt: new Date().toISOString()
        }
        
        mockPayouts.push(newPayout)
        
        return NextResponse.json({
          success: true,
          message: 'Payout request submitted successfully!',
          data: newPayout
        })

      case 'track-click':
        const { affiliateCode: clickAffiliateCode, ipAddress, userAgent, referrerUrl, landingPage } = body
        
        const click: ReferralClick = {
          id: `click-${Date.now()}`,
          affiliateId: affiliateId || 'unknown',
          affiliateCode: clickAffiliateCode,
          ipAddress,
          userAgent,
          referrerUrl,
          landingPage,
          timestamp: new Date().toISOString(),
          converted: false
        }
        
        // In real app, save click tracking
        console.log('Click tracked:', click)
        
        return NextResponse.json({
          success: true,
          message: 'Click tracked successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Affiliate POST API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliateId, action } = body

    if (!affiliateId) {
      return NextResponse.json({ error: 'Affiliate ID is required' }, { status: 400 })
    }

    switch (action) {
      case 'update-profile':
        const { personalInfo, socialMedia } = body
        
        const affiliateIndex = mockAffiliates.findIndex(a => a.id === affiliateId)
        if (affiliateIndex === -1) {
          return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
        }
        
        // Update affiliate profile
        mockAffiliates[affiliateIndex] = {
          ...mockAffiliates[affiliateIndex],
          personalInfo: { ...mockAffiliates[affiliateIndex].personalInfo, ...personalInfo },
          socialMedia: { ...mockAffiliates[affiliateIndex].socialMedia, ...socialMedia }
        }
        
        return NextResponse.json({
          success: true,
          message: 'Profile updated successfully',
          data: mockAffiliates[affiliateIndex]
        })

      case 'update-payment-details':
        const { bankDetails } = body
        
        const affIndex = mockAffiliates.findIndex(a => a.id === affiliateId)
        if (affIndex === -1) {
          return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
        }
        
        mockAffiliates[affIndex].personalInfo.bankDetails = {
          ...mockAffiliates[affIndex].personalInfo.bankDetails,
          ...bankDetails
        }
        
        return NextResponse.json({
          success: true,
          message: 'Payment details updated successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Affiliate PATCH API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}