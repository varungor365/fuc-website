/**
 * Multi-Provider AI Image Generation Service
 * 🔄 Automatic Fallback System: Freepik → Hugging Face → Replicate → ClipDrop
 * 🎨 Handles all AI generation with seamless provider switching
 */

const PROVIDERS = {
  FREEPIK: 'freepik',
  HUGGING_FACE: 'hugging_face', 
  REPLICATE: 'replicate',
  CLIPDROP: 'clipdrop'
} as const;

// Provider configurations
const PROVIDER_CONFIG = {
  freepik: {
    apiKey: process.env.FREEPIK_API_KEY || 'FPSX231f0a23b48d96bd0d59894cfe7d8117',
    baseUrl: 'https://api.freepik.com/v1',
    maxRetries: 2,
    timeout: 15000
  },
  hugging_face: {
    apiKey: process.env.HUGGING_FACE_API_KEY || '',
    baseUrl: 'https://api-inference.huggingface.co',
    models: {
      stable_diffusion: 'stabilityai/stable-diffusion-2-1',
      stable_diffusion_xl: 'stabilityai/stable-diffusion-xl-base-1.0',
      flux: 'black-forest-labs/FLUX.1-dev',
      anime: 'hakurei/waifu-diffusion',
      realistic: 'runwayml/stable-diffusion-v1-5'
    },
    maxRetries: 2,
    timeout: 20000
  },
  replicate: {
    apiKey: process.env.REPLICATE_API_TOKEN || '',
    baseUrl: 'https://api.replicate.com/v1',
    models: {
      stable_diffusion: 'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478',
      flux: 'black-forest-labs/flux-schnell:bf2f5bf6da32e4a518be3b0f1b8a3fef789ae47f0c1c72c8b04a5dba2b5ee4d9',
      sdxl: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      anime: 'cjwbw/waifu-diffusion:25d2f75ecda0c0bed34c806b7b70319a53a1bcd59bf1df53973d63d1d4c9cc61'
    },
    maxRetries: 2,
    timeout: 30000
  },
  clipdrop: {
    apiKey: process.env.CLIPDROP_API_KEY || '',
    baseUrl: 'https://clipdrop-api.co',
    maxRetries: 2,
    timeout: 15000
  }
};

// Supported AI models across providers (validated against memory)
export const AI_MODELS = {
  MYSTIC: 'mystic',
  FLUX: 'flux', 
  FLUX_REALISM: 'flux-realism',
  FLUX_ANIME: 'flux-anime',
  STABLE_DIFFUSION: 'stable-diffusion-xl'
};

// Supported image styles (validated against memory)
export const IMAGE_STYLES = {
  PHOTOREALISTIC: 'photorealistic',
  ILLUSTRATION: 'illustration',
  VECTOR: 'vector art', 
  MINIMALIST: 'minimalist design',
  VINTAGE: 'vintage retro',
  CYBERPUNK: 'cyberpunk futuristic',
  STREETWEAR: 'urban streetwear style'
};

export interface MultiProviderGenerationRequest {
  prompt: string;
  negative_prompt?: string;
  model?: string;
  style?: string;
  width?: number;
  height?: number;
  num_images?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
  seed?: number;
  provider_preference?: string[];
}

export interface MultiProviderGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  images?: {
    id: string;
    url: string;
    width: number;
    height: number;
  }[];
  provider_used: string;
  fallback_count: number;
  generation_time: number;
  cost?: number;
  error?: string;
  metadata?: {
    prompt: string;
    model: string;
    provider_chain: string[];
  };
}

class MultiProviderAIService {
  private providers: string[] = [PROVIDERS.FREEPIK, PROVIDERS.HUGGING_FACE, PROVIDERS.REPLICATE, PROVIDERS.CLIPDROP];

  /**
   * 🎯 Main generation method with automatic provider fallback
   */
  async generateImage(request: MultiProviderGenerationRequest): Promise<MultiProviderGenerationResponse> {
    const startTime = Date.now();
    const providerChain: string[] = [];
    let lastError: string = '';
    
    // Use custom provider preference or default order
    const providersToTry = request.provider_preference || this.providers;
    
    for (let i = 0; i < providersToTry.length; i++) {
      const provider = providersToTry[i];
      providerChain.push(provider);
      
      try {
        console.log(`🎨 Attempting AI generation with ${provider.toUpperCase()}...`);
        
        const result = await this.generateWithProvider(provider, request);
        
        return {
          ...result,
          provider_used: provider,
          fallback_count: i,
          generation_time: Date.now() - startTime,
          metadata: {
            prompt: request.prompt,
            model: request.model || 'default',
            provider_chain: providerChain
          }
        };
        
      } catch (error: any) {
        lastError = `${provider}: ${error.message}`;
        console.warn(`⚠️ ${provider.toUpperCase()} failed:`, error.message);
        
        // If this is the last provider, return error
        if (i === providersToTry.length - 1) {
          return {
            id: `failed-${Date.now()}`,
            status: 'failed',
            provider_used: provider,
            fallback_count: i,
            generation_time: Date.now() - startTime,
            error: `All providers failed. Last error: ${lastError}`,
            metadata: {
              prompt: request.prompt,
              model: request.model || 'default',
              provider_chain: providerChain
            }
          };
        }
      }
    }
    
    throw new Error('Unexpected error in provider chain');
  }

  /**
   * 🔧 Provider-specific generation logic
   */
  private async generateWithProvider(provider: string, request: MultiProviderGenerationRequest): Promise<Partial<MultiProviderGenerationResponse>> {
    switch (provider) {
      case PROVIDERS.FREEPIK:
        return await this.generateWithFreepik(request);
      case PROVIDERS.HUGGING_FACE:
        return await this.generateWithHuggingFace(request);
      case PROVIDERS.REPLICATE:
        return await this.generateWithReplicate(request);
      case PROVIDERS.CLIPDROP:
        return await this.generateWithClipDrop(request);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * 🎨 Freepik API generation (Primary)
   */
  private async generateWithFreepik(request: MultiProviderGenerationRequest): Promise<Partial<MultiProviderGenerationResponse>> {
    const config = PROVIDER_CONFIG.freepik;
    
    if (!config.apiKey) {
      throw new Error('Freepik API key not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(`${config.baseUrl}/ai/text-to-image`, {
        method: 'POST',
        headers: {
          'x-freepik-api-key': config.apiKey,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
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

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id || `freepik-${Date.now()}`,
        status: 'completed',
        images: data.images || [{
          id: 'freepik-img-1',
          url: data.image_url || data.url,
          width: request.width || 512,
          height: request.height || 512
        }],
        cost: data.cost || 0.01
      };

    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 🤗 Hugging Face Inference API generation (Secondary)
   */
  private async generateWithHuggingFace(request: MultiProviderGenerationRequest): Promise<Partial<MultiProviderGenerationResponse>> {
    const config = PROVIDER_CONFIG.hugging_face;
    
    if (!config.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    // Map model to HF model
    const modelMap: Record<string, string> = {
      [AI_MODELS.FLUX]: config.models.flux,
      [AI_MODELS.STABLE_DIFFUSION]: config.models.stable_diffusion_xl,
      [AI_MODELS.FLUX_ANIME]: config.models.anime,
      [AI_MODELS.FLUX_REALISM]: config.models.realistic
    };

    const huggingFaceModel = modelMap[request.model || AI_MODELS.STABLE_DIFFUSION] || config.models.stable_diffusion;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(`${config.baseUrl}/models/${huggingFaceModel}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          inputs: request.prompt,
          parameters: {
            negative_prompt: request.negative_prompt,
            width: request.width || 512,
            height: request.height || 512,
            num_inference_steps: request.num_inference_steps || 20,
            guidance_scale: request.guidance_scale || 7.5,
            seed: request.seed
          }
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // HF returns image as blob
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      return {
        id: `hf-${Date.now()}`,
        status: 'completed',
        images: [{
          id: 'hf-img-1',
          url: imageUrl,
          width: request.width || 512,
          height: request.height || 512
        }],
        cost: 0 // Free tier
      };

    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 🔄 Replicate API generation (Tertiary)
   */
  private async generateWithReplicate(request: MultiProviderGenerationRequest): Promise<Partial<MultiProviderGenerationResponse>> {
    const config = PROVIDER_CONFIG.replicate;
    
    if (!config.apiKey) {
      throw new Error('Replicate API key not configured');
    }

    // Map model to Replicate model
    const modelMap: Record<string, string> = {
      [AI_MODELS.FLUX]: config.models.flux,
      [AI_MODELS.STABLE_DIFFUSION]: config.models.sdxl,
      [AI_MODELS.FLUX_ANIME]: config.models.anime
    };

    const replicateModel = modelMap[request.model || AI_MODELS.STABLE_DIFFUSION] || config.models.stable_diffusion;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      // Create prediction
      const response = await fetch(`${config.baseUrl}/predictions`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          version: replicateModel,
          input: {
            prompt: request.prompt,
            negative_prompt: request.negative_prompt,
            width: request.width || 512,
            height: request.height || 512,
            num_inference_steps: request.num_inference_steps || 20,
            guidance_scale: request.guidance_scale || 7.5,
            seed: request.seed
          }
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const prediction = await response.json();
      
      // Poll for completion (simplified - in production, use webhooks)
      let result = prediction;
      let attempts = 0;
      while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const pollResponse = await fetch(`${config.baseUrl}/predictions/${result.id}`, {
          headers: {
            'Authorization': `Token ${config.apiKey}`,
          }
        });
        
        result = await pollResponse.json();
        attempts++;
      }

      if (result.status === 'failed') {
        throw new Error(`Replicate generation failed: ${result.error}`);
      }

      return {
        id: result.id,
        status: 'completed',
        images: Array.isArray(result.output) ? result.output.map((url: string, index: number) => ({
          id: `replicate-img-${index + 1}`,
          url,
          width: request.width || 512,
          height: request.height || 512
        })) : [{
          id: 'replicate-img-1',
          url: result.output,
          width: request.width || 512,
          height: request.height || 512
        }],
        cost: result.cost || 0.005
      };

    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * ✂️ ClipDrop API generation (Final fallback)
   */
  private async generateWithClipDrop(request: MultiProviderGenerationRequest): Promise<Partial<MultiProviderGenerationResponse>> {
    const config = PROVIDER_CONFIG.clipdrop;
    
    if (!config.apiKey) {
      throw new Error('ClipDrop API key not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const formData = new FormData();
      formData.append('prompt', request.prompt);
      
      if (request.negative_prompt) {
        formData.append('negative_prompt', request.negative_prompt);
      }

      const response = await fetch(`${config.baseUrl}/text-to-image/v1`, {
        method: 'POST',
        headers: {
          'x-api-key': config.apiKey,
        },
        signal: controller.signal,
        body: formData
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      return {
        id: `clipdrop-${Date.now()}`,
        status: 'completed',
        images: [{
          id: 'clipdrop-img-1',
          url: imageUrl,
          width: request.width || 512,
          height: request.height || 512
        }],
        cost: 0.01
      };

    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 📊 Get provider health status
   */
  async getProviderHealth(): Promise<Record<string, { status: string; latency?: number; error?: string }>> {
    const health: Record<string, { status: string; latency?: number; error?: string }> = {};
    
    for (const provider of this.providers) {
      const startTime = Date.now();
      try {
        await this.testProvider(provider);
        health[provider] = {
          status: 'healthy',
          latency: Date.now() - startTime
        };
      } catch (error: any) {
        health[provider] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }
    
    return health;
  }

  private async testProvider(provider: string): Promise<void> {
    const config = PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG];
    
    // Simple health check - just test if API endpoint is reachable
    const response = await fetch(config.baseUrl, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok && response.status !== 405) { // 405 is OK for HEAD requests
      throw new Error(`Provider unhealthy: ${response.status}`);
    }
  }
}

// Export singleton instance
export const multiProviderAI = new MultiProviderAIService();

// Helper functions for easy integration
export const generateAIImage = (request: MultiProviderGenerationRequest) => multiProviderAI.generateImage(request);
export const getAIProviderHealth = () => multiProviderAI.getProviderHealth();

// Provider availability check
export const getAvailableProviders = () => {
  return Object.entries(PROVIDER_CONFIG).filter(([_, config]) => config.apiKey).map(([name]) => name);
};

export { PROVIDERS, PROVIDER_CONFIG };