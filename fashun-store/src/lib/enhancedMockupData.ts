// Enhanced mockup data with ImageKit integration and complete properties
import { generateImageKitURL, MOCK_IMAGES, TRANSFORM_PRESETS } from '@/lib/imagekit';

export interface MockupItem {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  colors: string[];
  sizes: string[];
  description: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const MOCKUP_CATEGORIES = {
  HOODIES: 'hoodies',
  TSHIRTS: 'tshirts',
  PANTS: 'pants',
  ACCESSORIES: 'accessories',
  SHOES: 'shoes',
  JACKETS: 'jackets'
} as const;

// Generate ImageKit URLs for product images
const getProductImage = (category: keyof typeof MOCK_IMAGES, index: number): string => {
  const images = MOCK_IMAGES[category];
  const imagePath = images[index % images.length];
  return generateImageKitURL(imagePath, TRANSFORM_PRESETS.productCard);
};

// Helper to generate realistic product data
const createProduct = (
  id: string,
  name: string,
  category: string,
  price: number,
  description: string,
  imageIndex: number,
  originalPrice?: number
): MockupItem => ({
  id,
  name,
  category,
  image: getProductImage(category as keyof typeof MOCK_IMAGES, imageIndex),
  price,
  originalPrice,
  colors: ['Black', 'White', 'Grey', 'Navy', 'Purple'].slice(0, Math.floor(Math.random() * 3) + 2),
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  description,
  rating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10,
  reviewCount: Math.floor(Math.random() * 500) + 25,
  tags: ['streetwear', 'premium', 'trending', 'fashion', 'urban'].slice(0, Math.floor(Math.random() * 3) + 2),
  inStock: Math.random() > 0.1,
  isNew: Math.random() > 0.7,
  isFeatured: Math.random() > 0.8,
});

export const mockupData: Record<string, MockupItem[]> = {
  [MOCKUP_CATEGORIES.HOODIES]: [
    createProduct(
      'hoodie-001',
      'Urban Legends Oversized Hoodie',
      'hoodies',
      4999,
      'Premium oversized hoodie with urban-inspired graphics and ultra-soft fleece interior.',
      0,
      6999
    ),
    createProduct(
      'hoodie-002',
      'Street Culture Zip Hoodie',
      'hoodies',
      5499,
      'Full-zip hoodie featuring bold street art designs and premium cotton blend.',
      1,
      7499
    ),
    createProduct(
      'hoodie-003',
      'Neon Dreams Glow Hoodie',
      'hoodies',
      6999,
      'Eye-catching neon graphics that glow under blacklight. Perfect for night events.',
      2
    ),
    createProduct(
      'hoodie-004',
      'Minimalist Tech Hoodie',
      'hoodies',
      5999,
      'Clean, minimal design with hidden tech features and moisture-wicking fabric.',
      3
    ),
    createProduct(
      'hoodie-005',
      'Graffiti Art Cropped Hoodie',
      'hoodies',
      4499,
      'Cropped-fit hoodie with authentic graffiti art prints and raw hem details.',
      4
    ),
    createProduct(
      'hoodie-006',
      'Luxury Fleece Hoodie',
      'hoodies',
      8999,
      'Premium luxury fleece with gold accents and limited edition numbering.',
      5
    ),
  ],

  [MOCKUP_CATEGORIES.TSHIRTS]: [
    createProduct(
      'tshirt-001',
      'Vintage Streetwear Tee',
      'tshirts',
      2499,
      'Authentic vintage-inspired design with distressed graphics and soft cotton.',
      0,
      3499
    ),
    createProduct(
      'tshirt-002',
      'Neon Typography Tee',
      'tshirts',
      2999,
      'Bold neon typography design that makes a statement. 100% organic cotton.',
      1
    ),
    createProduct(
      'tshirt-003',
      'Abstract Art Oversized Tee',
      'tshirts',
      3499,
      'Oversized fit with abstract art prints. Perfect for layering or standalone wear.',
      2
    ),
    createProduct(
      'tshirt-004',
      'Minimalist Logo Tee',
      'tshirts',
      1999,
      'Clean minimalist design with subtle logo placement. Essential basic.',
      3
    ),
    createProduct(
      'tshirt-005',
      'Retro Wave Graphic Tee',
      'tshirts',
      2799,
      '80s-inspired retro wave graphics with gradient effects and vintage feel.',
      4
    ),
    createProduct(
      'tshirt-006',
      'Urban Jungle Tee',
      'tshirts',
      2699,
      'Nature-inspired urban design with eco-friendly materials and printing.',
      5
    ),
  ],

  [MOCKUP_CATEGORIES.PANTS]: [
    createProduct(
      'pants-001',
      'Tech Cargo Pants',
      'pants',
      6999,
      'Multi-pocket cargo pants with tech fabric and adjustable fit system.',
      0,
      8999
    ),
    createProduct(
      'pants-002',
      'Distressed Denim Jeans',
      'pants',
      5999,
      'Premium denim with authentic distressing and comfortable stretch fit.',
      1
    ),
    createProduct(
      'pants-003',
      'Reflective Track Pants',
      'pants',
      4999,
      'Athletic track pants with reflective strips and moisture-wicking fabric.',
      2
    ),
    createProduct(
      'pants-004',
      'Wide Leg Street Pants',
      'pants',
      5499,
      'Trendy wide-leg silhouette with urban styling and premium materials.',
      3
    ),
    createProduct(
      'pants-005',
      'Leather Accent Joggers',
      'pants',
      7999,
      'Luxury joggers with leather accents and premium fleece interior.',
      4
    ),
    createProduct(
      'pants-006',
      'Utility Tactical Pants',
      'pants',
      6499,
      'Military-inspired utility pants with multiple pockets and durable fabric.',
      5
    ),
  ],

  [MOCKUP_CATEGORIES.ACCESSORIES]: [
    createProduct(
      'acc-001',
      'Graffiti Snapback Cap',
      'accessories',
      2999,
      'Street art-inspired snapback with embroidered details and adjustable fit.',
      0
    ),
    createProduct(
      'acc-002',
      'Tech Crossbody Bag',
      'accessories',
      4999,
      'Multi-functional crossbody bag with tech compartments and weather resistance.',
      1,
      6999
    ),
    createProduct(
      'acc-003',
      'Chain Link Necklace',
      'accessories',
      3999,
      'Bold chain necklace with custom pendant and premium metal finish.',
      2
    ),
    createProduct(
      'acc-004',
      'Smart LED Watch',
      'accessories',
      12999,
      'High-tech smartwatch with customizable LED display and fitness tracking.',
      3
    ),
    createProduct(
      'acc-005',
      'Polarized Street Shades',
      'accessories',
      4499,
      'Premium polarized sunglasses with street-style frames and UV protection.',
      4
    ),
    createProduct(
      'acc-006',
      'RFID Wallet',
      'accessories',
      5999,
      'Slim RFID-blocking wallet with premium leather and modern design.',
      5
    ),
  ],

  [MOCKUP_CATEGORIES.SHOES]: [
    createProduct(
      'shoes-001',
      'High-Top Street Sneakers',
      'shoes',
      8999,
      'Premium high-top sneakers with street-inspired design and comfort technology.',
      0,
      11999
    ),
    createProduct(
      'shoes-002',
      'Chunky Platform Sneakers',
      'shoes',
      7499,
      'Bold platform sneakers with chunky sole and eye-catching color combinations.',
      1
    ),
    createProduct(
      'shoes-003',
      'Minimalist Low-Top Shoes',
      'shoes',
      5999,
      'Clean minimalist design with premium materials and all-day comfort.',
      2
    ),
    createProduct(
      'shoes-004',
      'Basketball Inspired Highs',
      'shoes',
      9999,
      'Basketball-inspired design with modern street aesthetic and performance features.',
      3
    ),
    createProduct(
      'shoes-005',
      'Running Tech Sneakers',
      'shoes',
      6999,
      'Advanced running technology meets street style in these hybrid sneakers.',
      4
    ),
    createProduct(
      'shoes-006',
      'Slip-On Skate Shoes',
      'shoes',
      5999,
      'Classic slip-on design with skate-inspired durability and comfort.',
      5
    ),
  ],

  [MOCKUP_CATEGORIES.JACKETS]: [
    createProduct(
      'jacket-001',
      'Oversized Bomber Jacket',
      'jackets',
      9999,
      'Premium oversized bomber with street-inspired details and premium lining.',
      0,
      13999
    ),
    createProduct(
      'jacket-002',
      'Tech Shell Windbreaker',
      'jackets',
      6999,
      'Lightweight windbreaker with advanced weather protection and packable design.',
      1
    ),
    createProduct(
      'jacket-003',
      'Denim Trucker Jacket',
      'jackets',
      5999,
      'Classic trucker jacket with modern fit and premium denim construction.',
      2
    ),
    createProduct(
      'jacket-004',
      'Puffer Vest',
      'jackets',
      4999,
      'Versatile puffer vest with down insulation and street-ready styling.',
      3
    ),
    createProduct(
      'jacket-005',
      'Utility Field Jacket',
      'jackets',
      8999,
      'Military-inspired field jacket with multiple pockets and weather resistance.',
      4
    ),
    createProduct(
      'jacket-006',
      'Vintage Leather Jacket',
      'jackets',
      19999,
      'Premium vintage-style leather jacket with authentic aging and craftsmanship.',
      5
    ),
  ],
};

// Utility functions
export const getAllProducts = (): MockupItem[] => {
  return Object.values(mockupData).flat();
};

export const getProductsByCategory = (category: string): MockupItem[] => {
  return mockupData[category] || [];
};

export const getFeaturedProducts = (): MockupItem[] => {
  return getAllProducts().filter(product => product.isFeatured);
};

export const getNewProducts = (): MockupItem[] => {
  return getAllProducts().filter(product => product.isNew);
};

export const searchProducts = (query: string): MockupItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllProducts().filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getProductById = (id: string): MockupItem | undefined => {
  return getAllProducts().find(product => product.id === id);
};