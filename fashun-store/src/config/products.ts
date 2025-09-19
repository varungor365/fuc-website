// Product categories configuration - easily customizable
export const productCategories = {
  'hoodies': {
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Premium oversized hoodies for the streets',
    image: '/images/categories/hoodies.jpg',
    features: ['Oversized Fit', '450GSM Cotton', 'Premium Print', 'Limited Edition'],
  seoTitle: 'Premium Streetwear Hoodies | FashUn.Co.in',
    seoDescription: 'Shop exclusive oversized hoodies with premium cotton and street-ready designs. Limited edition drops available.',
    filters: ['size', 'color', 'fit', 'material'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular']
  },
  'polo-shirts': {
    name: 'Polo Shirts',
    slug: 'polo-shirts',
    description: 'Elevated polo shirts with street edge',
    image: '/images/categories/polo-shirts.jpg',
    features: ['Modern Fit', 'Breathable Fabric', 'Street Design', 'Versatile Style'],
  seoTitle: 'Streetwear Polo Shirts | FashUn.Co.in',
    seoDescription: 'Discover elevated polo shirts that blend classic style with modern streetwear aesthetics.',
    filters: ['size', 'color', 'fit'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular']
  },
  't-shirts': {
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Essential tees with bold graphics',
    image: '/images/categories/t-shirts.jpg',
    features: ['Graphic Prints', 'Soft Cotton', 'Regular Fit', 'Daily Wear'],
  seoTitle: 'Graphic T-Shirts & Streetwear Tees | FashUn.Co.in',
    seoDescription: 'Essential streetwear t-shirts with bold graphics and premium cotton construction.',
    filters: ['size', 'color', 'graphic', 'fit'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular']
  },
  'jackets': {
    name: 'Jackets',
    slug: 'jackets',
    description: 'Statement outerwear for every season',
    image: '/images/categories/jackets.jpg',
    features: ['Weather Protection', 'Premium Materials', 'Functional Design', 'Statement Piece'],
  seoTitle: 'Streetwear Jackets & Outerwear | FashUn.Co.in',
    seoDescription: 'Premium streetwear jackets and outerwear designed for style and functionality.',
    filters: ['size', 'color', 'material', 'season'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular']
  },
  'pants': {
    name: 'Pants',
    slug: 'pants',
    description: 'Cargo pants and streetwear bottoms',
    image: '/images/categories/pants.jpg',
    features: ['Cargo Pockets', 'Tapered Fit', 'Durable Fabric', 'Street Ready'],
  seoTitle: 'Cargo Pants & Streetwear Bottoms | FashUn.Co.in',
    seoDescription: 'Functional cargo pants and streetwear bottoms with modern cuts and premium materials.',
    filters: ['size', 'color', 'fit', 'style'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular']
  },
  'accessories': {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Complete your streetwear look',
    image: '/images/categories/accessories.jpg',
    features: ['Caps & Beanies', 'Bags & Backpacks', 'Jewelry', 'Tech Accessories'],
  seoTitle: 'Streetwear Accessories | FashUn.Co.in',
    seoDescription: 'Complete your streetwear outfit with our curated selection of accessories.',
    filters: ['type', 'color', 'material'],
    sortOptions: ['newest', 'price-low', 'price-high', 'popular']
  },
  'limited-edition': {
    name: 'Limited Edition',
    slug: 'limited-edition',
    description: 'Exclusive drops and collaborations',
    image: '/images/categories/limited-edition.jpg',
    features: ['Exclusive Drops', 'Limited Quantities', 'Collector Items', 'Premium Materials'],
  seoTitle: 'Limited Edition Streetwear | FashUn.Co.in',
    seoDescription: 'Exclusive limited edition streetwear pieces and collaborations. Available while supplies last.',
    filters: ['size', 'color', 'collection'],
    sortOptions: ['newest', 'price-high', 'ending-soon']
  }
};

// Size configurations
export const sizeConfig = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  shoes: ['6', '7', '8', '9', '10', '11', '12'],
  accessories: ['One Size', 'S/M', 'L/XL']
};

// Color configurations
export const colorConfig = {
  primary: ['Black', 'White', 'Grey'],
  seasonal: ['Navy', 'Olive', 'Burgundy', 'Sand'],
  limited: ['Neon Green', 'Electric Blue', 'Hot Pink']
};

// Price ranges for filtering
export const priceRanges = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: Infinity }
];

export default productCategories;
