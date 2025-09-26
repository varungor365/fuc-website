/**
 * AI-Enhanced Image Component
 * Automatically uses AI-generated images when available, falls back to stock
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useStockImageReplacer from '@/hooks/useStockImageReplacer';

interface AIImageProps {
  id: string;
  alt: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const AIImage: React.FC<AIImageProps> = ({
  id,
  alt,
  fallbackSrc,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 90,
  onLoad,
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { getImageUrl } = useStockImageReplacer();

  // Update image source when stock images are updated
  useEffect(() => {
    const updateImageSrc = () => {
      const aiImageUrl = getImageUrl(id, fallbackSrc);
      setCurrentSrc(aiImageUrl);
      setHasError(false);
    };

    // Initial load
    updateImageSrc();

    // Listen for stock image updates
    const handleStockImagesUpdated = () => {
      updateImageSrc();
    };

    window.addEventListener('stockImagesUpdated', handleStockImagesUpdated);
    return () => window.removeEventListener('stockImagesUpdated', handleStockImagesUpdated);
  }, [id, fallbackSrc, getImageUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (!currentSrc) {
    return (
      <div 
        className={`bg-gray-800 animate-pulse flex items-center justify-center ${className}`}
        style={{ width: width || '100%', height: height || '100%' }}
      >
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center z-10"
        >
          <motion.div
            className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {/* Main Image */}
      <Image
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image unavailable</div>
          </div>
        </div>
      )}

      {/* AI Badge (optional) */}
      {currentSrc.includes('/output/') && !isLoading && !hasError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg"
        >
          AI ✨
        </motion.div>
      )}
    </div>
  );
};

export default AIImage;