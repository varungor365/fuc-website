// AI Personal Stylist Service
// Comprehensive AI-powered styling recommendations and analysis

export interface StyleProfile {
  id: string;
  userId: string;
  bodyType: 'pear' | 'apple' | 'hourglass' | 'rectangle' | 'inverted-triangle';
  colorSeason: 'spring' | 'summer' | 'autumn' | 'winter';
  preferredStyles: string[];
  sizes: {
    tops: string;
    bottoms: string;
    shoes: string;
    dresses: string;
  };
  personalityStyle: 'classic' | 'trendy' | 'bohemian' | 'minimalist' | 'edgy' | 'romantic';
  lifestyleNeeds: string[];
  budgetRange: 'budget' | 'mid-range' | 'luxury' | 'mixed';
  colorPreferences: string[];
  avoidColors: string[];
  fabricPreferences: string[];
  occasionNeeds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  description: string;
  occasion: string;
  confidenceScore: number;
  items: {
    id: string;
    type: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';
    name: string;
    brand: string;
    price: number;
    image: string;
    reason: string;
  }[];
  stylingTips: string[];
  alternativeItems: any[];
  totalPrice: number;
  seasonality: 'spring' | 'summer' | 'autumn' | 'winter' | 'all-season';
  tags: string[];
}

export interface StyleAnalysis {
  bodyTypeAnalysis: {
    detectedBodyType: string;
    confidence: number;
    recommendations: string[];
    silhouettesToAvoid: string[];
    silhouettesToEmbrace: string[];
  };
  colorAnalysis: {
    detectedSeason: string;
    confidence: number;
    bestColors: string[];
    worstColors: string[];
    neutrals: string[];
  };
  stylePersonality: {
    primaryStyle: string;
    secondaryStyle: string;
    confidence: number;
    characteristics: string[];
  };
}

export interface VirtualWardrobe {
  id: string;
  userId: string;
  items: WardrobeItem[];
  outfits: SavedOutfit[];
  wishlist: WishlistItem[];
  analytics: {
    mostWornItems: string[];
    leastWornItems: string[];
    costPerWear: Record<string, number>;
    gapsInWardrobe: string[];
    suggestions: string[];
  };
}

export interface WardrobeItem {
  id: string;
  productId?: string;
  name: string;
  type: string;
  color: string;
  brand: string;
  purchaseDate: string;
  price: number;
  timesWorn: number;
  lastWorn?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  season: string[];
  occasions: string[];
  image: string;
  tags: string[];
}

export interface SavedOutfit {
  id: string;
  name: string;
  itemIds: string[];
  occasion: string;
  season: string;
  timesWorn: number;
  lastWorn?: string;
  rating: number;
  notes: string;
  image?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  addedAt: string;
  image: string;
}

class AIStyleService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

  // Style Profile Management
  async createStyleProfile(userId: string, profileData: Partial<StyleProfile>): Promise<StyleProfile> {
    try {
      const response = await fetch(`${this.apiUrl}/api/style-profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            userId,
            ...profileData,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create style profile');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating style profile:', error);
      throw error;
    }
  }

  async getStyleProfile(userId: string): Promise<StyleProfile | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/style-profiles?filters[userId][$eq]=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch style profile');
      }

      const data = await response.json();
      return data.data.length > 0 ? data.data[0] : null;
    } catch (error) {
      console.error('Error fetching style profile:', error);
      return null;
    }
  }

  async updateStyleProfile(profileId: string, updates: Partial<StyleProfile>): Promise<StyleProfile> {
    try {
      const response = await fetch(`${this.apiUrl}/api/style-profiles/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: updates
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update style profile');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating style profile:', error);
      throw error;
    }
  }

  // AI-Powered Style Analysis
  async analyzeUserStyle(userId: string, preferences: any): Promise<StyleAnalysis> {
    // Simulate AI analysis - in production, this would use actual AI/ML services
    const mockAnalysis: StyleAnalysis = {
      bodyTypeAnalysis: {
        detectedBodyType: 'hourglass',
        confidence: 0.85,
        recommendations: [
          'Emphasize your waist with belts and fitted tops',
          'High-waisted bottoms work excellently',
          'V-necks and scoop necks are flattering'
        ],
        silhouettesToAvoid: ['Boxy shapes', 'Loose-fitting clothes'],
        silhouettesToEmbrace: ['Fitted waists', 'A-line skirts', 'Wrap dresses']
      },
      colorAnalysis: {
        detectedSeason: 'autumn',
        confidence: 0.78,
        bestColors: ['Deep reds', 'Rich browns', 'Warm oranges', 'Golden yellows'],
        worstColors: ['Pastels', 'Bright pinks', 'Cool blues'],
        neutrals: ['Cream', 'Camel', 'Chocolate brown', 'Warm gray']
      },
      stylePersonality: {
        primaryStyle: 'classic',
        secondaryStyle: 'trendy',
        confidence: 0.82,
        characteristics: [
          'Prefers timeless pieces',
          'Values quality over quantity',
          'Likes to incorporate current trends subtly'
        ]
      }
    };

    return mockAnalysis;
  }

  // Outfit Recommendations
  async getOutfitRecommendations(
    userId: string, 
    occasion?: string, 
    weather?: string,
    budget?: string
  ): Promise<OutfitRecommendation[]> {
    try {
      const profile = await this.getStyleProfile(userId);
      
      if (!profile) {
        throw new Error('No style profile found for user');
      }

      // Simulate AI-powered recommendations based on profile
      const mockRecommendations: OutfitRecommendation[] = [
        {
          id: '1',
          title: 'Elegant Office Chic',
          description: 'Perfect for important meetings and professional events',
          occasion: 'work',
          confidenceScore: 0.92,
          items: [
            {
              id: 'top1',
              type: 'top',
              name: 'Silk Blouse',
              brand: 'FASHUN.CO',
              price: 89.99,
              image: '/images/products/silk-blouse.jpg',
              reason: 'Flattering neckline for your body type'
            },
            {
              id: 'bottom1',
              type: 'bottom',
              name: 'High-waisted Trousers',
              brand: 'FASHUN.CO',
              price: 129.99,
              image: '/images/products/trousers.jpg',
              reason: 'Emphasizes your waist beautifully'
            }
          ],
          stylingTips: [
            'Add a statement necklace for extra sophistication',
            'Pair with pointed toe heels for a polished look',
            'Consider a blazer for cooler weather'
          ],
          alternativeItems: [],
          totalPrice: 219.98,
          seasonality: 'all-season',
          tags: ['professional', 'elegant', 'versatile']
        },
        {
          id: '2',
          title: 'Weekend Casual Comfort',
          description: 'Stylish yet comfortable for weekend activities',
          occasion: 'casual',
          confidenceScore: 0.88,
          items: [
            {
              id: 'dress1',
              type: 'dress',
              name: 'Wrap Midi Dress',
              brand: 'FASHUN.CO',
              price: 79.99,
              image: '/images/products/wrap-dress.jpg',
              reason: 'Perfect silhouette for your body type'
            }
          ],
          stylingTips: [
            'Add sneakers for a casual vibe',
            'Layer with a denim jacket',
            'Accessorize with a crossbody bag'
          ],
          alternativeItems: [],
          totalPrice: 79.99,
          seasonality: 'spring',
          tags: ['casual', 'comfortable', 'versatile']
        }
      ];

      return mockRecommendations;
    } catch (error) {
      console.error('Error getting outfit recommendations:', error);
      throw error;
    }
  }

  // Virtual Wardrobe Management
  async getVirtualWardrobe(userId: string): Promise<VirtualWardrobe> {
    try {
      const response = await fetch(`${this.apiUrl}/api/virtual-wardrobes?filters[userId][$eq]=${userId}&populate=*`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch virtual wardrobe');
      }

      const data = await response.json();
      return data.data.length > 0 ? data.data[0] : this.createEmptyWardrobe(userId);
    } catch (error) {
      console.error('Error fetching virtual wardrobe:', error);
      return this.createEmptyWardrobe(userId);
    }
  }

  private createEmptyWardrobe(userId: string): VirtualWardrobe {
    return {
      id: '',
      userId,
      items: [],
      outfits: [],
      wishlist: [],
      analytics: {
        mostWornItems: [],
        leastWornItems: [],
        costPerWear: {},
        gapsInWardrobe: [],
        suggestions: []
      }
    };
  }

  async addWardrobeItem(userId: string, item: Omit<WardrobeItem, 'id'>): Promise<WardrobeItem> {
    try {
      const response = await fetch(`${this.apiUrl}/api/wardrobe-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            userId,
            ...item,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add wardrobe item');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error adding wardrobe item:', error);
      throw error;
    }
  }

  async updateWardrobeItem(itemId: string, updates: Partial<WardrobeItem>): Promise<WardrobeItem> {
    try {
      const response = await fetch(`${this.apiUrl}/api/wardrobe-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: updates
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update wardrobe item');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating wardrobe item:', error);
      throw error;
    }
  }

  // Trend Forecasting
  async getTrendForecast(): Promise<any[]> {
    // Simulate trend data - in production, this would integrate with fashion trend APIs
    const mockTrends = [
      {
        id: '1',
        name: 'Oversized Blazers',
        description: 'Structured yet comfortable blazers are trending',
        confidenceScore: 0.89,
        season: 'autumn',
        category: 'outerwear',
        influence: 'high',
        timeframe: '3-6 months',
        relatedColors: ['sage green', 'rust orange', 'cream'],
        stylingTips: ['Pair with fitted bottoms', 'Roll up sleeves for casual look']
      },
      {
        id: '2',
        name: 'Earth Tones',
        description: 'Natural, earthy colors are dominating this season',
        confidenceScore: 0.95,
        season: 'autumn',
        category: 'color',
        influence: 'high',
        timeframe: '6-12 months',
        relatedColors: ['terracotta', 'olive green', 'warm brown'],
        stylingTips: ['Mix different earth tones', 'Add metallic accessories']
      }
    ];

    return mockTrends;
  }

  // Style Compatibility Analysis
  async analyzeStyleCompatibility(items: string[]): Promise<any> {
    // Analyze how well items work together
    return {
      compatibilityScore: 0.85,
      reasons: ['Colors complement each other', 'Styles work harmoniously'],
      suggestions: ['Add a statement accessory', 'Consider different footwear'],
      seasonAppropriate: true,
      occasionSuitable: true
    };
  }

  // Personal Shopping Assistance
  async getPersonalShoppingRecommendations(userId: string, budget: number): Promise<any[]> {
    const profile = await this.getStyleProfile(userId);
    const wardrobe = await this.getVirtualWardrobe(userId);

    // Analyze wardrobe gaps and recommend purchases
    const recommendations = [
      {
        item: 'Classic White Button-Down',
        reason: 'Versatile piece missing from your wardrobe',
        priority: 'high',
        estimatedPrice: 89.99,
        alternatives: ['Cotton poplin shirt', 'Silk blouse']
      },
      {
        item: 'Dark Wash Jeans',
        reason: 'Great for casual and smart-casual occasions',
        priority: 'medium',
        estimatedPrice: 129.99,
        alternatives: ['Black jeans', 'Chinos']
      }
    ];

    return recommendations;
  }
}

export const aiStyleService = new AIStyleService();
export default aiStyleService;
