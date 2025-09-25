/**
 * Resource Manager Service
 * Integrates with Lummi AI, Unblast, and other design resource platforms
 */

interface StockImage {
  id: string
  url: string
  thumbnail: string
  title: string
  description: string
  tags: string[]
  category: string
  premium: boolean
  license: 'free' | 'premium' | 'commercial'
  resolution: {
    width: number
    height: number
  }
  source: 'lummi' | 'unsplash' | 'internal'
}

interface MockupTemplate {
  id: string
  name: string
  category: string
  thumbnail: string
  preview: string
  downloadUrl: string
  designAreas: {
    x: number
    y: number
    width: number
    height: number
    rotation?: number
  }[]
  premium: boolean
  fileFormat: 'psd' | 'figma' | 'sketch' | 'png'
  source: 'unblast' | 'mockupworld' | 'internal'
}

interface DesignGraphic {
  id: string
  name: string
  category: string
  thumbnail: string
  downloadUrl: string
  format: 'svg' | 'png' | 'eps' | 'ai'
  premium: boolean
  tags: string[]
  source: 'unblast' | 'freepik' | 'internal'
}

class ResourceManager {
  private static instance: ResourceManager
  private stockImages: StockImage[] = []
  private mockupTemplates: MockupTemplate[] = []
  private designGraphics: DesignGraphic[] = []

  private constructor() {
    this.initializeResources()
  }

  public static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager()
    }
    return ResourceManager.instance
  }

  private initializeResources() {
    // Initialize with high-quality stock images (Lummi-style)
    this.stockImages = [
      {
        id: 'lummi-urban-1',
        url: '/stock/lummi/urban-street-art.jpg',
        thumbnail: '/stock/lummi/thumbs/urban-street-art.jpg',
        title: 'Urban Street Art Composition',
        description: 'Vibrant street art with modern urban elements',
        tags: ['urban', 'street-art', 'vibrant', 'modern'],
        category: 'urban',
        premium: false,
        license: 'free',
        resolution: { width: 4096, height: 4096 },
        source: 'lummi'
      },
      {
        id: 'lummi-abstract-1',
        url: '/stock/lummi/abstract-waves.jpg',
        thumbnail: '/stock/lummi/thumbs/abstract-waves.jpg',
        title: 'Fluid Abstract Waves',
        description: 'Smooth flowing abstract waves in gradient colors',
        tags: ['abstract', 'waves', 'fluid', 'gradient'],
        category: 'abstract',
        premium: true,
        license: 'premium',
        resolution: { width: 6000, height: 4000 },
        source: 'lummi'
      },
      {
        id: 'lummi-geometric-1',
        url: '/stock/lummi/geometric-patterns.jpg',
        thumbnail: '/stock/lummi/thumbs/geometric-patterns.jpg',
        title: 'Minimal Geometric Patterns',
        description: 'Clean geometric shapes in modern composition',
        tags: ['geometric', 'minimal', 'patterns', 'clean'],
        category: 'geometric',
        premium: false,
        license: 'free',
        resolution: { width: 3000, height: 3000 },
        source: 'lummi'
      },
      {
        id: 'lummi-nature-1',
        url: '/stock/lummi/organic-textures.jpg',
        thumbnail: '/stock/lummi/thumbs/organic-textures.jpg',
        title: 'Organic Natural Textures',
        description: 'Earth-inspired organic textures and patterns',
        tags: ['nature', 'organic', 'texture', 'earth'],
        category: 'nature',
        premium: true,
        license: 'commercial',
        resolution: { width: 5000, height: 5000 },
        source: 'lummi'
      },
      {
        id: 'lummi-cyber-1',
        url: '/stock/lummi/neon-cyber.jpg',
        thumbnail: '/stock/lummi/thumbs/neon-cyber.jpg',
        title: 'Neon Cyberpunk Elements',
        description: 'Futuristic neon glows and cyber aesthetics',
        tags: ['cyberpunk', 'neon', 'futuristic', 'glow'],
        category: 'futuristic',
        premium: true,
        license: 'premium',
        resolution: { width: 4500, height: 3000 },
        source: 'lummi'
      }
    ]

    // Initialize with mockup templates (Unblast-style)
    this.mockupTemplates = [
      {
        id: 'unblast-tshirt-1',
        name: 'Premium T-Shirt Front View',
        category: 'tshirts',
        thumbnail: '/mockups/unblast/tshirt-front-thumb.jpg',
        preview: '/mockups/unblast/tshirt-front.psd',
        downloadUrl: '/api/mockups/download/unblast-tshirt-1',
        designAreas: [
          { x: 30, y: 25, width: 40, height: 50 }
        ],
        premium: false,
        fileFormat: 'psd',
        source: 'unblast'
      },
      {
        id: 'unblast-hoodie-1',
        name: 'Oversized Hoodie Mockup',
        category: 'hoodies',
        thumbnail: '/mockups/unblast/hoodie-oversized-thumb.jpg',
        preview: '/mockups/unblast/hoodie-oversized.psd',
        downloadUrl: '/api/mockups/download/unblast-hoodie-1',
        designAreas: [
          { x: 25, y: 30, width: 50, height: 40 }
        ],
        premium: true,
        fileFormat: 'psd',
        source: 'unblast'
      },
      {
        id: 'unblast-polo-1',
        name: 'Classic Polo Shirt',
        category: 'polos',
        thumbnail: '/mockups/unblast/polo-classic-thumb.jpg',
        preview: '/mockups/unblast/polo-classic.figma',
        downloadUrl: '/api/mockups/download/unblast-polo-1',
        designAreas: [
          { x: 35, y: 20, width: 30, height: 40 }
        ],
        premium: false,
        fileFormat: 'figma',
        source: 'unblast'
      },
      {
        id: 'unblast-tank-1',
        name: 'Summer Tank Top',
        category: 'tanks',
        thumbnail: '/mockups/unblast/tank-summer-thumb.jpg',
        preview: '/mockups/unblast/tank-summer.psd',
        downloadUrl: '/api/mockups/download/unblast-tank-1',
        designAreas: [
          { x: 30, y: 25, width: 40, height: 50 }
        ],
        premium: true,
        fileFormat: 'psd',
        source: 'unblast'
      },
      {
        id: 'unblast-crew-1',
        name: 'Crewneck Sweatshirt',
        category: 'sweatshirts',
        thumbnail: '/mockups/unblast/crewneck-thumb.jpg',
        preview: '/mockups/unblast/crewneck.sketch',
        downloadUrl: '/api/mockups/download/unblast-crew-1',
        designAreas: [
          { x: 28, y: 28, width: 44, height: 44 }
        ],
        premium: false,
        fileFormat: 'sketch',
        source: 'unblast'
      }
    ]

    // Initialize with design graphics (Unblast-style)
    this.designGraphics = [
      {
        id: 'unblast-skull-1',
        name: 'Vintage Skull Vector',
        category: 'illustrations',
        thumbnail: '/graphics/unblast/skull-vintage-thumb.svg',
        downloadUrl: '/api/graphics/download/unblast-skull-1',
        format: 'svg',
        premium: false,
        tags: ['skull', 'vintage', 'gothic', 'detailed'],
        source: 'unblast'
      },
      {
        id: 'unblast-typo-1',
        name: 'Modern Typography Pack',
        category: 'typography',
        thumbnail: '/graphics/unblast/typography-modern-thumb.svg',
        downloadUrl: '/api/graphics/download/unblast-typo-1',
        format: 'ai',
        premium: true,
        tags: ['typography', 'modern', 'clean', 'pack'],
        source: 'unblast'
      },
      {
        id: 'unblast-geo-1',
        name: 'Geometric Shape Collection',
        category: 'shapes',
        thumbnail: '/graphics/unblast/geometric-shapes-thumb.svg',
        downloadUrl: '/api/graphics/download/unblast-geo-1',
        format: 'svg',
        premium: false,
        tags: ['geometric', 'shapes', 'minimal', 'collection'],
        source: 'unblast'
      },
      {
        id: 'unblast-badge-1',
        name: 'Vintage Badge Set',
        category: 'badges',
        thumbnail: '/graphics/unblast/vintage-badges-thumb.svg',
        downloadUrl: '/api/graphics/download/unblast-badge-1',
        format: 'eps',
        premium: true,
        tags: ['badges', 'vintage', 'retro', 'set'],
        source: 'unblast'
      },
      {
        id: 'unblast-abstract-1',
        name: 'Abstract Line Art',
        category: 'abstract',
        thumbnail: '/graphics/unblast/abstract-lines-thumb.svg',
        downloadUrl: '/api/graphics/download/unblast-abstract-1',
        format: 'svg',
        premium: false,
        tags: ['abstract', 'lines', 'artistic', 'modern'],
        source: 'unblast'
      }
    ]
  }

  // Stock Images API
  public async getStockImages(category?: string, premium?: boolean): Promise<StockImage[]> {
    let filtered = [...this.stockImages]
    
    if (category) {
      filtered = filtered.filter(img => img.category === category)
    }
    
    if (premium !== undefined) {
      filtered = filtered.filter(img => img.premium === premium)
    }
    
    return filtered
  }

  public async searchStockImages(query: string): Promise<StockImage[]> {
    return this.stockImages.filter(img =>
      img.title.toLowerCase().includes(query.toLowerCase()) ||
      img.description.toLowerCase().includes(query.toLowerCase()) ||
      img.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }

  // Mockup Templates API
  public async getMockupTemplates(category?: string, premium?: boolean): Promise<MockupTemplate[]> {
    let filtered = [...this.mockupTemplates]
    
    if (category) {
      filtered = filtered.filter(mockup => mockup.category === category)
    }
    
    if (premium !== undefined) {
      filtered = filtered.filter(mockup => mockup.premium === premium)
    }
    
    return filtered
  }

  // Design Graphics API
  public async getDesignGraphics(category?: string, premium?: boolean): Promise<DesignGraphic[]> {
    let filtered = [...this.designGraphics]
    
    if (category) {
      filtered = filtered.filter(graphic => graphic.category === category)
    }
    
    if (premium !== undefined) {
      filtered = filtered.filter(graphic => graphic.premium === premium)
    }
    
    return filtered
  }

  // Lummi AI Integration
  public async generateAIImage(prompt: string, style?: string): Promise<StockImage> {
    // Simulate AI image generation (would integrate with actual Lummi API)
    const generatedImage: StockImage = {
      id: `ai-${Date.now()}`,
      url: `/api/ai/generate?prompt=${encodeURIComponent(prompt)}&style=${style}`,
      thumbnail: `/api/ai/generate?prompt=${encodeURIComponent(prompt)}&style=${style}&size=thumb`,
      title: `AI Generated: ${prompt}`,
      description: `AI-generated image based on: ${prompt}`,
      tags: prompt.split(' ').slice(0, 4),
      category: 'ai-generated',
      premium: true,
      license: 'commercial',
      resolution: { width: 2048, height: 2048 },
      source: 'lummi'
    }
    
    return generatedImage
  }

  // Resource Download/Processing
  public async processResourceForMockup(resourceId: string, mockupId: string): Promise<string> {
    // Process and apply resource to mockup template
    return `/api/process/${mockupId}/${resourceId}`
  }

  public async exportDesign(designData: any, format: 'png' | 'jpg' | 'pdf' | 'svg'): Promise<string> {
    // Export final design in requested format
    return `/api/export?design=${encodeURIComponent(JSON.stringify(designData))}&format=${format}`
  }

  // Premium Features
  public async unlockPremiumResource(resourceId: string, type: 'image' | 'mockup' | 'graphic'): Promise<boolean> {
    // Handle premium resource unlocking (payment, subscription check, etc.)
    return true // Placeholder
  }

  // Resource Categories
  public getImageCategories(): string[] {
    return [...new Set(this.stockImages.map(img => img.category))]
  }

  public getMockupCategories(): string[] {
    return [...new Set(this.mockupTemplates.map(mockup => mockup.category))]
  }

  public getGraphicCategories(): string[] {
    return [...new Set(this.designGraphics.map(graphic => graphic.category))]
  }
}

// Export singleton instance
export const resourceManager = ResourceManager.getInstance()

// Export types for components
export type { StockImage, MockupTemplate, DesignGraphic }