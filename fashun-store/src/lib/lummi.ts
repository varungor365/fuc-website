// Lummi API Integration for High-Quality Images
// API Key: lummi-1bc82d8fc0f41b797d8c217dce23b989b598d9a30c36d94e12f23a2abec4978e

const LUMMI_API_KEY = process.env.NEXT_PUBLIC_LUMMI_API_KEY || 'lummi-1bc82d8fc0f41b797d8c217dce23b989b598d9a30c36d94e12f23a2abec4978e';
const LUMMI_API_URL = 'https://api.lummi.ai/v1';

export interface LummiImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  alt: string;
  attributionUrl: string;
  user: {
    name: string;
    url: string;
    attributionUrl: string;
  };
}

export interface LummiSearchParams {
  query: string;
  page?: number;
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  color?: string;
}

/**
 * Search for images using Lummi API
 */
export async function searchLummiImages(params: LummiSearchParams): Promise<LummiImage[]> {
  try {
    const queryParams = new URLSearchParams({
      query: params.query,
      page: (params.page || 1).toString(),
      per_page: (params.perPage || 20).toString(),
      ...(params.orientation && { orientation: params.orientation }),
      ...(params.color && { color: params.color }),
    });

    const response = await fetch(`${LUMMI_API_URL}/search?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${LUMMI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lummi API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.images || [];
  } catch (error) {
    console.error('Lummi API Error:', error);
    return [];
  }
}

/**
 * Get a single image by ID
 */
export async function getLummiImage(imageId: string): Promise<LummiImage | null> {
  try {
    const response = await fetch(`${LUMMI_API_URL}/images/${imageId}`, {
      headers: {
        'Authorization': `Bearer ${LUMMI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lummi API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.image || null;
  } catch (error) {
    console.error('Lummi API Error:', error);
    return null;
  }
}

/**
 * Get curated collections
 */
export async function getLummiCollections() {
  try {
    const response = await fetch(`${LUMMI_API_URL}/collections`, {
      headers: {
        'Authorization': `Bearer ${LUMMI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lummi API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.collections || [];
  } catch (error) {
    console.error('Lummi API Error:', error);
    return [];
  }
}


