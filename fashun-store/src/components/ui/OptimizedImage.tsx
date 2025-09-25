'use client';

import React from 'react';
import Image from 'next/image';
import { generateImageKitURL, ImageKitImageProps, generatePlaceholder } from '@/lib/imagekit';

const OptimizedImage: React.FC<ImageKitImageProps> = ({
  src,
  alt,
  transformations,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'blur',
  loading = 'lazy',
  ...props
}) => {
  // Generate optimized ImageKit URL
  const optimizedSrc = generateImageKitURL(src, transformations);
  
  // Generate placeholder for blur effect
  const blurDataURL = placeholder === 'blur' 
    ? generatePlaceholder(width || 400, height || 400, alt)
    : undefined;

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      priority={priority}
      loading={loading}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      quality={90}
      {...props}
    />
  );
};

export default OptimizedImage;