'use client';

import { useState } from 'react';
import Image from 'next/image';
import { APIIntegrations } from '@/lib/api-integrations';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(
    APIIntegrations.optimizeImage(src, width, height)
  );

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      onError={() => setImgSrc(src)}
    />
  );
}
