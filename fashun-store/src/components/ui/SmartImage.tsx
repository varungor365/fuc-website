/**
 * Enhanced Smart Image Component with 4-Tier Fallback System
 * Primary: Freepik API → Secondary: Unsplash → Tertiary: Picsum → Final: SVG Placeholder
 * Fashion-optimized searches with comprehensive error handling
 */

import React, { useState, useEffect } from 'react';
import { getFashionImage, FASHION_CATEGORIES, FALLBACK_SOURCES } from '@/lib/freepikApi';

interface SmartImageProps {
  searchTerm: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  category?: keyof typeof FASHION_CATEGORIES;
  showFallbackInfo?: boolean;
  onLoad?: (source: string) => void;
  onError?: (error: string) => void;
}

interface ImageState {
  src: string;
  source: string;
  loading: boolean;
  error: string | null;
  retryCount: number;
}

const SmartImage: React.FC<SmartImageProps> = ({
  searchTerm,
  alt,
  className = '',
  width = 400,
  height = 300,
  category,
  showFallbackInfo = false,
  onLoad,
  onError
}) => {
  const [imageState, setImageState] = useState<ImageState>({
    src: '',
    source: '',
    loading: true,
    error: null,
    retryCount: 0
  });

  useEffect(() => {
    loadImageWithFallback();
  }, [searchTerm, category]);

  const loadImageWithFallback = async () => {
    setImageState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await getFashionImage(category || searchTerm);
      
      setImageState({
        src: result.url,
        source: result.source,
        loading: false,
        error: result.error || null,
        retryCount: result.retryCount || 0
      });
      
      onLoad?.(result.source);
    } catch (error) {
      const errorMsg = `Failed to load image: ${error}`;
      setImageState(prev => ({
        ...prev,
        loading: false,
        error: errorMsg
      }));
      onError?.(errorMsg);
    }
  };

  const handleImageError = () => {
    console.warn('Image failed to load, already using fallback system');
    onError?.('Image load failed');
  };

  const handleImageLoad = () => {
    setImageState(prev => ({ ...prev, loading: false }));
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case FALLBACK_SOURCES.PRIMARY: return '🎨'; // Freepik
      case FALLBACK_SOURCES.SECONDARY: return '📷'; // Pexels
      case FALLBACK_SOURCES.TERTIARY: return '📸'; // Unsplash  
      case FALLBACK_SOURCES.QUATERNARY: return '🖼️'; // Picsum
      case FALLBACK_SOURCES.FINAL: return '🎭'; // SVG Placeholder
      default: return '❓';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case FALLBACK_SOURCES.PRIMARY: return 'Freepik API';
      case FALLBACK_SOURCES.SECONDARY: return 'Pexels';
      case FALLBACK_SOURCES.TERTIARY: return 'Unsplash';
      case FALLBACK_SOURCES.QUATERNARY: return 'Picsum';
      case FALLBACK_SOURCES.FINAL: return 'Generated SVG';
      default: return 'Unknown';
    }
  };

  if (imageState.loading) {
    return (
      <div 
        className={`${className} bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center rounded-lg`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div className="text-gray-500 text-sm font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <img
        src={imageState.src}
        alt={alt}
        className={`${className} transition-all duration-300 hover:scale-105`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
        }}
      />
      
      {showFallbackInfo && imageState.source && (
        <div className="absolute bottom-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1">
            <span>{getSourceIcon(imageState.source)}</span>
            <span>{getSourceLabel(imageState.source)}</span>
            {imageState.retryCount > 0 && (
              <span className="ml-1 text-yellow-300">({imageState.retryCount} retries)</span>
            )}
          </div>
        </div>
      )}
      
      {imageState.error && showFallbackInfo && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md opacity-75">
          ⚠️ Fallback used
        </div>
      )}
    </div>
  );
};

export default SmartImage;

export const StreetWearImage: React.FC<Omit<SmartImageProps, 'category'>> = (props) => (
  <SmartImage {...props} category="streetwear" />
);

export const TShirtImage: React.FC<Omit<SmartImageProps, 'category'>> = (props) => (
  <SmartImage {...props} category="tshirts" />
);

export const HoodieImage: React.FC<Omit<SmartImageProps, 'category'>> = (props) => (
  <SmartImage {...props} category="hoodies" />
);

export const AccessoryImage: React.FC<Omit<SmartImageProps, 'category'>> = (props) => (
  <SmartImage {...props} category="accessories" />
);

export const FashionModelImage: React.FC<Omit<SmartImageProps, 'category'>> = (props) => (
  <SmartImage {...props} category="models" />
);

export const LifestyleImage: React.FC<Omit<SmartImageProps, 'category'>> = (props) => (
  <SmartImage {...props} category="lifestyle" />
);