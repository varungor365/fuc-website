/**
 * Visual Shop-the-Look Service
 * Enables shopping from user-generated content and outfit inspiration
 */

export interface LookItem {
  id: string;
  productId: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  position: {
    x: number; // percentage from left
    y: number; // percentage from top
  };
  size?: string;
  color?: string;
  inStock: boolean;
  quickBuyAvailable: boolean;
}

export interface Look {
  id: string;
  title: string;
  description?: string;
  image: string;
  items: LookItem[];
  totalPrice: number;
  tags: string[];
  creator: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  stats: {
    views: number;
    likes: number;
    saves: number;
    shops: number;
  };
  createdAt: Date;
  featured: boolean;
  category: string;
  style: string[];
  occasion: string[];
}

export interface OutfitSuggestion {
  id: string;
  name: string;
  items: Array<{
    productId: string;
    category: string;
    required: boolean;
    alternatives?: string[];
  }>;
  description: string;
  totalPrice: number;
  image?: string;
  style: string;
  occasion: string[];
}

export interface StyleProfile {
  userId: string;
  preferredStyles: string[];
  favoriteColors: string[];
  bodyType?: string;
  lifestyle: string[];
  budget: {
    min: number;
    max: number;
  };
  occasions: string[];
  inspirations: string[];
}

class VisualShopTheLookService {
  private baseUrl = '/api/shop-the-look';

  /**
   * Get featured looks
   */
  async getFeaturedLooks(
    limit: number = 12,
    category?: string,
    style?: string
  ): Promise<Look[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(category && { category }),
        ...(style && { style })
      });

      const response = await fetch(`${this.baseUrl}/featured?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch featured looks');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching featured looks:', error);
      return [];
    }
  }

  /**
   * Get look by ID with shoppable items
   */
  async getLook(lookId: string): Promise<Look | null> {
    try {
      const response = await fetch(`${this.baseUrl}/looks/${lookId}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch look');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching look:', error);
      return null;
    }
  }

  /**
   * Search looks by various criteria
   */
  async searchLooks(
    query: string,
    filters?: {
      style?: string[];
      occasion?: string[];
      priceRange?: { min: number; max: number };
      category?: string;
      creator?: string;
    }
  ): Promise<Look[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to search looks');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching looks:', error);
      return [];
    }
  }

  /**
   * Get personalized look recommendations
   */
  async getPersonalizedLooks(
    userId: string,
    limit: number = 8
  ): Promise<Look[]> {
    try {
      const response = await fetch(`${this.baseUrl}/personalized/${userId}?limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch personalized looks');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching personalized looks:', error);
      return [];
    }
  }

  /**
   * Add item to cart from look
   */
  async addLookItemToCart(
    lookId: string,
    itemId: string,
    size?: string,
    quantity: number = 1
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lookId,
          itemId,
          size,
          quantity
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return { success: false, message: 'Failed to add item to cart' };
    }
  }

  /**
   * Add entire look to cart
   */
  async addLookToCart(
    lookId: string,
    sizes?: { [itemId: string]: string }
  ): Promise<{ success: boolean; message: string; unavailableItems?: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/add-look-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lookId,
          sizes
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error adding look to cart:', error);
      return { success: false, message: 'Failed to add look to cart' };
    }
  }

  /**
   * Save look to user's favorites
   */
  async saveLook(userId: string, lookId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          lookId
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error saving look:', error);
      return { success: false };
    }
  }

  /**
   * Track look interaction
   */
  async trackLookInteraction(
    lookId: string,
    action: 'view' | 'like' | 'save' | 'shop' | 'share',
    userId?: string
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lookId,
          action,
          userId,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  /**
   * Get similar looks
   */
  async getSimilarLooks(lookId: string, limit: number = 6): Promise<Look[]> {
    try {
      const response = await fetch(`${this.baseUrl}/similar/${lookId}?limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch similar looks');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching similar looks:', error);
      return [];
    }
  }

  /**
   * Generate outfit suggestions based on a single item
   */
  async getOutfitSuggestions(
    productId: string,
    occasion?: string,
    budget?: number
  ): Promise<OutfitSuggestion[]> {
    try {
      const response = await fetch(`${this.baseUrl}/outfit-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          occasion,
          budget
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch outfit suggestions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching outfit suggestions:', error);
      return [];
    }
  }

  /**
   * Get user's style profile
   */
  async getStyleProfile(userId: string): Promise<StyleProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/style-profile/${userId}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch style profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching style profile:', error);
      return null;
    }
  }

  /**
   * Update user's style profile
   */
  async updateStyleProfile(
    userId: string,
    profile: Partial<StyleProfile>
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/style-profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating style profile:', error);
      return { success: false };
    }
  }

  /**
   * Upload user-generated look content
   */
  async uploadLook(
    userId: string,
    lookData: {
      title: string;
      description?: string;
      image: File;
      items: Array<{
        productId: string;
        position: { x: number; y: number };
      }>;
      tags: string[];
      style: string[];
      occasion: string[];
    }
  ): Promise<{ success: boolean; lookId?: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('title', lookData.title);
      if (lookData.description) {
        formData.append('description', lookData.description);
      }
      formData.append('image', lookData.image);
      formData.append('items', JSON.stringify(lookData.items));
      formData.append('tags', JSON.stringify(lookData.tags));
      formData.append('style', JSON.stringify(lookData.style));
      formData.append('occasion', JSON.stringify(lookData.occasion));

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData
      });

      return await response.json();
    } catch (error) {
      console.error('Error uploading look:', error);
      return { success: false, message: 'Failed to upload look' };
    }
  }

  /**
   * Get trending looks by category
   */
  async getTrendingLooks(
    category?: string,
    timeframe: 'day' | 'week' | 'month' = 'week',
    limit: number = 12
  ): Promise<Look[]> {
    try {
      const params = new URLSearchParams({
        timeframe,
        limit: limit.toString(),
        ...(category && { category })
      });

      const response = await fetch(`${this.baseUrl}/trending?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch trending looks');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching trending looks:', error);
      return [];
    }
  }

  /**
   * Get looks by creator
   */
  async getCreatorLooks(
    creatorId: string,
    limit: number = 12
  ): Promise<Look[]> {
    try {
      const response = await fetch(`${this.baseUrl}/creator/${creatorId}?limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch creator looks');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching creator looks:', error);
      return [];
    }
  }

  /**
   * Generate AI styling suggestions
   */
  async getAIStylingTips(
    productIds: string[],
    occasion?: string,
    style?: string
  ): Promise<{
    tips: string[];
    complementaryItems: Array<{
      category: string;
      suggestions: string[];
      reasoning: string;
    }>;
    colorPalette: string[];
    accessories: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-styling`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productIds,
          occasion,
          style
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI styling tips');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting AI styling tips:', error);
      return {
        tips: [],
        complementaryItems: [],
        colorPalette: [],
        accessories: []
      };
    }
  }

  /**
   * Get color coordination suggestions
   */
  async getColorCoordination(
    baseColor: string,
    style: string
  ): Promise<{
    complementary: string[];
    analogous: string[];
    triadic: string[];
    recommendations: Array<{
      color: string;
      description: string;
      confidence: number;
    }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/color-coordination`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          baseColor,
          style
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get color coordination');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting color coordination:', error);
      return {
        complementary: [],
        analogous: [],
        triadic: [],
        recommendations: []
      };
    }
  }
}

export default VisualShopTheLookService;