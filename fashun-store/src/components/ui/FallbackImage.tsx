'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface FallbackImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  fallbackSrc?: string;
  alt: string;
}

/**
 * Image component with automatic fallback to placeholder
 * Handles broken images gracefully across the entire website
 */
export default function FallbackImage({
  src,
  fallbackSrc = '/images/placeholder.jpg',
  alt,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    if (!isError) {
      setIsError(true);
      // Try fallback first
      if (fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        // Generate a placeholder with the correct dimensions
        const width = props.width || 600;
        const height = props.height || 400;
        setImgSrc(`https://placehold.co/${width}x${height}/1a1a1a/white?text=${encodeURIComponent(alt || 'Image')}`);
      }
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
}
