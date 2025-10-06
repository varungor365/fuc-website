/**
 * Image Utilities - Fallback and placeholder system
 */

// Map of mock image paths to actual existing images
export const imageMap: Record<string, string> = {
  // Collections
  '/images/mock/collections/streetwear.jpg': '/images/products/hoodies/hoodie-1-main.jpg',
  '/images/mock/collections/basics.jpg': '/images/products/t-shirts/tshirt-1-main.jpg',
  '/images/mock/collections/limited.jpg': '/images/products/jackets/jacket-1-main.jpg',
  '/images/mock/collections/seasonal.jpg': '/images/products/hoodies/hoodie-2-main.jpg',
  
  // Products - T-shirts
  '/images/mock/products/tshirts/oversized-tee.jpg': '/images/products/t-shirts/tshirt-1-main.jpg',
  '/images/mock/products/tshirts/oversized-tee-2.jpg': '/images/products/t-shirts/tshirt-1-front.jpg',
  '/images/mock/products/tshirts/minimalist-tee.jpg': '/images/products/t-shirts/tshirt-2-main.jpg',
  '/images/mock/products/tshirts/minimalist-tee-2.jpg': '/images/products/t-shirts/tshirt-2-front.jpg',
  
  // Products - Hoodies
  '/images/mock/products/hoodies/urban-hoodie.jpg': '/images/products/hoodies/hoodie-1-main.jpg',
  '/images/mock/products/hoodies/urban-hoodie-2.jpg': '/images/products/hoodies/hoodie-1-front.jpg',
  '/images/mock/products/hoodies/trending-hoodie.jpg': '/images/products/hoodies/hoodie-2-main.jpg',
  '/images/mock/products/hoodies/trending-hoodie-2.jpg': '/images/products/hoodies/hoodie-2-front.jpg',
  
  // Products - Jackets
  '/images/mock/products/jackets/bomber-jacket.jpg': '/images/products/jackets/jacket-1-main.jpg',
  '/images/mock/products/jackets/bomber-jacket-2.jpg': '/images/products/jackets/jacket-1-front.jpg',
  '/images/mock/products/jackets/neo-street.jpg': '/images/products/jackets/jacket-1-main.jpg',
  '/images/mock/products/jackets/neo-street-2.jpg': '/images/products/jackets/jacket-1-front.jpg',
  
  // Products - Pants/Shorts
  '/images/mock/products/pants/cargo-pants.jpg': '/images/products/hoodies/hoodie-1-main.jpg',
  '/images/mock/products/pants/cargo-pants-2.jpg': '/images/products/hoodies/hoodie-1-front.jpg',
  '/images/mock/products/shorts/tech-cargo.jpg': '/images/products/t-shirts/tshirt-1-main.jpg',
  '/images/mock/products/shorts/tech-cargo-2.jpg': '/images/products/t-shirts/tshirt-1-front.jpg',
  
  // Products - Jeans
  '/images/mock/products/jeans/future-denim.jpg': '/images/products/hoodies/hoodie-2-main.jpg',
  '/images/mock/products/jeans/future-denim-2.jpg': '/images/products/hoodies/hoodie-2-front.jpg',
  
  // Products - Shoes
  '/images/mock/products/shoes/cyber-sneakers.jpg': '/images/products/accessories/cap-1-main.jpg',
  '/images/mock/products/shoes/cyber-sneakers-2.jpg': '/images/products/accessories/cap-1-main.jpg',
};

/**
 * Get the actual image path, falling back to existing images
 */
export function getImagePath(mockPath: string): string {
  // If it's already a real path, return it
  if (!mockPath.includes('/mock/')) {
    return mockPath;
  }
  
  // Try to find mapped image
  if (imageMap[mockPath]) {
    return imageMap[mockPath];
  }
  
  // Fallback to a default image based on category
  if (mockPath.includes('hoodie')) {
    return '/images/products/hoodies/hoodie-1-main.jpg';
  } else if (mockPath.includes('tshirt') || mockPath.includes('tee')) {
    return '/images/products/t-shirts/tshirt-1-main.jpg';
  } else if (mockPath.includes('jacket')) {
    return '/images/products/jackets/jacket-1-main.jpg';
  } else if (mockPath.includes('collection')) {
    return '/images/products/hoodies/hoodie-1-main.jpg';
  }
  
  // Ultimate fallback
  return '/images/products/hoodies/hoodie-1-main.jpg';
}

/**
 * Generate a placeholder image URL using a service
 */
export function getPlaceholderImage(width: number = 400, height: number = 500, text?: string): string {
  const bgColor = '1a1a1a';
  const textColor = 'ffffff';
  const displayText = text || 'FASHUN.CO';
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(displayText)}`;
}

/**
 * Get image with error handling
 */
export function getImageWithFallback(imagePath: string, fallback?: string): string {
  try {
    const actualPath = getImagePath(imagePath);
    return actualPath;
  } catch (error) {
    return fallback || getPlaceholderImage();
  }
}

/**
 * Preload images for better performance
 */
export function preloadImages(imagePaths: string[]): void {
  if (typeof window === 'undefined') return;
  
  imagePaths.forEach(path => {
    const img = new Image();
    img.src = getImagePath(path);
  });
}
