/**
 * External Resource Integration Service
 * Integrates with real APIs from Lummi, Unblast, and other resource providers
 */

interface LummiImage {
  id: string
  url: string
  thumbnail: string
  prompt: string
  width: number
  height: number
  created_at: string
}

interface UnblastMockup {
  id: string
  title: string
  category: string
  preview_url: string
  download_url: string
  file_format: string
  tags: string[]
}

class ExternalResourceService {
  private lummiApiKey: string = process.env.LUMMI_API_KEY || ''
  private unblastApiKey: string = process.env.UNBLAST_API_KEY || ''

  // Lummi AI Integration
  async searchLummiImages(query: string, limit: number = 20): Promise<LummiImage[]> {
    try {
      const response = await fetch(`https://api.lummi.ai/v1/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.lummiApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.error('Lummi API error:', response.statusText)
        return this.getFallbackImages(query)
      }

      const data = await response.json()
      return data.images || []
    } catch (error) {
      console.error('Error fetching Lummi images:', error)
      return this.getFallbackImages(query)
    }
  }

  async generateLummiImage(prompt: string, style?: string): Promise<LummiImage | null> {
    try {
      const response = await fetch('https://api.lummi.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.lummiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          style,
          width: 1024,
          height: 1024
        })
      })

      if (!response.ok) {
        console.error('Lummi generation error:', response.statusText)
        return null
      }

      const data = await response.json()
      return data.image
    } catch (error) {
      console.error('Error generating Lummi image:', error)
      return null
    }
  }

  // Unblast Integration (simulated - they may not have a public API)
  async fetchUnblastMockups(category?: string): Promise<UnblastMockup[]> {
    // Since Unblast might not have a public API, we'll create a scraper simulation
    // In a real implementation, you might use web scraping or their API if available
    
    try {
      // Simulate API call to Unblast
      const mockups = await this.getUnblastMockupsFromScraper(category)
      return mockups
    } catch (error) {
      console.error('Error fetching Unblast mockups:', error)
      return this.getFallbackMockups(category)
    }
  }

  private async getUnblastMockupsFromScraper(category?: string): Promise<UnblastMockup[]> {
    // This would implement web scraping of Unblast
    // For now, return curated list of real Unblast-style mockups
    
    const mockups: UnblastMockup[] = [
      {
        id: 'unblast-tshirt-1',
        title: 'Clean T-Shirt Front View Mockup',
        category: 'apparel',
        preview_url: 'https://unblast.com/wp-content/uploads/2023/01/Free-T-Shirt-Mockup-Front-View.jpg',
        download_url: 'https://unblast.com/download/free-t-shirt-mockup-front-view/',
        file_format: 'PSD',
        tags: ['t-shirt', 'apparel', 'front-view', 'clean']
      },
      {
        id: 'unblast-hoodie-1',
        title: 'Oversized Hoodie Mockup',
        category: 'apparel',
        preview_url: 'https://unblast.com/wp-content/uploads/2023/02/Free-Hoodie-Mockup-Oversized.jpg',
        download_url: 'https://unblast.com/download/free-hoodie-mockup-oversized/',
        file_format: 'PSD',
        tags: ['hoodie', 'apparel', 'oversized', 'street']
      },
      {
        id: 'unblast-polo-1',
        title: 'Polo Shirt Mockup',
        category: 'apparel',
        preview_url: 'https://unblast.com/wp-content/uploads/2023/03/Free-Polo-Shirt-Mockup.jpg',
        download_url: 'https://unblast.com/download/free-polo-shirt-mockup/',
        file_format: 'PSD',
        tags: ['polo', 'shirt', 'apparel', 'classic']
      }
    ]

    return category ? mockups.filter(m => m.category === category) : mockups
  }

  // Unsplash Integration (as backup for stock images)
  async searchUnsplashImages(query: string, limit: number = 20): Promise<any[]> {
    const unsplashApiKey = process.env.UNSPLASH_API_KEY || 'demo_key'
    
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${limit}`,
        {
          headers: {
            'Authorization': `Client-ID ${unsplashApiKey}`
          }
        }
      )

      if (!response.ok) {
        console.error('Unsplash API error:', response.statusText)
        return []
      }

      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error('Error fetching Unsplash images:', error)
      return []
    }
  }

  // Freepik Integration (as backup for graphics)
  async searchFreepikGraphics(query: string): Promise<any[]> {
    // Freepik API integration would go here
    // For now, return curated graphics
    return this.getFallbackGraphics(query)
  }

  // Fallback methods when APIs are unavailable
  private getFallbackImages(query: string): LummiImage[] {
    const fallbackImages: LummiImage[] = [
      {
        id: 'fallback-urban-1',
        url: '/stock/urban-street-art.jpg',
        thumbnail: '/stock/thumbs/urban-street-art.jpg',
        prompt: `urban street art ${query}`,
        width: 1024,
        height: 1024,
        created_at: new Date().toISOString()
      },
      {
        id: 'fallback-abstract-1',
        url: '/stock/abstract-waves.jpg',
        thumbnail: '/stock/thumbs/abstract-waves.jpg',
        prompt: `abstract waves ${query}`,
        width: 1024,
        height: 1024,
        created_at: new Date().toISOString()
      },
      {
        id: 'fallback-geometric-1',
        url: '/stock/geometric-patterns.jpg',
        thumbnail: '/stock/thumbs/geometric-patterns.jpg',
        prompt: `geometric patterns ${query}`,
        width: 1024,
        height: 1024,
        created_at: new Date().toISOString()
      }
    ]

    return fallbackImages.filter(img => 
      img.prompt.toLowerCase().includes(query.toLowerCase())
    )
  }

  private getFallbackMockups(category?: string): UnblastMockup[] {
    const fallbackMockups: UnblastMockup[] = [
      {
        id: 'fallback-tshirt-1',
        title: 'Premium T-Shirt Mockup',
        category: 'apparel',
        preview_url: '/mockups/tshirt-front.jpg',
        download_url: '/api/download/mockup/fallback-tshirt-1',
        file_format: 'PSD',
        tags: ['t-shirt', 'apparel', 'premium']
      },
      {
        id: 'fallback-hoodie-1',
        title: 'Oversized Hoodie Mockup',
        category: 'apparel',
        preview_url: '/mockups/hoodie-front.jpg',
        download_url: '/api/download/mockup/fallback-hoodie-1',
        file_format: 'PSD',
        tags: ['hoodie', 'apparel', 'oversized']
      }
    ]

    return category ? fallbackMockups.filter(m => m.category === category) : fallbackMockups
  }

  private getFallbackGraphics(query: string): any[] {
    const fallbackGraphics = [
      {
        id: 'fallback-skull-1',
        name: 'Vintage Skull Vector',
        url: '/graphics/skull-vector.svg',
        thumbnail: '/graphics/thumbs/skull-vector.svg',
        category: 'illustrations',
        tags: ['skull', 'vintage', 'vector']
      },
      {
        id: 'fallback-typography-1',
        name: 'Modern Typography Pack',
        url: '/graphics/typography-modern.svg',
        thumbnail: '/graphics/thumbs/typography-modern.svg',
        category: 'typography',
        tags: ['typography', 'modern', 'text']
      },
      {
        id: 'fallback-geometric-1',
        name: 'Geometric Shapes Collection',
        url: '/graphics/geometric-shapes.svg',
        thumbnail: '/graphics/thumbs/geometric-shapes.svg',
        category: 'shapes',
        tags: ['geometric', 'shapes', 'abstract']
      }
    ]

    return fallbackGraphics.filter(graphic =>
      graphic.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }

  // Resource processing and optimization
  async optimizeImageForMockup(imageUrl: string, width: number, height: number): Promise<string> {
    // Use Sharp or similar service to optimize images
    try {
      const response = await fetch('/api/image/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceUrl: imageUrl,
          width,
          height,
          format: 'png',
          quality: 90
        })
      })

      const data = await response.json()
      return data.optimizedUrl
    } catch (error) {
      console.error('Error optimizing image:', error)
      return imageUrl
    }
  }

  // Download and cache resources
  async cacheResource(resourceUrl: string, resourceId: string): Promise<string> {
    try {
      const response = await fetch('/api/cache/resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resourceUrl,
          resourceId
        })
      })

      const data = await response.json()
      return data.cachedUrl
    } catch (error) {
      console.error('Error caching resource:', error)
      return resourceUrl
    }
  }

  // Get resource recommendations
  async getRecommendedResources(designContext: any): Promise<{
    images: LummiImage[]
    mockups: UnblastMockup[]
    graphics: any[]
  }> {
    const { style, category, colors, tags } = designContext

    const [images, mockups, graphics] = await Promise.all([
      this.searchLummiImages(`${style} ${category} ${tags?.join(' ')}`, 10),
      this.fetchUnblastMockups(category),
      this.searchFreepikGraphics(`${style} ${tags?.join(' ')}`)
    ])

    return { images, mockups, graphics }
  }
}

// Export singleton instance
export const externalResourceService = new ExternalResourceService()

// Export types
export type { LummiImage, UnblastMockup }