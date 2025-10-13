// Import canonical types
import { Product as CanonicalProduct, ColorVariant, SizeVariant, ProductTransformer } from '../types/product';

// Legacy interface for backward compatibility
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: Array<{
    name: string;
    value: string;
    image?: string;
  }>;
  sizes: Array<{
    name: string;
    available: boolean;
  }>;
  description: string;
  features: string[];
  inStock: boolean;
  stockCount?: number;
  category: string;
  tags: string[];
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export const mockProducts: Product[] = [
  {
    id: 'hoodie-001',
    name: 'Urban Legends Hoodie',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviewCount: 247,
    images: [
      '/images/products/hoodies/urban-legends-black.jpg',
      '/images/products/hoodies/urban-legends-black-back.jpg',
      '/images/products/hoodies/urban-legends-black-detail.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000', image: '/images/products/hoodies/urban-legends-black.jpg' },
      { name: 'Gray', value: '#6B7280', image: '/images/products/hoodies/urban-legends-gray.jpg' },
      { name: 'Navy', value: '#1E3A8A', image: '/images/products/hoodies/urban-legends-navy.jpg' }
    ],
    sizes: [
      { name: 'XS', available: true },
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: false }
    ],
    description: 'Premium heavyweight hoodie with embroidered urban legends design. Made from 100% organic cotton with a soft fleece lining.',
    features: [
      '100% Organic Cotton',
      'Heavyweight 400gsm fabric',
      'Embroidered design',
      'Kangaroo pocket',
      'Adjustable drawstring hood',
      'Pre-shrunk'
    ],
    inStock: true,
    stockCount: 45,
    category: 'Hoodies',
    tags: ['streetwear', 'urban', 'premium', 'organic'],
    sku: 'UL-HOOD-001',
    weight: 0.8,
    dimensions: { length: 70, width: 55, height: 3 }
  },
  {
    id: 'tshirt-001',
    name: 'Street Vibes Graphic Tee',
    price: 49.99,
    rating: 4.6,
    reviewCount: 189,
    images: [
      '/images/products/tshirts/street-vibes-white.jpg',
      '/images/products/tshirts/street-vibes-white-back.jpg'
    ],
    colors: [
      { name: 'White', value: '#FFFFFF' },
      { name: 'Black', value: '#000000' },
      { name: 'Vintage Blue', value: '#4F46E5' }
    ],
    sizes: [
      { name: 'XS', available: true },
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: false },
      { name: 'XXL', available: false }
    ],
    description: 'Comfortable cotton tee with unique street art inspired graphic print. Perfect for everyday wear.',
    features: [
      '100% Cotton',
      'Screen printed design',
      'Regular fit',
      'Crew neck',
      'Machine washable'
    ],
    inStock: true,
    stockCount: 78,
    category: 'T-Shirts',
    tags: ['casual', 'graphic', 'cotton', 'everyday'],
    sku: 'SV-TEE-001',
    weight: 0.2
  },
  {
    id: 'jacket-001',
    name: 'Neo Tech Bomber',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviewCount: 156,
    images: [
      '/images/products/jackets/neo-tech-black.jpg',
      '/images/products/jackets/neo-tech-black-side.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Olive', value: '#6B7280' }
    ],
    sizes: [
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: true }
    ],
    description: 'Futuristic bomber jacket with tech-inspired details. Water-resistant fabric with reflective accents.',
    features: [
      'Water-resistant coating',
      'Reflective details',
      'Multiple pockets',
      'Ribbed cuffs and hem',
      'Lightweight construction'
    ],
    inStock: true,
    stockCount: 23,
    category: 'Jackets',
    tags: ['bomber', 'tech', 'water-resistant', 'reflective'],
    sku: 'NT-BOMB-001',
    weight: 0.6
  },
  {
    id: 'pants-001',
    name: 'Cargo Utility Pants',
    price: 89.99,
    rating: 4.4,
    reviewCount: 203,
    images: [
      '/images/products/pants/cargo-utility-khaki.jpg',
      '/images/products/pants/cargo-utility-khaki-back.jpg'
    ],
    colors: [
      { name: 'Khaki', value: '#D2B48C' },
      { name: 'Black', value: '#000000' },
      { name: 'Olive', value: '#556B2F' }
    ],
    sizes: [
      { name: '28', available: true },
      { name: '30', available: true },
      { name: '32', available: true },
      { name: '34', available: true },
      { name: '36', available: true },
      { name: '38', available: false }
    ],
    description: 'Functional cargo pants with multiple pockets and modern streetwear aesthetic.',
    features: [
      'Multiple cargo pockets',
      'Adjustable waist',
      'Reinforced knees',
      'Tapered fit',
      'Cotton-poly blend'
    ],
    inStock: true,
    stockCount: 67,
    category: 'Pants',
    tags: ['cargo', 'utility', 'functional', 'streetwear'],
    sku: 'CU-PANT-001',
    weight: 0.5
  },
  {
    id: 'shoes-001',
    name: 'Future Runner Sneakers',
    price: 159.99,
    rating: 4.7,
    reviewCount: 324,
    images: [
      '/images/products/shoes/future-runner-white.jpg',
      '/images/products/shoes/future-runner-white-side.jpg'
    ],
    colors: [
      { name: 'White/Gray', value: '#FFFFFF' },
      { name: 'Black/Red', value: '#000000' },
      { name: 'Blue/White', value: '#3B82F6' }
    ],
    sizes: [
      { name: '7', available: true },
      { name: '8', available: true },
      { name: '9', available: true },
      { name: '10', available: true },
      { name: '11', available: true },
      { name: '12', available: false }
    ],
    description: 'High-performance sneakers with futuristic design and superior comfort technology.',
    features: [
      'Air cushioning system',
      'Breathable mesh upper',
      'Rubber outsole',
      'Lightweight EVA midsole',
      'Reflective accents'
    ],
    inStock: true,
    stockCount: 89,
    category: 'Sneakers',
    tags: ['performance', 'comfortable', 'futuristic', 'breathable'],
    sku: 'FR-SNKR-001',
    weight: 0.7
  },
  {
    id: 'accessory-001',
    name: 'Urban Legend Cap',
    price: 34.99,
    rating: 4.5,
    reviewCount: 178,
    images: [
      '/images/products/accessories/urban-legend-cap-black.jpg',
      '/images/products/accessories/urban-legend-cap-black-back.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Gray', value: '#6B7280' }
    ],
    sizes: [
      { name: 'One Size', available: true }
    ],
    description: 'Classic snapback cap with embroidered logo. Adjustable fit for maximum comfort.',
    features: [
      'Embroidered logo',
      'Snapback adjustment',
      '6-panel construction',
      'Curved visor',
      'Cotton twill fabric'
    ],
    inStock: true,
    stockCount: 156,
    category: 'Accessories',
    tags: ['cap', 'snapback', 'embroidered', 'adjustable'],
    sku: 'UL-CAP-001',
    weight: 0.1
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.slice(0, 4);
};

export const getNewArrivals = (): Product[] => {
  return mockProducts.slice(2, 6);
};

export const getBestSellers = (): Product[] => {
  return mockProducts
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);
};
