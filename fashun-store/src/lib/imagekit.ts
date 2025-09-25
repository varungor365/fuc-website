// ImageKit Configuration
export const IMAGEKIT_CONFIG = {
  publicKey: 'public_GfOy05FZ5PFeREQnWvRFk5MBM10=',
  urlEndpoint: 'https://ik.imagekit.io/fashun',
  transformationPosition: 'path' as const,
  authenticationEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_AUTH_ENDPOINT || '/api/imagekit-auth',
};

// ImageKit transformation presets for different use cases
export const TRANSFORM_PRESETS = {
  // Product mockups
  productThumbnail: [{ height: '300', width: '400', cropMode: 'pad_resize', background: 'FFFFFF' }],
  productCard: [{ height: '400', width: '400', cropMode: 'maintain_ratio' }],
  productHero: [{ height: '600', width: '800', cropMode: 'pad_resize', quality: '90' }],
  
  // Profile and user images
  avatar: [{ height: '100', width: '100', cropMode: 'maintain_ratio', radius: '50' }],
  profileBanner: [{ height: '200', width: '800', cropMode: 'pad_resize' }],
  
  // Social media optimized
  instagram: [{ height: '1080', width: '1080', cropMode: 'maintain_ratio', quality: '85' }],
  instagramStory: [{ height: '1920', width: '1080', cropMode: 'pad_resize' }],
  
  // Performance optimized
  webp: [{ format: 'webp', quality: '80' }],
  mobile: [{ width: '400', quality: '75', format: 'webp' }],
  desktop: [{ width: '800', quality: '85', format: 'webp' }],
  
  // AI mockup generation
  aiMockup: [{ 
    height: '600', 
    width: '600', 
    cropMode: 'pad_resize', 
    background: 'transparent',
    quality: '90'
  }],
};

// Generate ImageKit URL with transformations
export const generateImageKitURL = (
  path: string, 
  transformations?: Array<Record<string, string | number>>,
  endpoint: string = IMAGEKIT_CONFIG.urlEndpoint
): string => {
  if (!path) return '';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) return path;
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (!transformations || transformations.length === 0) {
    return `${endpoint}/${cleanPath}`;
  }
  
  // Build transformation string
  const transformString = transformations
    .map(transform => 
      Object.entries(transform)
        .map(([key, value]) => `${key}-${value}`)
        .join(',')
    )
    .join('/');
  
  return `${endpoint}/tr:${transformString}/${cleanPath}`;
};

// ImageKit optimized component props
export interface ImageKitImageProps {
  src: string;
  alt: string;
  transformations?: Array<Record<string, string | number>>;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  loading?: 'lazy' | 'eager';
}

// Mock image paths for development (replace with actual ImageKit paths)
export const MOCK_IMAGES = {
  // Product categories
  hoodies: [
    'products/hoodies/premium-hoodie-1.jpg',
    'products/hoodies/street-hoodie-2.jpg',
    'products/hoodies/designer-hoodie-3.jpg',
    'products/hoodies/urban-hoodie-4.jpg',
    'products/hoodies/luxury-hoodie-5.jpg',
    'products/hoodies/trendy-hoodie-6.jpg',
  ],
  tshirts: [
    'products/tshirts/graphic-tee-1.jpg',
    'products/tshirts/basic-tee-2.jpg',
    'products/tshirts/vintage-tee-3.jpg',
    'products/tshirts/designer-tee-4.jpg',
    'products/tshirts/oversized-tee-5.jpg',
    'products/tshirts/premium-tee-6.jpg',
  ],
  pants: [
    'products/pants/cargo-pants-1.jpg',
    'products/pants/jeans-2.jpg',
    'products/pants/joggers-3.jpg',
    'products/pants/chinos-4.jpg',
    'products/pants/streetwear-pants-5.jpg',
    'products/pants/designer-pants-6.jpg',
  ],
  accessories: [
    'products/accessories/cap-1.jpg',
    'products/accessories/backpack-2.jpg',
    'products/accessories/chain-3.jpg',
    'products/accessories/watch-4.jpg',
    'products/accessories/sunglasses-5.jpg',
    'products/accessories/wallet-6.jpg',
  ],
  shoes: [
    'products/shoes/sneakers-1.jpg',
    'products/shoes/boots-2.jpg',
    'products/shoes/casual-3.jpg',
    'products/shoes/basketball-4.jpg',
    'products/shoes/running-5.jpg',
    'products/shoes/luxury-6.jpg',
  ],
  jackets: [
    'products/jackets/bomber-1.jpg',
    'products/jackets/leather-2.jpg',
    'products/jackets/denim-3.jpg',
    'products/jackets/windbreaker-4.jpg',
    'products/jackets/puffer-5.jpg',
    'products/jackets/blazer-6.jpg',
  ],
  
  // Instagram content
  instagram: [
    'social/instagram/post-1.jpg',
    'social/instagram/post-2.jpg',
    'social/instagram/post-3.jpg',
    'social/instagram/post-4.jpg',
    'social/instagram/post-5.jpg',
    'social/instagram/post-6.jpg',
  ],
  
  // Hero and banner images
  heroes: [
    'banners/hero-1.jpg',
    'banners/hero-2.jpg',
    'banners/collection-banner.jpg',
  ],
  
  // User avatars
  avatars: [
    'users/avatar-1.jpg',
    'users/avatar-2.jpg',
    'users/avatar-3.jpg',
  ],
  
  // Brand assets
  brand: [
    'brand/logo.png',
    'brand/logo-white.png',
    'brand/watermark.png',
  ],
};

// Helper function to get random mock image
export const getRandomMockImage = (category: keyof typeof MOCK_IMAGES): string => {
  const images = MOCK_IMAGES[category];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

// Generate placeholder image URL
export const generatePlaceholder = (
  width: number = 400, 
  height: number = 400, 
  text?: string
): string => {
  const placeholder = text ? encodeURIComponent(text) : 'FASHUN';
  return generateImageKitURL(
    'placeholder.jpg',
    [{ 
      width: width.toString(), 
      height: height.toString(), 
      overlay_text: placeholder,
      overlay_text_font_size: '40',
      overlay_text_color: 'FFFFFF',
      background: '9f7aea'
    }]
  );
};