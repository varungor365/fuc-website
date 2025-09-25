/**
 * Premium Resources API Route
 * Handles all premium resource requests and integrations
 */

import { NextRequest, NextResponse } from 'next/server'
import { premiumResourceIntegration } from '@/lib/premiumResourceIntegration'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const style = searchParams.get('style')
    const source = searchParams.get('source')
    const query = searchParams.get('query')

    // Handle different resource types
    switch (type) {
      case 'fonts':
        const fonts = await premiumResourceIntegration.getPremiumFonts(category || undefined)
        return NextResponse.json({ success: true, data: fonts, count: fonts.length })

      case 'illustrations':
        const illustrations = await premiumResourceIntegration.getIllustrations(
          style || undefined, 
          category || undefined
        )
        return NextResponse.json({ success: true, data: illustrations, count: illustrations.length })

      case 'footers':
        const footers = await premiumResourceIntegration.getFooterDesigns(style || undefined)
        return NextResponse.json({ success: true, data: footers, count: footers.length })

      case 'inspirations':
        const inspirations = await premiumResourceIntegration.getDesignInspiration(
          category || undefined, 
          source || undefined
        )
        return NextResponse.json({ success: true, data: inspirations, count: inspirations.length })

      case 'mockups':
        const mockups = await premiumResourceIntegration.getLSGraphicsMockups(category || undefined)
        return NextResponse.json({ success: true, data: mockups, count: mockups.length })

      case 'search':
        if (!query) {
          return NextResponse.json({ 
            success: false, 
            error: 'Query parameter required for search' 
          }, { status: 400 })
        }
        const searchResults = await premiumResourceIntegration.searchAllResources(query)
        return NextResponse.json({ success: true, data: searchResults })

      case 'recommendations':
        const context = {
          style: style || 'modern',
          category: category || 'fashion',
          colors: searchParams.get('colors')?.split(',') || ['#000000', '#FFFFFF'],
          user_preferences: searchParams.get('preferences')?.split(',') || []
        }
        const recommendations = await premiumResourceIntegration.getRecommendedResources(context)
        return NextResponse.json({ success: true, data: recommendations })

      case 'analytics':
        const analytics = await premiumResourceIntegration.getResourceAnalytics()
        return NextResponse.json({ success: true, data: analytics })

      default:
        // Return all resource types overview
        const [allFonts, allIllustrations, allFooters, allInspirations, allMockups] = await Promise.all([
          premiumResourceIntegration.getPremiumFonts(),
          premiumResourceIntegration.getIllustrations(),
          premiumResourceIntegration.getFooterDesigns(),
          premiumResourceIntegration.getDesignInspiration(),
          premiumResourceIntegration.getLSGraphicsMockups()
        ])

        return NextResponse.json({
          success: true,
          data: {
            fonts: allFonts.slice(0, 6),
            illustrations: allIllustrations.slice(0, 8),
            footers: allFooters.slice(0, 4),
            inspirations: allInspirations.slice(0, 10),
            mockups: allMockups.slice(0, 6)
          },
          totals: {
            fonts: allFonts.length,
            illustrations: allIllustrations.length,
            footers: allFooters.length,
            inspirations: allInspirations.length,
            mockups: allMockups.length
          }
        })
    }
  } catch (error) {
    console.error('Premium Resources API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch premium resources'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, resourceType, resourceId, userId } = body

    switch (action) {
      case 'download':
        // Handle premium resource downloads
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User authentication required'
          }, { status: 401 })
        }

        // Check subscription status
        const hasAccess = await checkPremiumAccess(userId, resourceType)
        if (!hasAccess) {
          return NextResponse.json({
            success: false,
            error: 'Premium subscription required',
            upgrade_url: '/pricing'
          }, { status: 403 })
        }

        // Generate download URL or return resource data
        const downloadUrl = await generateDownloadUrl(resourceType, resourceId)
        return NextResponse.json({
          success: true,
          download_url: downloadUrl
        })

      case 'favorite':
        // Add resource to user favorites
        await addToFavorites(userId, resourceType, resourceId)
        return NextResponse.json({ success: true })

      case 'track_usage':
        // Track resource usage for analytics
        await trackResourceUsage(userId, resourceType, resourceId)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Premium Resources POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 })
  }
}

// Helper functions
async function checkPremiumAccess(userId: string, resourceType: string): Promise<boolean> {
  // Mock subscription check - replace with actual logic
  const mockPremiumUsers = ['user123', 'premium_user', 'designer_pro']
  return mockPremiumUsers.includes(userId)
}

async function generateDownloadUrl(resourceType: string, resourceId: string): Promise<string> {
  // Generate secure download URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const token = generateSecureToken(resourceId)
  return `${baseUrl}/api/download/${resourceType}/${resourceId}?token=${token}`
}

async function addToFavorites(userId: string, resourceType: string, resourceId: string): Promise<void> {
  // Add to user favorites - implement with your database
  console.log(`Adding ${resourceType}:${resourceId} to favorites for user ${userId}`)
}

async function trackResourceUsage(userId: string, resourceType: string, resourceId: string): Promise<void> {
  // Track usage analytics - implement with your analytics service
  console.log(`Tracking usage: ${resourceType}:${resourceId} by user ${userId}`)
}

function generateSecureToken(resourceId: string): string {
  // Generate secure token for downloads
  const timestamp = Date.now()
  return Buffer.from(`${resourceId}:${timestamp}`).toString('base64')
}