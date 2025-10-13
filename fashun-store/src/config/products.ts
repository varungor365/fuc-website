// 🎯 FASHUN.CO - T-SHIRT FOCUSED CATEGORIES
// Redesigned based on Instagram brand identity and competitor analysis
export const productCategories = {
  'printed-tshirts': {
    name: 'Printed T-Shirts',
    slug: 'printed-tshirts',
    description: 'Bold graphics and artistic designs that tell your story',
    image: '/images/products/t-shirts/tshirt-1-main.jpg',
    features: ['Graphic Prints', 'Soft Cotton', 'Premium Quality', 'Unique Designs'],
    seoTitle: 'Printed T-Shirts for Men & Women | FASHUN.CO',
    seoDescription: 'Shop unique printed t-shirts with bold graphics, artistic designs, and premium cotton quality. Express your style with FASHUN.CO',
    filters: ['size', 'color', 'design', 'fit'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular'],
    priority: 1,
    trending: true
  },
  'full-sleeve-tshirts': {
    name: 'Full Sleeve T-Shirts',
    slug: 'full-sleeve-tshirts',
    description: 'Extended comfort with full sleeve protection and style',
    image: '/images/products/t-shirts/tshirt-2-main.jpg',
    features: ['Full Sleeve', 'Comfortable Fit', 'All Season', 'Breathable Cotton'],
    seoTitle: 'Full Sleeve T-Shirts for Men & Women | FASHUN.CO',
    seoDescription: 'Premium full sleeve t-shirts for year-round comfort. Perfect for layering and standalone wear. Shop FASHUN.CO',
    filters: ['size', 'color', 'fit', 'material'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular'],
    priority: 2,
    trending: true
  },
  'polo-tshirts': {
    name: 'Polo T-Shirts',
    slug: 'polo-tshirts',
    description: 'Classic polo style with modern streetwear edge',
    image: '/images/products/t-shirts/tshirt-1-front.jpg',
    features: ['Collar Design', 'Button Closure', 'Smart Casual', 'Premium Fabric'],
    seoTitle: 'Polo T-Shirts for Men & Women | FASHUN.CO',
    seoDescription: 'Elevate your style with premium polo t-shirts. Perfect blend of classic and contemporary design at FASHUN.CO',
    filters: ['size', 'color', 'fit'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular'],
    priority: 3,
    trending: false
  },
  'womens-tshirts': {
    name: "Women's T-Shirts",
    slug: 'womens-tshirts',
    description: 'Specially designed for the modern, confident woman',
    image: '/images/products/t-shirts/tshirt-2-front.jpg',
    features: ['Flattering Fit', 'Feminine Cuts', 'Soft Fabric', 'Versatile Style'],
    seoTitle: "Women's T-Shirts | Fashionable & Comfortable | FASHUN.CO",
    seoDescription: "Discover stylish women's t-shirts with flattering fits and premium comfort. Perfect for every occasion at FASHUN.CO",
    filters: ['size', 'color', 'fit', 'neckline'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular'],
    priority: 4,
    trending: true
  },
  'crop-tops': {
    name: 'Crop Tops',
    slug: 'crop-tops',
    description: 'Trendy crop tops for the fashion-forward generation',
    image: '/images/products/hoodies/hoodie-1-main.jpg',
    features: ['Cropped Length', 'Trendy Styles', 'Comfortable Fit', 'Mix & Match'],
    seoTitle: 'Trendy Crop Tops for Women | FASHUN.CO',
    seoDescription: 'Stay on-trend with stylish crop tops from FASHUN.CO. Perfect for casual outings and layering.',
    filters: ['size', 'color', 'style', 'length'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular'],
    priority: 5,
    trending: true
  },
  'plus-size-tshirts': {
    name: 'Plus Size T-Shirts',
    slug: 'plus-size-tshirts',
    description: 'Inclusive fashion for all body types with premium comfort',
    image: '/images/products/hoodies/hoodie-2-main.jpg',
    features: ['Extended Sizes', 'Comfortable Fit', 'Quality Fabric', 'Inclusive Design'],
    seoTitle: 'Plus Size T-Shirts for Men & Women | FASHUN.CO',
    seoDescription: 'Comfortable and stylish plus size t-shirts designed for the perfect fit. Inclusive fashion at FASHUN.CO',
    filters: ['size', 'color', 'fit', 'style'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular'],
    priority: 6,
    trending: false
  },
  'plain-tshirts': {
    name: 'Plain T-Shirts & Packs',
    slug: 'plain-tshirts',
    description: 'Essential basics and value combo packs for everyday wear',
    image: '/images/products/t-shirts/tshirt-1-main.jpg',
    features: ['Plain Colors', 'Combo Packs', 'Basic Essentials', 'Value Pricing'],
    seoTitle: 'Plain T-Shirts & Combo Packs | FASHUN.CO',
    seoDescription: 'Essential plain t-shirts and value combo packs. Build your wardrobe basics with FASHUN.CO premium quality.',
    filters: ['size', 'color', 'pack-size', 'fit'],
    sortOptions: ['price-low', 'pack-size', 'newest', 'popular'],
    priority: 7,
    trending: false
  },
  'hoodies': {
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Cozy comfort meets street style',
    image: '/images/products/hoodies/hoodie-1-main.jpg',
    features: ['Hood Design', 'Kangaroo Pocket', 'Warm & Cozy', 'Street Style'],
    seoTitle: 'Premium Hoodies for Men & Women | FASHUN.CO',
    seoDescription: 'Stay warm and stylish with premium hoodies from FASHUN.CO. Perfect for casual wear and street fashion.',
    filters: ['size', 'color', 'fit', 'material'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular'],
    priority: 8,
    trending: true
  },
  'oversized-hoodies': {
    name: 'Oversized Hoodies',
    slug: 'oversized-hoodies',
    description: 'Extra comfort with oversized streetwear fit',
    image: '/images/products/hoodies/hoodie-2-front.jpg',
    features: ['Oversized Fit', 'Drop Shoulder', 'Street Style', 'Premium Cotton'],
    seoTitle: 'Oversized Hoodies | Streetwear Fashion | FASHUN.CO',
    seoDescription: 'Rock the oversized trend with premium oversized hoodies. Perfect streetwear style at FASHUN.CO',
    filters: ['size', 'color', 'design', 'material'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular'],
    priority: 9,
    trending: true
  },
  'sweatshirts': {
    name: 'Sweatshirts',
    slug: 'sweatshirts',
    description: 'Classic comfort without the hood for versatile styling',
    image: '/images/products/hoodies/hoodie-1-front.jpg',
    features: ['No Hood', 'Crew Neck', 'Comfortable Fit', 'Versatile Style'],
    seoTitle: 'Premium Sweatshirts for Men & Women | FASHUN.CO',
    seoDescription: 'Classic sweatshirts with premium comfort and style. Perfect for layering and casual wear at FASHUN.CO',
    filters: ['size', 'color', 'fit', 'neckline'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular'],
    priority: 10,
    trending: false
  }
};

// 📏 SIZE CONFIGURATIONS - T-shirt focused sizing
export const sizeConfig = {
  tshirts: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], // Extended for plus size
  women: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  oversized: ['S', 'M', 'L', 'XL', 'XXL'], // Oversized starts from S
  cropTops: ['XS', 'S', 'M', 'L', 'XL'],
  hoodies: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
};

// 🎨 COLOR CONFIGURATIONS - Inspired by competitor analysis
export const colorConfig = {
  // Core colors for basics and plain tees
  basics: [
    { name: 'Black', code: '#000000', popular: true },
    { name: 'White', code: '#FFFFFF', popular: true },
    { name: 'Grey', code: '#808080', popular: true },
    { name: 'Navy Blue', code: '#000080', popular: true }
  ],
  // Trending colors for printed and stylish pieces
  trending: [
    { name: 'Olive Green', code: '#808000' },
    { name: 'Burgundy', code: '#800020' },
    { name: 'Mustard Yellow', code: '#FFDB58' },
    { name: 'Rust Orange', code: '#B7410E' },
    { name: 'Deep Purple', code: '#483D8B' }
  ],
  // Women's specific color palette
  womens: [
    { name: 'Pastel Pink', code: '#FFD6E8' },
    { name: 'Lavender', code: '#E6E6FA' },
    { name: 'Mint Green', code: '#98FF98' },
    { name: 'Peach', code: '#FFCBA4' },
    { name: 'Sky Blue', code: '#87CEEB' }
  ]
};

// 💰 PRICE RANGES - Competitive with analyzed brands
export const priceRanges = [
  { label: 'Under ₹499', min: 0, max: 499, popular: true },
  { label: '₹500 - ₹999', min: 500, max: 999, popular: true },
  { label: '₹1,000 - ₹1,499', min: 1000, max: 1499 },
  { label: '₹1,500 - ₹2,499', min: 1500, max: 2499 },
  { label: '₹2,500 - ₹3,999', min: 2500, max: 3999 },
  { label: 'Above ₹4,000', min: 4000, max: Infinity }
];

// 🏷️ COMBO PACK CONFIGURATIONS - Inspired by Beyoung's success
export const comboPackConfig = {
  'plain-combo-3': {
    name: 'Pick Any 3 - Plain T-shirts',
    discount: 30,
    minItems: 3,
    maxItems: 3,
    applicableCategories: ['plain-tshirts']
  },
  'plain-combo-5': {
    name: 'Pick Any 5 - Plain T-shirts',
    discount: 40,
    minItems: 5,
    maxItems: 5,
    applicableCategories: ['plain-tshirts']
  },
  'mix-match-4': {
    name: 'Mix & Match - Any 4 Items',
    discount: 25,
    minItems: 4,
    maxItems: 4,
    applicableCategories: ['printed-tshirts', 'full-sleeve-tshirts', 'polo-tshirts']
  }
};

// 🎯 FIT TYPES - Based on competitor analysis
export const fitTypes = [
  { id: 'regular', name: 'Regular Fit', description: 'Classic comfortable fit' },
  { id: 'slim', name: 'Slim Fit', description: 'Tailored close-to-body fit' },
  { id: 'oversized', name: 'Oversized Fit', description: 'Relaxed loose fit' },
  { id: 'boxy', name: 'Boxy Fit', description: 'Square relaxed silhouette' },
  { id: 'cropped', name: 'Cropped Fit', description: 'Shortened length design' }
];

export default productCategories;
