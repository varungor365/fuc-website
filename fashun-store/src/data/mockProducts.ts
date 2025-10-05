export interface Product {
  id: string;
  name: string;
  brand?: string;
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
  subcategory?: string;
  tags: string[];
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  // Additional properties used by filters
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;
  isLimited?: boolean;
  material?: string;
  fit?: string;
  reviews?: number;
}

export const mockProducts: Product[] = [
  // 🎨 PRINTED T-SHIRTS - Core Category
  {
    id: 'printed-tee-001',
    name: 'Urban Street Art Printed Tee',
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewCount: 247,
    images: [
      '/images/products/t-shirts/tshirt-1-main.jpg',
      '/images/products/t-shirts/tshirt-1-front.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Grey', value: '#808080' }
    ],
    sizes: [
      { name: 'XS', available: true },
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: true }
    ],
    description: 'Express your individuality with this unique urban street art printed t-shirt. Premium cotton with vibrant, long-lasting prints.',
    features: [
      '100% Premium Cotton',
      'High-Quality Screen Print',
      'Pre-Shrunk Fabric',
      'Regular Fit',
      'Machine Washable'
    ],
    inStock: true,
    stockCount: 45,
    category: 'Printed T-Shirts',
    tags: ['printed', 'streetwear', 'urban', 'graphic'],
    sku: 'FSN-PT-001',
    weight: 0.2
  },
  {
    id: 'printed-tee-002',
    name: 'FASHUN Typography Print',
    price: 799,
    originalPrice: 999,
    rating: 4.6,
    reviewCount: 189,
    images: [
      '/images/products/t-shirts/tshirt-2-main.jpg',
      '/images/products/t-shirts/tshirt-2-front.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Navy Blue', value: '#000080' },
      { name: 'Burgundy', value: '#800020' }
    ],
    sizes: [
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: false }
    ],
    description: 'Bold typography design featuring the FASHUN brand aesthetic. Perfect for making a statement.',
    features: [
      '180 GSM Cotton',
      'Vinyl Print Technology',
      'Fade Resistant',
      'Comfortable Fit',
      'Brand Exclusive'
    ],
    inStock: true,
    stockCount: 78,
    category: 'Printed T-Shirts',
    tags: ['typography', 'brand', 'statement', 'exclusive'],
    sku: 'FSN-PT-002',
    weight: 0.2
  },
  
  // 👕 FULL SLEEVE T-SHIRTS
  {
    id: 'fullsleeve-001',
    name: 'Essential Full Sleeve Basic',
    price: 1199,
    rating: 4.7,
    reviewCount: 156,
    images: [
      '/images/products/hoodies/hoodie-1-main.jpg',
      '/images/products/hoodies/hoodie-1-front.jpg'
    ],
    colors: [
      { name: 'White', value: '#FFFFFF' },
      { name: 'Black', value: '#000000' },
      { name: 'Grey Melange', value: '#A9A9A9' },
      { name: 'Navy Blue', value: '#000080' }
    ],
    sizes: [
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: true }
    ],
    description: 'Your go-to full sleeve tee for all seasons. Comfortable, versatile, and perfect for layering.',
    features: [
      '100% Cotton',
      'Full Sleeve Coverage',
      'Ribbed Cuffs',
      'Regular Fit',
      'All Season Wear'
    ],
    inStock: true,
    stockCount: 23,
    category: 'Full Sleeve T-Shirts',
    tags: ['full-sleeve', 'basic', 'layering', 'comfortable'],
    sku: 'FSN-FS-001',
    weight: 0.25
  },
  
  // 🏆 POLO T-SHIRTS
  {
    id: 'polo-001',
    name: 'Classic Streetwear Polo',
    price: 1499,
    originalPrice: 1899,
    rating: 4.5,
    reviewCount: 203,
    images: [
      '/images/products/hoodies/hoodie-2-main.jpg',
      '/images/products/hoodies/hoodie-2-front.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Olive Green', value: '#808000' }
    ],
    sizes: [
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: false }
    ],
    description: 'Elevate your casual style with this premium polo tee. Perfect blend of comfort and sophistication.',
    features: [
      'Collar Design',
      '3-Button Closure',
      'Pique Cotton Fabric',
      'Smart Casual',
      'Breathable Material'
    ],
    inStock: true,
    stockCount: 67,
    category: 'Polo T-Shirts',
    tags: ['polo', 'collar', 'smart-casual', 'premium'],
    sku: 'FSN-PL-001',
    weight: 0.22
  },
  
  // 👩 WOMEN'S T-SHIRTS
  {
    id: 'womens-001',
    name: 'Feminine Fit Graphic Tee',
    price: 999,
    originalPrice: 1299,
    rating: 4.9,
    reviewCount: 324,
    images: [
      '/images/products/t-shirts/tshirt-1-front.jpg',
      '/images/products/t-shirts/tshirt-2-front.jpg'
    ],
    colors: [
      { name: 'Pastel Pink', value: '#FFD6E8' },
      { name: 'Lavender', value: '#E6E6FA' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Black', value: '#000000' }
    ],
    sizes: [
      { name: 'XS', available: true },
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true }
    ],
    description: 'Designed specifically for women with a flattering fit and feminine aesthetic. Comfortable and stylish.',
    features: [
      'Feminine Cut',
      'Soft Cotton Blend',
      'Flattering Fit',
      'Crew Neckline',
      'Women Specific Sizing'
    ],
    inStock: true,
    stockCount: 89,
    category: "Women's T-Shirts",
    tags: ['womens', 'feminine', 'flattering', 'comfortable'],
    sku: 'FSN-WT-001',
    weight: 0.18
  },
  
  // ✂️ CROP TOPS
  {
    id: 'crop-001',
    name: 'Trendy Cropped Basic',
    price: 699,
    rating: 4.4,
    reviewCount: 178,
    images: [
      '/images/products/accessories/cap-1-main.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Baby Pink', value: '#FFB6C1' }
    ],
    sizes: [
      { name: 'XS', available: true },
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: false }
    ],
    description: 'Stay on-trend with this stylish cropped tee. Perfect for layering or wearing solo.',
    features: [
      'Cropped Length',
      'Trendy Style',
      'Comfortable Fit',
      'Mix & Match Ready',
      'Soft Fabric'
    ],
    inStock: true,
    stockCount: 156,
    category: 'Crop Tops',
    tags: ['crop', 'trendy', 'layering', 'fashion'],
    sku: 'FSN-CT-001',
    weight: 0.15
  },
  
  // 📏 PLUS SIZE T-SHIRTS
  {
    id: 'plus-001',
    name: 'Inclusive Comfort Tee',
    price: 1099,
    rating: 4.8,
    reviewCount: 145,
    images: [
      '/images/products/jackets/jacket-1-main.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Navy Blue', value: '#000080' },
      { name: 'Grey', value: '#808080' }
    ],
    sizes: [
      { name: 'XL', available: true },
      { name: 'XXL', available: true },
      { name: 'XXXL', available: true }
    ],
    description: 'Designed with extended sizes for ultimate comfort and style. Inclusive fashion for everyone.',
    features: [
      'Extended Sizing',
      'Comfortable Cut',
      'Premium Cotton',
      'Inclusive Design',
      'Plus Size Fit'
    ],
    inStock: true,
    stockCount: 67,
    category: 'Plus Size T-Shirts',
    tags: ['plus-size', 'inclusive', 'comfort', 'extended'],
    sku: 'FSN-PS-001',
    weight: 0.23
  },
  
  // ⚪ PLAIN T-SHIRTS & COMBO PACKS
  {
    id: 'plain-combo-001',
    name: 'Pick Any 3 - Plain T-Shirts Combo',
    price: 1299, // for 3 pieces
    originalPrice: 1797, // Original ₹599 each
    rating: 4.6,
    reviewCount: 892,
    images: [
      '/images/products/t-shirts/tshirt-1-main.jpg',
      '/images/products/t-shirts/tshirt-2-main.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Grey', value: '#808080' },
      { name: 'Navy Blue', value: '#000080' },
      { name: 'Olive Green', value: '#808000' }
    ],
    sizes: [
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: true }
    ],
    description: 'Build your wardrobe essentials with this value combo pack. Choose any 3 colors from our plain collection.',
    features: [
      'Combo Pack of 3',
      'Mix & Match Colors',
      'Value Pricing',
      'Basic Essentials',
      '100% Cotton'
    ],
    inStock: true,
    stockCount: 234,
    category: 'Plain T-Shirts',
    tags: ['combo', 'plain', 'value', 'essentials', 'pack'],
    sku: 'FSN-PC-001',
    weight: 0.6
  },
  
  // 👘 HOODIES
  {
    id: 'hoodie-001',
    name: 'Classic FASHUN Hoodie',
    price: 2499,
    originalPrice: 2999,
    rating: 4.9,
    reviewCount: 156,
    images: [
      '/images/products/hoodies/hoodie-1-main.jpg',
      '/images/products/hoodies/hoodie-1-front.jpg',
      '/images/products/hoodies/hoodie-1-back.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Grey', value: '#808080' },
      { name: 'Navy Blue', value: '#000080' }
    ],
    sizes: [
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: true }
    ],
    description: 'Premium quality hoodie with the signature FASHUN design. Perfect for casual streetwear styling.',
    features: [
      'Premium Cotton Blend',
      'Kangaroo Pocket',
      'Adjustable Hood',
      'Ribbed Cuffs',
      'Soft Inner Lining'
    ],
    inStock: true,
    stockCount: 23,
    category: 'Hoodies',
    tags: ['hoodie', 'streetwear', 'comfortable', 'premium'],
    sku: 'FSN-HD-001',
    weight: 0.6
  },
  
  // 📏 OVERSIZED HOODIES
  {
    id: 'oversized-hoodie-001',
    name: 'Oversized Street Hoodie',
    price: 2799,
    originalPrice: 3299,
    rating: 4.7,
    reviewCount: 203,
    images: [
      '/images/products/hoodies/hoodie-2-main.jpg',
      '/images/products/hoodies/hoodie-2-front.jpg'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Olive Green', value: '#808000' },
      { name: 'Cream', value: '#F5F5DC' }
    ],
    sizes: [
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: false }
    ],
    description: 'Trendy oversized hoodie with drop shoulders. The perfect streetwear statement piece.',
    features: [
      'Oversized Fit',
      'Drop Shoulder Design',
      'Heavy Cotton',
      'Street Style',
      'Premium Quality'
    ],
    inStock: true,
    stockCount: 67,
    category: 'Oversized Hoodies',
    tags: ['oversized', 'street-style', 'trendy', 'drop-shoulder'],
    sku: 'FSN-OH-001',
    weight: 0.7
  },
  
  // 👔 SWEATSHIRTS
  {
    id: 'sweatshirt-001',
    name: 'Crew Neck Sweatshirt',
    price: 1999,
    originalPrice: 2499,
    rating: 4.5,
    reviewCount: 324,
    images: [
      '/images/products/jackets/jacket-1-main.jpg',
      '/images/products/jackets/jacket-1-front.jpg'
    ],
    colors: [
      { name: 'Grey Melange', value: '#A9A9A9' },
      { name: 'Black', value: '#000000' },
      { name: 'Navy Blue', value: '#000080' }
    ],
    sizes: [
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: true }
    ],
    description: 'Classic crew neck sweatshirt without hood. Versatile piece for layering and standalone wear.',
    features: [
      'Crew Neckline',
      'No Hood Design',
      'Comfortable Fit',
      'Soft Cotton Blend',
      'Versatile Styling'
    ],
    inStock: true,
    stockCount: 89,
    category: 'Sweatshirts',
    tags: ['sweatshirt', 'crew-neck', 'versatile', 'comfortable'],
    sku: 'FSN-SW-001',
    weight: 0.5
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
