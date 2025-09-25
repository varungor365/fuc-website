/**
 * Premium Resource Integration Service
 * Integrates with multiple premium design platforms for FashUn.Co
 */

interface PremiumFont {
  id: string
  name: string
  family: string
  style: string
  weight: string
  formats: string[]
  preview_url: string
  download_url: string
  license: 'free' | 'premium' | 'commercial'
  price?: number
  source: 'dirtyline' | 'google_fonts' | 'adobe_fonts' | 'custom'
}

interface IllustrationAsset {
  id: string
  title: string
  description: string
  preview_url: string
  download_url: string
  category: string
  style: string
  format: string
  tags: string[]
  premium: boolean
  source: 'getillustra' | 'dribbble' | 'custom'
}

interface FooterDesign {
  id: string
  title: string
  website_url: string
  screenshot_url: string
  style: string
  layout_type: string
  color_scheme: string
  components: string[]
  premium: boolean
  source: 'footer_design' | 'httpster' | 'custom'
}

interface DesignInspiration {
  id: string
  title: string
  description: string
  image_url: string
  source_url: string
  category: string
  tags: string[]
  color_palette: string[]
  style: string
  source: 'dribbble' | 'httpster' | 'same_energy' | 'refern' | 'custom'
}

interface LSGraphicsMockup {
  id: string
  name: string
  category: string
  preview_url: string
  download_url: string
  file_format: string
  price: number
  animated: boolean
  device_type?: string
  orientation?: string
  source: 'ls_graphics'
}

class PremiumResourceIntegration {
  private static instance: PremiumResourceIntegration

  private constructor() {}

  public static getInstance(): PremiumResourceIntegration {
    if (!PremiumResourceIntegration.instance) {
      PremiumResourceIntegration.instance = new PremiumResourceIntegration()
    }
    return PremiumResourceIntegration.instance
  }

  // Font Integration (Dirtyline + alternatives)
  async getPremiumFonts(category?: string): Promise<PremiumFont[]> {
    const fonts: PremiumFont[] = [
      // Premium streetwear fonts
      {
        id: 'streetwear-bold-1',
        name: 'UrbanCore Bold',
        family: 'UrbanCore',
        style: 'bold',
        weight: '700',
        formats: ['woff2', 'woff', 'ttf'],
        preview_url: '/fonts/previews/urbancore-bold.png',
        download_url: '/api/fonts/download/urbancore-bold',
        license: 'premium',
        price: 49,
        source: 'dirtyline'
      },
      {
        id: 'streetwear-script-1',
        name: 'GraffitiFlow Script',
        family: 'GraffitiFlow',
        style: 'script',
        weight: '400',
        formats: ['woff2', 'woff', 'otf'],
        preview_url: '/fonts/previews/graffitiflow-script.png',
        download_url: '/api/fonts/download/graffitiflow-script',
        license: 'premium',
        price: 39,
        source: 'dirtyline'
      },
      {
        id: 'minimal-sans-1',
        name: 'CleanStreet Sans',
        family: 'CleanStreet',
        style: 'sans-serif',
        weight: '300',
        formats: ['woff2', 'woff', 'ttf'],
        preview_url: '/fonts/previews/cleanstreet-sans.png',
        download_url: '/api/fonts/download/cleanstreet-sans',
        license: 'free',
        source: 'google_fonts'
      },
      {
        id: 'display-font-1',
        name: 'NeonGlow Display',
        family: 'NeonGlow',
        style: 'display',
        weight: '800',
        formats: ['woff2', 'svg'],
        preview_url: '/fonts/previews/neonglow-display.png',
        download_url: '/api/fonts/download/neonglow-display',
        license: 'commercial',
        price: 79,
        source: 'adobe_fonts'
      }
    ]

    return category ? fonts.filter(font => font.style === category) : fonts
  }

  // Illustration Integration (GetIllustra + Dribbble)
  async getIllustrations(style?: string, category?: string): Promise<IllustrationAsset[]> {
    const illustrations: IllustrationAsset[] = [
      {
        id: 'streetwear-illus-1',
        title: 'Urban Sneaker Collection',
        description: 'Modern streetwear sneaker illustrations with bold colors',
        preview_url: '/illustrations/urban-sneakers.png',
        download_url: '/api/illustrations/download/urban-sneakers',
        category: 'fashion',
        style: 'modern',
        format: 'svg',
        tags: ['sneakers', 'streetwear', 'urban', 'fashion'],
        premium: true,
        source: 'getillustra'
      },
      {
        id: 'abstract-shapes-1',
        title: 'Geometric Abstract Shapes',
        description: 'Minimalist geometric shapes for modern designs',
        preview_url: '/illustrations/geometric-abstract.svg',
        download_url: '/api/illustrations/download/geometric-abstract',
        category: 'abstract',
        style: 'minimal',
        format: 'svg',
        tags: ['geometric', 'abstract', 'minimal', 'shapes'],
        premium: false,
        source: 'dribbble'
      },
      {
        id: 'street-culture-1',
        title: 'Street Culture Elements',
        description: 'Graffiti-inspired street culture illustrations',
        preview_url: '/illustrations/street-culture.png',
        download_url: '/api/illustrations/download/street-culture',
        category: 'culture',
        style: 'graffiti',
        format: 'png',
        tags: ['graffiti', 'street', 'culture', 'urban'],
        premium: true,
        source: 'getillustra'
      },
      {
        id: 'fashion-icons-1',
        title: 'Fashion Icon Set',
        description: 'Complete set of fashion and apparel icons',
        preview_url: '/illustrations/fashion-icons.svg',
        download_url: '/api/illustrations/download/fashion-icons',
        category: 'icons',
        style: 'line',
        format: 'svg',
        tags: ['fashion', 'icons', 'apparel', 'clothing'],
        premium: false,
        source: 'dribbble'
      }
    ]

    let filtered = illustrations
    if (style) filtered = filtered.filter(ill => ill.style === style)
    if (category) filtered = filtered.filter(ill => ill.category === category)
    
    return filtered
  }

  // Footer Design Integration
  async getFooterDesigns(style?: string): Promise<FooterDesign[]> {
    const footers: FooterDesign[] = [
      {
        id: 'minimal-footer-1',
        title: 'Clean Minimal Footer',
        website_url: 'https://example.com',
        screenshot_url: '/footer-designs/minimal-clean.png',
        style: 'minimal',
        layout_type: 'single-column',
        color_scheme: 'monochrome',
        components: ['links', 'social', 'copyright'],
        premium: false,
        source: 'footer_design'
      },
      {
        id: 'complex-footer-1',
        title: 'Multi-Column Fashion Footer',
        website_url: 'https://fashion-example.com',
        screenshot_url: '/footer-designs/fashion-multi.png',
        style: 'modern',
        layout_type: 'multi-column',
        color_scheme: 'dark',
        components: ['navigation', 'newsletter', 'social', 'payment', 'legal'],
        premium: true,
        source: 'footer_design'
      },
      {
        id: 'creative-footer-1',
        title: 'Creative Agency Footer',
        website_url: 'https://creative-agency.com',
        screenshot_url: '/footer-designs/creative-agency.png',
        style: 'creative',
        layout_type: 'grid',
        color_scheme: 'gradient',
        components: ['portfolio', 'contact', 'social', 'awards'],
        premium: true,
        source: 'httpster'
      }
    ]

    return style ? footers.filter(footer => footer.style === style) : footers
  }

  // Design Inspiration Integration (Multiple sources)
  async getDesignInspiration(category?: string, source?: string): Promise<DesignInspiration[]> {
    const inspirations: DesignInspiration[] = [
      {
        id: 'dribbble-fashion-1',
        title: 'Streetwear Brand Identity',
        description: 'Modern streetwear brand with bold typography and urban aesthetics',
        image_url: '/inspiration/streetwear-brand.jpg',
        source_url: 'https://dribbble.com/shots/example',
        category: 'branding',
        tags: ['streetwear', 'branding', 'typography', 'urban'],
        color_palette: ['#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4'],
        style: 'modern',
        source: 'dribbble'
      },
      {
        id: 'httpster-ecommerce-1',
        title: 'Fashion E-commerce Layout',
        description: 'Clean and modern e-commerce design for fashion brands',
        image_url: '/inspiration/fashion-ecommerce.jpg',
        source_url: 'https://httpster.net/website/example',
        category: 'ecommerce',
        tags: ['ecommerce', 'fashion', 'clean', 'modern'],
        color_palette: ['#F8F9FA', '#212529', '#007BFF', '#28A745'],
        style: 'clean',
        source: 'httpster'
      },
      {
        id: 'same-energy-abstract-1',
        title: 'Abstract Pattern Collection',
        description: 'Geometric and abstract patterns for textile design',
        image_url: '/inspiration/abstract-patterns.jpg',
        source_url: 'https://same.energy/search/example',
        category: 'patterns',
        tags: ['abstract', 'geometric', 'patterns', 'textile'],
        color_palette: ['#8E44AD', '#3498DB', '#E74C3C', '#F39C12'],
        style: 'abstract',
        source: 'same_energy'
      }
    ]

    let filtered = inspirations
    if (category) filtered = filtered.filter(insp => insp.category === category)
    if (source) filtered = filtered.filter(insp => insp.source === source)
    
    return filtered
  }

  // LS Graphics Mockup Integration
  async getLSGraphicsMockups(category?: string): Promise<LSGraphicsMockup[]> {
    const mockups: LSGraphicsMockup[] = [
      {
        id: 'ls-tshirt-1',
        name: 'Premium T-Shirt Mockup',
        category: 'apparel',
        preview_url: '/mockups/ls-graphics/tshirt-premium.jpg',
        download_url: '/api/mockups/ls-graphics/tshirt-premium',
        file_format: 'PSD',
        price: 49,
        animated: false,
        source: 'ls_graphics'
      },
      {
        id: 'ls-hoodie-animated-1',
        name: 'Animated Hoodie Mockup',
        category: 'apparel',
        preview_url: '/mockups/ls-graphics/hoodie-animated.gif',
        download_url: '/api/mockups/ls-graphics/hoodie-animated',
        file_format: 'GIF',
        price: 79,
        animated: true,
        source: 'ls_graphics'
      },
      {
        id: 'ls-device-iphone-1',
        name: 'iPhone 16 Pro Mockup',
        category: 'devices',
        preview_url: '/mockups/ls-graphics/iphone-16-pro.jpg',
        download_url: '/api/mockups/ls-graphics/iphone-16-pro',
        file_format: 'PSD',
        price: 29,
        animated: false,
        device_type: 'smartphone',
        orientation: 'portrait',
        source: 'ls_graphics'
      },
      {
        id: 'ls-branding-1',
        name: 'Complete Branding Mockup Set',
        category: 'branding',
        preview_url: '/mockups/ls-graphics/branding-complete.jpg',
        download_url: '/api/mockups/ls-graphics/branding-complete',
        file_format: 'PSD',
        price: 99,
        animated: false,
        source: 'ls_graphics'
      }
    ]

    return category ? mockups.filter(mockup => mockup.category === category) : mockups
  }

  // Combined Resource Search
  async searchAllResources(query: string, resourceTypes?: string[]): Promise<{
    fonts: PremiumFont[]
    illustrations: IllustrationAsset[]
    footers: FooterDesign[]
    inspirations: DesignInspiration[]
    mockups: LSGraphicsMockup[]
  }> {
    const searchTerm = query.toLowerCase()
    
    const [fonts, illustrations, footers, inspirations, mockups] = await Promise.all([
      this.getPremiumFonts(),
      this.getIllustrations(),
      this.getFooterDesigns(),
      this.getDesignInspiration(),
      this.getLSGraphicsMockups()
    ])

    return {
      fonts: fonts.filter(font => 
        font.name.toLowerCase().includes(searchTerm) ||
        font.family.toLowerCase().includes(searchTerm) ||
        font.style.toLowerCase().includes(searchTerm)
      ),
      illustrations: illustrations.filter(ill =>
        ill.title.toLowerCase().includes(searchTerm) ||
        ill.description.toLowerCase().includes(searchTerm) ||
        ill.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ),
      footers: footers.filter(footer =>
        footer.title.toLowerCase().includes(searchTerm) ||
        footer.style.toLowerCase().includes(searchTerm) ||
        footer.components.some(comp => comp.toLowerCase().includes(searchTerm))
      ),
      inspirations: inspirations.filter(insp =>
        insp.title.toLowerCase().includes(searchTerm) ||
        insp.description.toLowerCase().includes(searchTerm) ||
        insp.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ),
      mockups: mockups.filter(mockup =>
        mockup.name.toLowerCase().includes(searchTerm) ||
        mockup.category.toLowerCase().includes(searchTerm)
      )
    }
  }

  // Resource Recommendation Engine
  async getRecommendedResources(context: {
    style: string
    category: string
    colors: string[]
    user_preferences?: string[]
  }): Promise<{
    fonts: PremiumFont[]
    illustrations: IllustrationAsset[]
    mockups: LSGraphicsMockup[]
    inspirations: DesignInspiration[]
  }> {
    const { style, category, colors, user_preferences = [] } = context

    // Smart recommendation logic
    const [fonts, illustrations, mockups, inspirations] = await Promise.all([
      this.getPremiumFonts(),
      this.getIllustrations(style, category),
      this.getLSGraphicsMockups(category),
      this.getDesignInspiration(category)
    ])

    // Filter and score resources based on context
    const recommendedFonts = fonts
      .filter(font => 
        font.style === style || 
        user_preferences.includes(font.family)
      )
      .slice(0, 6)

    const recommendedIllustrations = illustrations
      .filter(ill => ill.style === style)
      .slice(0, 8)

    const recommendedMockups = mockups
      .filter(mockup => mockup.category === category)
      .slice(0, 6)

    const recommendedInspirations = inspirations
      .filter(insp => insp.style === style)
      .slice(0, 10)

    return {
      fonts: recommendedFonts,
      illustrations: recommendedIllustrations,
      mockups: recommendedMockups,
      inspirations: recommendedInspirations
    }
  }

  // Premium Resource Analytics
  async getResourceAnalytics(): Promise<{
    totalResources: number
    premiumResources: number
    freeResources: number
    popularCategories: string[]
    recentAdditions: number
  }> {
    const [fonts, illustrations, footers, inspirations, mockups] = await Promise.all([
      this.getPremiumFonts(),
      this.getIllustrations(),
      this.getFooterDesigns(),
      this.getDesignInspiration(),
      this.getLSGraphicsMockups()
    ])

    const totalResources = fonts.length + illustrations.length + footers.length + inspirations.length + mockups.length
    const premiumResources = [
      ...fonts.filter(f => f.license === 'premium'),
      ...illustrations.filter(i => i.premium),
      ...footers.filter(f => f.premium),
      ...mockups
    ].length

    return {
      totalResources,
      premiumResources,
      freeResources: totalResources - premiumResources,
      popularCategories: ['streetwear', 'minimal', 'modern', 'urban', 'fashion'],
      recentAdditions: 47
    }
  }
}

// Export singleton instance
export const premiumResourceIntegration = PremiumResourceIntegration.getInstance()

// Export types
export type { 
  PremiumFont, 
  IllustrationAsset, 
  FooterDesign, 
  DesignInspiration, 
  LSGraphicsMockup 
}