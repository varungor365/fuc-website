// FASHUN Product Database - Focused Collection
// Hoodies, T-Shirts, Oversized T-Shirts, Sweatshirts, Polo Shirts, and Anime Accessories

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isLimited?: boolean;
  inStock: boolean;
  stockCount?: number;
  sku: string;
  material?: string;
  fit?: string;
  rating?: number;
  reviews?: number;
}

// Categories configuration
export const categories = {
  hoodies: {
    name: "Hoodies",
    slug: "hoodies",
    description: "Premium hoodies for ultimate comfort and style",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop&auto=format",
    subcategories: ["pullover", "zip-up", "oversized"],
  },
  tshirts: {
    name: "T-Shirts",
    slug: "tshirts", 
    description: "Graphic tees and essential t-shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&auto=format",
    subcategories: ["graphic", "basic", "anime"],
  },
  oversized_tshirts: {
    name: "Oversized T-Shirts",
    slug: "oversized-tshirts",
    description: "Oversized tees for streetwear style",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&h=600&fit=crop&auto=format",
    subcategories: ["graphic", "plain", "anime"],
  },
  sweatshirts: {
    name: "Sweatshirts",
    slug: "sweatshirts",
    description: "Cozy sweatshirts for casual comfort",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format",
    subcategories: ["crew-neck", "oversized", "vintage"],
  },
  polos: {
    name: "Polo Shirts",
    slug: "polos",
    description: "Smart casual polos with streetwear edge", 
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=600&fit=crop&auto=format",
    subcategories: ["classic", "oversized", "embroidered"],
  },
  anime_accessories: {
    name: "Anime Accessories",
    slug: "anime-accessories",
    description: "Anime-inspired accessories and collectibles",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format",
    subcategories: ["pins", "patches", "bags", "keychains", "figures"],
  }
};

// Product Database
export const products: Product[] = [
  // HOODIES (8 products)
  {
    id: 'hoodie-001',
    name: 'Essential Oversized Hoodie',
    category: 'hoodies',
    subcategory: 'oversized',
    price: 79.99,
    description: 'Ultra-comfortable oversized hoodie in premium heavyweight cotton. Perfect for layering with adjustable drawstring hood.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Cream', 'Forest Green', 'Burgundy'],
    tags: ['oversized', 'heavyweight', 'basic', 'comfortable'],
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockCount: 38,
    sku: 'FASH-HOD-001',
    material: 'Premium Cotton Blend',
    fit: 'Oversized',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 'hoodie-002',
    name: 'Graffiti Print Hoodie',
    category: 'hoodies',
    subcategory: 'pullover',
    price: 89.99,
    originalPrice: 109.99,
    description: 'Street art inspired hoodie with all-over graffiti print. Features kangaroo pocket and ribbed cuffs.',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Multi-Black', 'Multi-White', 'Multi-Gray'],
    tags: ['graffiti', 'street-art', 'print', 'urban'],
    isFeatured: true,
    inStock: true,
    stockCount: 22,
    sku: 'FASH-HOD-002',
    material: 'Cotton Fleece',
    fit: 'Regular',
    rating: 4.6,
    reviews: 94
  },
  {
    id: 'hoodie-003',
    name: 'Zip-Up Hoodie',
    category: 'hoodies',
    subcategory: 'zip-up',
    price: 69.99,
    description: 'Classic zip-up hoodie with full-length zipper and dual side pockets. Versatile layering piece.',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Heather Gray', 'Olive'],
    tags: ['zip-up', 'classic', 'versatile', 'layering'],
    inStock: true,
    stockCount: 47,
    sku: 'FASH-HOD-003',
    material: 'Cotton Blend',
    fit: 'Regular',
    rating: 4.5,
    reviews: 112
  },
  {
    id: 'hoodie-004',
    name: 'Anime Character Hoodie',
    category: 'hoodies',
    subcategory: 'pullover',
    price: 94.99,
    description: 'Premium hoodie featuring popular anime character designs. High-quality print with vibrant colors.',
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black/Multi', 'White/Multi', 'Navy/Multi'],
    tags: ['anime', 'character', 'premium', 'vibrant'],
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockCount: 29,
    sku: 'FASH-HOD-004',
    material: 'Premium Cotton',
    fit: 'Regular',
    rating: 4.9,
    reviews: 71
  },
  {
    id: 'hoodie-005',
    name: 'Minimalist Logo Hoodie',
    category: 'hoodies',
    subcategory: 'pullover',
    price: 74.99,
    description: 'Clean minimal design with subtle FASHUN logo placement. Perfect for everyday wear.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray', 'Navy', 'Burgundy'],
    tags: ['minimalist', 'logo', 'basic', 'everyday'],
    inStock: true,
    stockCount: 65,
    sku: 'FASH-HOD-005',
    material: 'Organic Cotton',
    fit: 'Regular',
    rating: 4.7,
    reviews: 143
  },

  // T-SHIRTS (8 products)
  {
    id: 'tshirt-001',
    name: 'Urban Graphic Tee',
    category: 'tshirts',
    subcategory: 'graphic',
    price: 29.99,
    originalPrice: 39.99,
    description: 'Bold streetwear graphic tee with premium cotton blend. Features unique FASHUN artwork.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray', 'Navy'],
    tags: ['graphic', 'cotton', 'streetwear', 'urban'],
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockCount: 45,
    sku: 'FASH-TEE-001',
    material: 'Cotton Blend',
    fit: 'Regular',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'tshirt-002',
    name: 'Anime Character Tee',
    category: 'tshirts',
    subcategory: 'anime',
    price: 34.99,
    description: 'High-quality anime character print on premium cotton. Perfect for anime enthusiasts.',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black/Multi', 'White/Multi', 'Navy/Multi'],
    tags: ['anime', 'character', 'premium', 'cotton'],
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockCount: 62,
    sku: 'FASH-TEE-002',
    material: 'Premium Cotton',
    fit: 'Regular',
    rating: 4.6,
    reviews: 89
  },
  {
    id: 'tshirt-003',
    name: 'Basic Essential Tee',
    category: 'tshirts',
    subcategory: 'basic',
    price: 24.99,
    description: 'Essential basic t-shirt in premium organic cotton. Perfect wardrobe staple.',
    images: [
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1588117472013-59bb13edafec?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Gray', 'Navy', 'Olive'],
    tags: ['basic', 'essential', 'organic', 'staple'],
    inStock: true,
    stockCount: 128,
    sku: 'FASH-TEE-003',
    material: 'Organic Cotton',
    fit: 'Regular',
    rating: 4.5,
    reviews: 67
  },
  {
    id: 'tshirt-004',
    name: 'Typography Art Tee',
    category: 'tshirts',
    subcategory: 'graphic',
    price: 31.99,
    description: 'Bold typography design with street art aesthetic. High-quality screen print.',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f37f4042?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Red', 'Navy'],
    tags: ['typography', 'art', 'screen-print', 'street'],
    inStock: true,
    stockCount: 33,
    sku: 'FASH-TEE-004',
    material: 'Cotton',
    fit: 'Regular',
    rating: 4.4,
    reviews: 52
  },
  {
    id: 'tshirt-005',
    name: 'Vintage Band Tee',
    category: 'tshirts',
    subcategory: 'graphic',
    price: 36.99,
    description: 'Vintage-inspired band t-shirt with distressed print and soft cotton feel.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1622445275576-721325763eda?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Vintage Black', 'Faded White', 'Worn Gray'],
    tags: ['vintage', 'band', 'distressed', 'soft'],
    inStock: true,
    stockCount: 41,
    sku: 'FASH-TEE-005',
    material: 'Soft Cotton',
    fit: 'Regular',
    rating: 4.7,
    reviews: 78
  },

  // OVERSIZED T-SHIRTS (6 products)
  {
    id: 'oversized-001',
    name: 'Oversized Graphic Tee',
    category: 'oversized_tshirts',
    subcategory: 'graphic',
    price: 39.99,
    description: 'Oversized fit graphic tee with bold streetwear design. Premium heavyweight cotton.',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray', 'Beige'],
    tags: ['oversized', 'graphic', 'heavyweight', 'streetwear'],
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockCount: 54,
    sku: 'FASH-OVR-001',
    material: 'Heavyweight Cotton',
    fit: 'Oversized',
    rating: 4.8,
    reviews: 91
  },
  {
    id: 'oversized-002',
    name: 'Oversized Anime Tee',
    category: 'oversized_tshirts',
    subcategory: 'anime',
    price: 44.99,
    description: 'Oversized anime character tee with premium print quality. Perfect for anime fans.',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black/Multi', 'White/Multi', 'Gray/Multi'],
    tags: ['oversized', 'anime', 'premium', 'character'],
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockCount: 37,
    sku: 'FASH-OVR-002',
    material: 'Premium Cotton',
    fit: 'Oversized',
    rating: 4.9,
    reviews: 76
  },
  {
    id: 'oversized-003',
    name: 'Oversized Plain Tee',
    category: 'oversized_tshirts',
    subcategory: 'plain',
    price: 34.99,
    description: 'Simple oversized plain tee in premium cotton. Essential wardrobe piece.',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray', 'Beige', 'Navy'],
    tags: ['oversized', 'plain', 'essential', 'premium'],
    inStock: true,
    stockCount: 89,
    sku: 'FASH-OVR-003',
    material: 'Premium Cotton',
    fit: 'Oversized',
    rating: 4.6,
    reviews: 134
  },

  // SWEATSHIRTS (6 products)
  {
    id: 'sweat-001',
    name: 'Crew Neck Sweatshirt',
    category: 'sweatshirts',
    subcategory: 'crew-neck',
    price: 64.99,
    description: 'Classic crew neck sweatshirt in premium cotton fleece. Perfect for casual wear.',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Navy', 'Burgundy', 'Forest Green'],
    tags: ['crew-neck', 'classic', 'fleece', 'casual'],
    isFeatured: true,
    inStock: true,
    stockCount: 56,
    sku: 'FASH-SWT-001',
    material: 'Cotton Fleece',
    fit: 'Regular',
    rating: 4.7,
    reviews: 98
  },
  {
    id: 'sweat-002',
    name: 'Oversized Sweatshirt',
    category: 'sweatshirts',
    subcategory: 'oversized',
    price: 74.99,
    description: 'Oversized sweatshirt with dropped shoulders and relaxed fit. Ultra comfortable.',
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Cream', 'Sage Green', 'Dusty Pink', 'Light Gray'],
    tags: ['oversized', 'relaxed', 'comfortable', 'trendy'],
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockCount: 43,
    sku: 'FASH-SWT-002',
    material: 'Cotton Blend',
    fit: 'Oversized',
    rating: 4.8,
    reviews: 112
  },
  {
    id: 'sweat-003',
    name: 'Vintage Wash Sweatshirt',
    category: 'sweatshirts',
    subcategory: 'vintage',
    price: 69.99,
    description: 'Vintage-style sweatshirt with washed finish and retro feel.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Faded Black', 'Vintage Gray', 'Washed Blue'],
    tags: ['vintage', 'washed', 'retro', 'unique'],
    inStock: true,
    stockCount: 32,
    sku: 'FASH-SWT-003',
    material: 'Cotton',
    fit: 'Regular',
    rating: 4.6,
    reviews: 87
  },

  // POLO SHIRTS (5 products)
  {
    id: 'polo-001',
    name: 'Classic Polo Shirt',
    category: 'polos',
    subcategory: 'classic',
    price: 49.99,
    description: 'Classic polo shirt with modern streetwear edge. Premium pique cotton construction.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'White', 'Black', 'Forest Green'],
    tags: ['classic', 'polo', 'pique', 'smart-casual'],
    isFeatured: true,
    inStock: true,
    stockCount: 67,
    sku: 'FASH-POL-001',
    material: 'Pique Cotton',
    fit: 'Regular',
    rating: 4.5,
    reviews: 143
  },
  {
    id: 'polo-002',
    name: 'Oversized Polo Shirt',
    category: 'polos',
    subcategory: 'oversized',
    price: 54.99,
    description: 'Oversized polo with relaxed fit and modern streetwear styling.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sage Green', 'Cream', 'Charcoal', 'Dusty Blue'],
    tags: ['oversized', 'relaxed', 'modern', 'streetwear'],
    isNew: true,
    inStock: true,
    stockCount: 45,
    sku: 'FASH-POL-002',
    material: 'Cotton Blend',
    fit: 'Oversized',
    rating: 4.7,
    reviews: 89
  },

  // ANIME ACCESSORIES (10 products)
  {
    id: 'anime-acc-001',
    name: 'Anime Enamel Pin Set',
    category: 'anime_accessories',
    subcategory: 'pins',
    price: 19.99,
    description: 'Set of 5 high-quality enamel pins featuring popular anime characters.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['One Size'],
    colors: ['Multi-Color Set'],
    tags: ['anime', 'pins', 'enamel', 'collectible'],
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockCount: 89,
    sku: 'FASH-ANM-001',
    material: 'Metal Enamel',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 'anime-acc-002',
    name: 'Anime Patch Collection',
    category: 'anime_accessories',
    subcategory: 'patches',
    price: 14.99,
    description: 'Iron-on patches featuring iconic anime symbols and characters.',
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['One Size'],
    colors: ['Multi-Color Set'],
    tags: ['anime', 'patches', 'iron-on', 'symbols'],
    inStock: true,
    stockCount: 112,
    sku: 'FASH-ANM-002',
    material: 'Embroidered Fabric',
    rating: 4.6,
    reviews: 92
  },
  {
    id: 'anime-acc-003',
    name: 'Anime Crossbody Bag',
    category: 'anime_accessories',
    subcategory: 'bags',
    price: 39.99,
    description: 'Crossbody bag with anime character prints and multiple compartments.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['One Size'],
    colors: ['Black/Multi', 'Navy/Multi', 'White/Multi'],
    tags: ['anime', 'bag', 'crossbody', 'print'],
    isFeatured: true,
    inStock: true,
    stockCount: 34,
    sku: 'FASH-ANM-003',
    material: 'Canvas',
    rating: 4.7,
    reviews: 67
  },
  {
    id: 'anime-acc-004',
    name: 'Anime Keychain Set',
    category: 'anime_accessories',
    subcategory: 'keychains',
    price: 12.99,
    description: 'Set of 3 premium anime character keychains with metal construction.',
    images: [
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['One Size'],
    colors: ['Multi-Color Set'],
    tags: ['anime', 'keychain', 'metal', 'character'],
    isNew: true,
    inStock: true,
    stockCount: 145,
    sku: 'FASH-ANM-004',
    material: 'Metal/PVC',
    rating: 4.5,
    reviews: 189
  },
  {
    id: 'anime-acc-005',
    name: 'Mini Anime Figure',
    category: 'anime_accessories',
    subcategory: 'figures',
    price: 24.99,
    description: 'High-quality mini anime figure with detailed sculpting and paint.',
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=600&fit=crop&crop=center'
    ],
    sizes: ['One Size'],
    colors: ['As Shown'],
    tags: ['anime', 'figure', 'collectible', 'detailed'],
    isFeatured: true,
    inStock: true,
    stockCount: 56,
    sku: 'FASH-ANM-005',
    material: 'PVC',
    rating: 4.9,
    reviews: 78
  }
];

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.isFeatured);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.isNew);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Legacy compatibility
export const mockProducts = products.slice(0, 3).map(product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.images[0],
  category: product.category,
  sizes: product.sizes,
  colors: product.colors,
  rating: product.rating || 4.5,
  reviews: product.reviews || 0,
  description: product.description,
  inStock: product.inStock
}));