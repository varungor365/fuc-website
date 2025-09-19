// Comprehensive Product Database for FashUn.Co.in
// Industry-grade product catalog with stock images and complete information

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
  care?: string[];
  rating?: number;
  reviews?: number;
  seoTitle?: string;
  seoDescription?: string;
  weight?: string;
  dimensions?: string;
}

// Categories configuration for maximum flexibility
export const categories = {
  hoodies: {
    name: "Hoodies",
    slug: "hoodies",
    description: "Premium hoodies for ultimate comfort and style",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop&auto=format",
    subcategories: ["pullover", "zip-up", "oversized", "cropped"],
    seoTitle: "Premium Hoodies & Sweatshirts | FashUn.Co.in",
    seoDescription: "Shop premium hoodies and sweatshirts at FashUn.Co.in. Oversized fits, premium materials, and streetwear designs."
  },
  tshirts: {
    name: "T-Shirts",
    slug: "tshirts", 
    description: "Graphic tees and essentials for everyday wear",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&auto=format",
    subcategories: ["graphic", "plain", "oversized", "crop"],
    seoTitle: "Graphic T-Shirts & Essential Tees | FashUn.Co.in",
    seoDescription: "Explore our collection of graphic t-shirts and essential tees. Premium cotton, bold designs, perfect fit."
  },
  polos: {
    name: "Polo Shirts",
    slug: "polos",
    description: "Smart casual polos with streetwear edge", 
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=600&fit=crop&auto=format",
    subcategories: ["classic", "oversized", "embroidered"],
    seoTitle: "Polo Shirts & Smart Casual Wear | FashUn.Co.in",
    seoDescription: "Premium polo shirts with modern streetwear edge. Classic and oversized fits available."
  },
  sweatshirts: {
    name: "Sweatshirts",
    slug: "sweatshirts",
    description: "Cozy sweatshirts for casual comfort",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format",
    subcategories: ["crew-neck", "oversized", "vintage"],
    seoTitle: "Sweatshirts & Casual Wear | FashUn.Co.in",
    seoDescription: "Comfortable sweatshirts and casual wear. Premium materials, perfect for layering."
  },
  jackets: {
    name: "Jackets",
    slug: "jackets", 
    description: "Statement jackets for layering",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=600&fit=crop&auto=format",
    subcategories: ["bomber", "denim", "windbreaker", "varsity"],
    seoTitle: "Jackets & Outerwear | FashUn.Co.in",
    seoDescription: "Premium jackets and outerwear. Bomber jackets, denim pieces, and statement outerwear."
  },
  pants: {
    name: "Pants",
    slug: "pants",
    description: "Comfortable pants and joggers",
    image: "https://images.unsplash.com/photo-1506629905057-f39a2c35b5a5?w=800&h=600&fit=crop&auto=format", 
    subcategories: ["joggers", "cargo", "straight", "wide"],
    seoTitle: "Pants & Bottoms | FashUn.Co.in",
    seoDescription: "Comfortable pants, joggers, and bottoms. Modern fits and premium materials."
  },
  shorts: {
    name: "Shorts", 
    slug: "shorts",
    description: "Summer essentials and athletic shorts",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=600&fit=crop&auto=format",
    subcategories: ["athletic", "cargo", "denim", "swim"],
    seoTitle: "Shorts & Summer Wear | FashUn.Co.in",
    seoDescription: "Summer shorts and athletic wear. Comfortable fits for active lifestyle."
  },
  accessories: {
    name: "Accessories",
    slug: "accessories",
    description: "Complete your look with premium accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&auto=format",
    subcategories: ["caps", "beanies", "bags", "socks", "jewelry"],
    seoTitle: "Accessories & Streetwear Gear | FashUn.Co.in",
    seoDescription: "Complete your streetwear look with our premium accessories. Caps, bags, jewelry, and more."
  }
};

// Comprehensive product catalog with stock images
export const products: Product[] = [
  // HOODIES COLLECTION
  {
    id: "hod-001",
    name: "Essential Oversized Hoodie",
    description: "Our signature oversized hoodie crafted from premium 100% organic cotton. Features a relaxed fit, kangaroo pocket, and embroidered logo detail. Perfect for layering and streetwear styling.",
    price: 2499,
    originalPrice: 3499,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop&auto=format"
    ],
    category: "hoodies",
    subcategory: "oversized",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Stone Grey", "Navy", "Forest Green"],
    tags: ["oversized", "organic cotton", "signature", "premium", "streetwear"],
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 45,
    sku: "FUC-HOD-001",
    material: "100% Organic Cotton (450 GSM)",
    fit: "Oversized",
    care: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron inside out"],
    rating: 4.8,
    reviews: 127,
    seoTitle: "Essential Oversized Hoodie - Premium Cotton | FashUn.Co.in",
    seoDescription: "Shop our signature oversized hoodie made from 100% organic cotton. Perfect streetwear piece with premium quality.",
    weight: "650g",
    dimensions: "Length: 70cm, Chest: 65cm (Size L)"
  },
  {
    id: "hod-002", 
    name: "Zip-Up Tech Hoodie",
    description: "Technical hoodie with moisture-wicking fabric and modern fit. Features premium YKK zipper, thumb holes, and reflective details. Perfect for active lifestyle with premium finishes.",
    price: 3299,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop&auto=format"
    ],
    category: "hoodies",
    subcategory: "zip-up", 
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal", "Forest Green", "Navy"],
    tags: ["tech fabric", "moisture-wicking", "active", "reflective", "YKK zipper"],
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 32,
    sku: "FUC-HOD-002",
    material: "Polyester Blend Tech Fabric (380 GSM)",
    fit: "Regular Athletic",
    care: ["Machine wash cold", "Hang dry", "Do not iron prints"],
    rating: 4.6,
    reviews: 89,
    seoTitle: "Tech Zip-Up Hoodie - Moisture Wicking | FashUn.Co.in",
    seoDescription: "Premium tech hoodie with moisture-wicking fabric. Perfect for active lifestyle and streetwear.",
    weight: "580g"
  },
  {
    id: "hod-003",
    name: "Vintage Washed Hoodie",
    description: "Pre-washed vintage look hoodie with distressed details and premium aging process for authentic worn-in feel. Features vintage-inspired graphics and relaxed fit.",
    price: 2799,
    originalPrice: 3599,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop&auto=format"
    ],
    category: "hoodies",
    subcategory: "pullover",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Washed Black", "Vintage Blue", "Faded Pink", "Stone Grey"],
    tags: ["vintage", "washed", "distressed", "retro"],
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 28,
    sku: "FUC-HOD-003",
    material: "Cotton Blend (420 GSM)",
    fit: "Regular",
    care: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
    rating: 4.5,
    reviews: 63,
    seoTitle: "Vintage Washed Hoodie - Distressed Look | FashUn.Co.in",
    seoDescription: "Authentic vintage washed hoodie with distressed details. Premium aging process for worn-in feel.",
    weight: "620g"
  },
  {
    id: "hod-004",
    name: "Cropped Hoodie",
    description: "Contemporary cropped hoodie with modern silhouette. Features dropped shoulders, raw hem details, and minimalist branding. Perfect for layering and trend-forward styling.",
    price: 2299,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&auto=format"
    ],
    category: "hoodies",
    subcategory: "cropped",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Cream", "Sage Green", "Lavender"],
    tags: ["cropped", "contemporary", "minimalist", "trendy"],
    isNew: true,
    isFeatured: false,
    inStock: true,
    stockCount: 38,
    sku: "FUC-HOD-004",
    material: "Cotton Fleece (380 GSM)",
    fit: "Cropped Regular",
    care: ["Machine wash cold", "Tumble dry low"],
    rating: 4.7,
    reviews: 54,
    seoTitle: "Cropped Hoodie - Contemporary Streetwear | FashUn.Co.in",
    seoDescription: "Modern cropped hoodie with contemporary silhouette. Perfect for trendy streetwear styling.",
    weight: "480g"
  },

  // T-SHIRTS COLLECTION
  {
    id: "tee-001",
    name: "Graphic Statement Tee",
    description: "Bold graphic print on premium cotton tee. Features unique FashUn.Co.in artwork with high-quality screen printing. Soft hand feel with superior wash durability.",
    price: 1299,
    originalPrice: 1799,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1583743814966-8936f37f8fc6?w=800&h=800&fit=crop&auto=format"
    ],
    category: "tshirts",
    subcategory: "graphic",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Forest Green", "Burgundy"],
    tags: ["graphic", "statement", "premium cotton", "screen print"],
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 67,
    sku: "FUC-TEE-001",
    material: "100% Premium Cotton (180 GSM)",
    fit: "Regular",
    care: ["Machine wash cold", "Do not bleach", "Iron inside out", "Tumble dry low"],
    rating: 4.7,
    reviews: 156,
    seoTitle: "Graphic Statement T-Shirt - Premium Cotton | FashUn.Co.in",
    seoDescription: "Bold graphic t-shirt with unique artwork. Premium cotton construction with superior print quality.",
    weight: "200g"
  },
  {
    id: "tee-002",
    name: "Essential Plain Tee",
    description: "Minimalist essential tee in premium cotton. Perfect base layer for any outfit with superior comfort and durability. Pre-shrunk and colorfast for lasting quality.",
    price: 999,
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1583743814966-8936f37f8fc6?w=800&h=800&fit=crop&auto=format"
    ],
    category: "tshirts",
    subcategory: "plain",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Grey", "Navy", "Beige", "Olive"],
    tags: ["essential", "basic", "minimalist", "premium cotton"],
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 89,
    sku: "FUC-TEE-002",
    material: "100% Cotton (160 GSM)",
    fit: "Regular",
    care: ["Machine wash cold", "Tumble dry low"],
    rating: 4.6,
    reviews: 203,
    seoTitle: "Essential Plain T-Shirt - Premium Cotton | FashUn.Co.in",
    seoDescription: "Classic plain t-shirt in premium cotton. Perfect base layer for any outfit.",
    weight: "180g"
  },
  {
    id: "tee-003",
    name: "Oversized Graphic Tee",
    description: "Oversized fit graphic tee with exclusive artwork. Contemporary streetwear style with premium construction. Features dropped shoulders and longer length.",
    price: 1599,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1583743814966-8936f37f8fc6?w=800&h=800&fit=crop&auto=format"
    ],
    category: "tshirts",
    subcategory: "oversized",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Sand", "Olive", "White"],
    tags: ["oversized", "graphic", "streetwear", "contemporary"],
    isNew: true,
    isFeatured: false,
    inStock: true,
    stockCount: 43,
    sku: "FUC-TEE-003",
    material: "Cotton Blend (200 GSM)",
    fit: "Oversized",
    care: ["Machine wash cold", "Hang dry", "Iron inside out"],
    rating: 4.8,
    reviews: 91,
    seoTitle: "Oversized Graphic T-Shirt - Streetwear Style | FashUn.Co.in",
    seoDescription: "Contemporary oversized graphic tee with exclusive artwork. Perfect streetwear piece.",
    weight: "220g"
  },
  {
    id: "tee-004",
    name: "Vintage Band Tee",
    description: "Vintage-inspired band tee with authentic wash treatment. Features classic band graphics and lived-in feel. Perfect for casual streetwear styling.",
    price: 1799,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f37f8fc6?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&auto=format"
    ],
    category: "tshirts",
    subcategory: "graphic",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Vintage Black", "Washed Grey", "Faded Blue"],
    tags: ["vintage", "band", "washed", "retro"],
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 35,
    sku: "FUC-TEE-004",
    material: "Cotton Blend (170 GSM)",
    fit: "Regular",
    care: ["Machine wash cold", "Tumble dry low"],
    rating: 4.5,
    reviews: 78,
    seoTitle: "Vintage Band T-Shirt - Authentic Wash | FashUn.Co.in",
    seoDescription: "Vintage-inspired band tee with authentic wash treatment. Classic streetwear styling.",
    weight: "190g"
  },

  // POLO SHIRTS COLLECTION
  {
    id: "pol-001",
    name: "Classic Pique Polo",
    description: "Timeless polo shirt in premium pique cotton. Elevated with modern fit and subtle branding for versatile styling. Perfect for smart casual occasions.",
    price: 1899,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&h=800&fit=crop&auto=format"
    ],
    category: "polos",
    subcategory: "classic",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Navy", "Black", "Forest Green", "Burgundy", "Sky Blue"],
    tags: ["classic", "pique", "versatile", "smart casual"],
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 56,
    sku: "FUC-POL-001",
    material: "100% Pique Cotton (220 GSM)",
    fit: "Regular",
    care: ["Machine wash cold", "Iron if needed", "Do not bleach"],
    rating: 4.5,
    reviews: 78,
    seoTitle: "Classic Pique Polo Shirt - Premium Cotton | FashUn.Co.in",
    seoDescription: "Timeless polo shirt in premium pique cotton. Perfect for smart casual styling.",
    weight: "250g"
  },
  {
    id: "pol-002",
    name: "Oversized Polo Shirt",
    description: "Contemporary oversized polo with premium cotton construction. Modern streetwear take on classic polo styling with dropped shoulders and relaxed fit.",
    price: 2199,
    images: [
      "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop&auto=format"
    ],
    category: "polos",
    subcategory: "oversized",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Cream", "Sage Green", "Stone Grey"],
    tags: ["oversized", "contemporary", "streetwear", "relaxed"],
    isNew: true,
    isFeatured: false,
    inStock: true,
    stockCount: 34,
    sku: "FUC-POL-002",
    material: "Premium Cotton (240 GSM)",
    fit: "Oversized",
    care: ["Machine wash cold", "Tumble dry low"],
    rating: 4.7,
    reviews: 45,
    seoTitle: "Oversized Polo Shirt - Contemporary Fit | FashUn.Co.in",
    seoDescription: "Modern oversized polo with streetwear styling. Contemporary take on classic polo.",
    weight: "280g"
  },
  {
    id: "pol-003",
    name: "Embroidered Logo Polo",
    description: "Premium polo with subtle embroidered logo. Features clean lines, quality construction, and attention to detail. Perfect for elevated casual wear.",
    price: 2399,
    images: [
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop&auto=format"
    ],
    category: "polos",
    subcategory: "embroidered",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "White", "Black", "Charcoal"],
    tags: ["embroidered", "logo", "premium", "elevated"],
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 42,
    sku: "FUC-POL-003",
    material: "Premium Pique Cotton (230 GSM)",
    fit: "Regular",
    care: ["Machine wash cold", "Iron carefully around embroidery"],
    rating: 4.6,
    reviews: 67,
    seoTitle: "Embroidered Logo Polo - Premium Quality | FashUn.Co.in",
    seoDescription: "Premium polo with subtle embroidered logo. Quality construction for elevated casual wear.",
    weight: "260g"
  },

  // SWEATSHIRTS COLLECTION
  {
    id: "swe-001",
    name: "Classic Crew Sweatshirt",
    description: "Essential crew neck sweatshirt in heavyweight cotton blend. Perfect for layering with classic fit and comfort. Features ribbed cuffs and hem.",
    price: 2199,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop&auto=format"
    ],
    category: "sweatshirts",
    subcategory: "crew-neck",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey Heather", "Navy", "Black", "Cream", "Forest Green"],
    tags: ["crew neck", "heavyweight", "classic", "comfortable"],
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 62,
    sku: "FUC-SWE-001",
    material: "Cotton Poly Blend (320 GSM)",
    fit: "Regular",
    care: ["Machine wash cold", "Tumble dry low"],
    rating: 4.6,
    reviews: 112,
    seoTitle: "Classic Crew Sweatshirt - Heavyweight Cotton | FashUn.Co.in",
    seoDescription: "Essential crew neck sweatshirt in heavyweight cotton blend. Perfect for layering.",
    weight: "450g"
  },
  {
    id: "swe-002",
    name: "Vintage Washed Sweatshirt",
    description: "Vintage-inspired sweatshirt with authentic wash treatment. Features relaxed fit and lived-in feel. Perfect for casual comfort with retro styling.",
    price: 2599,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&auto=format"
    ],
    category: "sweatshirts",
    subcategory: "vintage",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Washed Grey", "Vintage Black", "Faded Navy"],
    tags: ["vintage", "washed", "relaxed", "retro"],
    isNew: true,
    isFeatured: false,
    inStock: true,
    stockCount: 38,
    sku: "FUC-SWE-002",
    material: "Cotton Blend (350 GSM)",
    fit: "Relaxed",
    care: ["Machine wash cold", "Tumble dry low"],
    rating: 4.7,
    reviews: 84,
    seoTitle: "Vintage Washed Sweatshirt - Authentic Feel | FashUn.Co.in",
    seoDescription: "Vintage-inspired sweatshirt with authentic wash treatment. Relaxed fit and retro styling.",
    weight: "480g"
  },

  // JACKETS COLLECTION
  {
    id: "jac-001",
    name: "Classic Bomber Jacket",
    description: "Classic bomber jacket with modern updates. Features premium materials, interior pockets, and signature details. Water-resistant finish for versatile wear.",
    price: 4299,
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&h=800&fit=crop&auto=format"
    ],
    category: "jackets",
    subcategory: "bomber",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Olive", "Navy", "Charcoal"],
    tags: ["bomber", "classic", "premium", "water-resistant"],
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 23,
    sku: "FUC-JAC-001",
    material: "Nylon Shell with Polyester Lining",
    fit: "Regular",
    care: ["Dry clean only", "Do not machine wash"],
    rating: 4.8,
    reviews: 67,
    seoTitle: "Classic Bomber Jacket - Premium Outerwear | FashUn.Co.in",
    seoDescription: "Premium bomber jacket with modern updates. Water-resistant finish and classic styling.",
    weight: "750g"
  },
  {
    id: "jac-002",
    name: "Denim Jacket",
    description: "Classic denim jacket in premium indigo denim. Features authentic wash treatment, button closure, and chest pockets. Perfect layering piece for streetwear styling.",
    price: 3799,
    images: [
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&h=800&fit=crop&auto=format"
    ],
    category: "jackets",
    subcategory: "denim",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Indigo", "Black Denim", "Light Wash"],
    tags: ["denim", "classic", "versatile", "layering"],
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 31,
    sku: "FUC-JAC-002",
    material: "100% Cotton Denim (12 oz)",
    fit: "Regular",
    care: ["Machine wash cold", "Tumble dry low"],
    rating: 4.6,
    reviews: 92,
    seoTitle: "Denim Jacket - Classic Indigo | FashUn.Co.in",
    seoDescription: "Classic denim jacket in premium indigo denim. Perfect layering piece for streetwear.",
    weight: "680g"
  },
  {
    id: "jac-003",
    name: "Windbreaker Jacket",
    description: "Lightweight windbreaker with packable design. Features water-resistant coating, adjustable hood, and zippered pockets. Perfect for active lifestyle.",
    price: 2999,
    images: [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=800&fit=crop&auto=format"
    ],
    category: "jackets",
    subcategory: "windbreaker",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Forest Green", "Orange"],
    tags: ["windbreaker", "packable", "water-resistant", "active"],
    isNew: true,
    isFeatured: false,
    inStock: true,
    stockCount: 45,
    sku: "FUC-JAC-003",
    material: "Nylon Ripstop with DWR Coating",
    fit: "Regular Athletic",
    care: ["Machine wash cold", "Hang dry", "Do not iron"],
    rating: 4.5,
    reviews: 56,
    seoTitle: "Windbreaker Jacket - Packable Design | FashUn.Co.in",
    seoDescription: "Lightweight windbreaker with water-resistant coating. Perfect for active lifestyle.",
    weight: "320g"
  },

  // PANTS COLLECTION
  {
    id: "pan-001",
    name: "Essential Joggers",
    description: "Premium joggers with tapered fit and comfortable elastic waistband. Features side pockets, back pocket, and ribbed cuffs. Perfect for casual wear and active lifestyle.",
    price: 2799,
    images: [
      "https://images.unsplash.com/photo-1506629905057-f39a2c35b5a5?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop&auto=format"
    ],
    category: "pants",
    subcategory: "joggers",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey", "Navy", "Khaki", "Forest Green"],
    tags: ["joggers", "comfortable", "tapered", "casual"],
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 48,
    sku: "FUC-PAN-001",
    material: "Cotton Fleece (300 GSM)",
    fit: "Tapered",
    care: ["Machine wash cold", "Tumble dry low"],
    rating: 4.5,
    reviews: 89,
    seoTitle: "Essential Joggers - Comfortable Fit | FashUn.Co.in",
    seoDescription: "Premium joggers with tapered fit. Perfect for casual wear and active lifestyle.",
    weight: "520g"
  },
  {
    id: "pan-002",
    name: "Cargo Pants",
    description: "Modern cargo pants with functional pockets and contemporary fit. Features adjustable waist, multiple cargo pockets, and durable construction for urban adventures.",
    price: 3299,
    images: [
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop&auto=format"
    ],
    category: "pants",
    subcategory: "cargo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Olive", "Khaki", "Charcoal"],
    tags: ["cargo", "functional", "urban", "durable"],
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 36,
    sku: "FUC-PAN-002",
    material: "Cotton Canvas (280 GSM)",
    fit: "Regular",
    care: ["Machine wash cold", "Iron if needed"],
    rating: 4.7,
    reviews: 73,
    seoTitle: "Cargo Pants - Functional Design | FashUn.Co.in",
    seoDescription: "Modern cargo pants with functional pockets. Durable construction for urban adventures.",
    weight: "580g"
  },
  {
    id: "pan-003",
    name: "Wide Leg Pants",
    description: "Contemporary wide leg pants with relaxed fit. Features clean lines, minimalist design, and comfortable construction. Perfect for modern streetwear styling.",
    price: 2999,
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1506629905057-f39a2c35b5a5?w=800&h=800&fit=crop&auto=format"
    ],
    category: "pants",
    subcategory: "wide",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Cream", "Navy", "Stone Grey"],
    tags: ["wide leg", "contemporary", "relaxed", "minimalist"],
    isNew: true,
    isFeatured: false,
    inStock: true,
    stockCount: 29,
    sku: "FUC-PAN-003",
    material: "Cotton Twill (250 GSM)",
    fit: "Wide Leg",
    care: ["Machine wash cold", "Hang dry"],
    rating: 4.6,
    reviews: 41,
    seoTitle: "Wide Leg Pants - Contemporary Fit | FashUn.Co.in",
    seoDescription: "Contemporary wide leg pants with relaxed fit. Perfect for modern streetwear styling.",
    weight: "480g"
  },

  // SHORTS COLLECTION
  {
    id: "sho-001",
    name: "Athletic Shorts",
    description: "Performance shorts with moisture-wicking fabric and comfortable fit. Features elastic waistband, side pockets, and mesh lining. Perfect for workouts and casual wear.",
    price: 1599,
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1506629905057-f39a2c35b5a5?w=800&h=800&fit=crop&auto=format"
    ],
    category: "shorts",
    subcategory: "athletic",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Grey", "Olive", "Orange"],
    tags: ["athletic", "performance", "moisture-wicking", "comfortable"],
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 71,
    sku: "FUC-SHO-001",
    material: "Polyester Blend with Moisture-Wicking",
    fit: "Regular Athletic",
    care: ["Machine wash cold", "Hang dry"],
    rating: 4.4,
    reviews: 134,
    seoTitle: "Athletic Shorts - Moisture Wicking | FashUn.Co.in",
    seoDescription: "Performance athletic shorts with moisture-wicking fabric. Perfect for workouts and casual wear.",
    weight: "180g"
  },
  {
    id: "sho-002",
    name: "Cargo Shorts",
    description: "Functional cargo shorts with multiple pockets and comfortable fit. Features durable construction, adjustable waist, and classic cargo styling for summer adventures.",
    price: 1999,
    images: [
      "https://images.unsplash.com/photo-1506629905057-f39a2c35b5a5?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop&auto=format"
    ],
    category: "shorts",
    subcategory: "cargo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Khaki", "Black", "Olive", "Navy"],
    tags: ["cargo", "functional", "durable", "summer"],
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 53,
    sku: "FUC-SHO-002",
    material: "Cotton Canvas (220 GSM)",
    fit: "Regular",
    care: ["Machine wash cold", "Tumble dry low"],
    rating: 4.5,
    reviews: 98,
    seoTitle: "Cargo Shorts - Functional Design | FashUn.Co.in",
    seoDescription: "Functional cargo shorts with multiple pockets. Durable construction for summer adventures.",
    weight: "280g"
  },

  // ACCESSORIES COLLECTION
  {
    id: "acc-001",
    name: "Signature Snapback Cap",
    description: "Premium snapback cap with embroidered logo. Features structured crown, curved brim, and adjustable snap closure. Quality construction with attention to detail.",
    price: 1299,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1575428652377-a2d80ddaca1d?w=800&h=800&fit=crop&auto=format"
    ],
    category: "accessories",
    subcategory: "caps",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "White", "Khaki", "Forest Green"],
    tags: ["snapback", "embroidered", "signature", "structured"],
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 95,
    sku: "FUC-ACC-001",
    material: "Cotton Twill with Mesh Back",
    fit: "Adjustable",
    care: ["Spot clean only", "Do not machine wash"],
    rating: 4.6,
    reviews: 78,
    seoTitle: "Signature Snapback Cap - Embroidered Logo | FashUn.Co.in",
    seoDescription: "Premium snapback cap with embroidered logo. Quality construction and adjustable fit.",
    weight: "120g"
  },
  {
    id: "acc-002",
    name: "Beanie Hat",
    description: "Soft knit beanie with fold-over cuff. Features ribbed construction and embroidered logo patch. Perfect for cold weather and streetwear styling.",
    price: 999,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1575428652377-a2d80ddaca1d?w=800&h=800&fit=crop&auto=format"
    ],
    category: "accessories",
    subcategory: "beanies",
    sizes: ["One Size"],
    colors: ["Black", "Grey", "Navy", "Cream", "Forest Green"],
    tags: ["beanie", "knit", "fold-over", "winter"],
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 87,
    sku: "FUC-ACC-002",
    material: "Acrylic Knit",
    fit: "One Size",
    care: ["Hand wash cold", "Lay flat to dry"],
    rating: 4.4,
    reviews: 92,
    seoTitle: "Beanie Hat - Soft Knit | FashUn.Co.in",
    seoDescription: "Soft knit beanie with fold-over cuff. Perfect for cold weather and streetwear styling.",
    weight: "80g"
  },
  {
    id: "acc-003",
    name: "Canvas Tote Bag",
    description: "Durable canvas tote bag with reinforced handles. Features spacious interior, interior pocket, and embroidered logo. Perfect for everyday carry and streetwear styling.",
    price: 1799,
    images: [
      "https://images.unsplash.com/photo-1575428652377-a2d80ddaca1d?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&auto=format"
    ],
    category: "accessories",
    subcategory: "bags",
    sizes: ["One Size"],
    colors: ["Natural", "Black", "Navy"],
    tags: ["tote", "canvas", "durable", "everyday"],
    isNew: true,
    isFeatured: false,
    inStock: true,
    stockCount: 64,
    sku: "FUC-ACC-003",
    material: "Heavy Canvas (12 oz)",
    fit: "One Size",
    care: ["Spot clean only", "Air dry"],
    rating: 4.7,
    reviews: 45,
    seoTitle: "Canvas Tote Bag - Durable Construction | FashUn.Co.in",
    seoDescription: "Durable canvas tote bag with reinforced handles. Perfect for everyday carry.",
    weight: "320g",
    dimensions: "40cm x 35cm x 12cm"
  },
  {
    id: "acc-004",
    name: "Crew Socks Pack",
    description: "Premium crew socks in 3-pack. Features cushioned sole, reinforced heel and toe, and moisture-wicking fabric. Comfortable fit with seamless toe construction.",
    price: 899,
    images: [
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop&auto=format"
    ],
    category: "accessories",
    subcategory: "socks",
    sizes: ["S (6-8)", "M (8-10)", "L (10-12)"],
    colors: ["Black Pack", "White Pack", "Mixed Pack"],
    tags: ["crew socks", "3-pack", "cushioned", "moisture-wicking"],
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 156,
    sku: "FUC-ACC-004",
    material: "Cotton Blend with Moisture-Wicking",
    fit: "Crew Length",
    care: ["Machine wash warm", "Tumble dry low"],
    rating: 4.5,
    reviews: 187,
    seoTitle: "Crew Socks 3-Pack - Premium Comfort | FashUn.Co.in",
    seoDescription: "Premium crew socks with cushioned sole and moisture-wicking fabric. 3-pack value.",
    weight: "150g"
  }
];

// Featured collections for homepage
export const featuredCollections = [
  {
    id: "new-arrivals",
    name: "New Arrivals",
    description: "Fresh drops and latest designs",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop&auto=format",
    products: products.filter(p => p.isNew).slice(0, 8)
  },
  {
    id: "bestsellers",
    name: "Bestsellers",
    description: "Most loved by our community",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop&auto=format",
    products: products.filter(p => p.isFeatured).slice(0, 8)
  },
  {
    id: "essential-basics",
    name: "Essential Basics",
    description: "Wardrobe staples you need",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=600&fit=crop&auto=format",
    products: products.filter(p => p.tags.includes("essential") || p.tags.includes("basic")).slice(0, 6)
  }
];

// Size guide information
export const sizeGuide = {
  clothing: {
    tops: {
      S: { chest: "36-38", length: "26", shoulder: "17" },
      M: { chest: "40-42", length: "27", shoulder: "18" },
      L: { chest: "44-46", length: "28", shoulder: "19" },
      XL: { chest: "48-50", length: "29", shoulder: "20" },
      XXL: { chest: "52-54", length: "30", shoulder: "21" }
    },
    bottoms: {
      S: { waist: "28-30", length: "40", hip: "36-38" },
      M: { waist: "32-34", length: "41", hip: "40-42" },
      L: { waist: "36-38", length: "42", hip: "44-46" },
      XL: { waist: "40-42", length: "43", hip: "48-50" },
      XXL: { waist: "44-46", length: "44", hip: "52-54" }
    }
  }
};

// Color swatches for consistent display
export const colorSwatches = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Grey": "#808080",
  "Navy": "#1B2951",
  "Forest Green": "#2D5016",
  "Burgundy": "#722F37",
  "Stone Grey": "#8B8680",
  "Charcoal": "#36454F",
  "Olive": "#708238",
  "Cream": "#F5F5DC",
  "Sage Green": "#9CAF88",
  "Sand": "#C2B280",
  "Khaki": "#8FBC8F",
  "Beige": "#F5F5DC",
  "Sky Blue": "#87CEEB",
  "Orange": "#FF8C00",
  "Lavender": "#E6E6FA",
  "Indigo": "#4B0082",
  "Faded Pink": "#F8BBD9",
  "Vintage Blue": "#4F628E",
  "Washed Black": "#2C2C2C",
  "Washed Grey": "#A9A9A9",
  "Faded Blue": "#6A8CAF",
  "Vintage Black": "#1C1C1C",
  "Faded Navy": "#2F4F4F",
  "Light Wash": "#B0C4DE",
  "Black Denim": "#1E1E1E",
  "Natural": "#F5F5DC"
};

export default products;
