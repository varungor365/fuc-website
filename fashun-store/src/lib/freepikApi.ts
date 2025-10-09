/**
 * Enhanced Freepik API Service
 * Comprehensive integration with AI generation, mockups, and image editing
 * 🔄 4-Tier Fallback System: Freepik → Unsplash → Picsum → SVG Placeholder
 */

const FREEPIK_API_KEY = 'FPSX231f0a23b48d96bd0d59894cfe7d8117';
const FREEPIK_BASE_URL = 'https://api.freepik.com/v1';

// 🔄 4-TIER FALLBACK SYSTEM
export const FALLBACK_SOURCES = {
  PRIMARY: 'freepik',
  SECONDARY: 'pexels',
  TERTIARY: 'unsplash', 
  QUATERNARY: 'picsum',
  FINAL: 'svg_placeholder'
};

// 📊 ERROR HANDLING CODES
export const ERROR_CODES = {
  NETWORK_FAILURE: 'NETWORK_FAILURE',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  RATE_LIMIT: 'RATE_LIMIT',
  NOT_FOUND: 'NOT_FOUND',
  TIMEOUT: 'TIMEOUT',
  API_KEY_INVALID: 'API_KEY_INVALID'
};

// 🎨 FASHION-OPTIMIZED SEARCH CATEGORIES
export const FASHION_CATEGORIES = {
  streetwear: 'urban streetwear fashion clothing style modern',
  tshirts: 't-shirt mockup template fashion cotton casual wear',
  hoodies: 'hoodie sweatshirt urban fashion comfortable streetwear',
  jackets: 'jacket bomber fashion outerwear style trendy',
  accessories: 'fashion accessories cap bag jewelry urban style',
  models: 'fashion model portrait lifestyle young trendy',
  lifestyle: 'young person lifestyle urban fashion street style',
  vintage: 'vintage retro fashion clothing classic style',
  minimalist: 'minimalist fashion clean simple elegant style',
  cyberpunk: 'cyberpunk futuristic fashion neon tech style',
  athletic: 'athletic sportswear fitness fashion active wear',
  formal: 'formal fashion business attire professional wear'
};

// Reliability configuration
interface ReliabilityConfig {
  maxRetries: number;
  timeout: number;
  enableFallback: boolean;
  logErrors: boolean;
}

interface FallbackResult {
  url: string;
  source: string;
  error?: string;
  retryCount?: number;
}

const DEFAULT_RELIABILITY_CONFIG: ReliabilityConfig = {
  maxRetries: 3,
  timeout: 10000, // 10 seconds
  enableFallback: true,
  logErrors: true
};

// AI Generation Models available
export const AI_MODELS = {
  MYSTIC: 'mystic', // General purpose AI model
  FLUX: 'flux', // High-quality realistic images
  FLUX_REALISM: 'flux-realism', // Ultra-realistic photos
  FLUX_ANIME: 'flux-anime', // Anime/illustration style
  STABLE_DIFFUSION: 'stable-diffusion-xl' // Classic SD model
};

// Image styles for different use cases
export const IMAGE_STYLES = {
  PHOTOREALISTIC: 'photorealistic',
  ILLUSTRATION: 'illustration', 
  VECTOR: 'vector art',
  MINIMALIST: 'minimalist design',
  VINTAGE: 'vintage retro',
  CYBERPUNK: 'cyberpunk futuristic',
  STREETWEAR: 'urban streetwear style'
};

export interface FreepikResource {
  id: string;
  title: string;
  url: string;
  preview: {
    url: string;
    width: number;
    height: number;
  };
  thumbnails: {
    small: string;
    medium: string;
    large: string;
  };
  type: 'photo' | 'vector' | 'psd' | 'ai' | 'eps';
  tags: string[];
  premium: boolean;
}

// AI Generation Interfaces
export interface AIGenerationRequest {
  prompt: string;
  negative_prompt?: string;
  model?: string;
  width?: number;
  height?: number;
  num_images?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
  seed?: number;
  style?: string;
}

export interface AIGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  images?: {
    id: string;
    url: string;
    width: number;
    height: number;
  }[];
  error?: string;
  metadata?: {
    prompt: string;
    model: string;
    generation_time: number;
    cost: number;
  };
}

// Mockup Generation Interfaces
export interface MockupRequest {
  template_id?: string;
  design_url: string;
  product_type: 'tshirt' | 'hoodie' | 'tank' | 'mug' | 'poster';
  color?: string;
  size?: string;
  perspective?: 'front' | 'back' | 'side' | 'folded' | 'lifestyle';
  environment?: string;
  lighting?: 'natural' | 'studio' | 'dramatic' | 'soft';
}

export interface MockupResponse {
  id: string;
  mockup_url: string;
  preview_url: string;
  download_url: string;
  metadata: {
    template: string;
    product_type: string;
    generation_time: number;
  };
}

// Image Editing Interfaces
export interface ImageEditRequest {
  image_url: string;
  operation: 'upscale' | 'remove_background' | 'enhance' | 'relight' | 'colorize';
  parameters?: {
    scale_factor?: number; // for upscaling
    enhancement_level?: number; // for enhancement
    lighting_direction?: string; // for relighting
    target_colors?: string[]; // for colorization
  };
}

export interface ImageEditResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result_url?: string;
  original_url: string;
  operation: string;
  cost: number;
}

// Custom Model Training (LoRA)
export interface LoRATrainingRequest {
  name: string;
  description?: string;
  training_images: string[]; // Array of image URLs
  trigger_word: string;
  base_model?: string;
  training_steps?: number;
}

export interface LoRAModel {
  id: string;
  name: string;
  status: 'training' | 'completed' | 'failed';
  trigger_word: string;
  download_url?: string;
  training_progress?: number;
}

export interface FreepikSearchParams {
  term: string;
  page?: number;
  limit?: number;
  order?: 'relevance' | 'recent';
  filters?: {
    type?: 'photo' | 'vector' | 'psd' | 'ai' | 'eps';
    orientation?: 'horizontal' | 'vertical' | 'square';
    category?: string;
    color?: string;
    premium?: boolean;
  };
}

export interface FreepikSearchResponse {
  data: FreepikResource[];
  meta: {
    per_page: number;
    total: number;
    last_page: number;
    current_page: number;
    clean_search: boolean;
  };
}

class FreepikApiService {
  private apiKey: string;
  private baseUrl: string;
  private config: ReliabilityConfig;

  constructor(apiKey: string = FREEPIK_API_KEY, config: ReliabilityConfig = DEFAULT_RELIABILITY_CONFIG) {
    this.apiKey = apiKey;
    this.baseUrl = FREEPIK_BASE_URL;
    this.config = config;
  }

  /**
   * 🔄 4-TIER FALLBACK SYSTEM
   * Primary: Freepik API → Secondary: Unsplash → Tertiary: Picsum → Final: SVG Placeholder
   */
  async getImageWithFallback(searchTerm: string, category?: string): Promise<FallbackResult> {
    let lastError: string = '';
    let retryCount = 0;

    // TIER 1: Freepik API (Primary)
    try {
      const freepikResult = await this.tryFreepikImage(searchTerm, category);
      if (freepikResult) {
        return {
          url: freepikResult,
          source: FALLBACK_SOURCES.PRIMARY,
          retryCount
        };
      }
    } catch (error) {
      lastError = this.handleError(error, 'Freepik API');
      retryCount++;
    }

    // TIER 2: Pexels (Secondary fallback)
    if (this.config.enableFallback) {
      try {
        const pexelsResult = await this.tryPexelsImage(searchTerm);
        return {
          url: pexelsResult,
          source: FALLBACK_SOURCES.SECONDARY,
          error: lastError,
          retryCount
        };
      } catch (error) {
        lastError = this.handleError(error, 'Pexels');
        retryCount++;
      }
    }

    // TIER 3: Unsplash (Tertiary fallback)
    if (this.config.enableFallback) {
      try {
        const unsplashResult = await this.tryUnsplashImage(searchTerm);
        return {
          url: unsplashResult,
          source: FALLBACK_SOURCES.TERTIARY,
          error: lastError,
          retryCount
        };
      } catch (error) {
        lastError = this.handleError(error, 'Unsplash');
        retryCount++;
      }
    }

    // TIER 4: Picsum Photos (Quaternary fallback)
    if (this.config.enableFallback) {
      try {
        const picsumResult = await this.tryPicsumImage();
        return {
          url: picsumResult,
          source: FALLBACK_SOURCES.QUATERNARY,
          error: lastError,
          retryCount
        };
      } catch (error) {
        lastError = this.handleError(error, 'Picsum');
        retryCount++;
      }
    }

    // TIER 4: SVG Placeholder (Final fallback)
    return {
      url: this.generateSVGPlaceholder(searchTerm),
      source: FALLBACK_SOURCES.FINAL,
      error: lastError,
      retryCount
    };
  }

  /**
   * Try to get image from Freepik API with enhanced error handling
   */
  private async tryFreepikImage(searchTerm: string, category?: string): Promise<string | null> {
    const enhancedTerm = category && FASHION_CATEGORIES[category as keyof typeof FASHION_CATEGORIES] 
      ? FASHION_CATEGORIES[category as keyof typeof FASHION_CATEGORIES]
      : searchTerm;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/resources`, {
        method: 'GET',
        headers: {
          'x-freepik-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        throw new Error(ERROR_CODES.RATE_LIMIT);
      }

      if (!response.ok) {
        throw new Error(`${ERROR_CODES.INVALID_RESPONSE}: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        return data.data[0].preview.url;
      }

      return null;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(ERROR_CODES.TIMEOUT);
      }
      throw error;
    }
  }

  /**
   * Try to get image from Pexels as secondary fallback
   */
  private async tryPexelsImage(searchTerm: string): Promise<string> {
    const pexelsApiKey = process.env.PEXELS_API_KEY || 'KJWWcdUA07x2yLwj7s8KnYb5w6OfkRMxY9HCxpsVAJZY8uEisULVeXIy';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=1&orientation=landscape`, {
        method: 'GET',
        headers: {
          'Authorization': pexelsApiKey,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.medium;
      }
      
      throw new Error(ERROR_CODES.NOT_FOUND);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(ERROR_CODES.TIMEOUT);
      }
      throw error;
    }
  }

  /**
   * Try to get image from Unsplash as tertiary fallback
   */
  private async tryUnsplashImage(searchTerm: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      // Use Unsplash Source API for simplicity
      const width = 800;
      const height = 600;
      const url = `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(searchTerm)}`;
      
      // Test if the URL is accessible
      const response = await fetch(url, { 
        method: 'HEAD', 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return url;
      }
      
      throw new Error(ERROR_CODES.NOT_FOUND);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(ERROR_CODES.TIMEOUT);
      }
      throw error;
    }
  }

  /**
   * Try to get image from Picsum as quaternary fallback
   */
  private async tryPicsumImage(): Promise<string> {
    const width = 800;
    const height = 600;
    const randomId = Math.floor(Math.random() * 1000) + 1;
    return `https://picsum.photos/${width}/${height}?random=${randomId}`;
  }

  /**
   * Generate SVG placeholder as final fallback
   */
  private generateSVGPlaceholder(searchTerm: string): string {
    const width = 800;
    const height = 600;
    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    const textColor = '#ffffff';
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <rect width="90%" height="80%" x="5%" y="10%" fill="none" stroke="${textColor}" stroke-width="2" stroke-dasharray="10,5"/>
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
          🎨 Fashion Design
        </text>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="16">
          ${searchTerm || 'Image Placeholder'}
        </text>
        <text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="12" opacity="0.8">
          Fashun.co.in
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Enhanced error handling with logging
   */
  private handleError(error: any, source: string): string {
    const errorMessage = `${source} failed: ${error.message || error}`;
    
    if (this.config.logErrors) {
      console.warn(`🚫 ${errorMessage}`);
    }
    
    return errorMessage;
  }

  /**
   * Get multiple images with fallback for galleries
   */
  async getImageGalleryWithFallback(searchTerm: string, count: number = 6, category?: string): Promise<FallbackResult[]> {
    const results: FallbackResult[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const result = await this.getImageWithFallback(`${searchTerm} ${i}`, category);
        results.push(result);
      } catch (error) {
        // Fallback to SVG placeholder for any remaining images
        results.push({
          url: this.generateSVGPlaceholder(`${searchTerm} ${i + 1}`),
          source: FALLBACK_SOURCES.FINAL,
          error: `Gallery item ${i + 1} failed: ${error}`
        });
      }
    }
    
    return results;
  }

  /**
   * Generate AI images from text prompts
   * Perfect for Creator Studio and custom designs
   */
  async generateAIImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/text-to-image`, {
        method: 'POST',
        headers: {
          'x-freepik-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          negative_prompt: request.negative_prompt || 'blurry, low quality, distorted',
          model: request.model || AI_MODELS.MYSTIC,
          width: request.width || 512,
          height: request.height || 512,
          num_images: request.num_images || 1,
          guidance_scale: request.guidance_scale || 7.5,
          num_inference_steps: request.num_inference_steps || 30,
          seed: request.seed,
          style: request.style
        })
      });

      if (!response.ok) {
        throw new Error(`AI Generation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI image generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate professional mockups for T-shirts and products
   * Replaces basic image placement with lifestyle photography
   */
  async generateMockup(request: MockupRequest): Promise<MockupResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mockups/generate`, {
        method: 'POST',
        headers: {
          'x-freepik-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          design_url: request.design_url,
          product_type: request.product_type,
          color: request.color || 'white',
          size: request.size || 'M',
          perspective: request.perspective || 'front',
          environment: request.environment || 'Apply this design to a folded t-shirt on a rustic wooden table with soft, cozy lighting',
          lighting: request.lighting || 'natural'
        })
      });

      if (!response.ok) {
        throw new Error(`Mockup generation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Mockup generation failed:', error);
      throw error;
    }
  }

  /**
   * Edit images (upscale, remove background, enhance)
   * Perfect for preprocessing try-on images
   */
  async editImage(request: ImageEditRequest): Promise<ImageEditResponse> {
    try {
      const endpoint = this.getEditEndpoint(request.operation);
      
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'x-freepik-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: request.image_url,
          ...request.parameters
        })
      });

      if (!response.ok) {
        throw new Error(`Image editing failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Image editing failed:', error);
      throw error;
    }
  }

  /**
   * Train custom LoRA models for personalized avatars
   * Premium feature for consistent user representation
   */
  async trainLoRAModel(request: LoRATrainingRequest): Promise<LoRAModel> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/lora/train`, {
        method: 'POST',
        headers: {
          'x-freepik-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: request.name,
          description: request.description,
          training_images: request.training_images,
          trigger_word: request.trigger_word,
          base_model: request.base_model || AI_MODELS.FLUX,
          training_steps: request.training_steps || 1000
        })
      });

      if (!response.ok) {
        throw new Error(`LoRA training failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('LoRA training failed:', error);
      throw error;
    }
  }

  /**
   * Get LoRA model status and download URL
   */
  async getLoRAModel(modelId: string): Promise<LoRAModel> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/lora/${modelId}`, {
        headers: {
          'x-freepik-api-key': this.apiKey,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get LoRA model: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get LoRA model:', error);
      throw error;
    }
  }

  /**
   * Helper method to get the correct endpoint for image editing operations
   */
  private getEditEndpoint(operation: string): string {
    const endpoints = {
      'upscale': 'image-upscaler',
      'remove_background': 'background-remover',
      'enhance': 'image-enhancer',
      'relight': 'image-relighter',
      'colorize': 'image-colorizer'
    };
    
    return endpoints[operation as keyof typeof endpoints] || 'image-enhancer';
  }

  /**
   * Search for resources using Freepik API
   */
  async searchResources(params: FreepikSearchParams): Promise<FreepikSearchResponse> {
    try {
      const url = new URL(`${this.baseUrl}/resources`);
      
      // Add query parameters
      url.searchParams.append('term', params.term);
      if (params.page) url.searchParams.append('page', params.page.toString());
      if (params.limit) url.searchParams.append('limit', params.limit.toString());
      if (params.order) url.searchParams.append('order', params.order);
      
      // Add filters with proper array handling for orientation
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined) {
            // Fix: Freepik API expects orientation as array format
            if (key === 'orientation') {
              url.searchParams.append(`filters[${key}][]`, value.toString());
            } else {
              url.searchParams.append(`filters[${key}]`, value.toString());
            }
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-freepik-api-key': this.apiKey,
          'Accept-Language': 'en-US',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Freepik API error: ${response.status} ${response.statusText}`);
      }

      const data: FreepikSearchResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching from Freepik API:', error);
      throw error;
    }
  }

  /**
   * Get fashion/streetwear related images
   */
  async getFashionImages(category: string = 'streetwear', limit: number = 10): Promise<FreepikResource[]> {
    try {
      const searchTerms = {
        streetwear: 'urban streetwear fashion clothing',
        tshirts: 't-shirt mockup template fashion',
        hoodies: 'hoodie sweatshirt urban fashion',
        jackets: 'jacket bomber fashion outerwear',
        accessories: 'fashion accessories cap bag',
        model: 'fashion model portrait lifestyle',
        lifestyle: 'young person lifestyle urban'
      };

      const term = searchTerms[category as keyof typeof searchTerms] || category;
      
      const response = await this.searchResources({
        term,
        limit,
        order: 'relevance',
        filters: {
          type: 'photo',
          orientation: 'vertical',
          premium: false
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching ${category} images:`, error);
      return [];
    }
  }

  /**
   * Get multiple images for a gallery or grid with enhanced fallback
   */
  async getImageGallery(searchTerm: string, count: number = 6): Promise<string[]> {
    const results = await this.getImageGalleryWithFallback(searchTerm, count);
    return results.map(result => result.url);
  }
}

// Export singleton instance
export const freepikApi = new FreepikApiService();

// Export helper functions with enhanced fallback system
export const getFashionImage = async (category: string): Promise<FallbackResult> => {
  return await freepikApi.getImageWithFallback(category, category);
};

export const getFashionImageUrl = async (category: string): Promise<string> => {
  const result = await freepikApi.getImageWithFallback(category, category);
  return result.url;
};

export const getFashionGallery = async (searchTerm: string, count?: number): Promise<FallbackResult[]> => {
  return await freepikApi.getImageGalleryWithFallback(searchTerm, count);
};

export const getFashionGalleryUrls = async (searchTerm: string, count?: number): Promise<string[]> => {
  const results = await freepikApi.getImageGalleryWithFallback(searchTerm, count);
  return results.map(result => result.url);
};

export const getFreepikResources = (params: FreepikSearchParams) => freepikApi.searchResources(params);

// 📊 RELIABILITY MONITORING HELPERS
export const getSystemReliability = () => {
  return {
    fallback_sources: FALLBACK_SOURCES,
    error_codes: ERROR_CODES,
    fashion_categories: Object.keys(FASHION_CATEGORIES),
    features: [
      '🔄 5-Tier Fallback System',
      '📊 Comprehensive Error Handling',
      '🎨 Fashion-Optimized Searches',
      '🛡️ Rate Limit Protection',
      '⏱️ Timeout Management',
      '🎨 SVG Placeholder Generation'
    ]
  };
};

// Quick access to fashion-optimized search terms
export const getFashionSearchTerm = (category: string): string => {
  return FASHION_CATEGORIES[category as keyof typeof FASHION_CATEGORIES] || category;
};