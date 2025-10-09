'use client';

const BYTEZ_API_KEY = '6eebd9e3131d9feb9215cf2e6818b394';
const BYTEZ_BASE_URL = 'https://api.bytez.com/v1';

export class BytezClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = BYTEZ_API_KEY;
    this.baseUrl = BYTEZ_BASE_URL;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`/api/bytez${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Bytez API error: ${response.statusText}`);
    }

    return response.json();
  }

  async generateMockup(prompt: string, style: string = 'realistic') {
    return this.makeRequest('/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, type: 'mockup', style })
    });
  }

  async generateModel(description: string, type: string = '3d') {
    return this.makeRequest('/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: description, type: 'model', style: type })
    });
  }

  async enhanceDesign(imageUrl: string, enhancement: string) {
    return this.makeRequest('/enhance/design', {
      method: 'POST',
      body: JSON.stringify({
        image_url: imageUrl,
        enhancement,
        strength: 0.8
      })
    });
  }

  async generateProductDescription(productName: string, features: string[]) {
    return this.makeRequest('/generate/text', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `Create a compelling product description for ${productName} with features: ${features.join(', ')}`,
        max_tokens: 200,
        temperature: 0.7
      })
    });
  }
}

export const bytezClient = new BytezClient();