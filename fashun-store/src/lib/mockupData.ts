// High-quality mockup data for different categories
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

// Helper function to generate additional properties
const generateMockupExtras = (index: number) => ({
  rating: 4.0 + (Math.random() * 1.0), // 4.0-5.0 rating
  reviewCount: Math.floor(Math.random() * 500) + 50,
  tags: ['trendy', 'streetwear', 'premium', 'fashion'],
  inStock: Math.random() > 0.1, // 90% in stock
  isNew: Math.random() > 0.7, // 30% are new
  isFeatured: Math.random() > 0.8, // 20% are featured
});

export const mockupData: Record<string, MockupItem[]> = {
  [MOCKUP_CATEGORIES.HOODIES]: [
    {
      id: 'hoodie-001',
      name: 'Urban Legends Oversized Hoodie',
      category: 'hoodies',
      image: '/stock/products/tshirt-01.svg',
      price: 4999,
      originalPrice: 6999,
      colors: ['Black', 'White', 'Grey', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Premium heavyweight cotton blend hoodie with embossed logo and kangaroo pocket.'
    },
    {
      id: 'hoodie-002',
      name: 'Street Culture Zip Hoodie',
      category: 'hoodies',
      image: '/stock/products/tshirt-01.svg',
      price: 5499,
      originalPrice: 7499,
      colors: ['Black', 'Charcoal', 'Olive'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Full-zip hoodie with reflective details and premium fleece lining.'
    },
    {
      id: 'hoodie-003',
      name: 'Neon Dreams Glow Hoodie',
      category: 'hoodies',
      image: '/stock/products/tshirt-01.svg',
      price: 6999,
      colors: ['Black', 'Navy', 'Purple'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Glow-in-the-dark print hoodie with UV-reactive graphics.'
    },
    {
      id: 'hoodie-004',
      name: 'Minimalist Tech Hoodie',
      category: 'hoodies',
      image: '/stock/products/tshirt-01.svg',
      price: 5999,
      colors: ['White', 'Light Grey', 'Cream'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Clean design tech hoodie with moisture-wicking fabric.'
    },
    {
      id: 'hoodie-005',
      name: 'Graffiti Art Cropped Hoodie',
      category: 'hoodies',
      image: '/stock/products/tshirt-01.svg',
      price: 4499,
      colors: ['Black', 'White', 'Pink'],
      sizes: ['XS', 'S', 'M', 'L'],
      description: 'Cropped fit hoodie with original graffiti artwork.'
    },
    {
      id: 'hoodie-006',
      name: 'Luxury Fleece Hoodie',
      category: 'hoodies',
      image: '/stock/products/tshirt-01.svg',
      price: 8999,
      colors: ['Burgundy', 'Forest Green', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Premium fleece hoodie with gold-tone hardware and embroidered details.'
    }
  ],
  
  [MOCKUP_CATEGORIES.TSHIRTS]: [
    {
      id: 'tshirt-001',
      name: 'Vintage Streetwear Tee',
      category: 'tshirts',
      image: '/stock/products/tshirt-01.svg',
      price: 2499,
      originalPrice: 3499,
      colors: ['Black', 'White', 'Vintage Grey'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      description: 'Soft cotton tee with vintage-inspired graphics and distressed finish.'
    },
    {
      id: 'tshirt-002',
      name: 'Neon Typography Tee',
      category: 'tshirts',
      image: '/stock/products/tshirt-01.svg',
      price: 2999,
      colors: ['Black', 'Navy', 'Charcoal'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Bold neon typography design with premium ring-spun cotton.'
    },
    {
      id: 'tshirt-003',
      name: 'Abstract Art Oversized Tee',
      category: 'tshirts',
      image: '/stock/products/tshirt-01.svg',
      price: 3499,
      colors: ['White', 'Cream', 'Light Pink'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Oversized fit tee with hand-drawn abstract artwork.'
    },
    {
      id: 'tshirt-004',
      name: 'Minimalist Logo Tee',
      category: 'tshirts',
      image: '/stock/products/tshirt-01.svg',
      price: 1999,
      colors: ['Black', 'White', 'Grey', 'Navy'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      description: 'Clean minimalist design with subtle logo placement.'
    },
    {
      id: 'tshirt-005',
      name: 'Retro Wave Graphic Tee',
      category: 'tshirts',
      image: '/stock/products/tshirt-01.svg',
      price: 2799,
      colors: ['Black', 'Purple', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Retro-wave inspired graphics with gradient effects.'
    },
    {
      id: 'tshirt-006',
      name: 'Urban Jungle Tee',
      category: 'tshirts',
      image: '/stock/products/tshirt-01.svg',
      price: 2699,
      colors: ['Olive', 'Forest Green', 'Black'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Nature-inspired urban design with eco-friendly materials.'
    }
  ],

  [MOCKUP_CATEGORIES.PANTS]: [
    {
      id: 'pants-001',
      name: 'Tech Cargo Pants',
      category: 'pants',
      image: '/stock/products/tshirt-01.svg',
      price: 6999,
      originalPrice: 8999,
      colors: ['Black', 'Olive', 'Charcoal'],
      sizes: ['28', '30', '32', '34', '36', '38'],
      description: 'Technical fabric cargo pants with multiple pockets and adjustable cuffs.'
    },
    {
      id: 'pants-002',
      name: 'Distressed Denim Jeans',
      category: 'pants',
      image: '/stock/products/tshirt-01.svg',
      price: 5999,
      colors: ['Dark Blue', 'Light Blue', 'Black'],
      sizes: ['28', '30', '32', '34', '36'],
      description: 'Premium denim with artistic distressing and tapered fit.'
    },
    {
      id: 'pants-003',
      name: 'Reflective Track Pants',
      category: 'pants',
      image: '/stock/products/tshirt-01.svg',
      price: 4999,
      colors: ['Black', 'Navy', 'Grey'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Athletic track pants with reflective side stripes.'
    },
    {
      id: 'pants-004',
      name: 'Wide Leg Street Pants',
      category: 'pants',
      image: '/stock/products/tshirt-01.svg',
      price: 5499,
      colors: ['Black', 'Cream', 'Brown'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Relaxed wide-leg pants with adjustable drawstring waist.'
    },
    {
      id: 'pants-005',
      name: 'Leather Accent Joggers',
      category: 'pants',
      image: '/stock/products/tshirt-01.svg',
      price: 7999,
      colors: ['Black', 'Grey', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Premium joggers with leather panel details and zip pockets.'
    },
    {
      id: 'pants-006',
      name: 'Utility Tactical Pants',
      category: 'pants',
      image: '/stock/products/tshirt-01.svg',
      price: 6499,
      colors: ['Black', 'Olive', 'Khaki'],
      sizes: ['30', '32', '34', '36', '38'],
      description: 'Military-inspired tactical pants with reinforced knees.'
    }
  ],

  [MOCKUP_CATEGORIES.ACCESSORIES]: [
    {
      id: 'acc-001',
      name: 'Graffiti Snapback Cap',
      category: 'accessories',
      image: '/stock/products/tshirt-01.svg',
      price: 2999,
      colors: ['Black', 'White', 'Red'],
      sizes: ['One Size'],
      description: 'Embroidered snapback with custom graffiti artwork.'
    },
    {
      id: 'acc-002',
      name: 'Tech Crossbody Bag',
      category: 'accessories',
      image: '/stock/products/tshirt-01.svg',
      price: 4999,
      originalPrice: 6999,
      colors: ['Black', 'Grey', 'Navy'],
      sizes: ['One Size'],
      description: 'Water-resistant crossbody bag with tech organization pockets.'
    },
    {
      id: 'acc-003',
      name: 'Chain Link Necklace',
      category: 'accessories',
      image: '/stock/products/tshirt-01.svg',
      price: 3499,
      colors: ['Silver', 'Gold', 'Black'],
      sizes: ['18"', '20"', '22"'],
      description: 'Stainless steel chain necklace with custom pendant.'
    },
    {
      id: 'acc-004',
      name: 'Street Art Phone Case',
      category: 'accessories',
      image: '/stock/products/tshirt-01.svg',
      price: 1999,
      colors: ['Clear', 'Black', 'White'],
      sizes: ['iPhone 15', 'iPhone 14', 'Samsung S24'],
      description: 'Protective case with original street art designs.'
    },
    {
      id: 'acc-005',
      name: 'Bucket Hat Collection',
      category: 'accessories',
      image: '/stock/products/tshirt-01.svg',
      price: 2499,
      colors: ['Black', 'Khaki', 'Navy', 'Pink'],
      sizes: ['S/M', 'L/XL'],
      description: 'Reversible bucket hat with dual designs.'
    },
    {
      id: 'acc-006',
      name: 'LED Light-Up Sunglasses',
      category: 'accessories',
      image: '/stock/products/tshirt-01.svg',
      price: 5999,
      colors: ['Black', 'White', 'Clear'],
      sizes: ['One Size'],
      description: 'Futuristic sunglasses with customizable LED strips.'
    }
  ],

  [MOCKUP_CATEGORIES.SHOES]: [
    {
      id: 'shoes-001',
      name: 'High-Top Street Sneakers',
      category: 'shoes',
      image: '/stock/products/tshirt-01.svg',
      price: 8999,
      originalPrice: 11999,
      colors: ['Black/White', 'All Black', 'White/Gum'],
      sizes: ['7', '8', '9', '10', '11', '12'],
      description: 'Classic high-top sneakers with premium leather upper.'
    },
    {
      id: 'shoes-002',
      name: 'Chunky Dad Sneakers',
      category: 'shoes',
      image: '/stock/products/tshirt-01.svg',
      price: 7999,
      colors: ['White/Grey', 'Black/Red', 'Cream/Brown'],
      sizes: ['7', '8', '9', '10', '11', '12'],
      description: 'Retro-inspired chunky sneakers with mesh and leather details.'
    },
    {
      id: 'shoes-003',
      name: 'Minimalist Canvas Shoes',
      category: 'shoes',
      image: '/stock/products/tshirt-01.svg',
      price: 4999,
      colors: ['White', 'Black', 'Navy', 'Olive'],
      sizes: ['6', '7', '8', '9', '10', '11', '12'],
      description: 'Clean canvas sneakers with vulcanized rubber sole.'
    },
    {
      id: 'shoes-004',
      name: 'Platform Boots',
      category: 'shoes',
      image: '/stock/products/tshirt-01.svg',
      price: 12999,
      colors: ['Black', 'Brown', 'White'],
      sizes: ['6', '7', '8', '9', '10', '11'],
      description: 'Statement platform boots with premium leather construction.'
    },
    {
      id: 'shoes-005',
      name: 'Athletic Running Shoes',
      category: 'shoes',
      image: '/stock/products/tshirt-01.svg',
      price: 9999,
      colors: ['Black/Neon', 'White/Blue', 'Grey/Orange'],
      sizes: ['7', '8', '9', '10', '11', '12'],
      description: 'Performance running shoes with advanced cushioning technology.'
    },
    {
      id: 'shoes-006',
      name: 'Slip-On Skate Shoes',
      category: 'shoes',
      image: '/stock/products/tshirt-01.svg',
      price: 5999,
      colors: ['Black/White', 'Checkerboard', 'Solid Black'],
      sizes: ['6', '7', '8', '9', '10', '11', '12'],
      description: 'Classic slip-on skate shoes with waffle outsole.'
    }
  ],

  [MOCKUP_CATEGORIES.JACKETS]: [
    {
      id: 'jacket-001',
      name: 'Oversized Bomber Jacket',
      category: 'jackets',
      image: '/stock/products/tshirt-01.svg',
      price: 9999,
      originalPrice: 13999,
      colors: ['Black', 'Olive', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Premium bomber jacket with satin lining and custom patches.'
    },
    {
      id: 'jacket-002',
      name: 'Denim Trucker Jacket',
      category: 'jackets',
      image: '/stock/products/tshirt-01.svg',
      price: 7999,
      colors: ['Dark Blue', 'Light Blue', 'Black'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Classic trucker jacket with vintage-inspired wash and fit.'
    },
    {
      id: 'jacket-003',
      name: 'Reflective Windbreaker',
      category: 'jackets',
      image: '/stock/products/tshirt-01.svg',
      price: 6999,
      colors: ['Black/Silver', 'Navy/White', 'Grey/Neon'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Lightweight windbreaker with full reflective panels.'
    },
    {
      id: 'jacket-004',
      name: 'Sherpa Lined Jacket',
      category: 'jackets',
      image: '/stock/products/tshirt-01.svg',
      price: 11999,
      colors: ['Brown', 'Black', 'Cream'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Cozy sherpa-lined jacket with corduroy exterior.'
    },
    {
      id: 'jacket-005',
      name: 'Tech Shell Jacket',
      category: 'jackets',
      image: '/stock/products/tshirt-01.svg',
      price: 14999,
      colors: ['Black', 'Grey', 'Olive'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'High-performance shell jacket with waterproof technology.'
    },
    {
      id: 'jacket-006',
      name: 'Vintage Leather Jacket',
      category: 'jackets',
      image: '/stock/products/tshirt-01.svg',
      price: 19999,
      colors: ['Black', 'Brown', 'Burgundy'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Genuine leather jacket with vintage styling and premium hardware.'
    }
  ]
};

// Helper function to get all mockups
export const getAllMockups = (): MockupItem[] => {
  return Object.values(mockupData).flat();
};

// Helper function to get mockups by category
export const getMockupsByCategory = (category: string): MockupItem[] => {
  return mockupData[category] || [];
};

// Helper function to format price
export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString()}`;
};
