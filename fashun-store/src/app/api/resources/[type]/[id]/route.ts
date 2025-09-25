import { NextRequest, NextResponse } from 'next/server'
import { resourceManager } from '@/lib/resourceManager'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  const { type, id } = params
  const { searchParams } = new URL(request.url)
  
  try {
    switch (type) {
      case 'stock-images': {
        const category = searchParams.get('category')
        const premium = searchParams.get('premium') === 'true'
        const query = searchParams.get('query')
        
        let images
        if (query) {
          images = await resourceManager.searchStockImages(query)
        } else {
          images = await resourceManager.getStockImages(category || undefined, premium)
        }
        
        return NextResponse.json({ images })
      }
      
      case 'mockups': {
        const category = searchParams.get('category')
        const premium = searchParams.get('premium') === 'true'
        
        const mockups = await resourceManager.getMockupTemplates(category || undefined, premium)
        return NextResponse.json({ mockups })
      }
      
      case 'graphics': {
        const category = searchParams.get('category')
        const premium = searchParams.get('premium') === 'true'
        
        const graphics = await resourceManager.getDesignGraphics(category || undefined, premium)
        return NextResponse.json({ graphics })
      }
      
      case 'categories': {
        const resourceType = searchParams.get('resourceType')
        
        let categories: string[]
        switch (resourceType) {
          case 'images':
            categories = resourceManager.getImageCategories()
            break
          case 'mockups':
            categories = resourceManager.getMockupCategories()
            break
          case 'graphics':
            categories = resourceManager.getGraphicCategories()
            break
          default:
            categories = []
        }
        
        return NextResponse.json({ categories })
      }
      
      default:
        return NextResponse.json({ error: 'Invalid resource type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Resource API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  const { type, id } = params
  
  try {
    switch (type) {
      case 'ai-generate': {
        const body = await request.json()
        const { prompt, style } = body
        
        if (!prompt) {
          return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }
        
        const generatedImage = await resourceManager.generateAIImage(prompt, style)
        return NextResponse.json({ image: generatedImage })
      }
      
      case 'process': {
        const body = await request.json()
        const { resourceId, mockupId } = body
        
        const processedUrl = await resourceManager.processResourceForMockup(resourceId, mockupId)
        return NextResponse.json({ processedUrl })
      }
      
      case 'export': {
        const body = await request.json()
        const { designData, format } = body
        
        const exportUrl = await resourceManager.exportDesign(designData, format)
        return NextResponse.json({ exportUrl })
      }
      
      case 'unlock-premium': {
        const body = await request.json()
        const { resourceId, resourceType } = body
        
        const unlocked = await resourceManager.unlockPremiumResource(resourceId, resourceType)
        return NextResponse.json({ unlocked })
      }
      
      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })
    }
  } catch (error) {
    console.error('Resource API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}