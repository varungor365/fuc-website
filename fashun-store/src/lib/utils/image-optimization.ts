/**
 * Image Optimization Utility
 * Leverages Shopify CDN with Next.js Image Optimization
 */

export interface ShopifyImageParams {
  url: string;
  width?: number;
  height?: number;
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  scale?: number;
  format?: 'jpg' | 'pjpg' | 'webp' | 'png';
}

/**
 * Generate optimized Shopify CDN URL
 * Shopify CDN supports image transformations via URL parameters
 */
export function getOptimizedImageUrl(params: ShopifyImageParams): string {
  const { url, width, height, crop = 'center', scale = 2, format } = params;

  // If not a Shopify CDN URL, return as-is
  if (!url.includes('cdn.shopify.com')) {
    return url;
  }

  // Remove any existing image size parameters
  const baseUrl = url.split('?')[0].replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)\.(jpg|jpeg|png|gif|webp)/i, '');

  // Build optimized URL
  let optimizedUrl = baseUrl;
  
  // Add dimensions
  if (width && height) {
    optimizedUrl += `_${width}x${height}`;
  } else if (width) {
    optimizedUrl += `_${width}x`;
  } else if (height) {
    optimizedUrl += `_x${height}`;
  }

  // Add crop parameter
  if (crop !== 'center') {
    optimizedUrl += `_crop_${crop}`;
  }

  // Add scale
  if (scale > 1) {
    optimizedUrl += `@${scale}x`;
  }

  // Add format
  const ext = format || 'webp'; // Default to WebP for better compression
  optimizedUrl += `.${ext}`;

  return optimizedUrl;
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(url: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920]): string {
  return widths
    .map((width) => {
      const optimizedUrl = getOptimizedImageUrl({ url, width });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Preload critical images
 */
export function preloadImage(url: string, priority: 'high' | 'low' = 'high'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  link.fetchPriority = priority;
  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 */
export function setupLazyLoading(): void {
  if (typeof window === 'undefined') return;
  if ('loading' in HTMLImageElement.prototype) return; // Browser supports native lazy loading

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Blur placeholder for better perceived performance
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) return '';

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Create gradient blur placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(102, 126, 234, 0.2)');
  gradient.addColorStop(1, 'rgba(118, 75, 162, 0.2)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
}

/**
 * Image loading priorities
 */
export const IMAGE_PRIORITIES = {
  HERO: 'high' as const,
  ABOVE_FOLD: 'high' as const,
  PRODUCT_MAIN: 'high' as const,
  PRODUCT_THUMBNAIL: 'low' as const,
  LAZY: 'low' as const,
};

/**
 * Recommended image sizes for different use cases
 */
export const IMAGE_SIZES = {
  HERO: { width: 1920, height: 1080 },
  PRODUCT_MAIN: { width: 1200, height: 1200 },
  PRODUCT_THUMBNAIL: { width: 300, height: 300 },
  PRODUCT_CARD: { width: 600, height: 600 },
  AVATAR: { width: 100, height: 100 },
  ICON: { width: 50, height: 50 },
};

/**
 * CDN cache control headers
 */
export const CACHE_HEADERS = {
  IMAGES: {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'CDN-Cache-Control': 'public, max-age=31536000',
  },
  PAGES: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  },
  API: {
    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
  },
};
