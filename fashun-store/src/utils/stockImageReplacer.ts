/**
 * Automatic Stock Image Replacement System
 * Replaces all stock images throughout the website with AI-generated images
 */

export interface ImageRequest {
  id: string;
  category: 'hero' | 'product' | 'collection' | 'category' | 'lifestyle' | 'banner';
  description: string;
  style?: string;
  width?: number;
  height?: number;
  currentUrl?: string;
}

export interface ImageResult {
  id: string;
  imageUrl: string;
  category: string;
  description: string;
  error?: string;
}

export interface ReplacementJob {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  total: number;
  completed: number;
  results: ImageResult[];
}

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:3001';

export class StockImageReplacer {
  private static instance: StockImageReplacer;
  
  static getInstance(): StockImageReplacer {
    if (!StockImageReplacer.instance) {
      StockImageReplacer.instance = new StockImageReplacer();
    }
    return StockImageReplacer.instance;
  }

  /**
   * Replace all stock images automatically
   */
  async replaceAllStockImages(): Promise<string> {
    const imageRequests = this.getAllImageRequests();
    
    const response = await fetch(`${AI_SERVICE_URL}/api/replace-all-stock-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ images: imageRequests }),
    });

    if (!response.ok) {
      throw new Error('Failed to start stock image replacement');
    }

    const { jobId } = await response.json();
    return jobId;
  }

  /**
   * Generate a single stock image
   */
  async generateStockImage(request: ImageRequest): Promise<string> {
    const response = await fetch(`${AI_SERVICE_URL}/api/generate-stock-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to generate stock image');
    }

    const { jobId } = await response.json();
    return jobId;
  }

  /**
   * Check job status
   */
  async checkJobStatus(jobId: string): Promise<any> {
    const response = await fetch(`${AI_SERVICE_URL}/api/job-status/${jobId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check job status');
    }

    return response.json();
  }

  /**
   * Get all image requests for the website
   */
  private getAllImageRequests(): ImageRequest[] {
    return [
      // Homepage Hero Images
      {
        id: 'hero-main',
        category: 'hero',
        description: 'Streetwear fashion hero banner with young trendy models wearing hoodies and sneakers',
        width: 1920,
        height: 800
      },
      {
        id: 'hero-sale',
        category: 'banner',
        description: 'Sale banner for streetwear fashion with vibrant colors and modern design',
        width: 1200,
        height: 400
      },

      // Category Images
      {
        id: 'category-hoodies',
        category: 'category',
        description: 'Hoodies and sweatshirts category banner with urban streetwear aesthetic',
        width: 600,
        height: 400
      },
      {
        id: 'category-tshirts',
        category: 'category',
        description: 'T-shirts category banner with modern streetwear design',
        width: 600,
        height: 400
      },
      {
        id: 'category-sneakers',
        category: 'category',
        description: 'Sneakers and footwear category with trendy athletic shoes',
        width: 600,
        height: 400
      },
      {
        id: 'category-accessories',
        category: 'category',
        description: 'Fashion accessories category with caps, bags, and jewelry',
        width: 600,
        height: 400
      },

      // Product Images - Hoodies
      {
        id: 'product-hoodie-1',
        category: 'product',
        description: 'Black oversized hoodie with minimalist streetwear design',
        width: 800,
        height: 800
      },
      {
        id: 'product-hoodie-2',
        category: 'product',
        description: 'Purple gradient hoodie with modern streetwear aesthetic',
        width: 800,
        height: 800
      },
      {
        id: 'product-hoodie-3',
        category: 'product',
        description: 'White hoodie with bold typography and urban design',
        width: 800,
        height: 800
      },

      // Product Images - T-Shirts
      {
        id: 'product-tshirt-1',
        category: 'product',
        description: 'Black graphic t-shirt with streetwear print design',
        width: 800,
        height: 800
      },
      {
        id: 'product-tshirt-2',
        category: 'product',
        description: 'Oversized white t-shirt with minimalist logo',
        width: 800,
        height: 800
      },
      {
        id: 'product-tshirt-3',
        category: 'product',
        description: 'Vintage band t-shirt with retro streetwear styling',
        width: 800,
        height: 800
      },

      // Product Images - Sneakers
      {
        id: 'product-sneaker-1',
        category: 'product',
        description: 'White chunky sneakers with modern streetwear design',
        width: 800,
        height: 800
      },
      {
        id: 'product-sneaker-2',
        category: 'product',
        description: 'Black high-top sneakers with urban aesthetic',
        width: 800,
        height: 800
      },

      // Collection Banners
      {
        id: 'collection-new-arrivals',
        category: 'collection',
        description: 'New arrivals collection banner with trendy streetwear fashion',
        width: 1200,
        height: 600
      },
      {
        id: 'collection-bestsellers',
        category: 'collection',
        description: 'Best sellers collection with popular streetwear items',
        width: 1200,
        height: 600
      },
      {
        id: 'collection-sale',
        category: 'collection',
        description: 'Sale collection banner with discounted streetwear fashion',
        width: 1200,
        height: 600
      },

      // Lifestyle Images
      {
        id: 'lifestyle-1',
        category: 'lifestyle',
        description: 'Young people wearing streetwear in urban setting',
        width: 800,
        height: 600
      },
      {
        id: 'lifestyle-2',
        category: 'lifestyle',
        description: 'Fashion lifestyle photo with trendy streetwear outfits',
        width: 800,
        height: 600
      },
      {
        id: 'lifestyle-3',
        category: 'lifestyle',
        description: 'Street fashion photography with modern urban style',
        width: 800,
        height: 600
      }
    ];
  }

  /**
   * Get image URL by ID (used for displaying generated images)
   */
  getImageUrl(id: string, fallback?: string): string {
    // Check if we have a generated image for this ID
    const storedImages = this.getStoredImages();
    if (storedImages[id]) {
      return `${AI_SERVICE_URL}${storedImages[id]}`;
    }
    
    // Return fallback or placeholder
    return fallback || this.getPlaceholderImage(id);
  }

  /**
   * Get stored images from localStorage
   */
  private getStoredImages(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = localStorage.getItem('fashun-generated-images');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Store generated images in localStorage
   */
  storeGeneratedImages(results: ImageResult[]): void {
    if (typeof window === 'undefined') return;
    
    const current = this.getStoredImages();
    const updated = { ...current };
    
    results.forEach(result => {
      if (result.imageUrl && !result.error) {
        updated[result.id] = result.imageUrl;
      }
    });
    
    localStorage.setItem('fashun-generated-images', JSON.stringify(updated));
  }

  /**
   * Get placeholder image based on category
   */
  private getPlaceholderImage(id: string): string {
    const category = id.split('-')[0];
    const placeholders = {
      'hero': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop',
      'product': 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop',
      'collection': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop',
      'category': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=400&fit=crop',
      'lifestyle': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop',
      'banner': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop'
    };
    
    return placeholders[category as keyof typeof placeholders] || placeholders.product;
  }
}

export default StockImageReplacer;