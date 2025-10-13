'use client';

import { IKImage, IKContext } from 'imagekitio-react';

interface ImageKitImageProps {
  path: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageKitImage({ path, alt, width = 800, height = 800, className }: ImageKitImageProps) {
  return (
    <IKContext
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
    >
      <IKImage
        path={path}
        transformation={[{ height: height.toString(), width: width.toString(), quality: '85' }]}
        alt={alt}
        className={className}
        loading="lazy"
      />
    </IKContext>
  );
}
