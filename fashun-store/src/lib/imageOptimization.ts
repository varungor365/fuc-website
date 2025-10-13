/**
 * Enhanced Image Optimization Utilities
 * Comment 14 Fix: Implement comprehensive image optimization strategies
 */

import { ImageProps } from 'next/image'

// ==================== IMAGE SIZE CONFIGURATIONS ====================

export const IMAGE_SIZES = {
  // Product images
  PRODUCT_THUMBNAIL: { width: 150, height: 150 },
  PRODUCT_CARD: { width: 300, height: 400 },
  PRODUCT_GALLERY: { width: 600, height: 800 },
  PRODUCT_HERO: { width: 1200, height: 1600 },
  
  // Category and collection images  
  CATEGORY_CARD: { width: 400, height: 300 },
  COLLECTION_HERO: { width: 1920, height: 800 },
  
  // User avatars and profiles
  AVATAR_SMALL: { width: 32, height: 32 },
  AVATAR_MEDIUM: { width: 64, height: 64 },
  AVATAR_LARGE: { width: 128, height: 128 },
  
  // Blog and content images
  BLOG_THUMBNAIL: { width: 300, height: 200 },
  BLOG_HERO: { width: 1200, height: 630 },
  
  // Social and sharing
  OG_IMAGE: { width: 1200, height: 630 },
  TWITTER_CARD: { width: 1200, height: 600 }
} as const

export type ImageSizeKey = keyof typeof IMAGE_SIZES

// ==================== QUALITY PRESETS ====================

export const QUALITY_PRESETS = {
  THUMBNAIL: 60,    // Small images where quality matters less
  STANDARD: 75,     // Default quality for most images
  HIGH: 85,         // Product detail images
  HERO: 90,         // Large hero images
  PRINT: 95         // Maximum quality for downloadable images
} as const

// ==================== RESPONSIVE IMAGE CONFIGURATIONS ====================

export const generateResponsiveSizes = (baseSize: { width: number; height: number }) => {
  const breakpoints = [640, 768, 1024, 1280, 1536]
  
  return breakpoints.map(bp => ({
    breakpoint: bp,
    width: Math.min(baseSize.width, bp),
    height: Math.round((baseSize.height / baseSize.width) * Math.min(baseSize.width, bp))
  }))
}

// ==================== OPTIMIZED IMAGE COMPONENT PROPS ====================

interface OptimizedImageOptions {
  sizeKey?: ImageSizeKey
  quality?: keyof typeof QUALITY_PRESETS | number
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  responsive?: boolean
}

export function getOptimizedImageProps(
  src: string,
  alt: string,
  options: OptimizedImageOptions = {}
): Partial<ImageProps> {
  const {
    sizeKey,
    quality = 'STANDARD',
    priority = false,
    placeholder = 'blur',
    responsive = true
  } = options

  const baseProps: Partial<ImageProps> = {
    src,
    alt,
    priority,
    placeholder,
    quality: typeof quality === 'number' ? quality : QUALITY_PRESETS[quality]
  }

  // Apply size configuration
  if (sizeKey && IMAGE_SIZES[sizeKey]) {
    const size = IMAGE_SIZES[sizeKey]
    baseProps.width = size.width
    baseProps.height = size.height
  }

  // Generate responsive sizes
  if (responsive && sizeKey) {
    const size = IMAGE_SIZES[sizeKey]
    const responsiveSizes = generateResponsiveSizes(size)
    
    baseProps.sizes = responsiveSizes
      .map(({ breakpoint, width }) => `(max-width: ${breakpoint}px) ${width}px`)
      .join(', ') + `, ${size.width}px`
  }

  // Generate blur placeholder if not provided
  if (placeholder === 'blur' && !options.blurDataURL) {
    baseProps.blurDataURL = generateBlurPlaceholder()
  }

  return baseProps
}

// ==================== BLUR PLACEHOLDER GENERATION ====================

export function generateBlurPlaceholder(
  width = 10,
  height = 10,
  color = '#f3f4f6'
): string {
  // Generate a simple SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <defs>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
        </filter>
      </defs>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

// ==================== IMAGE FORMAT DETECTION ====================

export function getOptimalImageFormat(userAgent?: string): 'webp' | 'avif' | 'jpeg' {
  if (!userAgent) return 'webp'
  
  // Check for AVIF support (Chrome 85+, Firefox 86+)
  if (userAgent.includes('Chrome/8') || userAgent.includes('Firefox/8')) {
    return 'avif'
  }
  
  // Check for WebP support (most modern browsers)
  if (userAgent.includes('Chrome') || userAgent.includes('Firefox') || userAgent.includes('Edge')) {
    return 'webp'
  }
  
  // Fallback to JPEG for older browsers
  return 'jpeg'
}

// ==================== CLOUDINARY INTEGRATION ====================

export function buildCloudinaryUrl(
  publicId: string,
  transformations: Record<string, string | number> = {}
): string {
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL || 'https://res.cloudinary.com/demo'
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
    ...otherTransforms
  } = transformations

  const transforms = [
    width && `w_${width}`,
    height && `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
    gravity !== 'auto' && `g_${gravity}`,
    ...Object.entries(otherTransforms).map(([key, value]) => `${key}_${value}`)
  ].filter(Boolean).join(',')

  return `${baseUrl}/image/upload/${transforms}/${publicId}`
}

// ==================== IMAGE PRELOADING ====================

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

export function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage))
}

// ==================== PERFORMANCE MONITORING ====================

export interface ImagePerformanceMetrics {
  loadTime: number
  size: number
  format: string
  fromCache: boolean
}

export function measureImagePerformance(src: string): Promise<ImagePerformanceMetrics> {
  return new Promise((resolve) => {
    const startTime = performance.now()
    const img = new Image()
    
    img.onload = () => {
      const loadTime = performance.now() - startTime
      
      // Try to get size information (may not always be available)
      fetch(src, { method: 'HEAD' })
        .then(response => {
          resolve({
            loadTime,
            size: parseInt(response.headers.get('content-length') || '0'),
            format: response.headers.get('content-type') || 'unknown',
            fromCache: response.headers.get('cf-cache-status') === 'HIT'
          })
        })
        .catch(() => {
          resolve({
            loadTime,
            size: 0,
            format: 'unknown',
            fromCache: false
          })
        })
    }
    
    img.src = src
  })
}

// ==================== LAZY LOADING HELPERS ====================

export interface IntersectionObserverOptions {
  rootMargin?: string
  threshold?: number | number[]
}

export function createImageObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverOptions = {}
): IntersectionObserver {
  const defaultOptions = {
    rootMargin: '50px 0px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver((entries) => {
    entries.forEach(callback)
  }, defaultOptions)
}

// ==================== IMAGE OPTIMIZATION UTILITIES ====================

export class ImageOptimizer {
  static getResponsiveImageProps(
    src: string,
    alt: string,
    sizeKey: ImageSizeKey,
    options: Partial<OptimizedImageOptions> = {}
  ) {
    return getOptimizedImageProps(src, alt, { sizeKey, ...options })
  }
  
  static preloadCriticalImages(sources: string[]) {
    // Only preload in browser environment
    if (typeof window !== 'undefined') {
      return preloadImages(sources)
    }
    return Promise.resolve([])
  }
  
  static generatePlaceholder = generateBlurPlaceholder
  static buildCloudinaryUrl = buildCloudinaryUrl
  static measurePerformance = measureImagePerformance
}

export default ImageOptimizer