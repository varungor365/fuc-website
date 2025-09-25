/**
 * Live Platform Integrations API
 * Connects to real premium design platforms
 */

import { NextRequest, NextResponse } from 'next/server'
import { platformIntegration } from '@/lib/platformIntegrations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const category = searchParams.get('category')
    const style = searchParams.get('style')
    const page = parseInt(searchParams.get('page') || '1')

    switch (platform) {
      case 'dribbble':
        const shots = await platformIntegration.getDribbbleShots(page, 20, 'popular')
        return NextResponse.json({
          success: true,
          data: shots.map((shot: any) => ({
            id: shot.id,
            title: shot.title,
            description: shot.description,
            preview_url: shot.images.normal,
            source_url: shot.html_url,
            author: shot.user.name,
            tags: shot.tags || [],
            source: 'dribbble',
            premium: false
          })),
          platform: 'dribbble'
        })

      case 'ls-graphics':
        const mockups = await platformIntegration.getLSGraphicsMockups(category || undefined, page)
        return NextResponse.json({
          success: true,
          data: mockups.map((mockup: any) => ({
            id: mockup.id,
            title: mockup.name,
            preview_url: mockup.preview_url,
            category: mockup.category,
            price: mockup.price,
            formats: mockup.formats,
            description: mockup.description,
            source: 'ls_graphics',
            premium: true
          })),
          platform: 'ls-graphics'
        })

      case 'footer-design':
        const footers = await platformIntegration.getFooterDesigns(style || undefined, page)
        return NextResponse.json({
          success: true,
          data: footers.map((footer: any) => ({
            id: footer.id,
            title: footer.title,
            preview_url: footer.screenshot_url,
            website_url: footer.website,
            style: footer.style,
            components: footer.components,
            color_scheme: footer.color_scheme,
            source: 'footer_design',
            premium: false
          })),
          platform: 'footer-design'
        })

      case 'getillustra':
        const illustrations = await platformIntegration.getIllustrations(category || undefined, style || undefined)
        return NextResponse.json({
          success: true,
          data: illustrations.map((illus: any) => ({
            id: illus.id,
            title: illus.title,
            preview_url: illus.preview_url,
            category: illus.category,
            style: illus.style,
            format: illus.format,
            tags: illus.tags,
            description: illus.description,
            source: 'getillustra',
            premium: false
          })),
          platform: 'getillustra'
        })

      case 'httpster':
        const websites = await platformIntegration.getWebsiteShowcases(category || undefined, page)
        return NextResponse.json({
          success: true,
          data: websites.map((site: any) => ({
            id: site.id,
            title: site.title,
            preview_url: site.screenshot_url,
            website_url: site.url,
            category: site.category,
            tags: site.tags,
            color_palette: site.color_palette,
            description: site.description,
            source: 'httpster',
            premium: false
          })),
          platform: 'httpster'
        })

      case 'fonts':
        const fonts = await platformIntegration.getPremiumFonts(category || undefined)
        return NextResponse.json({
          success: true,
          data: fonts.map((font: any) => ({
            id: font.id,
            title: font.name,
            family: font.family,
            category: font.category,
            preview_url: font.preview_url,
            download_url: font.download_url,
            formats: font.formats,
            license: font.license,
            price: font.price,
            source: 'premium_fonts',
            premium: font.license === 'premium'
          })),
          platform: 'fonts'
        })

      case 'same-energy':
        const imageUrl = searchParams.get('image')
        if (!imageUrl) {
          return NextResponse.json({
            success: false,
            error: 'Image URL required for visual search'
          }, { status: 400 })
        }
        
        const similar = await platformIntegration.findSimilarImages(imageUrl, 20)
        return NextResponse.json({
          success: true,
          data: similar.map((img: any) => ({
            id: img.id,
            preview_url: img.image_url,
            similarity_score: img.similarity_score,
            source_url: img.source_url,
            tags: img.tags,
            source: 'same_energy',
            premium: false
          })),
          platform: 'same-energy'
        })

      case 'all':
        // Get consolidated data from all platforms
        const allResources = await platformIntegration.getAllResources()
        return NextResponse.json({
          success: true,
          data: {
            dribbble: allResources.dribbble.slice(0, 6),
            mockups: allResources.mockups.slice(0, 6),
            footers: allResources.footers.slice(0, 4),
            illustrations: allResources.illustrations.slice(0, 8),
            websites: allResources.websites.slice(0, 6),
            fonts: allResources.fonts.slice(0, 6)
          },
          platforms: ['dribbble', 'ls-graphics', 'footer-design', 'getillustra', 'httpster', 'fonts']
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid platform specified',
          available_platforms: [
            'dribbble', 'ls-graphics', 'footer-design', 
            'getillustra', 'httpster', 'fonts', 'same-energy', 'all'
          ]
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Platform Integration API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch platform resources',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, platform, resourceId, userId } = body

    switch (action) {
      case 'download':
        // Handle downloads from different platforms
        const downloadUrl = await generatePlatformDownloadUrl(platform, resourceId)
        
        return NextResponse.json({
          success: true,
          download_url: downloadUrl,
          expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
        })

      case 'track_view':
        // Track resource views for analytics
        await trackPlatformResourceView(platform, resourceId, userId)
        
        return NextResponse.json({ success: true })

      case 'add_to_collection':
        // Add resource to user's collection
        await addToUserCollection(userId, platform, resourceId)
        
        return NextResponse.json({ success: true })

      case 'search_similar':
        const { imageUrl } = body
        if (!imageUrl) {
          return NextResponse.json({
            success: false,
            error: 'Image URL required for similarity search'
          }, { status: 400 })
        }

        const similarImages = await platformIntegration.findSimilarImages(imageUrl, 10)
        return NextResponse.json({
          success: true,
          data: similarImages
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Platform Integration POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process platform request'
    }, { status: 500 })
  }
}

// Helper functions
async function generatePlatformDownloadUrl(platform: string, resourceId: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const token = Buffer.from(`${platform}:${resourceId}:${Date.now()}`).toString('base64')
  
  return `${baseUrl}/api/platform-download/${platform}/${resourceId}?token=${token}`
}

async function trackPlatformResourceView(platform: string, resourceId: string, userId?: string): Promise<void> {
  // Implement analytics tracking
  console.log(`Tracking view: ${platform}:${resourceId} by user ${userId || 'anonymous'}`)
  
  // Here you would integrate with your analytics service
  // e.g., Google Analytics, Mixpanel, custom analytics, etc.
}

async function addToUserCollection(userId: string, platform: string, resourceId: string): Promise<void> {
  // Implement user collection storage
  console.log(`Adding ${platform}:${resourceId} to collection for user ${userId}`)
  
  // Here you would save to your database
  // e.g., user_collections table with platform, resource_id, user_id
}