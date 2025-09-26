/**
 * Mock Product Data for FASHUN.CO
 * Professional streetwear products inspired by Bewakoof & Souled Store
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  brand: string;
  images: string[];
  colors: Array<{
    name: string;
    value: string;
    image?: string;
  }>;
  sizes: Array<{
    name: string;
    value: string;
    stock: number;
  }>;
  features: string[];
  material: string;
  care: string[];
  tags: string[];
  rating: number;
  reviewsCount: number;
  badges: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
}

export const mockProducts: Product[] = [
  // HOODIES & SWEATSHIRTS
  {
    id: '1',
    name: 'Oversized Graphic Hoodie - Street Vibes',
    slug: 'oversized-graphic-hoodie-street-vibes',
    description: 'Premium oversized hoodie with bold street graphics. Made from 100% cotton fleece for ultimate comfort. Perfect for layering and street style.',
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    category: 'hoodies',
    subcategory: 'graphic-hoodies',
    brand: 'FASHUN.CO',
    images: [
      '/images/products/hoodie-1-main.jpg',
      '/images/products/hoodie-1-front.jpg',
      '/images/products/hoodie-1-back.jpg',
      '/images/products/hoodie-1-side.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Navy', value: '#1a237e' },
      { name: 'Charcoal', value: '#424242' }
    ],
    sizes: [
      { name: 'S', value: 's', stock: 15 },
      { name: 'M', value: 'm', stock: 25 },
      { name: 'L', value: 'l', stock: 20 },
      { name: 'XL', value: 'xl', stock: 12 },
      { name: 'XXL', value: 'xxl', stock: 8 }
    ],
    features: ['Oversized Fit', 'Premium Cotton Fleece', 'Kangaroo Pocket', 'Ribbed Cuffs', 'Screen Printed Graphics'],
    material: '100% Cotton Fleece (320 GSM)',
    care: ['Machine wash cold', 'Do not bleach', 'Tumble dry low', 'Iron inside out'],
    tags: ['streetwear', 'hoodie', 'oversized', 'graphic', 'urban'],
    rating: 4.8,
    reviewsCount: 156,
    badges: ['Best Seller', 'Premium Quality'],
    inStock: true,
    isBestseller: true,
    isOnSale: true
  },
  {
    id: '2',
    name: 'Minimalist Pullover Hoodie',
    slug: 'minimalist-pullover-hoodie',
    description: 'Clean, minimalist hoodie with subtle branding. Perfect for everyday wear with premium comfort and style.',
    price: 1699,
    originalPrice: 1999,
    discount: 15,
    category: 'hoodies',
    subcategory: 'plain-hoodies',
    brand: 'FASHUN.CO',
    images: [
      '/images/products/hoodie-2-main.jpg',
      '/images/products/hoodie-2-front.jpg',
      '/images/products/hoodie-2-back.jpg'
    ],
    colors: [
      { name: 'White', value: '#ffffff' },
      { name: 'Grey', value: '#9e9e9e' },
      { name: 'Beige', value: '#d7ccc8' }
    ],
    sizes: [
      { name: 'S', value: 's', stock: 12 },
      { name: 'M', value: 'm', stock: 18 },
      { name: 'L', value: 'l', stock: 15 },
      { name: 'XL', value: 'xl', stock: 10 }
    ],
    features: ['Regular Fit', 'Soft Cotton Blend', 'Drawstring Hood', 'Minimal Design'],
    material: '80% Cotton, 20% Polyester (280 GSM)',
    care: ['Machine wash cold', 'Do not bleach', 'Hang dry'],
    tags: ['minimalist', 'hoodie', 'casual', 'basic'],
    rating: 4.6,
    reviewsCount: 89,
    badges: ['New Arrival'],
    inStock: true,
    isNew: true
  },

  // T-SHIRTS
  {
    id: '3',
    name: 'Typography Print T-Shirt',
    slug: 'typography-print-t-shirt',
    description: 'Bold typography design on premium cotton tee. Contemporary streetwear essential with comfortable fit.',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    category: 't-shirts',
    subcategory: 'graphic-tees',
    brand: 'FASHUN.CO',
    images: [
      '/images/products/tshirt-1-main.jpg',
      '/images/products/tshirt-1-front.jpg',
      '/images/products/tshirt-1-back.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#ffffff' },
      { name: 'Navy', value: '#1a237e' }
    ],
    sizes: [
      { name: 'S', value: 's', stock: 20 },
      { name: 'M', value: 'm', stock: 30 },
      { name: 'L', value: 'l', stock: 25 },
      { name: 'XL', value: 'xl', stock: 15 },
      { name: 'XXL', value: 'xxl', stock: 10 }
    ],
    features: ['Regular Fit', '100% Cotton', 'Screen Print', 'Pre-shrunk'],
    material: '100% Combed Cotton (180 GSM)',
    care: ['Machine wash cold', 'Iron inside out', 'Do not dry clean'],
    tags: ['typography', 't-shirt', 'graphic', 'streetwear'],
    rating: 4.7,
    reviewsCount: 203,
    badges: ['Best Seller'],
    inStock: true,
    isBestseller: true,
    isOnSale: true
  },
  {
    id: '4',
    name: 'Oversized Drop Shoulder Tee',
    slug: 'oversized-drop-shoulder-tee',
    description: 'Trendy oversized tee with drop shoulder design. Perfect for layering and achieving that effortless street style.',
    price: 1099,
    category: 't-shirts',
    subcategory: 'oversized-tees',
    brand: 'FASHUN.CO',
    images: [
      '/images/products/tshirt-2-main.jpg',
      '/images/products/tshirt-2-front.jpg',
      '/images/products/tshirt-2-side.jpg'
    ],
    colors: [
      { name: 'Sage Green', value: '#87a96b' },
      { name: 'Dusty Pink', value: '#d7a3a3' },
      { name: 'Cream', value: '#f5f5dc' }
    ],
    sizes: [
      { name: 'S', value: 's', stock: 18 },
      { name: 'M', value: 'm', stock: 22 },
      { name: 'L', value: 'l', stock: 20 },
      { name: 'XL', value: 'xl', stock: 12 }
    ],
    features: ['Oversized Fit', 'Drop Shoulder', 'Heavy Cotton', 'Boxy Cut'],
    material: '100% Cotton (220 GSM)',
    care: ['Machine wash cold', 'Tumble dry low'],
    tags: ['oversized', 'trendy', 'basic', 'layering'],
    rating: 4.5,
    reviewsCount: 124,
    badges: ['Trending'],
    inStock: true
  },

  // SNEAKERS
  {
    id: '5',
    name: 'Urban Runner Sneakers',
    slug: 'urban-runner-sneakers',
    description: 'Contemporary sneakers with urban aesthetic. Comfortable for all-day wear with premium materials and modern design.',
    price: 3499,
    originalPrice: 4299,
    discount: 19,
    category: 'sneakers',
    subcategory: 'lifestyle-sneakers',
    brand: 'FASHUN.CO',
    images: [
      '/images/products/sneaker-1-main.jpg',
      '/images/products/sneaker-1-side.jpg',
      '/images/products/sneaker-1-top.jpg',
      '/images/products/sneaker-1-sole.jpg'
    ],
    colors: [
      { name: 'White/Black', value: '#ffffff' },
      { name: 'All Black', value: '#000000' },
      { name: 'Grey/White', value: '#9e9e9e' }
    ],
    sizes: [
      { name: '6', value: '6', stock: 8 },
      { name: '7', value: '7', stock: 12 },
      { name: '8', value: '8', stock: 15 },
      { name: '9', value: '9', stock: 18 },
      { name: '10', value: '10', stock: 12 },
      { name: '11', value: '11', stock: 8 }
    ],
    features: ['Breathable Mesh', 'Cushioned Sole', 'Lightweight', 'Durable Outsole'],
    material: 'Synthetic Upper, Rubber Sole',
    care: ['Wipe clean with damp cloth', 'Air dry only'],
    tags: ['sneakers', 'urban', 'lifestyle', 'comfortable'],
    rating: 4.6,
    reviewsCount: 87,
    badges: ['New Launch'],
    inStock: true,
    isNew: true,
    isOnSale: true
  },

  // ACCESSORIES
  {
    id: '6',
    name: 'Embroidered Cap - Street Logo',
    slug: 'embroidered-cap-street-logo',
    description: 'Premium embroidered cap with street-inspired logo. Adjustable fit with quality construction.',
    price: 799,
    originalPrice: 999,
    discount: 20,
    category: 'accessories',
    subcategory: 'caps',
    brand: 'FASHUN.CO',
    images: [
      '/images/products/cap-1-main.jpg',
      '/images/products/cap-1-front.jpg',
      '/images/products/cap-1-side.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Navy', value: '#1a237e' },
      { name: 'Khaki', value: '#8d6e63' }
    ],
    sizes: [
      { name: 'One Size', value: 'os', stock: 25 }
    ],
    features: ['Embroidered Logo', 'Adjustable Strap', '6-Panel Construction', 'Curved Brim'],
    material: '100% Cotton Twill',
    care: ['Spot clean only', 'Do not machine wash'],
    tags: ['cap', 'accessories', 'embroidered', 'streetwear'],
    rating: 4.4,
    reviewsCount: 156,
    badges: ['Best Seller'],
    inStock: true,
    isBestseller: true,
    isOnSale: true
  },

  // JEANS & BOTTOMS
  {
    id: '7',
    name: 'Relaxed Fit Cargo Jeans',
    slug: 'relaxed-fit-cargo-jeans',
    description: 'Modern cargo jeans with relaxed fit. Multiple pockets with contemporary styling for the urban explorer.',
    price: 2299,
    originalPrice: 2799,
    discount: 18,
    category: 'jeans',
    subcategory: 'cargo-jeans',
    brand: 'FASHUN.CO',
    images: [
      '/images/products/jeans-1-main.jpg',
      '/images/products/jeans-1-front.jpg',
      '/images/products/jeans-1-back.jpg',
      '/images/products/jeans-1-detail.jpg'
    ],
    colors: [
      { name: 'Dark Wash', value: '#2c3e50' },
      { name: 'Light Wash', value: '#7f8c8d' },
      { name: 'Black', value: '#000000' }
    ],
    sizes: [
      { name: '28', value: '28', stock: 10 },
      { name: '30', value: '30', stock: 15 },
      { name: '32', value: '32', stock: 18 },
      { name: '34', value: '34', stock: 12 },
      { name: '36', value: '36', stock: 8 }
    ],
    features: ['Relaxed Fit', 'Cargo Pockets', 'Premium Denim', 'Tapered Leg'],
    material: '98% Cotton, 2% Elastane',
    care: ['Machine wash cold', 'Wash inside out', 'Hang dry'],
    tags: ['jeans', 'cargo', 'relaxed', 'denim'],
    rating: 4.5,
    reviewsCount: 92,
    badges: ['Trending'],
    inStock: true,
    isOnSale: true
  },

  // JACKETS
  {
    id: '8',
    name: 'Utility Bomber Jacket',
    slug: 'utility-bomber-jacket',
    description: 'Contemporary bomber jacket with utility pockets. Perfect blend of style and functionality for urban adventures.',
    price: 3299,
    originalPrice: 3999,
    discount: 18,
    category: 'jackets',
    subcategory: 'bomber-jackets',
    brand: 'FASHUN.CO',
    images: [
      '/images/products/jacket-1-main.jpg',
      '/images/products/jacket-1-front.jpg',
      '/images/products/jacket-1-back.jpg',
      '/images/products/jacket-1-detail.jpg'
    ],
    colors: [
      { name: 'Olive Green', value: '#556b2f' },
      { name: 'Black', value: '#000000' },
      { name: 'Navy', value: '#1a237e' }
    ],
    sizes: [
      { name: 'S', value: 's', stock: 12 },
      { name: 'M', value: 'm', stock: 15 },
      { name: 'L', value: 'l', stock: 18 },
      { name: 'XL', value: 'xl', stock: 10 }
    ],
    features: ['Water Resistant', 'Multiple Pockets', 'Ribbed Cuffs', 'Zip Closure'],
    material: 'Nylon Shell, Polyester Lining',
    care: ['Machine wash cold', 'Do not bleach', 'Hang dry'],
    tags: ['bomber', 'jacket', 'utility', 'streetwear'],
    rating: 4.7,
    reviewsCount: 68,
    badges: ['Premium Quality'],
    inStock: true,
    isOnSale: true
  }
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return mockProducts.find(product => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find(product => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return mockProducts.filter(product => product.category === category);
}

export function getFeaturedProducts(): Product[] {
  return mockProducts.filter(product => product.isBestseller || product.isNew).slice(0, 8);
}

export function getOnSaleProducts(): Product[] {
  return mockProducts.filter(product => product.isOnSale);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export const categories = [
  { id: 'hoodies', name: 'Hoodies & Sweatshirts', slug: 'hoodies' },
  { id: 't-shirts', name: 'T-Shirts', slug: 't-shirts' },
  { id: 'sneakers', name: 'Sneakers', slug: 'sneakers' },
  { id: 'jeans', name: 'Jeans & Bottoms', slug: 'jeans' },
  { id: 'jackets', name: 'Jackets', slug: 'jackets' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' }
];

export default mockProducts;