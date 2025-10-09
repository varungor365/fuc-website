/**
 * React Hook for Freepik API Integration
 * Provides easy access to Freepik images with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { freepikApi, FreepikResource, FreepikSearchParams } from '@/lib/freepikApi';

export interface UseFreepikImageOptions {
  searchTerm: string;
  enabled?: boolean;
  fallbackUrl?: string;
}

export interface UseFreepikImagesOptions {
  searchTerm: string;
  count?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch a single image from Freepik API
 */
export function useFreepikImage({ searchTerm, enabled = true, fallbackUrl }: UseFreepikImageOptions) {
  const [imageUrl, setImageUrl] = useState<string>(fallbackUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = useCallback(async () => {
    if (!enabled || !searchTerm) return;

    setLoading(true);
    setError(null);

    try {
      const url = await freepikApi.getImageWithFallback(searchTerm);
      setImageUrl(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch image';
      setError(errorMessage);
      
      // Set fallback if available
      if (fallbackUrl) {
        setImageUrl(fallbackUrl);
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm, enabled, fallbackUrl]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  return {
    imageUrl,
    loading,
    error,
    refetch: fetchImage
  };
}

/**
 * Hook to fetch multiple images from Freepik API
 */
export function useFreepikImages({ searchTerm, count = 6, enabled = true }: UseFreepikImagesOptions) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    if (!enabled || !searchTerm) return;

    setLoading(true);
    setError(null);

    try {
      const imageUrls = await freepikApi.getImageGallery(searchTerm, count);
      setImages(imageUrls);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch images';
      setError(errorMessage);
      
      // Generate fallback Unsplash URLs
      const fallbackImages = Array.from({ length: count }, (_, i) => 
        `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=400&h=400&fit=crop&q=${encodeURIComponent(searchTerm)}`
      );
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, count, enabled]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    refetch: fetchImages
  };
}

/**
 * Hook to search Freepik resources with advanced parameters
 */
export function useFreepikSearch(params: FreepikSearchParams & { enabled?: boolean }) {
  const [resources, setResources] = useState<FreepikResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);

  const { enabled = true, ...searchParams } = params;

  const search = useCallback(async () => {
    if (!enabled || !searchParams.term) return;

    setLoading(true);
    setError(null);

    try {
      const response = await freepikApi.searchResources(searchParams);
      setResources(response.data);
      setMeta(response.meta);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setResources([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, JSON.stringify(searchParams)]);

  useEffect(() => {
    search();
  }, [search]);

  return {
    resources,
    meta,
    loading,
    error,
    refetch: search
  };
}

/**
 * Hook for fashion-specific images with predefined categories
 */
export function useFashionImages(category: 'streetwear' | 'tshirts' | 'hoodies' | 'jackets' | 'accessories' | 'model' | 'lifestyle') {
  const [images, setImages] = useState<FreepikResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFashionImages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedImages = await freepikApi.getFashionImages(category, 10);
      setImages(fetchedImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fashion images';
      setError(errorMessage);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchFashionImages();
  }, [fetchFashionImages]);

  return {
    images,
    loading,
    error,
    refetch: fetchFashionImages
  };
}