'use client';

import { useState, useEffect } from 'react';

interface AIImageGeneratorProps {
  prompt: string;
  width?: number;
  height?: number;
  className?: string;
  alt: string;
  fallbackSrc?: string;
}

const AIImageGenerator = ({ 
  prompt, 
  width = 400, 
  height = 500, 
  className = '', 
  alt,
  fallbackSrc 
}: AIImageGeneratorProps) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    generateImage();
  }, [prompt]);

  const generateImage = async () => {
    try {
      setLoading(true);
      setError(false);

      // Using a placeholder service that generates images based on text
      // In production, you'd use OpenAI DALL-E, Midjourney API, or Replicate
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Fashion photography: ${prompt}, professional lighting, clean background, high quality`,
          width,
          height
        })
      });

      if (response.ok) {
        const data = await response.json();
        setImageSrc(data.imageUrl);
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError(true);
      // Use Unsplash as fallback for high-quality stock images
      const unsplashUrl = `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(prompt)}&fashion&clothing`;
      setImageSrc(unsplashUrl);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    if (!error) {
      setError(true);
      // Fallback to a more generic fashion image
      const fallbackUrl = fallbackSrc || `https://source.unsplash.com/${width}x${height}/?fashion,clothing,style`;
      setImageSrc(fallbackUrl);
    }
  };

  if (loading) {
    return (
      <div 
        className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center`}
        style={{ width, height }}
      >
        <div className="text-gray-400 dark:text-gray-500">Generating...</div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      style={{ width, height }}
    />
  );
};

export default AIImageGenerator;